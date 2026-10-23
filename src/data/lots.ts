export type LotStatus = "Occupied" | "Empty" | "Open" | "Eviction";

export type LotFilter = "all" | "empty" | "occupied" | "issues" | "renters" | "owners" | "no-owe" | "due" | "past-due" | "roof" | "pets" | "wiring" | "lease-ending";

export function isNoOwe(value?: string) {
  const v = value?.trim().toLowerCase() ?? "";
  return v === "" || v === "no" || v === "no-owe";
}

export function isRenterLot(lot: { renter?: string }) {
  const role = lot.renter?.trim().toLowerCase() ?? "";
  return role.includes("renter") || role.includes("rent-to-own") || role.includes("rent to own");
}

export function mowChoice(value?: string): "Yes" | "NO-OWE" {
  return value?.trim().toLowerCase() === "yes" ? "Yes" : "NO-OWE";
}

const MOW_SHEET = new Set([
  "2", "4", "5", "6", "8", "12", "13", "18", "21", "28", "29", "30", "31", "34", "35", "37", "38",
  "42", "45", "46", "47", "50", "52", "53", "54", "56", "57", "61", "64", "65", "66", "75", "84",
  "85", "87", "89", "91", "93", "94", "95", "96", "98", "101", "102", "103", "104", "109", "113",
  "114", "118", "119", "120", "122", "123", "125",
]);

const WIRING_YES = new Set([
  "5585|jaleen", "5483|jaleen", "5543|jaleen", "5525|jaleen", "5529|jaleen", "5603|jaleen", "5520|jaleen",
  "5545|jaleen", "5515|jaleen", "5565|jaleen", "5575|jaleen", "5601|jaleen", "5495|jaleen",
  "5502|denise", "5467|denise", "5443|denise", "5455|denise", "5523|denise", "5436|denise", "5459|denise",
  "5609|denise", "5538|denise", "5431|denise", "5530|denise", "5528|denise", "5456|denise", "5500|denise",
  "5475|denise", "5479|denise", "5481|denise",
  "5593|leon", "5520|leon", "5511|leon", "5500|leon", "5442|leon", "5465|leon", "5527|leon", "5524|leon",
  "5558|michelle", "5539|michelle", "5589|michelle", "5599|michelle", "5518|michelle", "5579|michelle",
  "5559|michelle", "5578|michelle", "3729|ermine",
]);

const HOME_INS_YES = new Set([
  "5529|jaleen", "5575|jaleen", "5580|jaleen", "5601|jaleen", "5603|jaleen", "5560|jaleen",
  "5431|denise", "5436|denise", "5439|denise", "5443|denise", "5466|denise", "5475|denise", "5479|denise",
  "5481|denise", "5500|denise", "5523|denise", "5528|denise", "5530|denise", "5538|denise", "5582|denise", "5583|denise",
  "5433|leon", "5442|leon", "5465|leon", "5520|leon", "5524|leon",
  "5539|michelle", "5558|michelle", "5578|michelle", "5579|michelle", "5599|michelle",
  "5589|jaleen", "5593|jaleen", "5569|denise", "5565|michelle",
]);

function wiringStreet(street: string) {
  const name = street.toLowerCase();
  if (name.includes("jaleen")) return "jaleen";
  if (name.includes("denise")) return "denise";
  if (name.includes("leon")) return "leon";
  if (name.includes("michelle")) return "michelle";
  if (name.includes("ermine") || name.includes("block")) return "ermine";
  if (name.includes("lake")) return "lake";
  return "";
}

export function petFee(dogs?: string, cats?: string) {
  const count = (value?: string) => (value === "1" || value === "2" ? Number(value) : 0);
  return (count(dogs) + count(cats)) * 15;
}

export function rentTotal(lotRent?: string, homeRent?: string, fee = 0) {
  const lot = (lotRent ?? "").replace(/[$,\s]/g, "");
  const home = (homeRent ?? "").replace(/[$,\s]/g, "");
  if (!lot && !home && !fee) return "";
  const sum = (Number(lot) || 0) + (Number(home) || 0) + fee;
  const rounded = Math.round(sum * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

export function rentGap(total?: string, lotRent?: string, fee = 0) {
  if (!(total ?? "").trim()) return "";
  const whole = Number((total ?? "").replace(/[$,\s]/g, ""));
  const base = Number((lotRent ?? "").replace(/[$,\s]/g, "")) || 0;
  if (!Number.isFinite(whole)) return "";
  const diff = Math.round((whole - base - fee) * 100) / 100;
  return Number.isInteger(diff) ? String(diff) : diff.toFixed(2);
}

export function withEmptyMow(lot: Lot): Lot {
  let next = lot;
  if (next.id === "47" && next.address === "5531") next = { ...next, address: "5539" };
  if (next.id === "76" && next.address === "5558") next = { ...next, address: "5598", wiring: next.wiring === "Yes" ? "" : next.wiring };
  if (next.id === "130.5" && (!next.address.trim() || next.street.toLowerCase().includes("block"))) {
    next = { ...next, address: "3729", street: "Ermine St" };
  }
  if (next.id === "109" && /leon/i.test(next.street)) next = { ...next, street: "Jaleen Ave" };
  const listed = MOW_SHEET.has(next.id) && !(next.noMow ?? "").trim();
  if (listed) next = { ...next, noMow: "Yes" };
  if (next.status === "Empty" && next.noMow !== "Yes") next = { ...next, noMow: "Yes" };
  if (/^(owe|no-owe)$/i.test(next.noMow) || (next.noOwe === "Yes" && next.noMow !== "Yes" && next.noMow !== "No")) {
    next = { ...next, noMow: "No", noOwe: "" };
  }
  const wiringKey = `${next.address}|${wiringStreet(next.street)}`;
  if (WIRING_YES.has(wiringKey) && next.wiring !== "Yes" && next.wiring !== "No") next = { ...next, wiring: "Yes" };
  if (HOME_INS_YES.has(wiringKey) && next.homeIns !== "Yes" && next.homeIns !== "No") next = { ...next, homeIns: "Yes" };
  if (next.address === "1471" && /lake/i.test(next.street) && next.homeIns === "Yes") next = { ...next, homeIns: "" };
  let lotRent = next.lotRent ?? "";
  if (next.status !== "Occupied") lotRent = "";
  else if (!lotRent.trim()) lotRent = "540";
  const homeRent = next.homeRent ?? "";
  const rent = rentTotal(lotRent, homeRent, petFee(next.dogs, next.cats));
  if (next.lotRent !== lotRent || next.homeRent !== homeRent || next.rent !== rent) {
    next = { ...next, lotRent, homeRent, rent };
  }
  return next;
}

export function matchesFilter(lot: Lot, filter: LotFilter): boolean {
  const role = lot.renter.trim().toLowerCase();
  const rentToOwn = role.includes("rent-to-own") || role.includes("rent to own");
  if (filter === "empty") return lot.status === "Empty";
  if (filter === "occupied") return lot.status === "Occupied";
  if (filter === "issues") return lot.issues.trim().length > 0;
  if (filter === "renters") return isRenterLot(lot);
  if (filter === "owners") return lot.status === "Occupied" && !role.includes("renter") && !rentToOwn;
  if (filter === "no-owe") return lot.noMow === "Owe" || /^no-owe$/i.test(lot.noMow);
  if (filter === "due") return dueState(lot.rentDue) === "due";
  if (filter === "past-due") return dueState(lot.rentDue) === "past";
  if (filter === "roof") return lot.roofReplace === "Yes";
  if (filter === "pets") return lot.dogs === "1" || lot.dogs === "2" || lot.cats === "1" || lot.cats === "2";
  if (filter === "wiring") return lot.wiring === "Yes";
  if (filter === "lease-ending") return sameMonth(lot.leaseEnd);
  return true;
}

export function dayStamp(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDay(value?: string) {
  const day = value?.trim().slice(0, 10) ?? "";
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "";
}

function sameMonth(value?: string) {
  const day = parseDay(value);
  if (!day) return false;
  return day.slice(0, 7) === dayStamp().slice(0, 7);
}

function addDays(stamp: string, days: number) {
  const [y, m, d] = stamp.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return dayStamp(date);
}

export function daysUntil(due?: string) {
  const day = parseDay(due);
  if (!day) return null;
  const [y, m, d] = day.split("-").map(Number);
  const [ty, tm, td] = dayStamp().split("-").map(Number);
  const dueDate = new Date(y, m - 1, d).getTime();
  const today = new Date(ty, tm - 1, td).getTime();
  return Math.round((dueDate - today) / 86400000);
}

export function depositReminder(stay: Stay) {
  if (!stay.depositDue || stay.depositChoice === "Return" || stay.depositChoice === "Keep") return "";
  const left = daysUntil(stay.depositDue);
  if (left == null) return "";
  const amount = stay.deposit?.trim() ? ` (${stay.deposit.trim()})` : "";
  if (left < 0) return `Deposit return or keep is past 15 days${amount}`;
  if (left === 0) return `Return or keep the deposit today${amount}`;
  return `Return or keep the deposit · ${left} day${left === 1 ? "" : "s"} left${amount}`;
}

export type Guest = {
  name: string;
  year: string;
  make: string;
  tag: string;
  state: string;
  arrival: string;
  departure: string;
  card?: { name: string; data: string } | null;
};

export type Stay = {
  name: string;
  phone: string;
  email?: string;
  renter: string;
  moveIn: string;
  moveOut: string;
  rent: string;
  balance: string;
  deposit?: string;
  depositDue?: string;
  depositChoice?: "" | "Return" | "Keep";
  rentDue?: string;
  lateRent?: string;
  bouncedCheck?: string;
  leaseEnd?: string;
  guest?: string;
  guests?: Guest[];
  vehicle?: string;
  dogs?: string;
  cats?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  noticeDate?: string;
  noticeNote?: string;
  noticeFile?: { name: string; data: string } | null;
  courtDate?: string;
  courtNote?: string;
  homeIns?: string;
  homeInsDate?: string;
  issues?: string;
  violations?: string;
  lease?: { name: string; data: string } | null;
  rulesReceipt?: { name: string; data: string } | null;
  background?: { name: string; data: string } | null;
  otherDocs?: { name: string; data: string }[];
};

export type MaintJob = {
  id: string;
  date: string;
  note: string;
  done: string;
};

export function moveOutLot(lot: Lot): Lot {
  const moved = dayStamp();
  const stay: Stay = {
    name: lot.name,
    phone: lot.phone,
    email: lot.email,
    renter: lot.renter,
    moveIn: lot.moveIn ?? "",
    moveOut: moved,
    rent: lot.rent,
    balance: lot.balance ?? "",
    deposit: lot.deposit ?? "",
    depositDue: addDays(moved, 15),
    depositChoice: "",
    rentDue: lot.rentDue ?? "",
    lateRent: lot.lateRent,
    bouncedCheck: lot.bouncedCheck ?? "",
    leaseEnd: lot.leaseEnd ?? "",
    guest: lot.guest,
    guests: lot.guests ?? [],
    vehicle: lot.vehicle,
    dogs: lot.dogs ?? "",
    cats: lot.cats ?? "",
    emergencyName: lot.emergencyName ?? "",
    emergencyPhone: lot.emergencyPhone ?? "",
    noticeDate: lot.noticeDate ?? "",
    noticeNote: lot.noticeNote ?? "",
    noticeFile: lot.noticeFile ?? null,
    courtDate: lot.courtDate ?? "",
    courtNote: lot.courtNote ?? "",
    homeIns: lot.homeIns ?? "",
    homeInsDate: lot.homeInsDate ?? "",
    issues: lot.issues,
    violations: lot.violations,
    lease: lot.lease ?? null,
    rulesReceipt: lot.rulesReceipt ?? null,
    background: lot.background ?? null,
    otherDocs: lot.otherDocs ?? [],
  };
  const keep = [stay.name, stay.phone, stay.email, stay.rent, stay.moveIn, stay.guest, stay.vehicle, stay.emergencyName, stay.issues].some((value) => (value ?? "").trim());
  return {
    ...lot,
    history: keep ? [stay, ...(lot.history ?? [])] : lot.history ?? [],
    name: "",
    phone: "",
    email: "",
    renter: "",
    rent: "",
    moveIn: "",
    rentDue: "",
    deposit: "",
    balance: "",
    noticeDate: "",
    noticeNote: "",
    noticeFile: null,
    guest: "",
    guests: [],
    vehicle: "",
    lateRent: "",
    bouncedCheck: "",
    dogs: "",
    cats: "",
    leaseEnd: "",
    emergencyName: "",
    emergencyPhone: "",
    courtDate: "",
    courtNote: "",
    homeIns: "",
    homeInsDate: "",
    issues: "",
    violations: "",
    lease: null,
    rulesReceipt: null,
    background: null,
    otherDocs: [],
    readyPower: "",
    readyClean: "",
    readyInspected: "",
    zillow: "",
    zillowUrl: "",
    noMow: "Yes",
    status: "Empty",
  };
}

export type TodoItem = {
  id: string;
  lot: string;
  address: string;
  street: string;
  name: string;
  notes: string;
  text: string;
  date: string;
};

function prettyDay(stamp: string) {
  const [y, m, d] = stamp.split("-").map(Number);
  if (!y || !m || !d) return stamp;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function lotNotes(lot: Lot) {
  return [lot.issues, lot.violations, lot.inspectionNotes].map((value) => value?.trim() ?? "").filter(Boolean).join(" · ");
}

export function buildTodo(lots: Lot[]): TodoItem[] {
  const today = dayStamp();
  const items: TodoItem[] = [];
  for (const lot of lots) {
    const tasks: { date: string; text: string }[] = [];
    const add = (date: string, text: string) => {
      if (text.trim()) tasks.push({ date, text });
    };
    const rent = parseDay(lot.rentDue);
    if (rent) add(rent, rent < today ? `Past due rent, was due ${prettyDay(rent)}` : rent === today ? "Rent due today" : `Rent due ${prettyDay(rent)}`);
    const lease = parseDay(lot.leaseEnd);
    if (lease) add(lease, lease < today ? `Lease ended ${prettyDay(lease)}` : lease === today ? "Lease ends today" : `Lease ends ${prettyDay(lease)}`);
    const court = parseDay(lot.courtDate);
    if (court) add(court, court < today ? `Court date passed ${prettyDay(court)}` : court === today ? "Court today" : `Court ${prettyDay(court)}`);
    const notice = parseDay(lot.noticeDate);
    if (lot.noticeNote?.trim() && !notice) add(today, `Notice to send${lot.noticeNote.trim() ? `: ${lot.noticeNote.trim()}` : ""}`);
    else if (notice) add(notice, notice < today ? `Notice was due ${prettyDay(notice)}` : notice === today ? "Notice today" : `Notice ${prettyDay(notice)}`);
    if (lot.roofReplace === "Yes") add(today, "Roof needs replaced");
    if (isRenterLot(lot)) {
      const insurance = parseDay(lot.homeInsDate);
      if (insurance) add(insurance, insurance < today ? `Home insurance expired ${prettyDay(insurance)}` : insurance === today ? "Home insurance expires today" : `Home insurance expires ${prettyDay(insurance)}`);
    }
    if (lot.lateRent?.trim()) add(today, `Late rent: ${lot.lateRent.trim()}`);
    for (const stay of lot.history ?? []) {
      const due = parseDay(stay.depositDue);
      const reminder = depositReminder(stay);
      if (reminder) add(due || today, `${stay.name || "Former tenant"}: ${reminder}`);
    }
    for (const job of lot.maintLog ?? []) {
      if (job.done === "Yes") continue;
      const when = parseDay(job.date);
      add(when || today, job.note.trim() || "Maintenance");
    }
    const notes = lotNotes(lot);
    if (!notes && tasks.length === 0) continue;
    tasks.sort((a, b) => a.date.localeCompare(b.date));
    items.push({
      id: lot.id,
      lot: lot.lot,
      address: [lot.address, lot.street].filter(Boolean).join(" "),
      street: lot.street,
      name: displayName(lot),
      notes,
      text: tasks.map((task) => task.text).join(" · "),
      date: tasks[0]?.date ?? "",
    });
  }
  items.sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.date !== b.date) return a.date ? -1 : 1;
    const lotA = Number(a.lot);
    const lotB = Number(b.lot);
    if (Number.isFinite(lotA) && Number.isFinite(lotB) && lotA !== lotB) return lotA - lotB;
    return a.lot.localeCompare(b.lot);
  });
  return items;
}

function dueState(value?: string): "due" | "past" | "" {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  const day = raw.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return "";
  const today = new Date();
  const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (day < stamp) return "past";
  return "due";
}

export type Lot = {
  id: string;
  lot: string;
  address: string;
  street: string;
  name: string;
  issues: string;
  status: LotStatus;
  maintenance?: string;
  maintCost?: string;
  mowCost?: string;
  acCost?: string;
  roofCost?: string;
  washCost?: string;
  inspectCost?: string;
  taxCost?: string;
  sewerCost?: string;
  waterCost?: string;
  garbageCost?: string;
  renter: string;
  rent: string;
  lotRent?: string;
  homeRent?: string;
  rentInc2026?: string;
  rentInc2027?: string;
  moveIn?: string;
  rentDue?: string;
  deposit?: string;
  balance?: string;
  noticeDate?: string;
  noticeNote?: string;
  noticeFile?: { name: string; data: string } | null;
  photo?: string;
  lease?: { name: string; data: string } | null;
  rulesReceipt?: { name: string; data: string } | null;
  background?: { name: string; data: string } | null;
  otherDocs?: { name: string; data: string }[];
  key: string;
  phone: string;
  email: string;
  noMow: string;
  noOwe?: string;
  lateRent: string;
  bouncedCheck?: string;
  guest: string;
  guests?: Guest[];
  vehicle: string;
  acFilter: string;
  pressureWash: string;
  violations: string;
  washer: string;
  dryer: string;
  fridge?: string;
  stove?: string;
  microwave?: string;
  dogs?: string;
  cats?: string;
  wiring?: string;
  homeIns?: string;
  homeInsDate?: string;
  readyPower?: string;
  readyClean?: string;
  readyInspected?: string;
  zillow?: string;
  zillowUrl?: string;
  homeYear?: string;
  homeMake?: string;
  homeModel?: string;
  homeWidth?: string;
  homeLength?: string;
  homeWide?: string;
  roofAge?: string;
  roofMaterial?: string;
  roofInstalled?: string;
  roofReplace?: string;
  acCleaning?: string;
  acService?: string;
  inspectionDate?: string;
  inspectionNotes?: string;
  inspectionChecks?: Record<string, string>;
  leaseEnd?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  courtDate?: string;
  courtNote?: string;
  waitName?: string;
  waitPhone?: string;
  history?: Stay[];
  maintLog?: MaintJob[];
};

/** Every column from the lot register, including blanks. */
export const LOTS: Lot[] = [
  { id: "1", lot: "1", address: "5600", street: "Jaleen Ave", name: "Club House/Office", issues: "", status: "Open", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "2", lot: "2", address: "5580", street: "Jaleen Ave", name: "Andrews", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "3", lot: "3", address: "5560", street: "Jaleen Ave", name: "Acosta, Espino", issues: "Will they get a rent increase?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "4", lot: "4", address: "5540", street: "Jaleen Ave", name: "Marysonet", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "5", lot: "5", address: "5520", street: "Jaleen Ave", name: "Herrera, E.", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "6", lot: "6", address: "5603", street: "Jaleen Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "7", lot: "7", address: "5601", street: "Jaleen Ave", name: "Mena Sosa", issues: "Owes $20 for Sep and $10 for Oct.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "8", lot: "8", address: "5608", street: "Denise Ave", name: "Sodansky, Carl", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "9", lot: "9", address: "5610", street: "Denise Ave", name: "Phillips", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "10", lot: "10", address: "5585", street: "Jaleen Ave", name: "Vazquez", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "11", lot: "11", address: "5561", street: "Jaleen Ave", name: "Brown", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "12", lot: "12", address: "5594", street: "Denise Ave", name: "Matejka, Carolina", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "13", lot: "13", address: "5498", street: "Jaleen Ave", name: "Carter, Lisa", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "14", lot: "14", address: "5575", street: "Jaleen Ave", name: "Kiefer", issues: "Owes $10 for Aug and Sep.", status: "Occupied", renter: "", rent: "", key: "", phone: "321-305-1396", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "15", lot: "15", address: "5587", street: "Jaleen Ave", name: "Perez, I.", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "16", lot: "16", address: "5578", street: "Denise Ave", name: "Cruz, Antonio", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "17", lot: "17", address: "5582", street: "Denise Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "18", lot: "18", address: "5565", street: "Jaleen Ave", name: "Ramsey, Jennifer", issues: "Does she have a dog?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "19", lot: "19", address: "5569", street: "Jaleen Ave", name: "Cruz, Antonio", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "20", lot: "20", address: "5568", street: "Denise Ave", name: "Ramskog", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "678-973-5466", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "21", lot: "21", address: "5564", street: "Denise Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "22", lot: "22", address: "5545", street: "Jaleen Ave", name: "Solomon, Larry", issues: "10 short in Aug and Sep.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "23", lot: "23", address: "5543", street: "Jaleen Ave", name: "Russell, John", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "24", lot: "24", address: "5538", street: "Denise Ave", name: "Gomez", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "25", lot: "25", address: "5542", street: "Denise Ave", name: "Hoang", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "26", lot: "26", address: "5525", street: "Jaleen Ave", name: "Hernandez, John", issues: "Owes $10 for Aug, Sep, Oct.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "27", lot: "27", address: "5529", street: "Jaleen Ave", name: "Vargas, Norberto", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "28", lot: "28", address: "5530", street: "Denise Ave", name: "Godshalk", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "29", lot: "29", address: "5528", street: "Denise Ave", name: "Clark", issues: "Does or did she get a rent increase?", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "30", lot: "30", address: "5515", street: "Jaleen Ave", name: "Stacy", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "31", lot: "31", address: "5513", street: "Jaleen Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "32", lot: "32", address: "5510", street: "Denise Ave", name: "Bodell, Richard", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "33", lot: "33", address: "5516", street: "Denise Ave", name: "Aranda, Benjamin", issues: "Owes $20 x 2.", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "34", lot: "34", address: "5499", street: "Jaleen Ave", name: "Polston, Carolyn", issues: "Owes $10 for Aug, Sep, Oct.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "35", lot: "35", address: "5509", street: "Jaleen Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "36", lot: "36", address: "5502", street: "Denise Ave", name: "Tinoco, Maria", issues: "Does she have a dog? $10 short x 2.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "37", lot: "37", address: "5500", street: "Denise Ave", name: "Holgate", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "38", lot: "38", address: "5495", street: "Jaleen Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "39", lot: "39", address: "5497", street: "Jaleen Ave", name: "Brizuela", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "40", lot: "40", address: "5485", street: "Jaleen Ave", name: "Battaglia", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "41", lot: "41", address: "5400", street: "Denise Ave", name: "Weil", issues: "Do they have a pet? Owes $10 for Aug, Sep, Oct and a late fee from February.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "42", lot: "42", address: "5609", street: "Denise Ave", name: "Spicer", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "43", lot: "43", address: "5583", street: "Denise Ave", name: "Roberts", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "44", lot: "44", address: "5561", street: "Leon Circle", name: "Shank", issues: "Does she have a dog?", status: "Occupied", renter: "", rent: "", key: "", phone: "407-712-5811", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "45", lot: "45", address: "5551", street: "Leon Circle", name: "Meininger", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-297-1021", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "46", lot: "46", address: "5543", street: "Leon Circle", name: "Manette", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "47", lot: "47", address: "5539", street: "Leon Circle", name: "Campbell", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "48", lot: "48", address: "5523", street: "Denise Ave", name: "Murillo, Nora", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "49", lot: "49", address: "5519", street: "Denise Ave", name: "Barr, James + Sharon", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "50", lot: "50", address: "5503", street: "Denise Ave", name: "Manos", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "51", lot: "51", address: "5522", street: "Leon Circle", name: "Exposito", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "52", lot: "52", address: "5524", street: "Leon Circle", name: "Walther Irene", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "53", lot: "53", address: "5520", street: "Leon Circle", name: "Oyster", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "54", lot: "54", address: "5518", street: "Leon Circle", name: "Hartner", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "55", lot: "55", address: "5504", street: "Leon Circle", name: "Walton, Richard", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "56", lot: "56", address: "5506", street: "Leon Circle", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "57", lot: "57", address: "5502", street: "Leon Circle", name: "Casarez, Lori", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-718-9047", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "58", lot: "58", address: "5500", street: "Leon Circle", name: "Wrage, Teresa", issues: "Owes $10 for Aug, Sep, Oct. Will she get a rent increase?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "59", lot: "59", address: "5531", street: "Leon Circle", name: "Reyes Cobas", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "60", lot: "60", address: "5527", street: "Leon Circle", name: "Cintron, Angel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "61", lot: "61", address: "5517", street: "Leon Circle", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "62", lot: "62", address: "5511", street: "Leon Circle", name: "Luzzi, Stephanie", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "63", lot: "63", address: "5593", street: "Leon Circle", name: "Barrett, Billy", issues: "Owes $10 for Aug, Sep, Oct. Will he get a rent increase?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "64", lot: "64", address: "5481", street: "Jaleen Ave", name: "Block", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "65", lot: "65", address: "5483", street: "Jaleen Ave", name: "Allbritton, Janet", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "66", lot: "66", address: "3551", street: "Kirkwood St", name: "Montero, Enrique", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "67", lot: "67", address: "5519", street: "Michelle Ave", name: "Costales Torres, Rafael", issues: "Owes $5 from Jan and $135 from March.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "68", lot: "68", address: "5524", street: "Michelle Ave", name: "Rojas Gill", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "69", lot: "69", address: "5539", street: "Michelle Ave", name: "Solis-Chong", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "70", lot: "70", address: "5549", street: "Michelle Ave", name: "Jimenez, Wilfred", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-895-7223", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "71", lot: "71", address: "5559", street: "Michelle Ave", name: "Marin, Ana", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "72", lot: "72", address: "5569", street: "Michelle Ave", name: "Lopez, Francisco", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "73", lot: "73", address: "5579", street: "Michelle Ave", name: "Rodriguez, Juan", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "74", lot: "74", address: "5589", street: "Michelle Ave", name: "Sawyer, Everett", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "75", lot: "75", address: "5599", street: "Michelle Ave", name: "Tiburcio, Pena", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "76", lot: "76", address: "5598", street: "Michelle Ave", name: "Reboyro, Pravia", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "77", lot: "77", address: "5588", street: "Michelle Ave", name: "Henke, Angela", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "78", lot: "78", address: "5578", street: "Michelle Ave", name: "Marquez, Jose", issues: "Owes $10 for Aug and Oct.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "79", lot: "79", address: "5568", street: "Michelle Ave", name: "Sanchez, Ronald", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "80", lot: "80", address: "5558", street: "Michelle Ave", name: "Selen, Daniel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "786-709-7545", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "81", lot: "81", address: "5548", street: "Michelle Ave", name: "Gomez, Samuel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "82", lot: "82", address: "5538", street: "Michelle Ave", name: "Gonzales, Jesus", issues: "Needs notice. No rent.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "83", lot: "83", address: "5528", street: "Michelle Ave", name: "Jimenez, Sol", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "84", lot: "84", address: "5518", street: "Michelle Ave", name: "Beshere,Christoffel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-967-3034", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "85", lot: "85", address: "3561", street: "Kirkwood St", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "No", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "86", lot: "86", address: "3571", street: "Kirkwood St", name: "Laine, Yvan", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "87", lot: "87", address: "3581", street: "Kirkwood St", name: "Luger, Ken", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "88", lot: "88", address: "5476", street: "Denise Ave", name: "Casanova", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "89", lot: "89", address: "5472", street: "Denise Ave", name: "Charles", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "90", lot: "90", address: "5466", street: "Denise Ave", name: "Hernandez / Martinez", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "91", lot: "91", address: "5456", street: "Denise Ave", name: "Davis", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "92", lot: "92", address: "5444", street: "Denise Ave", name: "Thomas", issues: "Does he have a dog?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "93", lot: "93", address: "5436", street: "Denise Ave", name: "Delgado Romero", issues: "10 short in Aug and Sep.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "94", lot: "94", address: "5432", street: "Denise Ave", name: "Coyne, Paul", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "95", lot: "95", address: "5431", street: "Denise Ave", name: "Lu", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "407-375-5023", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "96", lot: "96", address: "5435", street: "Denise Ave", name: "Polikoff", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "97", lot: "97", address: "5439", street: "Denise Ave", name: "Monell", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "98", lot: "98", address: "5443", street: "Denise Ave", name: "VonKretchmann", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "407-286-5493", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "99", lot: "99", address: "5447", street: "Denise Ave", name: "Montes De Oca Leo", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "100", lot: "100", address: "5451", street: "Denise Ave", name: "Yanta", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "101", lot: "101", address: "5455", street: "Denise Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "102", lot: "102", address: "5459", street: "Denise Ave", name: "Mendenhall", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "203-273-8692", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "103", lot: "103", address: "5463", street: "Denise Ave", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "104", lot: "104", address: "5467", street: "Denise Ave", name: "Miralles", issues: "Do they have a dog? Owe $20 x 2.", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "105", lot: "105", address: "5471", street: "Denise Ave", name: "Sawyer", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "106", lot: "106", address: "5475", street: "Denise Ave", name: "Ingram", issues: "", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "107", lot: "107", address: "5479", street: "Denise Ave", name: "Stuckey", issues: "Owes $10 for Aug, Sep, Oct and $20 from June.", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "407-616-9596", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "108", lot: "108", address: "5481", street: "Denise Ave", name: "Soriano", issues: "Owes $10 for Aug.", status: "Occupied", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "109", lot: "109", address: "5480", street: "Jaleen Ave", name: "Jimenez, Juan + Betty", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "110", lot: "110", address: "5478", street: "Leon Circle", name: "Montes De Oca Bea", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "111", lot: "111", address: "5474", street: "Leon Circle", name: "Benitez", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-448-0742", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "112", lot: "112", address: "5476", street: "Leon Circle", name: "Perez", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "113", lot: "113", address: "5466", street: "Leon Circle", name: "", issues: "", status: "Empty", renter: "", rent: "", key: "Yes", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "114", lot: "114", address: "5462", street: "Leon Circle", name: "Walther", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "115", lot: "115", address: "5458", street: "Leon Circle", name: "Bass", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "116", lot: "116", address: "5454", street: "Leon Circle", name: "Morrow, Tamara", issues: "Owes $10 from Sep.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "117", lot: "117", address: "5450", street: "Leon Circle", name: "Ally", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "118", lot: "118", address: "5446", street: "Leon Circle", name: "Barone, Samuel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "119", lot: "119", address: "5442", street: "Leon Circle", name: "Bornat", issues: "Owes $10 for Aug.", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "120", lot: "120", address: "5438", street: "Leon Circle", name: "Offenhauer", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "121", lot: "121", address: "5434", street: "Leon Circle", name: "Sembrat, Robert", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "122", lot: "122", address: "5430", street: "Leon Circle", name: "Cruz, Martin", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "123", lot: "123", address: "5429", street: "Leon Circle", name: "Rodriguez, Omara", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "124", lot: "124", address: "5433", street: "Leon Circle", name: "Chavez Romero", issues: "Did they get a $20 rent increase?", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "125", lot: "125", address: "5445", street: "Leon Circle", name: "Crawford, Linda", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "Yes", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "126", lot: "126", address: "5449", street: "Leon Circle", name: "Gasparre, Roman", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-969-2040", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "127", lot: "127", address: "5457", street: "Leon Circle", name: "Pena", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "128", lot: "128", address: "5465", street: "Leon Circle", name: "Winn, Donna", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "407-928-3080", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "129", lot: "129", address: "5473", street: "Leon Circle", name: "Pena, Daniel", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "130", lot: "130", address: "5477", street: "Leon Circle", name: "Tanyer, Joanne", issues: "", status: "Occupied", renter: "", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "130.5", lot: "130.5", address: "3729", street: "Ermine St", name: "Botey", issues: "Tell Botey to make Money Order to ETC fbo Gregory Horne", status: "Occupied", renter: "Renter", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "1471-Lake Drive", lot: "", address: "1471", street: "Lake Drive", name: "", issues: "", status: "Occupied", renter: "Renter", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "4053-Bonnie Drive", lot: "", address: "4053", street: "Bonnie Drive", name: "", issues: "", status: "Occupied", renter: "Renter", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
  { id: "3530-Magnolia Terrace Ave", lot: "", address: "3530", street: "Magnolia Terrace Ave", name: "", issues: "", status: "Occupied", renter: "Renter", rent: "", key: "", phone: "", email: "", noMow: "", lateRent: "", guest: "", vehicle: "", acFilter: "", pressureWash: "", violations: "", washer: "", dryer: "" },
];

export const LOT_BY_ID = new Map(LOTS.map((l) => [l.id, l]));

export function displayName(l: Lot): string {
  if (l.name) return l.name.replace(/,(\S)/g, ", $1");
  if (l.status === "Empty") return "Empty";
  if (l.status === "Open") return "Open";
  return "—";
}

export function sheetOf(id: string): 1 | 2 | 3 | null {
  const n = Number(id);
  if (id === "130.5") return 3;
  if (n >= 1 && n <= 65) return 1;
  if (n >= 66 && n <= 87) return 3;
  if (n >= 88 && n <= 130) return 2;
  return null;
}

export function matches(l: Lot, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (/^\d+(\.5)?$/.test(q)) return l.lot === q || l.address === q;
  return [
    l.lot, l.address, l.street, l.name, l.issues, l.status, l.maintenance, l.renter, l.rent, l.moveIn, l.rentDue, l.deposit, l.balance, l.noticeDate, l.noticeNote,
    l.key, l.phone, l.email, l.noMow, l.lateRent, l.bouncedCheck, l.guest, l.vehicle, l.rentInc2026, l.rentInc2027,
    ...(l.guests ?? []).flatMap((guest) => [guest.name, guest.year, guest.make, guest.tag, guest.state]),
    l.acFilter, l.pressureWash, l.violations, l.washer, l.dryer, l.fridge, l.stove, l.microwave, l.dogs, l.cats, l.wiring, l.homeIns, l.homeInsDate, l.zillow, l.zillowUrl, l.homeYear, l.homeMake, l.homeModel, l.homeWidth, l.homeLength, l.homeWide,
    l.roofAge, l.roofMaterial, l.roofInstalled, l.roofReplace, l.acCleaning, l.acService,
    l.inspectionDate, l.inspectionNotes, l.leaseEnd, l.emergencyName, l.emergencyPhone, l.courtDate, l.courtNote, l.waitName, l.waitPhone, l.lease?.name, l.rulesReceipt?.name, l.background?.name,
    ...(l.otherDocs ?? []).map((doc) => doc.name),
  ].join(" ").toLowerCase().includes(q);
}
