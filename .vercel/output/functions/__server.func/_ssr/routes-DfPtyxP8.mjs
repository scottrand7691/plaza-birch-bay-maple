import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-E0ptKr0j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DfPtyxP8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isRenterLot(lot) {
	const role = lot.renter?.trim().toLowerCase() ?? "";
	return role.includes("renter") || role.includes("rent-to-own") || role.includes("rent to own");
}
var MOW_SHEET = /* @__PURE__ */ new Set([
	"2",
	"4",
	"5",
	"6",
	"8",
	"12",
	"13",
	"18",
	"21",
	"28",
	"29",
	"30",
	"31",
	"34",
	"35",
	"37",
	"38",
	"42",
	"45",
	"46",
	"47",
	"50",
	"52",
	"53",
	"54",
	"56",
	"57",
	"61",
	"64",
	"65",
	"66",
	"75",
	"84",
	"85",
	"87",
	"89",
	"91",
	"93",
	"94",
	"95",
	"96",
	"98",
	"101",
	"102",
	"103",
	"104",
	"109",
	"113",
	"114",
	"118",
	"119",
	"120",
	"122",
	"123",
	"125"
]);
var WIRING_YES = /* @__PURE__ */ new Set([
	"5585|jaleen",
	"5483|jaleen",
	"5543|jaleen",
	"5525|jaleen",
	"5529|jaleen",
	"5603|jaleen",
	"5520|jaleen",
	"5545|jaleen",
	"5515|jaleen",
	"5565|jaleen",
	"5575|jaleen",
	"5601|jaleen",
	"5495|jaleen",
	"5502|denise",
	"5467|denise",
	"5443|denise",
	"5455|denise",
	"5523|denise",
	"5436|denise",
	"5459|denise",
	"5609|denise",
	"5538|denise",
	"5431|denise",
	"5530|denise",
	"5528|denise",
	"5456|denise",
	"5500|denise",
	"5475|denise",
	"5479|denise",
	"5481|denise",
	"5593|leon",
	"5520|leon",
	"5511|leon",
	"5500|leon",
	"5442|leon",
	"5465|leon",
	"5527|leon",
	"5524|leon",
	"5558|michelle",
	"5539|michelle",
	"5589|michelle",
	"5599|michelle",
	"5518|michelle",
	"5579|michelle",
	"5559|michelle",
	"5578|michelle",
	"3729|ermine"
]);
var HOME_INS_YES = /* @__PURE__ */ new Set([
	"5529|jaleen",
	"5575|jaleen",
	"5580|jaleen",
	"5601|jaleen",
	"5603|jaleen",
	"5560|jaleen",
	"5431|denise",
	"5436|denise",
	"5439|denise",
	"5443|denise",
	"5466|denise",
	"5475|denise",
	"5479|denise",
	"5481|denise",
	"5500|denise",
	"5523|denise",
	"5528|denise",
	"5530|denise",
	"5538|denise",
	"5582|denise",
	"5583|denise",
	"5433|leon",
	"5442|leon",
	"5465|leon",
	"5520|leon",
	"5524|leon",
	"5539|michelle",
	"5558|michelle",
	"5578|michelle",
	"5579|michelle",
	"5599|michelle",
	"5589|jaleen",
	"5593|jaleen",
	"5569|denise",
	"5565|michelle"
]);
function wiringStreet(street) {
	const name = street.toLowerCase();
	if (name.includes("jaleen")) return "jaleen";
	if (name.includes("denise")) return "denise";
	if (name.includes("leon")) return "leon";
	if (name.includes("michelle")) return "michelle";
	if (name.includes("ermine") || name.includes("block")) return "ermine";
	if (name.includes("lake")) return "lake";
	return "";
}
function petFee(dogs, cats) {
	const count = (value) => value === "1" || value === "2" ? Number(value) : 0;
	return (count(dogs) + count(cats)) * 15;
}
function rentTotal(lotRent, homeRent, fee = 0) {
	const lot = (lotRent ?? "").replace(/[$,\s]/g, "");
	const home = (homeRent ?? "").replace(/[$,\s]/g, "");
	if (!lot && !home && !fee) return "";
	const sum = (Number(lot) || 0) + (Number(home) || 0) + fee;
	const rounded = Math.round(sum * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
function rentGap(total, lotRent, fee = 0) {
	if (!(total ?? "").trim()) return "";
	const whole = Number((total ?? "").replace(/[$,\s]/g, ""));
	const base = Number((lotRent ?? "").replace(/[$,\s]/g, "")) || 0;
	if (!Number.isFinite(whole)) return "";
	const diff = Math.round((whole - base - fee) * 100) / 100;
	return Number.isInteger(diff) ? String(diff) : diff.toFixed(2);
}
function withEmptyMow(lot) {
	let next = lot;
	if (next.id === "47" && next.address === "5531") next = {
		...next,
		address: "5539"
	};
	if (next.id === "76" && next.address === "5558") next = {
		...next,
		address: "5598",
		wiring: next.wiring === "Yes" ? "" : next.wiring
	};
	if (next.id === "130.5" && (!next.address.trim() || next.street.toLowerCase().includes("block"))) next = {
		...next,
		address: "3729",
		street: "Ermine St"
	};
	if (next.id === "109" && /leon/i.test(next.street)) next = {
		...next,
		street: "Jaleen Ave"
	};
	if (MOW_SHEET.has(next.id) && !(next.noMow ?? "").trim()) next = {
		...next,
		noMow: "Yes"
	};
	if (next.status === "Empty" && next.noMow !== "Yes") next = {
		...next,
		noMow: "Yes"
	};
	if (/^(owe|no-owe)$/i.test(next.noMow) || next.noOwe === "Yes" && next.noMow !== "Yes" && next.noMow !== "No") next = {
		...next,
		noMow: "No",
		noOwe: ""
	};
	const wiringKey = `${next.address}|${wiringStreet(next.street)}`;
	if (WIRING_YES.has(wiringKey) && next.wiring !== "Yes" && next.wiring !== "No") next = {
		...next,
		wiring: "Yes"
	};
	if (HOME_INS_YES.has(wiringKey) && next.homeIns !== "Yes" && next.homeIns !== "No") next = {
		...next,
		homeIns: "Yes"
	};
	if (next.address === "1471" && /lake/i.test(next.street) && next.homeIns === "Yes") next = {
		...next,
		homeIns: ""
	};
	let lotRent = next.lotRent ?? "";
	if (next.status !== "Occupied") lotRent = "";
	else if (!lotRent.trim()) lotRent = "540";
	const homeRent = next.homeRent ?? "";
	const rent = rentTotal(lotRent, homeRent, petFee(next.dogs, next.cats));
	if (next.lotRent !== lotRent || next.homeRent !== homeRent || next.rent !== rent) next = {
		...next,
		lotRent,
		homeRent,
		rent
	};
	return next;
}
function matchesFilter(lot, filter) {
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
function dayStamp(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDay(value) {
	const day = value?.trim().slice(0, 10) ?? "";
	return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : "";
}
function sameMonth(value) {
	const day = parseDay(value);
	if (!day) return false;
	return day.slice(0, 7) === dayStamp().slice(0, 7);
}
function addDays(stamp, days) {
	const [y, m, d] = stamp.split("-").map(Number);
	const date = new Date(y, m - 1, d);
	date.setDate(date.getDate() + days);
	return dayStamp(date);
}
function daysUntil(due) {
	const day = parseDay(due);
	if (!day) return null;
	const [y, m, d] = day.split("-").map(Number);
	const [ty, tm, td] = dayStamp().split("-").map(Number);
	const dueDate = new Date(y, m - 1, d).getTime();
	const today = new Date(ty, tm - 1, td).getTime();
	return Math.round((dueDate - today) / 864e5);
}
function depositReminder(stay) {
	if (!stay.depositDue || stay.depositChoice === "Return" || stay.depositChoice === "Keep") return "";
	const left = daysUntil(stay.depositDue);
	if (left == null) return "";
	const amount = stay.deposit?.trim() ? ` (${stay.deposit.trim()})` : "";
	if (left < 0) return `Deposit return or keep is past 15 days${amount}`;
	if (left === 0) return `Return or keep the deposit today${amount}`;
	return `Return or keep the deposit · ${left} day${left === 1 ? "" : "s"} left${amount}`;
}
function moveOutLot(lot) {
	const moved = dayStamp();
	const stay = {
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
		otherDocs: lot.otherDocs ?? []
	};
	const keep = [
		stay.name,
		stay.phone,
		stay.email,
		stay.rent,
		stay.moveIn,
		stay.guest,
		stay.vehicle,
		stay.emergencyName,
		stay.issues
	].some((value) => (value ?? "").trim());
	return {
		...lot,
		history: keep ? [stay, ...lot.history ?? []] : lot.history ?? [],
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
		status: "Empty"
	};
}
function prettyDay(stamp) {
	const [y, m, d] = stamp.split("-").map(Number);
	if (!y || !m || !d) return stamp;
	return new Date(y, m - 1, d).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function lotNotes(lot) {
	return [
		lot.issues,
		lot.violations,
		lot.inspectionNotes
	].map((value) => value?.trim() ?? "").filter(Boolean).join(" · ");
}
function buildTodo(lots) {
	const today = dayStamp();
	const items = [];
	for (const lot of lots) {
		const tasks = [];
		const add = (date, text) => {
			if (text.trim()) tasks.push({
				date,
				text
			});
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
			add(parseDay(job.date) || today, job.note.trim() || "Maintenance");
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
			date: tasks[0]?.date ?? ""
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
function dueState(value) {
	const raw = value?.trim() ?? "";
	if (!raw) return "";
	const day = raw.slice(0, 10);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return "";
	const today = /* @__PURE__ */ new Date();
	if (day < `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`) return "past";
	return "due";
}
/** Every column from the lot register, including blanks. */
var LOTS = [
	{
		id: "1",
		lot: "1",
		address: "5600",
		street: "Jaleen Ave",
		name: "Club House/Office",
		issues: "",
		status: "Open",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "2",
		lot: "2",
		address: "5580",
		street: "Jaleen Ave",
		name: "Andrews",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "3",
		lot: "3",
		address: "5560",
		street: "Jaleen Ave",
		name: "Acosta, Espino",
		issues: "Will they get a rent increase?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "4",
		lot: "4",
		address: "5540",
		street: "Jaleen Ave",
		name: "Marysonet",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "5",
		lot: "5",
		address: "5520",
		street: "Jaleen Ave",
		name: "Herrera, E.",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "6",
		lot: "6",
		address: "5603",
		street: "Jaleen Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "7",
		lot: "7",
		address: "5601",
		street: "Jaleen Ave",
		name: "Mena Sosa",
		issues: "Owes $20 for Sep and $10 for Oct.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "8",
		lot: "8",
		address: "5608",
		street: "Denise Ave",
		name: "Sodansky, Carl",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "9",
		lot: "9",
		address: "5610",
		street: "Denise Ave",
		name: "Phillips",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "10",
		lot: "10",
		address: "5585",
		street: "Jaleen Ave",
		name: "Vazquez",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "11",
		lot: "11",
		address: "5561",
		street: "Jaleen Ave",
		name: "Brown",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "12",
		lot: "12",
		address: "5594",
		street: "Denise Ave",
		name: "Matejka, Carolina",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "13",
		lot: "13",
		address: "5498",
		street: "Jaleen Ave",
		name: "Carter, Lisa",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "14",
		lot: "14",
		address: "5575",
		street: "Jaleen Ave",
		name: "Kiefer",
		issues: "Owes $10 for Aug and Sep.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "321-305-1396",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "15",
		lot: "15",
		address: "5587",
		street: "Jaleen Ave",
		name: "Perez, I.",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "16",
		lot: "16",
		address: "5578",
		street: "Denise Ave",
		name: "Cruz, Antonio",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "17",
		lot: "17",
		address: "5582",
		street: "Denise Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "18",
		lot: "18",
		address: "5565",
		street: "Jaleen Ave",
		name: "Ramsey, Jennifer",
		issues: "Does she have a dog?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "19",
		lot: "19",
		address: "5569",
		street: "Jaleen Ave",
		name: "Cruz, Antonio",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "20",
		lot: "20",
		address: "5568",
		street: "Denise Ave",
		name: "Ramskog",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "678-973-5466",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "21",
		lot: "21",
		address: "5564",
		street: "Denise Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "22",
		lot: "22",
		address: "5545",
		street: "Jaleen Ave",
		name: "Solomon, Larry",
		issues: "10 short in Aug and Sep.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "23",
		lot: "23",
		address: "5543",
		street: "Jaleen Ave",
		name: "Russell, John",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "24",
		lot: "24",
		address: "5538",
		street: "Denise Ave",
		name: "Gomez",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "25",
		lot: "25",
		address: "5542",
		street: "Denise Ave",
		name: "Hoang",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "26",
		lot: "26",
		address: "5525",
		street: "Jaleen Ave",
		name: "Hernandez, John",
		issues: "Owes $10 for Aug, Sep, Oct.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "27",
		lot: "27",
		address: "5529",
		street: "Jaleen Ave",
		name: "Vargas, Norberto",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "28",
		lot: "28",
		address: "5530",
		street: "Denise Ave",
		name: "Godshalk",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "29",
		lot: "29",
		address: "5528",
		street: "Denise Ave",
		name: "Clark",
		issues: "Does or did she get a rent increase?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "30",
		lot: "30",
		address: "5515",
		street: "Jaleen Ave",
		name: "Stacy",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "31",
		lot: "31",
		address: "5513",
		street: "Jaleen Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "32",
		lot: "32",
		address: "5510",
		street: "Denise Ave",
		name: "Bodell, Richard",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "33",
		lot: "33",
		address: "5516",
		street: "Denise Ave",
		name: "Aranda, Benjamin",
		issues: "Owes $20 x 2.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "34",
		lot: "34",
		address: "5499",
		street: "Jaleen Ave",
		name: "Polston, Carolyn",
		issues: "Owes $10 for Aug, Sep, Oct.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "35",
		lot: "35",
		address: "5509",
		street: "Jaleen Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "36",
		lot: "36",
		address: "5502",
		street: "Denise Ave",
		name: "Tinoco, Maria",
		issues: "Does she have a dog? $10 short x 2.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "37",
		lot: "37",
		address: "5500",
		street: "Denise Ave",
		name: "Holgate",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "38",
		lot: "38",
		address: "5495",
		street: "Jaleen Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "39",
		lot: "39",
		address: "5497",
		street: "Jaleen Ave",
		name: "Brizuela",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "40",
		lot: "40",
		address: "5485",
		street: "Jaleen Ave",
		name: "Battaglia",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "41",
		lot: "41",
		address: "5400",
		street: "Denise Ave",
		name: "Weil",
		issues: "Do they have a pet? Owes $10 for Aug, Sep, Oct and a late fee from February.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "42",
		lot: "42",
		address: "5609",
		street: "Denise Ave",
		name: "Spicer",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "43",
		lot: "43",
		address: "5583",
		street: "Denise Ave",
		name: "Roberts",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "44",
		lot: "44",
		address: "5561",
		street: "Leon Circle",
		name: "Shank",
		issues: "Does she have a dog?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-712-5811",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "45",
		lot: "45",
		address: "5551",
		street: "Leon Circle",
		name: "Meininger",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-297-1021",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "46",
		lot: "46",
		address: "5543",
		street: "Leon Circle",
		name: "Manette",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "47",
		lot: "47",
		address: "5539",
		street: "Leon Circle",
		name: "Campbell",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "48",
		lot: "48",
		address: "5523",
		street: "Denise Ave",
		name: "Murillo, Nora",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "49",
		lot: "49",
		address: "5519",
		street: "Denise Ave",
		name: "Barr, James + Sharon",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "50",
		lot: "50",
		address: "5503",
		street: "Denise Ave",
		name: "Manos",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "51",
		lot: "51",
		address: "5522",
		street: "Leon Circle",
		name: "Exposito",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "52",
		lot: "52",
		address: "5524",
		street: "Leon Circle",
		name: "Walther Irene",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "53",
		lot: "53",
		address: "5520",
		street: "Leon Circle",
		name: "Oyster",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "54",
		lot: "54",
		address: "5518",
		street: "Leon Circle",
		name: "Hartner",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "55",
		lot: "55",
		address: "5504",
		street: "Leon Circle",
		name: "Walton, Richard",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "56",
		lot: "56",
		address: "5506",
		street: "Leon Circle",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "57",
		lot: "57",
		address: "5502",
		street: "Leon Circle",
		name: "Casarez, Lori",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-718-9047",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "58",
		lot: "58",
		address: "5500",
		street: "Leon Circle",
		name: "Wrage, Teresa",
		issues: "Owes $10 for Aug, Sep, Oct. Will she get a rent increase?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "59",
		lot: "59",
		address: "5531",
		street: "Leon Circle",
		name: "Reyes Cobas",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "60",
		lot: "60",
		address: "5527",
		street: "Leon Circle",
		name: "Cintron, Angel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "61",
		lot: "61",
		address: "5517",
		street: "Leon Circle",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "62",
		lot: "62",
		address: "5511",
		street: "Leon Circle",
		name: "Luzzi, Stephanie",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "63",
		lot: "63",
		address: "5593",
		street: "Leon Circle",
		name: "Barrett, Billy",
		issues: "Owes $10 for Aug, Sep, Oct. Will he get a rent increase?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "64",
		lot: "64",
		address: "5481",
		street: "Jaleen Ave",
		name: "Block",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "65",
		lot: "65",
		address: "5483",
		street: "Jaleen Ave",
		name: "Allbritton, Janet",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "66",
		lot: "66",
		address: "3551",
		street: "Kirkwood St",
		name: "Montero, Enrique",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "67",
		lot: "67",
		address: "5519",
		street: "Michelle Ave",
		name: "Costales Torres, Rafael",
		issues: "Owes $5 from Jan and $135 from March.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "68",
		lot: "68",
		address: "5524",
		street: "Michelle Ave",
		name: "Rojas Gill",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "69",
		lot: "69",
		address: "5539",
		street: "Michelle Ave",
		name: "Solis-Chong",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "70",
		lot: "70",
		address: "5549",
		street: "Michelle Ave",
		name: "Jimenez, Wilfred",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-895-7223",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "71",
		lot: "71",
		address: "5559",
		street: "Michelle Ave",
		name: "Marin, Ana",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "72",
		lot: "72",
		address: "5569",
		street: "Michelle Ave",
		name: "Lopez, Francisco",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "73",
		lot: "73",
		address: "5579",
		street: "Michelle Ave",
		name: "Rodriguez, Juan",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "74",
		lot: "74",
		address: "5589",
		street: "Michelle Ave",
		name: "Sawyer, Everett",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "75",
		lot: "75",
		address: "5599",
		street: "Michelle Ave",
		name: "Tiburcio, Pena",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "76",
		lot: "76",
		address: "5598",
		street: "Michelle Ave",
		name: "Reboyro, Pravia",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "77",
		lot: "77",
		address: "5588",
		street: "Michelle Ave",
		name: "Henke, Angela",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "78",
		lot: "78",
		address: "5578",
		street: "Michelle Ave",
		name: "Marquez, Jose",
		issues: "Owes $10 for Aug and Oct.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "79",
		lot: "79",
		address: "5568",
		street: "Michelle Ave",
		name: "Sanchez, Ronald",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "80",
		lot: "80",
		address: "5558",
		street: "Michelle Ave",
		name: "Selen, Daniel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "786-709-7545",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "81",
		lot: "81",
		address: "5548",
		street: "Michelle Ave",
		name: "Gomez, Samuel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "82",
		lot: "82",
		address: "5538",
		street: "Michelle Ave",
		name: "Gonzales, Jesus",
		issues: "Needs notice. No rent.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "83",
		lot: "83",
		address: "5528",
		street: "Michelle Ave",
		name: "Jimenez, Sol",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "84",
		lot: "84",
		address: "5518",
		street: "Michelle Ave",
		name: "Beshere,Christoffel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-967-3034",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "85",
		lot: "85",
		address: "3561",
		street: "Kirkwood St",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "No",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "86",
		lot: "86",
		address: "3571",
		street: "Kirkwood St",
		name: "Laine, Yvan",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "87",
		lot: "87",
		address: "3581",
		street: "Kirkwood St",
		name: "Luger, Ken",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "88",
		lot: "88",
		address: "5476",
		street: "Denise Ave",
		name: "Casanova",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "89",
		lot: "89",
		address: "5472",
		street: "Denise Ave",
		name: "Charles",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "90",
		lot: "90",
		address: "5466",
		street: "Denise Ave",
		name: "Hernandez / Martinez",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "91",
		lot: "91",
		address: "5456",
		street: "Denise Ave",
		name: "Davis",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "92",
		lot: "92",
		address: "5444",
		street: "Denise Ave",
		name: "Thomas",
		issues: "Does he have a dog?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "93",
		lot: "93",
		address: "5436",
		street: "Denise Ave",
		name: "Delgado Romero",
		issues: "10 short in Aug and Sep.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "94",
		lot: "94",
		address: "5432",
		street: "Denise Ave",
		name: "Coyne, Paul",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "95",
		lot: "95",
		address: "5431",
		street: "Denise Ave",
		name: "Lu",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "407-375-5023",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "96",
		lot: "96",
		address: "5435",
		street: "Denise Ave",
		name: "Polikoff",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "97",
		lot: "97",
		address: "5439",
		street: "Denise Ave",
		name: "Monell",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "98",
		lot: "98",
		address: "5443",
		street: "Denise Ave",
		name: "VonKretchmann",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "407-286-5493",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "99",
		lot: "99",
		address: "5447",
		street: "Denise Ave",
		name: "Montes De Oca Leo",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "100",
		lot: "100",
		address: "5451",
		street: "Denise Ave",
		name: "Yanta",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "101",
		lot: "101",
		address: "5455",
		street: "Denise Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "102",
		lot: "102",
		address: "5459",
		street: "Denise Ave",
		name: "Mendenhall",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "203-273-8692",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "103",
		lot: "103",
		address: "5463",
		street: "Denise Ave",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "104",
		lot: "104",
		address: "5467",
		street: "Denise Ave",
		name: "Miralles",
		issues: "Do they have a dog? Owe $20 x 2.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "105",
		lot: "105",
		address: "5471",
		street: "Denise Ave",
		name: "Sawyer",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "106",
		lot: "106",
		address: "5475",
		street: "Denise Ave",
		name: "Ingram",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "107",
		lot: "107",
		address: "5479",
		street: "Denise Ave",
		name: "Stuckey",
		issues: "Owes $10 for Aug, Sep, Oct and $20 from June.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "407-616-9596",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "108",
		lot: "108",
		address: "5481",
		street: "Denise Ave",
		name: "Soriano",
		issues: "Owes $10 for Aug.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "109",
		lot: "109",
		address: "5480",
		street: "Jaleen Ave",
		name: "Jimenez, Juan + Betty",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "110",
		lot: "110",
		address: "5478",
		street: "Leon Circle",
		name: "Montes De Oca Bea",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "111",
		lot: "111",
		address: "5474",
		street: "Leon Circle",
		name: "Benitez",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-448-0742",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "112",
		lot: "112",
		address: "5476",
		street: "Leon Circle",
		name: "Perez",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "113",
		lot: "113",
		address: "5466",
		street: "Leon Circle",
		name: "",
		issues: "",
		status: "Empty",
		renter: "",
		rent: "",
		key: "Yes",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "114",
		lot: "114",
		address: "5462",
		street: "Leon Circle",
		name: "Walther",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "115",
		lot: "115",
		address: "5458",
		street: "Leon Circle",
		name: "Bass",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "116",
		lot: "116",
		address: "5454",
		street: "Leon Circle",
		name: "Morrow, Tamara",
		issues: "Owes $10 from Sep.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "117",
		lot: "117",
		address: "5450",
		street: "Leon Circle",
		name: "Ally",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "118",
		lot: "118",
		address: "5446",
		street: "Leon Circle",
		name: "Barone, Samuel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "119",
		lot: "119",
		address: "5442",
		street: "Leon Circle",
		name: "Bornat",
		issues: "Owes $10 for Aug.",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "120",
		lot: "120",
		address: "5438",
		street: "Leon Circle",
		name: "Offenhauer",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "121",
		lot: "121",
		address: "5434",
		street: "Leon Circle",
		name: "Sembrat, Robert",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "122",
		lot: "122",
		address: "5430",
		street: "Leon Circle",
		name: "Cruz, Martin",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "123",
		lot: "123",
		address: "5429",
		street: "Leon Circle",
		name: "Rodriguez, Omara",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "124",
		lot: "124",
		address: "5433",
		street: "Leon Circle",
		name: "Chavez Romero",
		issues: "Did they get a $20 rent increase?",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "125",
		lot: "125",
		address: "5445",
		street: "Leon Circle",
		name: "Crawford, Linda",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "Yes",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "126",
		lot: "126",
		address: "5449",
		street: "Leon Circle",
		name: "Gasparre, Roman",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-969-2040",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "127",
		lot: "127",
		address: "5457",
		street: "Leon Circle",
		name: "Pena",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "128",
		lot: "128",
		address: "5465",
		street: "Leon Circle",
		name: "Winn, Donna",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "407-928-3080",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "129",
		lot: "129",
		address: "5473",
		street: "Leon Circle",
		name: "Pena, Daniel",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "130",
		lot: "130",
		address: "5477",
		street: "Leon Circle",
		name: "Tanyer, Joanne",
		issues: "",
		status: "Occupied",
		renter: "",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "130.5",
		lot: "130.5",
		address: "3729",
		street: "Ermine St",
		name: "Botey",
		issues: "Tell Botey to make Money Order to ETC fbo Gregory Horne",
		status: "Occupied",
		renter: "Renter",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "1471-Lake Drive",
		lot: "",
		address: "1471",
		street: "Lake Drive",
		name: "",
		issues: "",
		status: "Occupied",
		renter: "Renter",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "4053-Bonnie Drive",
		lot: "",
		address: "4053",
		street: "Bonnie Drive",
		name: "",
		issues: "",
		status: "Occupied",
		renter: "Renter",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	},
	{
		id: "3530-Magnolia Terrace Ave",
		lot: "",
		address: "3530",
		street: "Magnolia Terrace Ave",
		name: "",
		issues: "",
		status: "Occupied",
		renter: "Renter",
		rent: "",
		key: "",
		phone: "",
		email: "",
		noMow: "",
		lateRent: "",
		guest: "",
		vehicle: "",
		acFilter: "",
		pressureWash: "",
		violations: "",
		washer: "",
		dryer: ""
	}
];
new Map(LOTS.map((l) => [l.id, l]));
function displayName(l) {
	if (l.name) return l.name.replace(/,(\S)/g, ", $1");
	if (l.status === "Empty") return "Empty";
	if (l.status === "Open") return "Open";
	return "—";
}
function sheetOf(id) {
	const n = Number(id);
	if (id === "130.5") return 3;
	if (n >= 1 && n <= 65) return 1;
	if (n >= 66 && n <= 87) return 3;
	if (n >= 88 && n <= 130) return 2;
	return null;
}
function matches(l, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	if (/^\d+(\.5)?$/.test(q)) return l.lot === q || l.address === q;
	return [
		l.lot,
		l.address,
		l.street,
		l.name,
		l.issues,
		l.status,
		l.maintenance,
		l.renter,
		l.rent,
		l.moveIn,
		l.rentDue,
		l.deposit,
		l.balance,
		l.noticeDate,
		l.noticeNote,
		l.key,
		l.phone,
		l.email,
		l.noMow,
		l.lateRent,
		l.bouncedCheck,
		l.guest,
		l.vehicle,
		l.rentInc2026,
		l.rentInc2027,
		...(l.guests ?? []).flatMap((guest) => [
			guest.name,
			guest.year,
			guest.make,
			guest.tag,
			guest.state
		]),
		l.acFilter,
		l.pressureWash,
		l.violations,
		l.washer,
		l.dryer,
		l.fridge,
		l.stove,
		l.microwave,
		l.dogs,
		l.cats,
		l.wiring,
		l.homeIns,
		l.homeInsDate,
		l.zillow,
		l.zillowUrl,
		l.homeYear,
		l.homeMake,
		l.homeModel,
		l.homeWidth,
		l.homeLength,
		l.homeWide,
		l.roofAge,
		l.roofMaterial,
		l.roofInstalled,
		l.roofReplace,
		l.acCleaning,
		l.acService,
		l.inspectionDate,
		l.inspectionNotes,
		l.leaseEnd,
		l.emergencyName,
		l.emergencyPhone,
		l.courtDate,
		l.courtNote,
		l.waitName,
		l.waitPhone,
		l.lease?.name,
		l.rulesReceipt?.name,
		l.background?.name,
		...(l.otherDocs ?? []).map((doc) => doc.name)
	].join(" ").toLowerCase().includes(q);
}
function row(ids, y, opts) {
	const gap = opts.gap ?? 4;
	const total = ids.length * opts.w + (ids.length - 1) * gap;
	const start = opts.right != null ? opts.right - total : opts.x ?? 0;
	return ids.map((id, i) => ({
		id,
		x: start + i * (opts.w + gap),
		y,
		w: opts.w,
		h: opts.h,
		kind: "lot"
	}));
}
function mark(id, label, x, y, w, h) {
	return {
		id,
		label,
		x,
		y,
		w,
		h,
		kind: "landmark"
	};
}
function lotBox(id, x, y, w, h, extra) {
	return {
		id,
		x,
		y,
		w,
		h,
		kind: "lot",
		...extra
	};
}
/** Map 1 — landscape. North is left. Leon Circle is an L: along the north side of the inner lots, then west. */
function sheet1() {
	const boxes = [];
	const put = (id, x, y, w, h, extra) => boxes.push(lotBox(id, x, y, w, h, extra));
	const colX = 292;
	const colW = 168;
	const topY = 18;
	const topH = 90;
	const bigH = 116;
	const x = colX;
	const y = topY;
	const w = colW;
	const len = Math.hypot(w, bigH);
	const ox = bigH / len * 3;
	const oy = -168 / len * 3;
	put("59", 359.2, 24, w * .56, 102, { points: `${x + ox},${y} 460,${y} 460,${134 + oy}` });
	const x60 = 463;
	const topW = 177;
	[
		"60",
		"61",
		"62",
		"63"
	].forEach((id, i) => put(id, x60 + i * 180, topY, topW, topH));
	put("47", 298, 62.08, w * .52, bigH * .58, { points: `${x},${y - oy} ${460 - ox},134 ${x},134` });
	const stackH = 80;
	put("46", colX, 142, colW, stackH);
	put("45", colX, 225, colW, stackH);
	const innerX = 485;
	const inW = 627 / 4;
	const yLow = 308;
	const hLow = 86;
	const y51 = 225;
	const y52 = 142;
	[
		"52",
		"54",
		"56"
	].forEach((id, i) => put(id, innerX + i * 159.75, y52, inW, stackH));
	[
		"51",
		"53",
		"55"
	].forEach((id, i) => put(id, innerX + i * 159.75, y51, inW, stackH));
	const x58 = 964.25;
	put("58", x58, y52, 128.75, stackH);
	put("57", x58, y51, 128.75, stackH);
	const xPortrait = 1096;
	const widePortrait = 84;
	const pairH = 249 / 2;
	put("64", xPortrait, y52, widePortrait, pairH);
	put("65", xPortrait, 269.5, widePortrait, pairH);
	put("42", 52, yLow, 124, hLow);
	put("43", 180, yLow, 109, hLow);
	put("44", colX, yLow, colW, hLow);
	const dw = 210;
	["48", "49"].forEach((id, i) => put(id, innerX + i * 213, yLow, dw, hLow));
	put("50", 911, yLow, 182, hLow);
	const gridX = 52;
	const cw = 1104 / 9;
	const ch = 70;
	const y0 = 420;
	put("9", gridX, y0, cw, ch);
	put("17", 177.66666666666669, y0, 248.33333333333334, ch);
	[
		"21",
		"25",
		"29",
		"33",
		"37",
		"41"
	].forEach((id, i) => put(id, 429 + i * 125.66666666666667, y0, cw, ch));
	[
		[
			"8",
			"12",
			"16",
			"20",
			"24",
			"28",
			"32",
			"36",
			"40"
		],
		[
			"7",
			"11",
			"15",
			"19",
			"23",
			"27",
			"31",
			"35",
			"39"
		],
		[
			"6",
			"10",
			"14",
			"18",
			"22",
			"26",
			"30",
			"34",
			"38"
		]
	].forEach((ids, r) => {
		ids.forEach((id, c) => put(id, gridX + c * 125.66666666666667, y0 + (r + 1) * 73, cw, ch));
	});
	const clubY = 740;
	[
		"1",
		"2",
		"3",
		"4",
		"5"
	].forEach((id, i) => put(id, 52 + i * 168, clubY, 162, 94));
	put("13", 1057.3333333333335, clubY, cw, 94);
	return {
		viewBox: `0 0 1240 860`,
		boxes,
		labels: [
			{
				text: "DR. LOVE ROAD",
				x: 22,
				y: 520,
				rotate: -90,
				size: 13
			},
			{
				text: "LEON CIRCLE",
				x: 1665 / 2,
				y: 129,
				size: 13
			},
			{
				text: "LEON CIRCLE",
				x: 474,
				y: 222,
				rotate: -90,
				size: 12
			},
			{
				text: "DENISE AVE",
				x: 616,
				y: 412,
				size: 13
			},
			{
				text: "JALEEN AVE",
				x: 616,
				y: 730,
				size: 13
			}
		],
		north: "left"
	};
}
/** Map 2 — landscape. North is up, same as the sheet. */
function sheet2() {
	const x = 78;
	const gap = 4;
	const w8 = 174;
	const w14 = 1368 / 14;
	const hTop = 125;
	const hMid = 203;
	const hBot = 125;
	const hPond = 150;
	const y1 = 22;
	const y2 = 189;
	const y3 = 402;
	const y4 = 641;
	const yPond = 787;
	return {
		viewBox: `0 0 1540 959`,
		boxes: [
			...row([
				"130",
				"129",
				"128",
				"127",
				"126",
				"125",
				"124",
				"123"
			], y1, {
				x,
				w: w8,
				h: hTop,
				gap
			}),
			...row([
				"109",
				"110",
				"111",
				"112",
				"113",
				"114",
				"115",
				"116",
				"117",
				"118",
				"119",
				"120",
				"121",
				"122"
			], y2, {
				x,
				w: w14,
				h: hMid,
				gap
			}),
			...row([
				"108",
				"107",
				"106",
				"105",
				"104",
				"103",
				"102",
				"101",
				"100",
				"99",
				"98",
				"97",
				"96",
				"95"
			], y3, {
				x,
				w: w14,
				h: hMid,
				gap
			}),
			...row(["88", "89"], y4, {
				x,
				w: w8,
				h: hBot,
				gap
			}),
			mark("plant", "Treatment Plant", 434, y4, w8, hBot),
			...row([
				"90",
				"91",
				"92",
				"93",
				"94"
			], y4, {
				x: 612,
				w: w8,
				h: hBot,
				gap
			}),
			mark("retain", "Retention Pond", x, yPond, 1388 / 3, hPond),
			mark("hold", "Holding Pond", 556.6666666666667, yPond, 1388 / 3, hPond),
			mark("rv", "R.V. Lot", 1035.3333333333335, yPond, 1388 / 3, hPond)
		],
		labels: [
			{
				text: "JALEEN AVENUE",
				x: 22,
				y: 959 / 2,
				rotate: -90,
				size: 12
			},
			{
				text: "LEON CIRCLE",
				x: 788,
				y: 173,
				size: 13
			},
			{
				text: "DENISE AVE",
				x: 788,
				y: 629,
				size: 13
			}
		],
		north: "left"
	};
}
/** Map 3 — portrait. North is up. Michelle Avenue runs between 85 and 66. */
function sheet3() {
	const colW = 206;
	const colH = 78;
	const wingW = 166;
	const x87 = 28;
	const x86 = 200;
	const westX = 372;
	const eastX = 622;
	const west = [
		"76",
		"77",
		"78",
		"79",
		"80",
		"81",
		"82",
		"83",
		"84"
	];
	const east = [
		"75",
		"74",
		"73",
		"72",
		"71",
		"70",
		"69",
		"68",
		"67"
	];
	const y0 = 44;
	const boxes = [...west.map((id, i) => lotBox(id, westX, y0 + i * 83, colW, colH)), ...east.map((id, i) => lotBox(id, eastX, y0 + i * 83, colW, colH))];
	const kirkY = 791;
	const kirkH = 98;
	boxes.push(lotBox("87", x87, kirkY, wingW, kirkH));
	boxes.push(lotBox("130.5", x87, 925, wingW, kirkH));
	boxes.push(lotBox("86", x86, kirkY, wingW, kirkH));
	boxes.push(lotBox("85", westX, kirkY, colW, kirkH));
	boxes.push(lotBox("66", eastX, kirkY, colW, kirkH));
	return {
		viewBox: `0 0 864 1039`,
		boxes,
		labels: [
			{
				text: "DR. LOVE ROAD",
				x: 600,
				y: 20,
				size: 13
			},
			{
				text: "MICHELLE AVENUE",
				x: 600,
				y: 875 / 2,
				rotate: -90,
				size: 12
			},
			{
				text: "KIRKWOOD STREET",
				x: 428,
				y: 916,
				size: 13
			},
			{
				text: "MAGNOLIA HOMES ROAD",
				x: 16,
				y: 428,
				rotate: -90,
				size: 11
			}
		],
		north: "up"
	};
}
var SHEETS = {
	1: sheet1(),
	2: sheet2(),
	3: sheet3()
};
function mapNameLines(lot) {
	if (!lot.name.trim()) {
		if (lot.status === "Empty") return ["Empty"];
		if (lot.status === "Open") return ["Open"];
		return [""];
	}
	const raw = displayName(lot).replace(/\s*\/\s*/g, "/");
	if (raw.includes("/") && !/house|office/i.test(raw)) return raw.split("/").map((part) => part.trim()).filter(Boolean);
	const comma = raw.indexOf(",");
	return splitSurnames((comma >= 0 ? raw.slice(0, comma) : raw).trim());
}
function splitSurnames(surname) {
	const parts = surname.split(/\s+/).filter(Boolean);
	if (parts.length <= 1) return [surname];
	const particles = /* @__PURE__ */ new Set([
		"de",
		"del",
		"la",
		"von",
		"van",
		"da",
		"di"
	]);
	const words = [];
	for (let i = 0; i < parts.length; i++) if (particles.has(parts[i].toLowerCase()) && i + 1 < parts.length) words.push(`${parts[i]} ${parts[++i]}`);
	else words.push(parts[i]);
	if (words.length <= 1) return [surname];
	return [words[0], words.slice(1).join(" ")];
}
var HYPHEN_BREAKS = {
	mendenhall: ["Menden-", "hall"],
	vonkretchmann: ["VonKret-", "chmann"],
	offenhauer: ["Offen-", "hauer"]
};
function textWidth(text, size) {
	return text.length * size * .6;
}
function wrapLine(text, maxW, size) {
	if (textWidth(text, size) <= maxW) return [text];
	const key = text.toLowerCase().replace(/[^a-z]/g, "");
	if (key === "allbritton" || key === "polikoff" || key === "jimenez" || key === "soriano" || key === "stuckey" || key === "sembrat" || key === "walther" || key === "benitez") return [text];
	const known = HYPHEN_BREAKS[key];
	if (known) return [...known];
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length > 1) {
		let at = 1;
		let best = Infinity;
		for (let i = 1; i < words.length; i++) {
			const score = Math.abs(textWidth(words.slice(0, i).join(" "), size) - textWidth(words.slice(i).join(" "), size));
			if (score < best) {
				best = score;
				at = i;
			}
		}
		return [words.slice(0, at).join(" "), words.slice(at).join(" ")];
	}
	const mid = Math.ceil(text.length / 2);
	return [`${text.slice(0, mid)}-`, text.slice(mid)];
}
function North({ dir }) {
	if (dir === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(36 250)",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "0",
				y: "-16",
				textAnchor: "middle",
				fontSize: "14",
				fontWeight: "700",
				children: "N"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "18",
				y1: "0",
				x2: "-2",
				y2: "0",
				stroke: "var(--color-ink)",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "-14,-5 -26,0 -14,5",
				fill: "var(--color-ink)"
			})
		]
	});
	if (dir === "up") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(24 96)",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "0",
				y: "-6",
				textAnchor: "middle",
				fontSize: "14",
				fontWeight: "700",
				children: "N"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: "8",
				x2: "0",
				y2: "28",
				stroke: "var(--color-ink)",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "-5,10 0,-2 5,10",
				fill: "var(--color-ink)"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: "translate(590 240)",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "0",
				cy: "0",
				r: "26",
				fill: "var(--color-paper)",
				stroke: "var(--color-ink)",
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "0",
				y: "-34",
				textAnchor: "middle",
				fontSize: "12",
				fontWeight: "650",
				children: "S"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "-40",
				y: "4",
				textAnchor: "middle",
				fontSize: "12",
				fontWeight: "650",
				children: "E"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "40",
				y: "4",
				textAnchor: "middle",
				fontSize: "12",
				fontWeight: "650",
				children: "W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "0",
				y: "48",
				textAnchor: "middle",
				fontSize: "14",
				fontWeight: "700",
				children: "N"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "-4,10 0,24 4,10",
				fill: "var(--color-ink)"
			})
		]
	});
}
function PlatMap({ sheet, query, filter, selected, lots, textScale = 1, symbols = false, heat, onSelect, onCamera, onPlantCamera, onAlarm, alarmOn = false }) {
	const spec = SHEETS[sheet];
	const [, , vbW, vbH] = spec.viewBox.split(/[ ,]/).map(Number);
	const byId = new Map(lots.map((item) => [item.id, item]));
	const picked = Array.isArray(filter) ? filter : filter === "all" ? [] : [filter];
	const filtering = query.trim().length > 0 || picked.length > 0;
	const extra = sheet === 2 ? 3.5 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: sheet === 3 ? "map-svg portrait" : "map-svg landscape",
		viewBox: spec.viewBox,
		style: { aspectRatio: `${vbW} / ${vbH}` },
		preserveAspectRatio: sheet === 1 ? "xMidYMin meet" : "xMidYMid meet",
		role: "img",
		"aria-label": sheet === 3 ? "Michelle and Kirkwood site plan" : `Site plan sheet ${sheet}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "100%",
				height: "100%",
				fill: "var(--color-paper)"
			}),
			spec.rose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rose, {
				x: spec.rose.x,
				y: spec.rose.y
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(North, { dir: spec.north }),
			spec.roads?.map((road, i) => road.openBottom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "road",
				fill: "none",
				d: `M ${road.x} ${road.y + road.h} V ${road.y} H ${road.x + road.w} V ${road.y + road.h}`
			}, `road-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				className: "road",
				x: road.x,
				y: road.y,
				width: road.w,
				height: road.h
			}, `road-${i}`)),
			spec.labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				className: "street-label",
				x: label.x,
				y: label.y,
				textAnchor: label.anchor ?? "middle",
				fontSize: (label.size ?? 13) + 4 + extra,
				transform: label.rotate ? `rotate(${label.rotate} ${label.x} ${label.y})` : void 0,
				children: label.text
			}, label.text + label.x)),
			spec.boxes.map((box) => {
				if (box.kind === "landmark") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: box.id === "plant" ? "landmark plant" : "landmark",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: box.x,
						y: box.y,
						width: box.w,
						height: box.h
					}), box.id === "plant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: box.x + box.w / 2,
						y: box.y + box.h / 2,
						textAnchor: "middle",
						fontSize: 23 * textScale + extra,
						fontWeight: "650",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: box.x + box.w / 2,
							dy: "-0.55em",
							children: "TREATMENT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: box.x + box.w / 2,
							dy: "1.15em",
							children: "PLANT"
						})]
					}) : (box.label ?? "").split(" ").length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: box.x + box.w / 2,
						y: box.y + box.h / 2,
						textAnchor: "middle",
						fontSize: "15",
						fontWeight: "650",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: box.x + box.w / 2,
							dy: "-0.6em",
							children: "Magnolia Central"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
							x: box.x + box.w / 2,
							dy: "1.25em",
							children: "of Florida Estates"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: box.x + box.w / 2,
						y: box.y + box.h / 2,
						textAnchor: "middle",
						dominantBaseline: "middle",
						fontSize: ((box.h > 100 ? 18 : 13) + 4 + extra) * textScale,
						fontWeight: "650",
						letterSpacing: "0.08em",
						children: (box.label ?? "").toUpperCase()
					})]
				}, box.id);
				const lot = byId.get(box.id);
				if (!lot) return null;
				const out = picked.length > 0 && !picked.some((item) => matchesFilter(lot, item)) || query.trim().length > 0 && !matches(lot, query);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotBox, {
					box,
					lot,
					dim: filtering && out,
					selected: selected === lot.id,
					onSelect,
					textScale,
					sizeBoost: extra,
					symbols,
					heat: heat ? heat[lot.id] ?? {
						fill: "#d5d0c8",
						ink: "#1c1916",
						value: ""
					} : null
				}, box.id);
			}),
			onCamera && sheet === 1 ? spec.boxes.filter((box) => box.id === "1").map((box) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${box.x + 20} ${box.y})`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "camera-cone",
					d: "M -64 0 A 64 64 0 0 1 64 0 Z",
					pointerEvents: "none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "180° view from north through east to south" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "map-camera",
					role: "button",
					tabIndex: 0,
					"aria-label": "Office camera, paste Blue Iris link",
					onClick: (e) => {
						e.stopPropagation();
						onCamera();
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onCamera();
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Office camera · Blue Iris link" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							className: "camera-hit",
							x: -22,
							y: -22,
							width: 44,
							height: 48
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -16,
							y: -12,
							width: 32,
							height: 16,
							rx: 4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -7,
							y: 2,
							width: 14,
							height: 12,
							rx: 2,
							fill: "none",
							stroke: "#fff",
							strokeWidth: 1.6
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: 0,
							cy: 8,
							r: 2.4,
							fill: "none",
							stroke: "#fff",
							strokeWidth: 1.4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M -4 14 L 4 14 L 0 20 Z",
							fill: "#fff"
						})
					]
				})]
			}, "office-camera")) : null,
			sheet === 2 ? spec.boxes.filter((box) => box.id === "plant").map((box) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [onPlantCamera ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				transform: `translate(${box.x + box.w / 2} ${box.y})`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "camera-cone",
					d: "M -64 0 A 64 64 0 0 1 64 0 Z",
					pointerEvents: "none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "180° view facing down" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					className: "map-camera",
					role: "button",
					tabIndex: 0,
					"aria-label": "Treatment plant camera",
					onClick: (e) => {
						e.stopPropagation();
						onPlantCamera();
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onPlantCamera();
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Treatment plant camera" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							className: "camera-hit",
							x: -22,
							y: -12,
							width: 44,
							height: 40
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -16,
							y: -14,
							width: 32,
							height: 16,
							rx: 4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -7,
							y: 2,
							width: 14,
							height: 12,
							rx: 2,
							fill: "none",
							stroke: "#fff",
							strokeWidth: 1.6
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: 0,
							cy: 8,
							r: 2.4,
							fill: "none",
							stroke: "#fff",
							strokeWidth: 1.4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M -4 14 L 4 14 L 0 20 Z",
							fill: "#fff"
						})
					]
				})]
			}) : null, onAlarm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: alarmOn ? "alarm-light on" : "alarm-light",
				role: "button",
				tabIndex: 0,
				"aria-label": "Treatment plant alarm",
				transform: `translate(${box.x + box.w - 16} ${box.y + box.h - 16})`,
				onClick: (e) => {
					e.stopPropagation();
					onAlarm();
				},
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onAlarm();
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "Alarm Connect" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						className: "alarm-hit",
						cx: "0",
						cy: "-14",
						rx: "16",
						ry: "28"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "alarm-mark",
						pointerEvents: "none",
						transform: "translate(0 5) scale(1 2) translate(0 -5)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 0 -15 V -11 M -10 -10 L -7 -7 M 10 -10 L 7 -7" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M -9 1 A 9 9 0 0 1 9 1 Z" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "-11",
								y: "1",
								width: "22",
								height: "4",
								rx: "1"
							})
						]
					})
				]
			}) : null] }, "plant-devices")) : null
		]
	});
}
function Rose({ x, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y})`,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				r: "22",
				fill: "var(--color-paper)",
				stroke: "var(--color-ink)",
				strokeWidth: "1.25"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				y: "-30",
				textAnchor: "middle",
				fontSize: "13",
				fontWeight: "700",
				children: "N"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "-4,-8 0,-22 4,-8",
				fill: "var(--color-ink)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				y: "38",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "650",
				children: "S"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "-34",
				y: "4",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "650",
				children: "W"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "34",
				y: "4",
				textAnchor: "middle",
				fontSize: "11",
				fontWeight: "650",
				children: "E"
			})
		]
	});
}
function petCount(value) {
	return value === "1" ? 1 : value === "2" ? 2 : 0;
}
function DogMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "#1c1916",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "3.6",
				cy: "8.4",
				rx: "2.5",
				ry: "4.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "12.4",
				cy: "8.4",
				rx: "2.5",
				ry: "4.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "8.8",
				r: "4.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "8",
				cy: "12.4",
				rx: "2.3",
				ry: "1.7"
			})
		]
	});
}
function CatMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "#1c1916",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.6 8.6 L4.8 1.4 L7.6 7.2 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8.4 7.2 L11.2 1.4 L13.4 8.6 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "10",
				r: "5"
			})
		]
	});
}
function KeyMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "none",
		stroke: "#000",
		strokeWidth: 1.8,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		pointerEvents: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "4.6",
			cy: "6.2",
			r: "3.1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7.6 6.2 H15.2 M12.1 6.2 V10 M14.4 6.2 V9" })]
	});
}
function PersonMark({ x, y, s, fill }) {
	const warn = fill !== "#1c1916";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill,
		stroke: warn ? "#fff" : "none",
		strokeWidth: warn ? 1.15 : 0,
		pointerEvents: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "8",
			cy: "4.1",
			r: "3.05"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1.8 15.4 C2.4 9.8 4.6 8.2 8 8.2 C11.4 8.2 13.6 9.8 14.2 15.4 Z" })]
	});
}
function BoltMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "#1c1916",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.2 0.8 L3.8 9.2 H7.4 L5.6 15.2 L13.2 6.4 H9.2 L11 0.8 Z" })
	});
}
function BanMark({ cx, cy, r }) {
	const stroke = Math.max(1.6, r * .22);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		pointerEvents: "none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx,
			cy,
			r,
			fill: "#f6f3ec",
			fillOpacity: .35,
			stroke: "#000",
			strokeWidth: stroke
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: cx - r * .62,
			y1: cy - r * .62,
			x2: cx + r * .62,
			y2: cy + r * .62,
			stroke: "#000",
			strokeWidth: stroke,
			strokeLinecap: "round"
		})]
	});
}
function PetMarks({ box, size, dogs, cats }) {
	const kinds = [...Array(petCount(dogs)).fill("dog"), ...Array(petCount(cats)).fill("cat")];
	if (kinds.length === 0 || size < 6) return null;
	const gap = 1.5;
	let x = box.x + box.w - 3 - kinds.length * size - (kinds.length - 1) * gap;
	const y = box.y + box.h - 2 - size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
		pointerEvents: "none",
		children: kinds.map((kind, i) => {
			const mark = kind === "dog" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DogMark, {
				x,
				y,
				s: size
			}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatMark, {
				x,
				y,
				s: size
			}, i);
			x += size + gap;
			return mark;
		})
	});
}
var LotBox = (0, import_react.memo)(function LotBox({ box, lot, dim, selected, onSelect, textScale, sizeBoost = 0, symbols = false, heat = null }) {
	const shown = displayName(lot);
	const names = lot.id === "7" ? ["Mena Sosa"] : lot.id === "67" ? ["Costales Torres"] : lot.id === "68" ? ["Rojas Gill"] : mapNameLines(lot).filter((text) => text.length > 0);
	const plain = names[0] === "Empty" || names[0] === "Open";
	const address = lot.address || "—";
	const padY = 3;
	const innerW = Math.max(12, box.w - 8);
	const innerH = Math.max(12, box.h - 6);
	const n = Number(lot.lot);
	const nameUp = (/* @__PURE__ */ new Set([
		9,
		17,
		21,
		25,
		29,
		33,
		37,
		41,
		8,
		12,
		16,
		20,
		24,
		28,
		32,
		36,
		40,
		7,
		11,
		15,
		19,
		23,
		27,
		31,
		35,
		39,
		6,
		10,
		14,
		18,
		22,
		26,
		30,
		34,
		38
	])).has(n);
	const bump = (lot.id === "96" ? 1 : 0) + (n >= 9 && n <= 38 ? 1 : 0);
	const bodySize = 20 * textScale + sizeBoost;
	const sameAs60 = lot.id === "47" || lot.id === "59";
	const keepWhole = sameAs60 || lot.id === "67" || lot.id === "68" || lot.id === "65";
	const fsLot = (sameAs60 ? 17 * textScale + sizeBoost : Math.min(17 * textScale + sizeBoost, innerH * .36)) + bump;
	const texts = [address, ...names].flatMap((text) => keepWhole ? [text] : wrapLine(text, innerW, sizeBoost > 0 ? bodySize - 1.5 : bodySize));
	const gap = 2;
	let addressGap = bodySize * .55;
	const stack = texts.length * bodySize + (texts.length > 1 ? addressGap : 0) + gap * Math.max(0, texts.length - 2);
	const room = Math.max(8, innerH - fsLot - 4);
	const fitted = sameAs60 || stack <= room ? bodySize : (room - (texts.length > 1 ? addressGap : 0) - gap * Math.max(0, texts.length - 2)) / texts.length;
	const lines = texts.map((text, index) => {
		const widthFit = innerW / Math.max(1, text.length * .6);
		return {
			text,
			size: (sameAs60 ? bodySize : Math.min(fitted, widthFit)) + bump + (nameUp && index > 0 ? 2 : 0),
			weight: plain && text !== address ? 500 : 700
		};
	});
	if (lot.id === "65") for (let i = 1; i < lines.length; i++) lines[i].size += 1;
	if (lot.id === "124" && lines.length > 0) {
		const drop = sizeBoost > 0 ? bodySize * .9 : 0;
		const blockHeight = (sizes, afterAddress) => {
			let y = padY + fsLot + sizes[0] * .82 + drop;
			for (let i = 1; i < sizes.length; i++) y += sizes[i] + (i === 1 ? afterAddress : gap);
			return y;
		};
		const limit = box.h - 5;
		const used = blockHeight(lines.map((line) => line.size), addressGap);
		if (used > limit) {
			const scale = limit / used;
			for (const line of lines) line.size *= scale;
			addressGap *= scale;
		}
	}
	const dy = box.textDy ?? 0;
	const halfSpace = bodySize * .3;
	const textDx = lot.id === "59" ? 12 : lot.id === "47" ? -10 + halfSpace : 0;
	const textDyExtra = lot.id === "59" ? -28 + halfSpace : 0;
	const lotNo = n;
	const middleDrop = sizeBoost > 0 && lotNo >= 95 && lotNo <= 122 ? bodySize * .9 : 0;
	const bottomLift = sizeBoost > 0 && lotNo >= 88 && lotNo <= 94 ? bodySize * .9 : 0;
	const drop64 = lot.id === "64" || lot.id === "65" ? bodySize * .9 : 0;
	let baseline = box.y + padY + fsLot + dy + lines[0].size * .82 + textDyExtra + (sizeBoost > 0 ? bodySize * .9 : 0) + middleDrop - bottomLift + drop64;
	const cx = box.x + box.w / 2 + textDx;
	const lotNumX = box.x + 5 + (lot.id === "47" ? -16 + textWidth("47", fsLot) : 0) + (lot.id === "59" ? -textWidth("5", fsLot) : 0);
	const lotNumY = box.y + fsLot + 3 + dy + (lot.id === "47" ? -22 + halfSpace : 0);
	const maint = lot.maintenance?.trim() ?? "";
	const isLeak = /^leak$/i.test(maint);
	const needsRoof = lot.roofReplace === "Yes";
	const cls = [
		"lot",
		heat ? "heat" : "",
		!heat && lot.status === "Occupied" ? "occupied" : "",
		!heat && lot.status === "Empty" ? "empty" : "",
		!heat && lot.status === "Open" ? "open" : "",
		!heat && lot.status === "Eviction" ? "eviction" : "",
		!heat && lot.issues ? "notes" : "",
		!heat && lot.lateRent?.trim() ? "late" : "",
		!heat && maint && !isLeak ? "maint" : "",
		!heat && isLeak ? "leak" : "",
		!heat && needsRoof ? "roof" : "",
		dim ? "dim" : "",
		selected ? "selected" : ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: cls,
		"data-lot-id": lot.id,
		style: heat ? {
			"--heat-fill": heat.fill,
			"--heat-ink": heat.ink
		} : void 0,
		role: "button",
		tabIndex: 0,
		"aria-label": `Lot ${lot.lot}, ${lot.address} ${lot.street}, ${shown}`,
		"aria-pressed": selected,
		onClick: () => onSelect(lot.id),
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect(lot.id);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: `Lot ${lot.lot} · ${lot.address} ${lot.street} · ${shown}` }),
			box.points ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: box.points,
				pointerEvents: "fill"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: box.x,
				y: box.y,
				width: box.w,
				height: box.h,
				pointerEvents: "fill"
			}),
			symbols && !heat && (lot.noMow === "Yes" || lot.noMow === "Owe" || lot.noMow === "NO-OWE") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				pointerEvents: "none",
				children: (() => {
					const s = Math.max(18, Math.min(30, Math.min(box.w, box.h) * .375));
					const owe = lot.noMow === "Owe" || lot.noMow === "NO-OWE";
					const r = s * .72;
					const cx = box.x + box.w - r - 3;
					const cy = box.y + r + 2;
					const flagCx = (4.4 + s) / 3;
					const flagCy = (1 + s * 1.06) / 3;
					const x = owe ? cx - flagCx : box.x + box.w - s - 3;
					const y = owe ? cy - flagCy - s * .14 : box.y + 2;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: x + 1.4,
							y1: y,
							x2: x + 1.4,
							y2: y + s,
							stroke: "#148a38",
							strokeWidth: 1.5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: `M ${x + 2.2} ${y + 1} L ${x + s} ${y + s * .36} L ${x + 2.2} ${y + s * .7} Z`,
							fill: "#1f9d45",
							fillOpacity: 1,
							stroke: "#148a38",
							strokeWidth: 1.2
						}),
						owe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx,
							cy,
							r,
							fill: "#f6f3ec",
							fillOpacity: .35,
							stroke: "#000",
							strokeWidth: 2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: cx - r * .62,
							y1: cy - r * .62,
							x2: cx + r * .62,
							y2: cy + r * .62,
							stroke: "#000",
							strokeWidth: 2,
							strokeLinecap: "round"
						})] }) : null
					] });
				})()
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: lotNumX,
				y: lotNumY,
				fontSize: fsLot,
				fontWeight: "800",
				pointerEvents: "none",
				style: heat ? { fill: heat.ink } : void 0,
				children: lot.lot
			}),
			heat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: box.x + box.w / 2,
				y: box.y + box.h / 2 + fsLot * .15,
				textAnchor: "middle",
				dominantBaseline: "middle",
				fontSize: Math.max(12, Math.min(box.h * .24, 18)),
				fontWeight: "700",
				pointerEvents: "none",
				style: { fill: heat.ink },
				children: heat.value
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
				id: `clip-${lot.id}`,
				children: box.points ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: box.points }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: box.x + 3,
					y: box.y + fsLot + 2,
					width: box.w - 6,
					height: box.h - fsLot - 6
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				clipPath: sameAs60 ? void 0 : `url(#clip-${lot.id})`,
				pointerEvents: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: cx,
					y: baseline,
					textAnchor: "middle",
					fontSize: lines[0].size,
					fontWeight: lines[0].weight,
					children: lines[0].text
				}), lines.slice(1).map((line, i) => {
					baseline += line.size + (i === 0 ? addressGap : gap) - (lot.id === "124" && i === 0 ? line.size * .5 : 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: cx + (lot.id === "47" ? halfSpace : 0),
						y: baseline - (nameUp || lot.id === "1" ? halfSpace * 2 : 0) - (lot.id === "59" || lot.id === "47" ? bodySize * .5 : 0),
						textAnchor: "middle",
						fontSize: line.size,
						fontWeight: line.weight,
						children: line.text
					}, `${lot.id}-${line.text}-${baseline}`);
				})]
			})] }),
			symbols && !heat && /^(yes|y)$/i.test(lot.key?.trim() ?? "") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyMark, {
				x: box.x + box.w - 3 - Math.min(fsLot * .85, box.h * .34),
				y: box.y + box.h - 3 - Math.min(fsLot * .85, box.h * .34) * 2,
				s: Math.min(fsLot * .85, box.h * .34)
			}) : null,
			symbols && !heat && (lot.wiring === "Yes" || lot.wiring === "No") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				pointerEvents: "none",
				children: (() => {
					const s = Math.min(fsLot * .85, box.h * .34);
					const x = box.x + 3;
					const y = box.y + box.h - 2 - s;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoltMark, {
						x,
						y,
						s
					}), lot.wiring === "No" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BanMark, {
						cx: x + s * .52,
						cy: y + s * .5,
						r: s * .62
					}) : null] });
				})()
			}) : null,
			symbols && !heat && (/^[1-5]$/.test(lot.guest?.trim() ?? "") || /^(yes|y)$/i.test(lot.guest?.trim() ?? "")) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonMark, {
				x: box.x + (box.w - Math.min(fsLot * .85, box.h * .34)) / 2,
				y: box.y + box.h - 2 - Math.min(fsLot * .85, box.h * .34),
				s: Math.min(fsLot * .85, box.h * .34),
				fill: (lot.guests ?? []).length > 0 && (lot.guests ?? []).every((guest) => guest.name.trim()) ? "#1c1916" : "#ff5a00"
			}) : null,
			symbols && !heat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetMarks, {
				box,
				size: Math.min(fsLot * .85, box.h * .34),
				dogs: lot.dogs,
				cats: lot.cats
			}) : null
		]
	});
});
var SHEET_COPY = {
	1: {
		title: "Jaleen/Denise",
		note: "Landscape. North points left, along Dr. Love Road — same direction as the original sheet."
	},
	2: {
		title: "Denise/Leon",
		note: ""
	},
	3: {
		title: "Michelle/Kirkwood",
		note: "Portrait. Flipped so north points up, toward Dr. Love Road."
	}
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listVersions = createServerFn({ method: "GET" }).handler(createSsrRpc("63b2278e80f850fb8a80f752dae9b14d45011a628e2335494e988a272f4c8a3d"));
var restoreVersion = createServerFn({ method: "POST" }).validator((data) => {
	const id = typeof data?.id === "string" ? data.id : "";
	if (!/^magnolia-[\w-]+\.json$/.test(id)) throw new Error("Unknown version");
	return { id };
}).handler(createSsrRpc("e6440476118fcdacc74a3fe14b5285fa6e88db22cd0c8c49c06f9cf6d20d1c9a"));
var readMaster = createServerFn({ method: "GET" }).handler(createSsrRpc("93f4e9998517322f949f4cdcf16a741c3e82df3147f942aeda823f14047ef63c"));
var writeMaster = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.lots)) throw new Error("Master file needs a lot list");
	return {
		saved: typeof data.saved === "string" ? data.saved : (/* @__PURE__ */ new Date()).toISOString(),
		lots: data.lots,
		bills: Array.isArray(data.bills) ? data.bills : void 0,
		mowings: Array.isArray(data.mowings) ? data.mowings : void 0,
		board: Array.isArray(data.board) ? data.board : void 0
	};
}).handler(createSsrRpc("a69e9ce8decaba572e2a0b279bb6090ff0d09bec755a1b4e3629e0bc1600ddf1"));
var saveBills = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.bills)) throw new Error("Bills need a list");
	return { bills: data.bills };
}).handler(createSsrRpc("8a5c096e51c7fa1603bcbebdffe4f71a0c7c825cc457d059b29c650e22041394"));
var saveMowings = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.mowings)) throw new Error("Mowings need a list");
	return { mowings: data.mowings };
}).handler(createSsrRpc("af7d6386af86ff7e1e46913c237d29b24079d16eb53d52c4d5130cae25c217c0"));
var saveBoard = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.board)) throw new Error("Board needs a list");
	return { board: data.board };
}).handler(createSsrRpc("d369c18cc29680223a2bc5a4ac5ceadfe62a988c086856d0301f283a1c882af7"));
var validId = (value) => typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
var text = (value, max = 4e3) => typeof value === "string" ? value.trim().slice(0, max) : "";
var date = (value) => {
	const valueText = text(value, 10);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(valueText)) return "";
	const parsed = /* @__PURE__ */ new Date(valueText + "T00:00:00Z");
	return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === valueText ? valueText : "";
};
var categories = [
	"License / permit",
	"Vehicle",
	"Title work",
	"Insurance",
	"Tax / bill",
	"Maintenance",
	"Inspection",
	"Vendor",
	"Other"
];
var statuses = [
	"Open",
	"In progress",
	"Waiting",
	"Completed"
];
function normalizeTask(input) {
	if (!input || typeof input !== "object") throw new Error("A task is required.");
	const value = input;
	if (!validId(value.id)) throw new Error("Invalid task id.");
	const title = text(value.title, 200);
	const category = text(value.category, 60);
	const status = text(value.status, 30);
	if (!title) throw new Error("Task title is required.");
	if (!categories.includes(category)) throw new Error("Invalid task category.");
	if (!statuses.includes(status)) throw new Error("Invalid task status.");
	const cost = text(value.cost, 30).replace(/[$,\s]/g, "");
	if (cost && !/^\d{1,9}(\.\d{1,2})?$/.test(cost)) throw new Error("Cost must be a non-negative amount.");
	return {
		id: value.id,
		title,
		category,
		status,
		cost,
		dueDate: date(value.dueDate),
		followUp: date(value.followUp),
		owner: text(value.owner, 200),
		reference: text(value.reference, 200),
		notes: text(value.notes, 4e3)
	};
}
var listBusinessTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a5927577ce861885ea3c00c3753b5f2ae9f213a553abe39b4337e148b1984362"));
var saveBusinessTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	task: normalizeTask(data?.task),
	action: data?.action === "Created" ? "Created" : "Updated"
})).handler(createSsrRpc("0d283d3d517162bd48f85e35e2d927aecdd4330c6221170586dedfcc4acd49c7"));
var deleteBusinessTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid task id.");
	return { id: data.id };
}).handler(createSsrRpc("1925c895ac0841476583c81f943169d9c2408c84137bd32b94e4702282cc7b68"));
var listBusinessHistory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.taskId)) throw new Error("Invalid task id.");
	return { taskId: data.taskId };
}).handler(createSsrRpc("cfc0b9ac2b14c5ef3ff5442b1f586f4ea5aa8c4ee1b2c819abb5b52c9f8e7294"));
var listBusinessAttachments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.taskId)) throw new Error("Invalid task id.");
	return { taskId: data.taskId };
}).handler(createSsrRpc("728d9011e139b7691e25ed4b000ca7249ef42843a601eb07b93fb0fb6d8402e3"));
var addBusinessAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.taskId)) throw new Error("Invalid task id.");
	const name = text(data.name, 200);
	const mimeType = text(data.mimeType, 100);
	if (!name || !/^(application\/pdf|image\/(png|jpeg|webp))$/.test(mimeType)) throw new Error("Only PDF, PNG, JPEG, and WebP attachments are supported.");
	if (!Number.isInteger(data.size) || data.size < 1 || data.size > 3e6) throw new Error("Attachments must be 3 MB or smaller.");
	if (typeof data.dataBase64 !== "string" || data.dataBase64.length > 41e5 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.dataBase64)) throw new Error("Invalid attachment data.");
	return {
		taskId: data.taskId,
		name,
		mimeType,
		size: data.size,
		dataBase64: data.dataBase64
	};
}).handler(createSsrRpc("81d85d3e1ed96526137983ca2ca9e8749801d3fb5bf98ff108ec1affaab820f5"));
var readBusinessAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid attachment id.");
	return { id: data.id };
}).handler(createSsrRpc("1a1fd9891ffa60846cb36aa3af906502a1b7e742c8f2b4799b710794f9ae757f"));
var deleteBusinessAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid attachment id.");
	return { id: data.id };
}).handler(createSsrRpc("2ef8254051bee5948228ea49ef0a9f659af201aeae53b6baab7aa3b24755fc11"));
var STORAGE_KEY = "magnolia-lot-edits";
var STORAGE_AT = "magnolia-lot-edits-at";
var TODO_DONE_KEY = "magnolia-todo-done";
var TODO_RANK_KEY = "magnolia-todo-rank";
var MAP_KEY = "magnolia-last-map";
var CAMERA_KEY = "magnolia-camera-office";
var PLANT_CAMERA_KEY = "magnolia-camera-plant";
var ALARM_KEY = "magnolia-alarm-plant";
var ALARM_ON_KEY = "magnolia-alarm-on";
var DEVICE_LINKS = {
	office: {
		key: CAMERA_KEY,
		title: "Blue Iris",
		label: "Camera link",
		placeholder: "Paste the Blue Iris link"
	},
	plant: {
		key: PLANT_CAMERA_KEY,
		title: "Treatment plant camera",
		label: "Camera link",
		placeholder: "Paste the Blue Iris link"
	},
	alarm: {
		key: ALARM_KEY,
		title: "Alarm Connect",
		label: "Alarm link",
		placeholder: "Paste the Alarm Connect link"
	}
};
function rememberLots(lots) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
		localStorage.setItem(STORAGE_AT, (/* @__PURE__ */ new Date()).toISOString());
	} catch {}
}
var masterTimer = 0;
function queueMaster(lots) {
	window.clearTimeout(masterTimer);
	masterTimer = window.setTimeout(() => {
		writeMaster({ data: {
			saved: (/* @__PURE__ */ new Date()).toISOString(),
			lots
		} }).catch(() => {});
	}, 250);
}
function loadLots() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return LOTS.map(withEmptyMow);
		const saved = JSON.parse(raw);
		const byId = new Map(saved.map((lot) => [lot.id, lot]));
		return LOTS.map((lot) => {
			const next = byId.get(lot.id);
			if (!next) return withEmptyMow(lot);
			const status = next.status === "Empty" || next.status === "Open" || next.status === "Eviction" ? next.status : "Occupied";
			return withEmptyMow({
				...lot,
				...next,
				id: lot.id,
				status,
				phone: next.phone?.trim() ? next.phone : lot.phone,
				bouncedCheck: next.bouncedCheck ?? "",
				maintenance: next.maintenance ?? "",
				dogs: next.dogs === "1" || next.dogs === "2" ? next.dogs : "",
				cats: next.cats === "1" || next.cats === "2" ? next.cats : "",
				wiring: next.wiring === "Yes" || next.wiring === "No" ? next.wiring : "",
				homeIns: next.homeIns === "Yes" || next.homeIns === "No" ? next.homeIns : "",
				homeInsDate: next.homeInsDate ?? "",
				readyPower: next.readyPower === "Yes" ? "Yes" : "",
				readyClean: next.readyClean === "Yes" ? "Yes" : "",
				readyInspected: next.readyInspected === "Yes" ? "Yes" : "",
				zillow: next.zillow === "Yes" || next.zillow === "No" ? next.zillow : "",
				zillowUrl: next.zillowUrl ?? "",
				homeYear: next.homeYear ?? "",
				homeMake: next.homeMake ?? "",
				homeModel: next.homeModel ?? "",
				homeWidth: next.homeWidth ?? "",
				homeLength: next.homeLength ?? "",
				homeWide: next.homeWide === "Single Wide" || next.homeWide === "Double Wide" ? next.homeWide : "",
				roofAge: next.roofAge ?? "",
				roofMaterial: next.roofMaterial ?? "",
				roofInstalled: next.roofInstalled ?? "",
				roofReplace: next.roofReplace === "Yes" || next.roofReplace === "No" ? next.roofReplace : "",
				acCleaning: next.acCleaning ?? "",
				acService: next.acService ?? "",
				inspectionDate: next.inspectionDate ?? "",
				inspectionNotes: next.inspectionNotes ?? "",
				moveIn: next.moveIn ?? "",
				rentDue: next.rentDue ?? "",
				deposit: next.deposit ?? "",
				balance: next.balance ?? "",
				noticeDate: next.noticeDate ?? "",
				noticeNote: next.noticeNote ?? "",
				photo: next.photo ?? "",
				lease: next.lease?.data ? next.lease : null,
				rulesReceipt: next.rulesReceipt?.data ? next.rulesReceipt : null,
				background: next.background?.data ? next.background : null,
				otherDocs: Array.isArray(next.otherDocs) ? next.otherDocs : [],
				leaseEnd: next.leaseEnd ?? "",
				emergencyName: next.emergencyName ?? "",
				emergencyPhone: next.emergencyPhone ?? "",
				courtDate: next.courtDate ?? "",
				courtNote: next.courtNote ?? "",
				waitName: next.waitName ?? "",
				waitPhone: next.waitPhone ?? "",
				history: Array.isArray(next.history) ? next.history : [],
				maintLog: Array.isArray(next.maintLog) ? next.maintLog : [],
				noticeFile: next.noticeFile?.data ? next.noticeFile : null,
				rentInc2026: next.rentInc2026 ?? "",
				rentInc2027: next.rentInc2027 ?? ""
			});
		});
	} catch {
		return LOTS.map(withEmptyMow);
	}
}
function printTodo(items) {
	const win = window.open("", "_blank");
	if (!win) return;
	const rows = noteBands(items).map(([label, group]) => {
		const cards = group.map((item) => `<article class="${item.done ? "done" : ""}">
        <p class="when">${escapeHtml(item.date ? formatTodoDate(item.date) : "No date")}${item.done ? " · Done" : ""}</p>
        <p><b>Lot</b> ${escapeHtml(item.lot || "—")}</p>
        <p><b>Address</b> ${escapeHtml(item.address || "—")}</p>
        <p><b>Name</b> ${escapeHtml(item.name || "—")}</p>
        ${item.text ? `<p><b>Due</b> ${escapeHtml(item.text)}</p>` : ""}
        <p><b>Notes</b> ${escapeHtml(item.notes || "—")}</p>
      </article>`).join("");
		return `<h2>${escapeHtml(label)}</h2>${cards}`;
	}).join("");
	win.document.open();
	win.document.write(`<!doctype html><html><head><title>To-Do</title><style>
    @page { size: letter; margin: 0.6in; }
    body { margin: 0; color: #1c1916; font: 14px/1.4 Georgia, serif; }
    h1 { margin: 0 0 8px; font-size: 16px; letter-spacing: 0.12em; text-transform: uppercase; }
    h2 { margin: 18px 0 6px; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; }
    article { break-inside: avoid; border-top: 1px solid #ccc; padding: 10px 0; }
    article.done { color: #1d6b32; background: #d9efd8; padding: 10px; }
    p { margin: 0 0 2px; }
    b { display: inline-block; min-width: 4.6rem; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    .when { font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px; }
  </style></head><body>
    <h1>To-Do</h1>
    ${rows || "<p>Nothing on the list.</p>"}
  </body></html>`);
	win.document.close();
	const go = () => {
		if (win.closed) return;
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 200);
	setTimeout(go, 500);
}
var MAP_PRINT_CSS = `
  html, body { margin: 0; background: #fff; color: #1c1916; }
  h1 { margin: 0 0 8px; font: 700 16px sans-serif; letter-spacing: 0.08em; text-transform: uppercase; }
  svg { width: 100% !important; height: auto !important; max-height: none !important; display: block; }
  svg text { font-family: "Avenir Next", "Segoe UI", sans-serif; fill: #1c1916; }
  .lot rect, .lot polygon { fill: #f6f3ec; stroke: #000; stroke-width: 1.9; }
  .lot.occupied rect, .lot.occupied polygon { fill: rgb(40 175 80 / 14%); }
  .lot.empty rect, .lot.empty polygon { fill: #b5b5b5; }
  .lot.open rect, .lot.open polygon { fill: #fff; }
  .lot.notes rect, .lot.notes polygon { fill: #fff200; }
  .lot.late rect, .lot.late polygon { fill: #ff5a00; }
  .lot.maint rect, .lot.maint polygon { fill: url(#maintStripes); }
  .lot.leak rect, .lot.leak polygon { fill: #2f7bff; }
  .lot.eviction rect, .lot.eviction polygon { fill: #e10600; }
  .lot.eviction text { fill: #fff; }
  .lot.roof rect, .lot.roof polygon { fill: #2f6bff; }
  .landmark rect { fill: transparent; stroke: #2a2622; stroke-width: 1.5; }
  .landmark.plant rect { fill: rgb(122 74 32 / 35%); }
  .road { fill: transparent; stroke: #2a2622; stroke-width: 1.15; }
  * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
`;
function mapMarkup(id) {
	const svg = (document.getElementById(`map-${id}`) ?? document.querySelector(".map-stage"))?.querySelector("svg");
	if (!svg) return "";
	const clone = svg.cloneNode(true);
	if (!clone.querySelector("#maintStripes") || !clone.querySelector("#roofStripes")) {
		const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		for (const id of ["maintStripes", "roofStripes"]) {
			if (clone.querySelector(`#${id}`)) continue;
			const pattern = document.getElementById(id);
			if (pattern) defs.appendChild(pattern.cloneNode(true));
		}
		if (defs.childNodes.length) clone.insertBefore(defs, clone.firstChild);
	}
	return new XMLSerializer().serializeToString(clone);
}
function openMapPrint(title, body, page) {
	const pageCss = page === "portrait" ? "@page { size: portrait; margin: 0.35in; }" : page === "landscape" ? "@page { size: landscape; margin: 0.35in; }" : "@page land { size: landscape; margin: 0.35in; } @page port { size: portrait; margin: 0.35in; } section.land { page: land; break-after: page; } section.port { page: port; }";
	const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${pageCss}${MAP_PRINT_CSS}</style></head><body>${body}</body></html>`;
	const win = window.open("", "_blank");
	if (!win) {
		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "magnolia-map.html";
		link.click();
		URL.revokeObjectURL(url);
		return;
	}
	win.document.open();
	win.document.write(html);
	win.document.close();
	const go = () => {
		if (win.closed) return;
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 200);
	setTimeout(go, 400);
}
function printMap(id) {
	const svg = mapMarkup(id);
	if (!svg) return;
	openMapPrint(SHEET_COPY[id].title, `<h1>${escapeHtml(SHEET_COPY[id].title)}</h1>${svg}`, id === 3 ? "portrait" : "landscape");
}
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function prettyDate(value) {
	const day = parseDay(value);
	return (day ? new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) : /* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric"
	});
}
function printNotice(lot) {
	const win = window.open("", "_blank");
	if (!win) return;
	const file = lot.noticeFile?.data ?? "";
	const attached = file.startsWith("data:image/") ? `<img src="${file}" alt="Notice" />` : file.startsWith("data:application/pdf") ? `<iframe src="${file}" title="Notice"></iframe>` : "";
	win.document.open();
	win.document.write(`<!doctype html><html><head><title>Notice · Lot ${escapeHtml(lot.lot)}</title><style>
    @page { size: letter; margin: 0.75in; }
    body { margin: 0; color: #1c1916; font: 16px/1.45 Georgia, serif; }
    h1 { margin: 0 0 4px; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; }
    .date { margin: 28px 0; }
    .who { margin: 0 0 28px; }
    h2 { margin: 0 0 12px; font-size: 16px; letter-spacing: 0.12em; text-transform: uppercase; }
    p { margin: 0 0 12px; white-space: pre-wrap; }
    img { display: block; max-width: 100%; margin-top: 24px; }
    iframe { width: 100%; height: 70vh; border: 0; margin-top: 24px; }
  </style></head><body>
    <h1>Magnolia Central of Florida Estates</h1>
    <p class="date">${escapeHtml(prettyDate(lot.noticeDate))}</p>
    <p class="who">${escapeHtml(displayName(lot))}<br>${escapeHtml(`${lot.address} ${lot.street}`.trim())}<br>Lot ${escapeHtml(lot.lot)}</p>
    <h2>Notice</h2>
    <p>${escapeHtml(lot.noticeNote?.trim() || "This notice is for the resident at the address above.")}</p>
    ${attached}
  </body></html>`);
	win.document.close();
	const go = () => {
		if (win.closed) return;
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 250);
	setTimeout(go, 600);
}
var EXPORT_COLUMNS = [
	{
		key: "lot",
		label: "Lot"
	},
	{
		key: "address",
		label: "Address"
	},
	{
		key: "street",
		label: "Street"
	},
	{
		key: "name",
		label: "Name"
	},
	{
		key: "status",
		label: "Status"
	},
	{
		key: "renter",
		label: "Renter/Owner"
	},
	{
		key: "rent",
		label: "Rental Amount"
	},
	{
		key: "lotRent",
		label: "Lot rent"
	},
	{
		key: "homeRent",
		label: "Home rent"
	},
	{
		key: "rentInc2026",
		label: "08/2026"
	},
	{
		key: "rentInc2027",
		label: "08/2027"
	},
	{
		key: "moveIn",
		label: "Move-in"
	},
	{
		key: "rentDue",
		label: "Rent due"
	},
	{
		key: "deposit",
		label: "Deposit"
	},
	{
		key: "balance",
		label: "Still owed"
	},
	{
		key: "noticeDate",
		label: "Notice date"
	},
	{
		key: "noticeNote",
		label: "Notice note"
	},
	{
		key: "issues",
		label: "Issues"
	},
	{
		key: "maintenance",
		label: "Maintenance"
	},
	{
		key: "phone",
		label: "Phone"
	},
	{
		key: "email",
		label: "Email"
	},
	{
		key: "noMow",
		label: "MOW"
	},
	{
		key: "lateRent",
		label: "Late Rent"
	},
	{
		key: "bouncedCheck",
		label: "Bounced Check"
	},
	{
		key: "roofAge",
		label: "Roof age"
	},
	{
		key: "roofMaterial",
		label: "Roof material"
	},
	{
		key: "roofInstalled",
		label: "Roof installed"
	},
	{
		key: "roofReplace",
		label: "Roof needs replaced"
	},
	{
		key: "dogs",
		label: "Dogs"
	},
	{
		key: "cats",
		label: "Cats"
	},
	{
		key: "wiring",
		label: "Home wiring insurance"
	},
	{
		key: "homeIns",
		label: "Home insurance"
	},
	{
		key: "homeInsDate",
		label: "Insurance expires"
	},
	{
		key: "readyPower",
		label: "Power on"
	},
	{
		key: "readyClean",
		label: "Cleaned"
	},
	{
		key: "readyInspected",
		label: "Inspected"
	},
	{
		key: "zillow",
		label: "Listed on Zillow"
	},
	{
		key: "zillowUrl",
		label: "Zillow link"
	},
	{
		key: "homeYear",
		label: "Year"
	},
	{
		key: "homeMake",
		label: "Make"
	},
	{
		key: "homeModel",
		label: "Model"
	},
	{
		key: "homeWidth",
		label: "Width"
	},
	{
		key: "homeLength",
		label: "Length"
	},
	{
		key: "homeWide",
		label: "Single or double"
	}
];
function csvCell(value) {
	return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, "\"\"")}"` : value;
}
function downloadRegister(lots) {
	const lines = [EXPORT_COLUMNS.map((col) => csvCell(col.label)).join(","), ...lots.map((lot) => EXPORT_COLUMNS.map((col) => csvCell(String(lot[col.key] ?? ""))).join(","))];
	const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "magnolia-register.csv";
	link.click();
	URL.revokeObjectURL(url);
}
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = "";
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (quoted) {
			if (ch === "\"" && text[i + 1] === "\"") {
				cell += "\"";
				i += 1;
			} else if (ch === "\"") quoted = false;
			else cell += ch;
		} else if (ch === "\"") quoted = true;
		else if (ch === ",") {
			row.push(cell);
			cell = "";
		} else if (ch === "\n") {
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
		} else if (ch !== "\r") cell += ch;
	}
	if (cell || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows.filter((line) => line.some((item) => item.trim()));
}
function importRegister(text, current) {
	const rows = parseCsv(text);
	if (rows.length < 2) return current;
	const header = rows[0].map((item) => item.trim().toLowerCase());
	const lotIndex = header.findIndex((item) => item === "lot");
	if (lotIndex < 0) return current;
	const keys = header.map((name) => EXPORT_COLUMNS.find((col) => col.label.toLowerCase() === name)?.key);
	const incoming = /* @__PURE__ */ new Map();
	for (const line of rows.slice(1)) {
		const lotNo = line[lotIndex]?.trim();
		if (!lotNo) continue;
		const patch = {};
		keys.forEach((key, index) => {
			if (!key || key === "id" || key === "lot") return;
			patch[key] = line[index] ?? "";
		});
		incoming.set(lotNo, patch);
	}
	return current.map((lot) => {
		const patch = incoming.get(lot.lot);
		if (!patch) return lot;
		const status = patch.status === "Empty" || patch.status === "Open" || patch.status === "Eviction" || patch.status === "Occupied" ? patch.status : lot.status;
		return {
			...lot,
			...patch,
			id: lot.id,
			lot: lot.lot,
			status,
			photo: lot.photo,
			lease: lot.lease,
			rulesReceipt: lot.rulesReceipt,
			background: lot.background,
			otherDocs: lot.otherDocs
		};
	});
}
function readAsData(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}
async function fileToData(file) {
	if (file.type.startsWith("image/")) {
		const raw = await readAsData(file);
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, 720 / Math.max(img.width, img.height));
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(img.width * scale));
				canvas.height = Math.max(1, Math.round(img.height * scale));
				const ctx = canvas.getContext("2d");
				if (!ctx) return resolve(raw);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL("image/jpeg", .72));
			};
			img.onerror = () => resolve(raw);
			img.src = raw;
		});
	}
	if (file.size > 12e5) return "";
	return readAsData(file);
}
function downloadEverything(lots) {
	const blob = new Blob([JSON.stringify({
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		lots
	}, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "magnolia-backup.json";
	link.click();
	URL.revokeObjectURL(url);
}
function importEverything(text, current) {
	const parsed = JSON.parse(text);
	const incoming = Array.isArray(parsed) ? parsed : parsed.lots ?? [];
	const byId = new Map(incoming.map((lot) => [lot.id, lot]));
	return current.map((lot) => {
		const next = byId.get(lot.id);
		if (!next) return lot;
		const status = next.status === "Empty" || next.status === "Open" || next.status === "Eviction" ? next.status : "Occupied";
		return {
			...lot,
			...next,
			id: lot.id,
			lot: lot.lot,
			status
		};
	});
}
function lotNumberIn(text) {
	return text.match(/\blot\s*#?\s*(\d+(?:\.5)?)\b/i)?.[1] ?? "";
}
function lastToken(name) {
	return (name.split(",")[0]?.trim() || name.trim()).split(/\s+/).pop()?.toLowerCase() ?? "";
}
function moneyText(value) {
	const rounded = Math.round(value * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
function importFromQuickBooks(text, current) {
	const hits = parseQuickBooks(text);
	const used = /* @__PURE__ */ new Set();
	let updated = 0;
	let missed = 0;
	const next = current.map((lot) => ({ ...lot }));
	for (const hit of hits) {
		const lot = matchQuickBooksLot(next, hit);
		if (!lot || used.has(lot.id)) {
			missed += 1;
			continue;
		}
		used.add(lot.id);
		let changed = false;
		if (hit.phone && hit.phone !== lot.phone) {
			lot.phone = hit.phone;
			changed = true;
		}
		if (hit.email && hit.email !== lot.email) {
			lot.email = hit.email;
			changed = true;
		}
		if (hit.balance != null) {
			const shown = moneyText(hit.balance);
			if (shown !== (lot.balance ?? "")) {
				lot.balance = shown;
				changed = true;
			}
		} else if (hit.paid && hit.paid > 0) {
			const owed = Number(String(lot.balance ?? "").replace(/[$,]/g, ""));
			if (Number.isFinite(owed)) {
				lot.balance = moneyText(Math.max(0, owed - hit.paid));
				changed = true;
			}
		}
		if (changed) updated += 1;
	}
	return {
		lots: next,
		updated,
		missed
	};
}
function parseQuickBooks(text) {
	if (/(^|\n)!?(CUST|TRNS|ENDTRNS)\b/.test(text) && text.includes("	")) return parseIif(text);
	return parseQuickBooksCsv(text);
}
function parseIif(text) {
	const byName = /* @__PURE__ */ new Map();
	let headers = [];
	for (const line of text.split(/\r?\n/)) {
		if (!line.trim()) continue;
		const cols = line.split("	");
		if (line.startsWith("!")) {
			headers = cols.map((col) => col.replace(/^!/, "").toUpperCase());
			continue;
		}
		const rec = {};
		headers.forEach((header, index) => {
			if (header) rec[header] = cols[index] ?? "";
		});
		const kind = (cols[0] ?? "").toUpperCase();
		if (kind === "CUST") {
			const name = rec.NAME || rec.COMPANYNAME || "";
			const hit = byName.get(name.toLowerCase()) ?? blankHit(name);
			hit.lotNo = hit.lotNo || lotNumberIn([
				name,
				rec.NOTE,
				rec.BADDR1,
				rec.BADDR2,
				rec.BADDR3
			].join(" "));
			hit.phone = hit.phone || rec.PHONE1 || rec.PHONE || "";
			hit.email = hit.email || rec.EMAIL || "";
			const balance = numberOrNull(rec.BALANCE || rec.OPENBALANCE || "");
			if (balance != null) hit.balance = balance;
			byName.set(name.toLowerCase(), hit);
		}
		if (kind === "TRNS" && (rec.TRNSTYPE || "").toUpperCase() === "PAYMENT") {
			const name = rec.NAME || "";
			const hit = byName.get(name.toLowerCase()) ?? blankHit(name);
			hit.lotNo = hit.lotNo || lotNumberIn(`${name} ${rec.MEMO ?? ""} ${rec.DOCNUM ?? ""}`);
			const paid = numberOrNull(rec.AMOUNT || "");
			if (paid != null) hit.paid += Math.abs(paid);
			byName.set(name.toLowerCase(), hit);
		}
	}
	return [...byName.values()].filter((hit) => hit.name || hit.lotNo);
}
function parseQuickBooksCsv(text) {
	const rows = parseCsv(text);
	if (rows.length < 2) return [];
	const header = rows[0].map((cell) => cell.trim().toLowerCase());
	const col = (...names) => header.findIndex((cell) => names.some((name) => cell.includes(name)));
	const nameCol = col("customer", "name");
	const phoneCol = col("phone");
	const emailCol = col("email", "e-mail");
	const balanceCol = col("balance", "open balance", "amount due");
	const lotCol = col("lot");
	if (nameCol < 0 && lotCol < 0) return [];
	return rows.slice(1).map((row) => {
		const name = row[nameCol] ?? "";
		return {
			lotNo: lotNumberIn(`${row[lotCol] ?? ""} ${name}`),
			name,
			phone: phoneCol >= 0 ? row[phoneCol] ?? "" : "",
			email: emailCol >= 0 ? row[emailCol] ?? "" : "",
			balance: balanceCol >= 0 ? numberOrNull(row[balanceCol] ?? "") : null,
			paid: 0
		};
	});
}
function blankHit(name) {
	return {
		lotNo: lotNumberIn(name),
		name,
		phone: "",
		email: "",
		balance: null,
		paid: 0
	};
}
function numberOrNull(value) {
	const cleaned = value.replace(/[$,\s]/g, "");
	if (!cleaned || cleaned === "-") return null;
	const amount = Number(cleaned);
	return Number.isFinite(amount) ? amount : null;
}
function matchQuickBooksLot(lots, hit) {
	if (hit.lotNo) {
		const byLot = lots.find((lot) => lot.lot === hit.lotNo);
		if (byLot) return byLot;
	}
	const stripped = hit.name.replace(/^lot\s*\d+(?:\.5)?\s*[-–:]?\s*/i, "").trim();
	const token = lastToken(stripped);
	if (!token || token.length < 2) return void 0;
	const named = lots.filter((lot) => {
		return lastToken(lot.name) === token || lot.name.trim().toLowerCase() === stripped.toLowerCase();
	});
	return named.length === 1 ? named[0] : void 0;
}
var BUSINESS_CATEGORIES = [
	"License / permit",
	"Vehicle",
	"Title work",
	"Insurance",
	"Tax / bill",
	"Maintenance",
	"Inspection",
	"Vendor",
	"Other"
];
var BUSINESS_STATUSES = [
	"Open",
	"In progress",
	"Waiting",
	"Completed"
];
var BUSINESS_KEY = "magnolia-business-tasks";
function businessDays(date) {
	if (!date) return null;
	const value = /* @__PURE__ */ new Date(date + "T00:00:00");
	if (!Number.isFinite(value.getTime())) return null;
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	return Math.round((value.getTime() - today.getTime()) / 864e5);
}
function readFileBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const value = typeof reader.result === "string" ? reader.result : "";
			const comma = value.indexOf(",");
			if (comma < 0) reject(/* @__PURE__ */ new Error("The selected file could not be read."));
			else resolve(value.slice(comma + 1));
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("The selected file could not be read."));
		reader.readAsDataURL(file);
	});
}
function noteTasksFromLots(lots) {
	return buildTodo(lots).flatMap((item) => {
		const hay = `${item.notes}\n${item.text}`;
		const hit = [
			"title",
			"insurance",
			"power"
		].find((word) => new RegExp(`\\b${word}`, "i").test(hay));
		if (!hit) return [];
		const category = hit === "title" ? "Title work" : hit === "insurance" ? "Insurance" : "Other";
		const who = item.name && item.name !== "—" ? item.name : "";
		const label = hit[0].toUpperCase() + hit.slice(1);
		return [{
			id: `lot-note:${item.id}`,
			title: `Lot ${item.lot}${who ? ` · ${who}` : ""} · ${label}`,
			category,
			dueDate: item.date,
			followUp: "",
			status: "Open",
			owner: who,
			cost: "",
			reference: item.address || item.lot,
			notes: [item.notes, item.text].filter(Boolean).join(" · ")
		}];
	});
}
function BusinessBoard({ lots }) {
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [parkBills, setParkBills] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [storageError, setStorageError] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [hiddenTasks, setHiddenTasks] = (0, import_react.useState)(() => {
		try {
			const raw = JSON.parse(localStorage.getItem("magnolia-business-hidden") ?? "[]");
			return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
		} catch {
			return /* @__PURE__ */ new Set();
		}
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Title work");
	const [dueDate, setDueDate] = (0, import_react.useState)("");
	const [followUp, setFollowUp] = (0, import_react.useState)("");
	const [owner, setOwner] = (0, import_react.useState)("");
	const [cost, setCost] = (0, import_react.useState)("");
	const [reference, setReference] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [attachments, setAttachments] = (0, import_react.useState)({});
	const [history, setHistory] = (0, import_react.useState)({});
	const [expandedAttachments, setExpandedAttachments] = (0, import_react.useState)({});
	const [expandedHistory, setExpandedHistory] = (0, import_react.useState)({});
	const [legacyCount, setLegacyCount] = (0, import_react.useState)(0);
	const [dismissedNotes, setDismissedNotes] = (0, import_react.useState)(() => {
		try {
			const raw = JSON.parse(localStorage.getItem("magnolia-business-note-dismissed") ?? "[]");
			return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
		} catch {
			return /* @__PURE__ */ new Set();
		}
	});
	const boardTasks = (0, import_react.useMemo)(() => {
		const saved = new Set(tasks.map((task) => task.id));
		return [...noteTasksFromLots(lots).filter((task) => !saved.has(task.id) && !dismissedNotes.has(task.id) && !hiddenTasks.has(task.id)), ...tasks.filter((task) => !hiddenTasks.has(task.id))];
	}, [
		lots,
		tasks,
		dismissedNotes,
		hiddenTasks
	]);
	(0, import_react.useEffect)(() => {
		let active = true;
		try {
			const legacy = JSON.parse(localStorage.getItem(BUSINESS_KEY) ?? "[]");
			if (Array.isArray(legacy) && !localStorage.getItem(BUSINESS_KEY + "-imported")) setLegacyCount(legacy.filter((item) => item && typeof item.title === "string").length);
		} catch {}
		listBusinessTasks().then((rows) => {
			if (!active) return;
			setTasks(rows.filter((row) => !hiddenTasks.has(row.id)));
			setLoading(false);
		}).catch((error) => {
			if (!active) return;
			setStorageError(error instanceof Error ? error.message : "Shared task storage is unavailable.");
			setLoading(false);
		});
		return () => {
			active = false;
		};
	}, []);
	const active = boardTasks.filter((task) => task.status !== "Completed");
	const overdue = active.filter((task) => {
		const days = businessDays(task.dueDate);
		return days !== null && days < 0;
	});
	const upcoming = active.filter((task) => {
		const days = businessDays(task.dueDate);
		return days !== null && days >= 0 && days <= 30;
	});
	const followUpsDue = active.filter((task) => {
		const days = businessDays(task.followUp);
		return days !== null && days <= 0;
	});
	active.filter((task) => task.status === "Waiting");
	const filtered = boardTasks.filter((task) => (filter === "All" || task.category === filter || task.status === filter || filter === "Overdue" && task.status !== "Completed" && businessDays(task.dueDate) !== null && businessDays(task.dueDate) < 0 || filter === "Due soon" && task.status !== "Completed" && businessDays(task.dueDate) !== null && businessDays(task.dueDate) >= 0 && businessDays(task.dueDate) <= 30 || filter === "Follow-up due" && task.status !== "Completed" && businessDays(task.followUp) !== null && businessDays(task.followUp) <= 0) && [
		task.title,
		task.category,
		task.owner,
		task.reference,
		task.notes
	].join(" ").toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
		if (a.status === "Completed" && b.status !== "Completed") return 1;
		if (b.status === "Completed" && a.status !== "Completed") return -1;
		return (businessDays(a.dueDate) ?? 99999) - (businessDays(b.dueDate) ?? 99999);
	});
	async function addTask(event) {
		event.preventDefault();
		if (!title.trim()) return;
		setSaving(true);
		setStorageError("");
		const existing = editingId ? tasks.find((item) => item.id === editingId) : void 0;
		const task = {
			id: existing?.id ?? crypto.randomUUID(),
			title: title.trim(),
			category,
			dueDate,
			followUp,
			status: existing?.status ?? "Open",
			owner: owner.trim(),
			cost: cost.trim(),
			reference: reference.trim(),
			notes: notes.trim()
		};
		try {
			const saved = await saveBusinessTask({ data: {
				task,
				action: existing ? "Updated" : "Created"
			} });
			setTasks((current) => existing ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
			setTitle("");
			setDueDate("");
			setFollowUp("");
			setOwner("");
			setCost("");
			setReference("");
			setNotes("");
			setCategory("Title work");
			setShowForm(false);
			setEditingId(null);
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Task could not be saved.");
		} finally {
			setSaving(false);
		}
	}
	async function changeStatus(task, status) {
		const next = {
			...task,
			status
		};
		setStorageError("");
		try {
			const saved = await saveBusinessTask({ data: {
				task: next,
				action: "Updated"
			} });
			setTasks((current) => current.map((item) => item.id === saved.id ? saved : item));
			setHistory((current) => {
				const copy = { ...current };
				delete copy[task.id];
				return copy;
			});
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Task status could not be saved.");
		}
	}
	function beginEdit(task) {
		setEditingId(task.id);
		setTitle(task.title);
		setCategory(task.category);
		setDueDate(task.dueDate);
		setFollowUp(task.followUp);
		setOwner(task.owner);
		setCost(task.cost);
		setReference(task.reference);
		setNotes(task.notes);
		setShowForm(true);
		setStorageError("");
	}
	async function removeTask(task) {
		setConfirmId(null);
		setHiddenTasks((current) => {
			const next = new Set(current);
			next.add(task.id);
			localStorage.setItem("magnolia-business-hidden", JSON.stringify([...next]));
			return next;
		});
		if (task.id.startsWith("lot-note:")) setDismissedNotes((current) => {
			const next = new Set(current);
			next.add(task.id);
			localStorage.setItem("magnolia-business-note-dismissed", JSON.stringify([...next]));
			return next;
		});
		setTasks((current) => current.filter((item) => item.id !== task.id));
		if (task.id.startsWith("lot-note:") && !tasks.some((item) => item.id === task.id)) return;
		try {
			await deleteBusinessTask({ data: { id: task.id } });
			setAttachments((current) => {
				const copy = { ...current };
				delete copy[task.id];
				return copy;
			});
			setHistory((current) => {
				const copy = { ...current };
				delete copy[task.id];
				return copy;
			});
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Task could not be removed from shared storage, but it is hidden here.");
		}
	}
	async function toggleAttachments(taskId) {
		const open = !expandedAttachments[taskId];
		setExpandedAttachments((current) => ({
			...current,
			[taskId]: open
		}));
		if (open && !attachments[taskId]) try {
			const rows = await listBusinessAttachments({ data: { taskId } });
			setAttachments((current) => ({
				...current,
				[taskId]: rows
			}));
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Attachments could not be loaded.");
		}
	}
	async function uploadAttachment(task, file) {
		if (!file) return;
		setStorageError("");
		try {
			const dataBase64 = await readFileBase64(file);
			const attachment = await addBusinessAttachment({ data: {
				taskId: task.id,
				name: file.name,
				mimeType: file.type || "application/octet-stream",
				size: file.size,
				dataBase64
			} });
			setAttachments((current) => ({
				...current,
				[task.id]: [attachment, ...current[task.id] ?? []]
			}));
			setExpandedAttachments((current) => ({
				...current,
				[task.id]: true
			}));
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Attachment could not be uploaded.");
		}
	}
	async function downloadAttachment(attachment) {
		try {
			const file = await readBusinessAttachment({ data: { id: attachment.id } });
			if (!file) throw new Error("Attachment not found.");
			const binary = atob(file.dataBase64);
			const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
			const url = URL.createObjectURL(new Blob([bytes], { type: file.mimeType }));
			const link = document.createElement("a");
			link.href = url;
			link.download = file.name;
			link.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Attachment could not be downloaded.");
		}
	}
	async function removeAttachment(taskId, attachmentId) {
		try {
			await deleteBusinessAttachment({ data: { id: attachmentId } });
			setAttachments((current) => ({
				...current,
				[taskId]: (current[taskId] ?? []).filter((item) => item.id !== attachmentId)
			}));
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Attachment could not be removed.");
		}
	}
	async function toggleHistory(taskId) {
		const open = !expandedHistory[taskId];
		setExpandedHistory((current) => ({
			...current,
			[taskId]: open
		}));
		if (open && !history[taskId]) try {
			const rows = await listBusinessHistory({ data: { taskId } });
			setHistory((current) => ({
				...current,
				[taskId]: rows
			}));
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Change history could not be loaded.");
		}
	}
	async function importLegacyTasks() {
		let legacy;
		try {
			legacy = JSON.parse(localStorage.getItem(BUSINESS_KEY) ?? "[]");
		} catch {
			legacy = [];
		}
		if (!Array.isArray(legacy) || !legacy.length) {
			setLegacyCount(0);
			return;
		}
		if (!window.confirm("Import tasks saved in this browser into the currently signed-in account? This does not delete the browser copy.")) return;
		setSaving(true);
		setStorageError("");
		try {
			const imported = [];
			for (const raw of legacy) {
				if (!raw || typeof raw !== "object") continue;
				const old = raw;
				if (!old.title || !old.category) continue;
				const task = {
					id: crypto.randomUUID(),
					title: String(old.title).slice(0, 200),
					category: BUSINESS_CATEGORIES.includes(String(old.category)) ? String(old.category) : "Other",
					dueDate: String(old.dueDate ?? ""),
					followUp: String(old.followUp ?? ""),
					status: BUSINESS_STATUSES.includes(String(old.status)) ? String(old.status) : "Open",
					owner: String(old.owner ?? ""),
					cost: String(old.cost ?? ""),
					reference: String(old.reference ?? ""),
					notes: String(old.notes ?? "")
				};
				imported.push(await saveBusinessTask({ data: {
					task,
					action: "Created"
				} }));
			}
			setTasks((current) => [...imported, ...current]);
			localStorage.setItem(BUSINESS_KEY + "-imported", (/* @__PURE__ */ new Date()).toISOString());
			setLegacyCount(0);
		} catch (error) {
			setStorageError(error instanceof Error ? error.message : "Some legacy tasks could not be imported.");
		} finally {
			setSaving(false);
		}
	}
	function exportTasks() {
		const csv = [[
			"Task",
			"Category",
			"Due date",
			"Follow-up date",
			"Status",
			"Responsible",
			"Cost",
			"Reference",
			"Notes"
		], ...boardTasks.map((task) => [
			task.title,
			task.category,
			task.dueDate,
			task.followUp,
			task.status,
			task.owner,
			task.cost,
			task.reference,
			task.notes
		])].map((row) => row.map((cell) => "\"" + String(cell ?? "").replace(/"/g, "\"\"") + "\"").join(",")).join("\r\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = "business-task-tracker.csv";
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "business-board",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-metrics",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "business-metric metric-overdue",
						type: "button",
						onClick: () => setFilter("Overdue"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overdue" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: overdue.length }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Past due · incomplete" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "business-metric",
						type: "button",
						onClick: () => setFilter("Due soon"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Due in 30 days" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: upcoming.length }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Upcoming deadlines" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "business-metric",
						type: "button",
						onClick: () => setFilter("Follow-up due"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Follow-up due" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: followUpsDue.length }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Check on the next action" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "business-metric",
						type: "button",
						onClick: () => setFilter("Title work"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open title work" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: active.filter((task) => task.category === "Title work").length }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Transfers and documents" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-filters",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === "All",
						onClick: () => setFilter("All"),
						children: "All tasks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === "Overdue",
						onClick: () => setFilter("Overdue"),
						children: "Overdue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === "Due soon",
						onClick: () => setFilter("Due soon"),
						children: "Due in 30 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === "Follow-up due",
						onClick: () => setFilter("Follow-up due"),
						children: "Follow-up due"
					}),
					BUSINESS_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === item,
						onClick: () => setFilter(item),
						children: item
					}, item)),
					BUSINESS_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": filter === item,
						onClick: () => setFilter(item),
						children: item
					}, item))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "OPERATIONS WORKSPACE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Business center" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "business-subtitle",
						children: "Shared renewals, title work, registrations, documents, and follow-ups."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "business-heading-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "business-secondary",
						type: "button",
						onClick: exportTasks,
						children: "Export CSV"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "business-primary",
						type: "button",
						onClick: () => setShowForm((open) => !open),
						children: showForm ? "Cancel" : "+ Add task"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillsBoard, {
				onChange: setParkBills,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessCalendar, {
					tasks: boardTasks,
					bills: parkBills
				})
			}),
			storageError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-error",
				role: "alert",
				children: [storageError, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "business-secondary",
					type: "button",
					onClick: () => setStorageError(""),
					children: "Dismiss"
				})]
			}) : null,
			legacyCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-notice",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [legacyCount, " older task(s) were found in this browser and have not been moved to shared storage."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "business-secondary",
					type: "button",
					disabled: saving,
					onClick: () => void importLegacyTasks(),
					children: "Import to my account"
				})]
			}) : null,
			showForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "business-form",
				onSubmit: (event) => void addTask(event),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "business-form-title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: editingId ? "Edit business task" : "Create business task" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Track the deadline, next action, and reference details." })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field business-field-wide",
						children: ["Task name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							autoFocus: true,
							value: title,
							onChange: (event) => setTitle(event.target.value),
							placeholder: "e.g. Submit title transfer for Lot 24"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (event) => setCategory(event.target.value),
							children: BUSINESS_CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Due date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: dueDate,
							onChange: (event) => setDueDate(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Follow-up date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: followUp,
							onChange: (event) => setFollowUp(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Responsible person", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: owner,
							onChange: (event) => setOwner(event.target.value),
							placeholder: "Name or team"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Cost / fee ($)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							value: cost,
							onChange: (event) => setCost(event.target.value),
							placeholder: "0.00"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field",
						children: ["Reference number", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: reference,
							onChange: (event) => setReference(event.target.value),
							placeholder: "VIN, title case, permit #"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "business-field business-field-wide",
						children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: notes,
							onChange: (event) => setNotes(event.target.value),
							placeholder: "Missing documents, agency contact, next action…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "business-form-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "business-secondary",
							type: "button",
							onClick: () => {
								setShowForm(false);
								setEditingId(null);
							},
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "business-primary",
							type: "submit",
							disabled: saving,
							children: saving ? "Saving…" : editingId ? "Save changes" : "Save task"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-list-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Business task register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: loading ? "Loading shared records…" : filtered.length + " records · nearest deadline first" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					"aria-label": "Search business tasks",
					value: search,
					onChange: (event) => setSearch(event.target.value),
					placeholder: "Search tasks, people, references…"
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-empty",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Loading your shared task register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Checking the shared database…" })]
			}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "business-task-list",
				children: filtered.map((task) => {
					const days = businessDays(task.dueDate);
					const followDays = businessDays(task.followUp);
					const dueLabel = days === null ? "No due date" : days < 0 ? Math.abs(days) + "d overdue" : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : "Due in " + days + " days";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "business-task " + (task.status === "Completed" ? "task-completed" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "business-task-main",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "business-category",
									children: task.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: task.title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "business-task-meta",
									children: [
										task.owner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Owner: ", task.owner] }) : null,
										task.reference ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Ref: ", task.reference] }) : null,
										task.cost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fee: $" + task.cost }) : null,
										task.followUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Follow-up: ",
											task.followUp,
											followDays !== null && followDays <= 0 && task.status !== "Completed" ? " · due now" : ""
										] }) : null
									]
								}),
								task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "business-task-notes",
									children: task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim()
								}) : null,
								(loadTaskStickies()[task.id] ?? []).map((sticky) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "business-task-notes task-sticky",
									style: { background: sticky.color },
									children: sticky.text
								}, sticky.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "business-inline-actions",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "business-secondary",
										type: "button",
										onClick: () => void toggleAttachments(task.id),
										children: expandedAttachments[task.id] ? "Hide documents" : "Documents (" + (attachments[task.id]?.length ?? "…") + ")"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "business-secondary",
										type: "button",
										onClick: () => void toggleHistory(task.id),
										children: expandedHistory[task.id] ? "Hide history" : "Change history"
									})]
								}),
								expandedAttachments[task.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "business-detail-panel",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "business-field",
										children: ["Attach PDF or image (max 3 MB)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "application/pdf,image/png,image/jpeg,image/webp",
											onChange: (event) => {
												const file = event.target.files?.[0];
												event.target.value = "";
												uploadAttachment(task, file);
											}
										})]
									}), (attachments[task.id] ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "business-attachment",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												item.name,
												" · ",
												(item.size / 1024).toFixed(0),
												" KB"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "business-secondary",
												type: "button",
												onClick: () => void downloadAttachment(item),
												children: "Download"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "business-delete",
												type: "button",
												onClick: () => void removeAttachment(task.id, item.id),
												children: "Remove"
											})
										]
									}, item.id))]
								}) : null,
								expandedHistory[task.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "business-detail-panel",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", { children: "Recent changes" }), (history[task.id] ?? []).length ? (history[task.id] ?? []).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "business-history-entry",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: entry.action }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(entry.changedAt).toLocaleString() }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: entry.snapshot.title || "Task record" })
										]
									}, entry.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No change history available." })]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "business-task-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "business-due " + (days !== null && days < 0 && task.status !== "Completed" ? "due-overdue" : days !== null && days <= 7 && task.status !== "Completed" ? "due-soon" : ""),
									children: task.status === "Completed" ? "Completed" : dueLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "business-secondary",
									type: "button",
									onClick: () => beginEdit(task),
									children: "Edit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "Status for " + task.title,
									value: task.status,
									onChange: (event) => void changeStatus(task, event.target.value),
									children: BUSINESS_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: item }, item))
								}),
								confirmId === task.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "remove-confirm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Are you sure?" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "business-primary",
											type: "button",
											onClick: () => void removeTask(task),
											children: "Confirm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "business-secondary",
											type: "button",
											onClick: () => setConfirmId(null),
											children: "Cancel"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "business-delete",
									type: "button",
									onClick: () => setConfirmId(task.id),
									"aria-label": "Delete " + task.title,
									children: "Remove"
								})
							]
						})]
					}, task.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "business-empty",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "business-empty-icon",
						children: "✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: tasks.length ? "No matching tasks" : "Your business task list is ready" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tasks.length ? "Try another search or filter." : "Add a license renewal, vehicle registration, title transfer, or follow-up to start tracking deadlines." }),
					!tasks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "business-primary",
						type: "button",
						onClick: () => setShowForm(true),
						children: "+ Add your first task"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "business-secondary",
						type: "button",
						onClick: () => {
							setSearch("");
							setFilter("All");
						},
						children: "Clear filters"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "business-storage-note",
				children: "Tasks, change history, and attachments are stored in the shared database and scoped to the signed-in account. Due-date reminders appear in this workspace; external email or push notifications require a separately configured delivery provider."
			})
		]
	});
}
var BOARD_KEY = "magnolia-meeting-board";
var TASK_STICKY_KEY = "magnolia-task-stickies";
function loadTaskStickies() {
	try {
		const raw = JSON.parse(localStorage.getItem(TASK_STICKY_KEY) ?? "{}");
		return raw && typeof raw === "object" ? raw : {};
	} catch {
		return {};
	}
}
function writeTaskSticky(taskId, sticky) {
	const all = loadTaskStickies();
	const list = Array.isArray(all[taskId]) ? all[taskId] : [];
	if (!list.some((item) => item.id === sticky.id)) all[taskId] = [...list, sticky];
	localStorage.setItem(TASK_STICKY_KEY, JSON.stringify(all));
}
function eraseTaskSticky(id) {
	const all = loadTaskStickies();
	for (const key of Object.keys(all)) all[key] = (all[key] ?? []).filter((item) => item.id !== id);
	localStorage.setItem(TASK_STICKY_KEY, JSON.stringify(all));
}
var STICKY_COLORS = [
	"rgba(240, 130, 0, 0.76)",
	"rgba(170, 255, 0, 0.7)",
	"rgba(70, 160, 255, 0.62)",
	"rgba(255, 64, 64, 0.55)",
	"rgba(255, 230, 40, 0.75)"
];
function loadBoard() {
	try {
		const raw = JSON.parse(localStorage.getItem(BOARD_KEY) ?? "[]");
		if (!Array.isArray(raw)) return [];
		return raw.filter((item) => item && typeof item.text === "string" && (item.kind === "message" || item.kind === "sticky" || item.kind === "reminder" || item.kind === "pin"));
	} catch {
		return [];
	}
}
function PinMarks({ notes, pin, open, onOpen, onRemove }) {
	const pins = notes.filter((note) => note.kind === "pin" && note.pin === pin);
	if (!pins.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "pin-marks",
		children: pins.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "pin-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pin-mark",
				style: { background: item.color || "#ffe56a" },
				"aria-label": "Open sticky note",
				onClick: (event) => {
					event.stopPropagation();
					onOpen(open === item.id ? "" : item.id);
				}
			}), open === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "pin-pop",
				role: "note",
				children: [item.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Remove sticky",
					onClick: () => onRemove(item.id),
					children: "×"
				})]
			}) : null]
		}, item.id))
	});
}
function taskStickyNotes(task) {
	const found = [];
	for (const match of task.notes.matchAll(/\[\[sticky:([^|\]]+)\|([^\]]+)\]\]([^\n]*)/g)) found.push({
		id: match[2],
		kind: "pin",
		text: match[3],
		when: "",
		color: match[1],
		pin: `task:${task.id}`
	});
	return found;
}
function dropTarget(nodes) {
	for (const node of nodes) {
		const el = node;
		const task = el.closest?.("[data-task-id]");
		if (task?.dataset.taskId) return `task:${task.dataset.taskId}`;
		const todo = el.closest?.("[data-todo-id]");
		if (todo?.dataset.todoId) return `todo:${todo.dataset.todoId}`;
		const day = el.closest?.("[data-date]");
		if (day?.dataset.date) return `date:${day.dataset.date}`;
		const message = el.closest?.("[data-message-id]");
		if (message?.dataset.messageId) return `message:${message.dataset.messageId}`;
		const lot = el.closest?.("[data-lot-id]");
		if (lot?.dataset.lotId) return `lot:${lot.dataset.lotId}`;
	}
	return "";
}
function MeetingBoard({ lots, onOpen, onSave }) {
	const [notes, setNotes] = (0, import_react.useState)(() => typeof window === "undefined" ? [] : loadBoard());
	const [text, setText] = (0, import_react.useState)("");
	const [stickyText, setStickyText] = (0, import_react.useState)("");
	const [stickyColor, setStickyColor] = (0, import_react.useState)(STICKY_COLORS[4]);
	const [messageColor, setMessageColor] = (0, import_react.useState)(STICKY_COLORS[4]);
	const [colorOpen, setColorOpen] = (0, import_react.useState)(false);
	const [messageColorOpen, setMessageColorOpen] = (0, import_react.useState)(false);
	const composeDrag = (0, import_react.useRef)(null);
	const [when, setWhen] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [biz, setBiz] = (0, import_react.useState)([]);
	const [bills, setBills] = (0, import_react.useState)([]);
	(0, import_react.useRef)(null);
	const frameRef = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)(null);
	const [dragging, setDragging] = (0, import_react.useState)("");
	const [dropHint, setDropHint] = (0, import_react.useState)("");
	const [openPin, setOpenPin] = (0, import_react.useState)("");
	const [messagesOpen, setMessagesOpen] = (0, import_react.useState)(false);
	const [dragTick, setDragTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let active = true;
		readMaster().then((book) => {
			if (!active) return;
			const saved = Array.isArray(book?.board) ? book.board : [];
			if (saved.length) setNotes((current) => {
				const map = /* @__PURE__ */ new Map();
				for (const item of saved) if (item && typeof item.text === "string") map.set(item.id, item);
				for (const item of current) if (item && typeof item.text === "string") map.set(item.id, item);
				return [...map.values()];
			});
			if (Array.isArray(book?.bills)) setBills(book.bills.filter((item) => item && typeof item.name === "string"));
		}).catch(() => {}).finally(() => {
			if (active) setReady(true);
		});
		listBusinessTasks().then((rows) => {
			if (active) setBiz(rows);
		}).catch(() => {});
		try {
			const local = JSON.parse(localStorage.getItem(BILLS_KEY) ?? "[]");
			if (Array.isArray(local)) setBills(local.filter((item) => item && typeof item.name === "string"));
		} catch {}
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(BOARD_KEY, JSON.stringify(notes));
		} catch {}
		const timer = window.setTimeout(() => {
			saveBoard({ data: { board: notes } }).catch(() => {});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [notes, ready]);
	(0, import_react.useEffect)(() => {
		const root = frameRef.current;
		if (!root) return;
		const boxes = [...root.querySelectorAll("[data-resize]")];
		for (const el of boxes) try {
			const saved = JSON.parse(localStorage.getItem("magnolia-resize-" + el.dataset.resize) ?? "");
			if (saved.w && el.dataset.resize !== "tasks" && el.dataset.resize !== "todo" && el.dataset.resize !== "calendar" && el.dataset.resize !== "finance" && el.dataset.resize !== "messages") el.style.width = `${saved.w}px`;
			if (saved.h && el.dataset.resize !== "tasks" && el.dataset.resize !== "todo" && el.dataset.resize !== "calendar" && el.dataset.resize !== "finance") el.style.height = `${saved.h}px`;
		} catch {}
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const el = entry.target;
				const id = el.dataset.resize;
				if (!id) continue;
				localStorage.setItem("magnolia-resize-" + id, JSON.stringify({
					w: Math.round(el.offsetWidth),
					h: Math.round(el.offsetHeight)
				}));
			}
		});
		boxes.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		setNotes((current) => {
			const have = new Set(current.map((item) => item.id));
			const extra = [];
			for (const lot of lots) for (const sticky of lot.stickies ?? []) if (!have.has(sticky.id)) extra.push({
				id: sticky.id,
				kind: "pin",
				text: sticky.text,
				when: "",
				color: sticky.color,
				pin: `todo:${lot.id}`
			});
			for (const task of biz) for (const sticky of taskStickyNotes(task)) if (!have.has(sticky.id)) extra.push(sticky);
			for (const [taskId, stickies] of Object.entries(loadTaskStickies())) for (const sticky of stickies) if (!have.has(sticky.id)) extra.push({
				id: sticky.id,
				kind: "pin",
				text: sticky.text,
				when: "",
				color: sticky.color,
				pin: `task:${taskId}`
			});
			return extra.length ? [...extra, ...current] : current;
		});
	}, [
		lots,
		biz,
		ready
	]);
	function add(kind) {
		const body = text.trim();
		if (!body || kind === "reminder" && !when) return;
		setNotes((current) => {
			const stickiesNow = current.filter((item) => item.kind === "sticky").length;
			return [{
				id: `board-${Date.now()}`,
				kind,
				text: body,
				when: kind === "reminder" ? when : "",
				color: kind === "message" ? messageColor : STICKY_COLORS[current.length % STICKY_COLORS.length],
				x: kind === "sticky" ? 12 + stickiesNow % 4 * 176 : void 0,
				y: kind === "sticky" ? 12 : void 0
			}, ...current];
		});
		setText("");
		if (kind === "reminder") setWhen("");
	}
	function pinCompose(pin) {
		const body = stickyText.trim();
		if (!body) return;
		const id = `pin-${Date.now()}`;
		const target = pin.startsWith("lot:") ? `todo:${pin.slice(4)}` : pin;
		setNotes((current) => [{
			id,
			kind: "pin",
			text: body,
			when: "",
			color: stickyColor,
			pin: target
		}, ...current]);
		try {
			const saved = loadBoard().filter((item) => item.id !== id);
			localStorage.setItem(BOARD_KEY, JSON.stringify([{
				id,
				kind: "pin",
				text: body,
				when: "",
				color: stickyColor,
				pin: target
			}, ...saved]));
		} catch {}
		setStickyText("");
		setOpenPin(id);
		rememberPin(id, body, stickyColor, target);
	}
	function rememberPin(id, body, color, target) {
		const lotId = target.startsWith("todo:") ? target.slice(5) : target.startsWith("task:lot-note:") ? target.slice(14) : "";
		if (lotId) {
			const lot = lots.find((item) => item.id === lotId);
			if (lot) onSave({
				...lot,
				stickies: [...lot.stickies ?? [], {
					id,
					text: body,
					color
				}]
			});
		}
		if (target.startsWith("task:")) {
			const taskId = target.slice(5);
			writeTaskSticky(taskId, {
				id,
				text: body,
				color
			});
			const task = biz.find((item) => item.id === taskId);
			if (task && !taskId.startsWith("lot-note:")) {
				const notesText = `${task.notes ? `${task.notes}\n` : ""}[[sticky:${color}|${id}]]${body}`;
				const next = {
					...task,
					notes: notesText
				};
				setBiz((current) => current.map((item) => item.id === taskId ? next : item));
				saveBusinessTask({ data: {
					task: next,
					action: "Updated"
				} }).then((saved) => setBiz((current) => current.map((item) => item.id === saved.id ? saved : item))).catch(() => {});
			}
		}
	}
	function forgetPin(id) {
		setNotes((current) => current.filter((item) => item.id !== id));
		eraseTaskSticky(id);
		const lot = lots.find((item) => item.stickies?.some((sticky) => sticky.id === id));
		if (lot) onSave({
			...lot,
			stickies: (lot.stickies ?? []).filter((sticky) => sticky.id !== id)
		});
		const task = biz.find((item) => item.notes.includes(`|${id}]]`));
		if (task) {
			const notesText = task.notes.split("\n").filter((line) => !line.includes(`|${id}]]`)).join("\n").trim();
			saveBusinessTask({ data: {
				task: {
					...task,
					notes: notesText
				},
				action: "Updated"
			} }).then((saved) => setBiz((current) => current.map((item) => item.id === saved.id ? saved : item))).catch(() => {});
		}
	}
	const todos = (0, import_react.useMemo)(() => buildTodo(lots), [lots]);
	const business = (0, import_react.useMemo)(() => {
		const saved = new Set(biz.map((task) => task.id));
		return [...noteTasksFromLots(lots).filter((task) => !saved.has(task.id)), ...biz].filter((task) => task.status !== "Completed");
	}, [biz, lots]);
	const reminders = notes.filter((note) => note.kind === "reminder").sort((a, b) => a.when.localeCompare(b.when));
	const stickies = notes.filter((note) => note.kind === "sticky");
	const messages = notes.filter((note) => note.kind === "message");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "meeting-board",
		ref: frameRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "meeting-main",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "meeting-tiles",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "meeting-tile bulletin-tile",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Meeting Board" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "meeting-compose",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: composeDrag.current ? "compose-sticky-wrap is-dragging" : "compose-sticky-wrap",
								style: composeDrag.current ? {
									background: stickyColor,
									position: "fixed",
									left: composeDrag.current.x,
									top: composeDrag.current.y,
									width: composeDrag.current.w,
									zIndex: 80,
									pointerEvents: "none"
								} : { background: stickyColor },
								onPointerDown: (event) => {
									if (event.target.closest("button") || !stickyText.trim()) return;
									const rect = event.currentTarget.getBoundingClientRect();
									composeDrag.current = {
										dx: event.clientX - rect.left,
										dy: event.clientY - rect.top,
										x: rect.left,
										y: rect.top,
										w: rect.width,
										sx: event.clientX,
										sy: event.clientY,
										live: false
									};
								},
								onPointerMove: (event) => {
									const active = composeDrag.current;
									if (!active) return;
									if (!active.live) {
										if (Math.hypot(event.clientX - active.sx, event.clientY - active.sy) < 4) return;
										active.live = true;
										event.currentTarget.querySelector("textarea")?.blur();
										event.currentTarget.setPointerCapture(event.pointerId);
									}
									active.x = event.clientX - active.dx;
									active.y = event.clientY - active.dy;
									const hint = dropTarget(document.elementsFromPoint(event.clientX, event.clientY));
									setDropHint((current) => current === hint ? current : hint);
									setDragTick((tick) => tick + 1);
								},
								onPointerUp: (event) => {
									const active = composeDrag.current;
									if (!active) return;
									const pin = active.live ? dropTarget(document.elementsFromPoint(event.clientX, event.clientY)) : "";
									const left = Math.round(active.x);
									const top = Math.round(active.y);
									const body = stickyText.trim();
									composeDrag.current = null;
									setDropHint("");
									setDragTick((tick) => tick + 1);
									if (pin) {
										pinCompose(pin);
										return;
									}
									if (active.live && body) {
										setNotes((current) => [{
											id: `board-${Date.now()}`,
											kind: "sticky",
											text: body,
											when: "",
											color: stickyColor,
											x: left,
											y: top
										}, ...current]);
										setStickyText("");
									}
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "sticky-color",
										style: { background: stickyColor },
										"aria-label": "Choose sticky color",
										"aria-expanded": colorOpen,
										onMouseDown: (event) => event.preventDefault(),
										onClick: () => setColorOpen((open) => !open)
									}),
									colorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sticky-colors",
										children: STICKY_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											style: { background: color },
											"aria-label": `Sticky color ${color}`,
											onMouseDown: (event) => event.preventDefault(),
											onClick: () => {
												setStickyColor(color);
												setColorOpen(false);
											}
										}, color))
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "compose-sticky",
										rows: 3,
										value: stickyText,
										placeholder: "Sticky note",
										onChange: (event) => setStickyText(event.target.value)
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "message-float meeting-tile",
						"data-resize": "messages",
						children: [
							messages.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "message-all",
								onClick: () => setMessagesOpen((open) => !open),
								children: messagesOpen ? "Show latest" : "All messages"
							}) : null,
							messages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "meeting-messages",
								children: (messagesOpen ? messages : messages.slice(0, 2)).map((note, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									"data-message-id": note.id,
									className: dropHint === `message:${note.id}` ? "drop-ready" : "",
									style: { background: note.color || "#fff" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											index === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Latest" }) : index === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Previous" }) : null,
											" ",
											note.text
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinMarks, {
											notes,
											pin: `message:${note.id}`,
											open: openPin,
											onOpen: setOpenPin,
											onRemove: forgetPin
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Remove message",
											onClick: () => setNotes((current) => current.filter((item) => item.id !== note.id)),
											children: "×"
										})
									]
								}, note.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "message-empty",
								children: "No messages yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "message-compose",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										className: "message-write",
										rows: 2,
										value: text,
										placeholder: "Write a message",
										style: { background: messageColor },
										onChange: (event) => setText(event.target.value),
										onKeyDown: (event) => {
											if (event.key === "Enter" && !event.shiftKey) {
												event.preventDefault();
												add("message");
											}
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "sticky-color message-color",
										style: { background: messageColor },
										"aria-label": "Choose message color",
										"aria-expanded": messageColorOpen,
										onMouseDown: (event) => event.preventDefault(),
										onClick: () => setMessageColorOpen((open) => !open)
									}),
									messageColorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sticky-colors message-colors",
										children: STICKY_COLORS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											style: { background: color },
											"aria-label": `Message color ${color}`,
											onMouseDown: (event) => event.preventDefault(),
											onClick: () => {
												setMessageColor(color);
												setMessageColorOpen(false);
											}
										}, color))
									}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mini-list resize-box",
						"data-resize": "tasks",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Business tasks" }), business.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No open tasks." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: business.map((task) => {
							const lotId = task.id.startsWith("lot-note:") ? task.id.slice(9) : "";
							const fromLot = (lots.find((lot) => lot.id === lotId)?.stickies ?? []).map((sticky) => ({
								id: sticky.id,
								kind: "pin",
								text: sticky.text,
								when: "",
								color: sticky.color,
								pin: `task:${task.id}`
							}));
							const fromSaved = (loadTaskStickies()[task.id] ?? []).filter((sticky) => !notes.some((item) => item.id === sticky.id)).map((sticky) => ({
								id: sticky.id,
								kind: "pin",
								text: sticky.text,
								when: "",
								color: sticky.color,
								pin: `task:${task.id}`
							}));
							const pinned = [
								...notes,
								...fromLot,
								...fromSaved
							].filter((note) => note.kind === "pin" && note.pin === `task:${task.id}`);
							const seen = /* @__PURE__ */ new Set();
							const shown = pinned.filter((note) => {
								const key = note.text.trim().toLowerCase();
								if (seen.has(key)) return false;
								seen.add(key);
								return true;
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								"data-task-id": task.id,
								className: dropHint === `task:${task.id}` ? "drop-ready" : "",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: task.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [task.category, task.dueDate ? ` · ${task.dueDate}` : ""] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinMarks, {
										notes: shown,
										pin: `task:${task.id}`,
										open: openPin,
										onOpen: setOpenPin,
										onRemove: forgetPin
									})
								]
							}, task.id);
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mini-list resize-box",
						"data-resize": "todo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "To-Do" }), todos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Nothing open." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: todos.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							"data-todo-id": item.id,
							className: dropHint === `todo:${item.id}` ? "drop-ready" : "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onOpen(item.id),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["Lot ", item.lot] }),
									" ",
									item.name || "—",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.notes || item.text || "No notes" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinMarks, {
								notes: [...notes.map((note) => note.pin === `lot:${item.id}` ? {
									...note,
									pin: `todo:${item.id}`
								} : note), ...(lots.find((lot) => lot.id === item.id)?.stickies ?? []).filter((sticky) => !notes.some((note) => note.id === sticky.id)).map((sticky) => ({
									id: sticky.id,
									kind: "pin",
									text: sticky.text,
									when: "",
									color: sticky.color,
									pin: `todo:${item.id}`
								}))],
								pin: `todo:${item.id}`,
								open: openPin,
								onOpen: setOpenPin,
								onRemove: forgetPin
							})]
						}, item.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mini-calendar resize-box",
						"data-resize": "calendar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessCalendar, {
							mini: true,
							dropDate: dropHint.startsWith("date:") ? dropHint.slice(5) : "",
							pins: notes.filter((note) => note.kind === "pin" && note.pin?.startsWith("date:")),
							openPin,
							onPin: setOpenPin,
							bills,
							tasks: [...business, ...reminders.map((note) => ({
								id: note.id,
								title: note.text,
								category: "Other",
								dueDate: note.when,
								followUp: "",
								status: "Open",
								owner: "",
								cost: "",
								reference: "",
								notes: note.text
							}))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mini-finance resize-box",
						"data-resize": "finance",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Financial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeatBoard, {
							lots,
							scoped: lots,
							selected: null,
							onOpen,
							mini: true
						})]
					})
				]
			}), reminders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Reminders" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "meeting-reminders",
				children: reminders.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: note.when < dayStamp() ? "is-due" : "",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: formatTodoDate(note.when) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.text }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Remove reminder",
							onClick: () => setNotes((current) => current.filter((item) => item.id !== note.id)),
							children: "×"
						})
					]
				}, note.id))
			})] }) : null]
		}), stickies.map((note) => {
			const live = drag.current?.id === note.id;
			const spot = live ? {
				x: drag.current.x,
				y: drag.current.y
			} : {
				x: note.x ?? 40,
				y: note.y ?? 80
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: dragging === note.id ? "sticky is-dragging" : "sticky",
				style: {
					background: note.color,
					position: "fixed",
					left: spot.x,
					top: spot.y,
					zIndex: live ? 80 : 30,
					pointerEvents: live ? "none" : "auto"
				},
				onPointerDown: (event) => {
					if (event.target.closest("button")) return;
					const rect = event.currentTarget.getBoundingClientRect();
					drag.current = {
						id: note.id,
						dx: event.clientX - rect.left,
						dy: event.clientY - rect.top,
						x: rect.left,
						y: rect.top,
						homeX: rect.left,
						homeY: rect.top
					};
					setDragging(note.id);
					event.currentTarget.setPointerCapture(event.pointerId);
				},
				onPointerMove: (event) => {
					const active = drag.current;
					if (!active || active.id !== note.id) return;
					active.x = event.clientX - active.dx;
					active.y = event.clientY - active.dy;
					const hint = dropTarget(document.elementsFromPoint(event.clientX, event.clientY));
					setDropHint((current) => current === hint ? current : hint);
					setDragTick((tick) => tick + 1);
				},
				onPointerUp: (event) => {
					const active = drag.current;
					if (!active || active.id !== note.id) return;
					const pin = dropTarget(document.elementsFromPoint(event.clientX, event.clientY));
					const left = Math.round(active.x);
					const top = Math.round(active.y);
					drag.current = null;
					setDragging("");
					setDropHint("");
					if (pin) {
						const target = pin.startsWith("lot:") ? `todo:${pin.slice(4)}` : pin;
						rememberPin(note.id, note.text, note.color, target);
						setNotes((current) => current.map((item) => item.id === note.id ? {
							...item,
							kind: "pin",
							pin: target,
							x: void 0,
							y: void 0
						} : item));
						setOpenPin(note.id);
						return;
					}
					setNotes((current) => current.map((item) => item.id === note.id ? {
						...item,
						x: left,
						y: top
					} : item));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Remove sticky",
					onClick: () => setNotes((current) => current.filter((item) => item.id !== note.id)),
					children: "×"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: note.text })]
			}, note.id);
		})]
	});
}
var BILLS_KEY = "magnolia-park-bills";
var BILL_ROWS = [
	{
		id: "taxes",
		name: "Taxes"
	},
	{
		id: "electric",
		name: "Electric"
	},
	{
		id: "power",
		name: "Power"
	},
	{
		id: "water",
		name: "Water"
	},
	{
		id: "garbage",
		name: "Garbage"
	},
	{
		id: "utilities",
		name: "Pay utilities"
	},
	{
		id: "cards",
		name: "Credit cards"
	},
	{
		id: "wiring",
		name: "Wiring insurance"
	}
];
function moneyNumber(value) {
	const n = Number(String(value).replace(/[$,\s]/g, ""));
	return Number.isFinite(n) ? n : 0;
}
function billTone(days) {
	if (days === null) return "";
	if (days > 15) return "bill-green";
	if (days > 0) return "bill-orange";
	return "bill-red";
}
function billDueLabel(days) {
	if (days === null) return "Set a due date";
	if (days > 1) return `Due in ${days} days`;
	if (days === 1) return "Due in 1 day";
	if (days === 0) return "Due today";
	return `${Math.abs(days)} days past due`;
}
function BillsBoard({ onChange, children }) {
	const [bills, setBills] = (0, import_react.useState)(() => BILL_ROWS.map((row) => ({
		...row,
		amount: "",
		due: ""
	})));
	const [ready, setReady] = (0, import_react.useState)(false);
	const edited = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		readMaster().then((book) => {
			if (cancel || edited.current) return;
			const saved = Array.isArray(book?.bills) ? book.bills : null;
			const local = (() => {
				try {
					return JSON.parse(localStorage.getItem(BILLS_KEY) ?? "[]");
				} catch {
					return [];
				}
			})();
			const source = saved?.some((item) => item.amount || item.due) ? saved : local;
			if (source.length) setBills(BILL_ROWS.map((row) => {
				const found = source.find((item) => item.id === row.id);
				return {
					...row,
					amount: found?.amount ?? "",
					due: found?.due ?? ""
				};
			}));
		}).catch(() => {}).finally(() => {
			if (!cancel) setReady(true);
		});
		return () => {
			cancel = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
		} catch {}
		const timer = window.setTimeout(() => {
			onChange?.(bills);
			saveBills({ data: { bills } }).catch(() => {});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [
		bills,
		ready,
		onChange
	]);
	function update(id, patch) {
		edited.current = true;
		setBills((rows) => rows.map((row) => row.id === id ? {
			...row,
			...patch
		} : row));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bills-board",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bill-list",
			children: bills.map((bill) => {
				const days = businessDays(bill.due);
				const tone = billTone(days);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bill-row " + tone,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: bill.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Amount", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							value: bill.amount,
							placeholder: "0",
							onChange: (event) => update(bill.id, { amount: event.target.value })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Due date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: bill.due,
							onChange: (event) => update(bill.id, { due: event.target.value })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "bill-days " + tone,
							children: billDueLabel(days)
						})
					]
				}, bill.id);
			})
		})]
	});
}
function calendarStamp(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function calendarDays(cursor) {
	const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
	const start = new Date(first);
	start.setDate(1 - first.getDay());
	return Array.from({ length: 42 }, (_, index) => {
		const day = new Date(start);
		day.setDate(start.getDate() + index);
		return day;
	});
}
function icsText(value) {
	return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function nextDate(stamp) {
	const day = /* @__PURE__ */ new Date(stamp + "T00:00:00");
	day.setDate(day.getDate() + 1);
	return calendarStamp(day).replace(/-/g, "");
}
function BusinessCalendar({ tasks, bills, mini = false, dropDate = "", pins = [], openPin = "", onPin }) {
	const [cursor, setCursor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [note, setNote] = (0, import_react.useState)("");
	const items = (0, import_react.useMemo)(() => {
		const rows = [];
		for (const task of tasks) {
			if (task.status === "Completed") continue;
			if (task.dueDate) rows.push({
				date: task.dueDate,
				title: task.title || "Task due",
				kind: "due"
			});
			if (task.followUp) rows.push({
				date: task.followUp,
				title: `${task.title || "Task"} follow-up`,
				kind: "follow"
			});
		}
		for (const bill of bills) if (bill.due) rows.push({
			date: bill.due,
			title: `${bill.name} bill`,
			kind: "bill"
		});
		return rows;
	}, [tasks, bills]);
	const days = calendarDays(cursor);
	const today = calendarStamp(/* @__PURE__ */ new Date());
	const monthLabel = cursor.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	});
	function syncGoogle() {
		const lines = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Magnolia Estates//Business Center//EN",
			"CALSCALE:GREGORIAN",
			"METHOD:PUBLISH"
		];
		items.forEach((item, index) => {
			const start = item.date.replace(/-/g, "");
			lines.push("BEGIN:VEVENT", `UID:magnolia-${item.kind}-${start}-${index}@magnolia`, `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${nextDate(item.date)}`, `SUMMARY:${icsText(item.title)}`, "END:VEVENT");
		});
		lines.push("END:VCALENDAR");
		const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = "magnolia-business.ics";
		link.click();
		URL.revokeObjectURL(url);
		window.open("https://calendar.google.com/calendar/u/0/r/settings/export", "_blank", "noopener,noreferrer");
		setNote(items.length ? `Downloaded ${items.length} date${items.length === 1 ? "" : "s"}. In the Google Calendar tab, choose Import and pick magnolia-business.ics.` : "Add a due date first, then sync.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: mini ? "park-calendar is-mini" : "park-calendar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "park-calendar-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [mini ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "CALENDAR"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: monthLabel })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "park-calendar-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "business-secondary",
							onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)),
							"aria-label": "Previous month",
							children: "‹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "business-secondary",
							onClick: () => setCursor(/* @__PURE__ */ new Date()),
							children: "Today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "business-secondary",
							onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)),
							"aria-label": "Next month",
							children: "›"
						}),
						mini ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "business-primary",
							onClick: syncGoogle,
							children: "Sync Google Calendar"
						})
					]
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "park-calendar-note",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "park-calendar-week",
				children: [
					"Sun",
					"Mon",
					"Tue",
					"Wed",
					"Thu",
					"Fri",
					"Sat"
				].map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day }, day))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "park-calendar-grid",
				children: days.map((day) => {
					const stamp = calendarStamp(day);
					const here = items.filter((item) => item.date === stamp);
					const outside = day.getMonth() !== cursor.getMonth();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-date": stamp,
						className: "park-day" + (outside ? " is-outside" : "") + (stamp === today ? " is-today" : "") + (dropDate === stamp ? " drop-ready" : ""),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: day.getDate() }),
							pins.filter((note) => note.pin === `date:${stamp}`).map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "pin-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "pin-mark",
									style: { background: note.color || "#ffe56a" },
									"aria-label": "Open sticky note",
									onClick: () => onPin?.(openPin === note.id ? "" : note.id)
								}), openPin === note.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pin-pop",
									role: "note",
									children: note.text
								}) : null]
							}, note.id)),
							here.slice(0, mini ? 1 : 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "cal-" + item.kind,
								children: item.title
							}, item.kind + item.title)),
							here.length > (mini ? 1 : 3) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", {
								className: "cal-more",
								children: ["+", here.length - (mini ? 1 : 3)]
							}) : null
						]
					}, stamp + (outside ? "-x" : ""));
				})
			})
		]
	});
}
function Home() {
	const uploadRef = (0, import_react.useRef)(null);
	const backupRef = (0, import_react.useRef)(null);
	const quickBooksRef = (0, import_react.useRef)(null);
	const [sheet, setSheet] = (0, import_react.useState)(1);
	const [main, setMain] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)("1");
	const [view, setView] = (0, import_react.useState)(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "heat" ? "heat" : "map");
	const [registerMode, setRegisterMode] = (0, import_react.useState)("short");
	const [matchAt, setMatchAt] = (0, import_react.useState)(0);
	const [legendOn, setLegendOn] = (0, import_react.useState)(true);
	const [symbols, setSymbols] = (0, import_react.useState)(false);
	const [device, setDevice] = (0, import_react.useState)(null);
	const [deviceUrl, setDeviceUrl] = (0, import_react.useState)("");
	const [alarmOn, setAlarmOn] = (0, import_react.useState)(false);
	const [mapsOpen, setMapsOpen] = (0, import_react.useState)(false);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [dataOpen, setDataOpen] = (0, import_react.useState)(false);
	const [versions, setVersions] = (0, import_react.useState)(null);
	const [qbNote, setQbNote] = (0, import_react.useState)("");
	const [lots, setLots] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const hydratedRef = (0, import_react.useRef)(false);
	const dirtyRef = (0, import_react.useRef)(false);
	const masterReady = (0, import_react.useRef)(false);
	const mapReady = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(MAP_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (saved.sheet === 1 || saved.sheet === 2 || saved.sheet === 3) setSheet(saved.sheet);
				if (typeof saved.main === "boolean") setMain(saved.main);
			}
		} catch {}
		mapReady.current = true;
		try {
			setDeviceUrl(localStorage.getItem(CAMERA_KEY) ?? "");
			setAlarmOn(localStorage.getItem(ALARM_ON_KEY) === "Yes");
		} catch {}
	}, []);
	function openDevice(kind) {
		let stored = "";
		try {
			stored = localStorage.getItem(DEVICE_LINKS[kind].key) ?? "";
		} catch {
			stored = "";
		}
		setDeviceUrl(stored);
		setDevice(kind);
	}
	(0, import_react.useEffect)(() => {
		if (!mapReady.current) return;
		localStorage.setItem(MAP_KEY, JSON.stringify({
			main,
			sheet
		}));
	}, [main, sheet]);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		(async () => {
			const local = loadLots();
			let next = local;
			try {
				const master = await readMaster();
				let localAt = "";
				try {
					localAt = localStorage.getItem(STORAGE_AT) ?? "";
				} catch {
					localAt = "";
				}
				if (master?.lots?.length && localAt && master.saved && localAt > master.saved) {
					const byId = new Map(master.lots.map((lot) => [lot.id, lot]));
					next = local.map((lot) => withEmptyMow({
						...byId.get(lot.id) ?? {},
						...lot,
						id: lot.id
					}));
				} else if (master?.lots?.length) next = master.lots.map((lot) => withEmptyMow(lot));
				else await writeMaster({ data: {
					saved: (/* @__PURE__ */ new Date()).toISOString(),
					lots: local
				} });
			} catch {}
			if (cancel) return;
			setLots(next);
			rememberLots(next);
			masterReady.current = true;
			hydratedRef.current = true;
			setHydrated(true);
		})();
		return () => {
			cancel = true;
		};
	}, []);
	const lotsRef = (0, import_react.useRef)(lots);
	lotsRef.current = lots;
	(0, import_react.useEffect)(() => {
		if (!hydrated || !masterReady.current) return;
		const id = window.setTimeout(() => {
			rememberLots(lotsRef.current);
			queueMaster(lotsRef.current);
		}, 300);
		return () => window.clearTimeout(id);
	}, [lots, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated || !masterReady.current) return;
		const flush = () => {
			rememberLots(lotsRef.current);
			writeMaster({ data: {
				saved: (/* @__PURE__ */ new Date()).toISOString(),
				lots: lotsRef.current
			} }).catch(() => {});
		};
		window.addEventListener("pagehide", flush);
		return () => window.removeEventListener("pagehide", flush);
	}, [hydrated]);
	function saveLot(next) {
		const prevLot = lotsRef.current.find((item) => item.id === next.id);
		const parkRate = lotsRef.current.find((item) => item.status === "Occupied" && (item.lotRent ?? "").trim())?.lotRent?.trim() || "540";
		const draft = next.status === "Occupied" && !(next.lotRent ?? "").trim() ? {
			...next,
			lotRent: parkRate
		} : next;
		const lotRentChanged = Boolean(prevLot && (prevLot.lotRent ?? "").trim() && draft.status === "Occupied" && (prevLot.lotRent ?? "") !== (draft.lotRent ?? ""));
		const edited = withEmptyMow(Boolean(prevLot && prevLot.rent !== draft.rent && (prevLot.homeRent ?? "") === (draft.homeRent ?? "") && !lotRentChanged) ? {
			...draft,
			homeRent: rentGap(draft.rent, draft.lotRent ?? "", petFee(draft.dogs, draft.cats))
		} : draft);
		dirtyRef.current = true;
		setLots((prev) => {
			const nextLots = prev.map((item) => {
				if (lotRentChanged && item.status === "Occupied") return withEmptyMow({
					...item,
					...item.id === edited.id ? edited : {},
					lotRent: edited.lotRent ?? ""
				});
				return item.id === edited.id ? edited : item;
			});
			lotsRef.current = nextLots;
			if (hydratedRef.current) {
				rememberLots(nextLots);
				queueMaster(nextLots);
			}
			return nextLots;
		});
	}
	const visible = (0, import_react.useMemo)(() => {
		return lots.filter((lot) => (filter.length === 0 || filter.some((item) => matchesFilter(lot, item))) && matches(lot, query));
	}, [
		lots,
		filter,
		query
	]);
	const sig = `${filter.join(",")}|${query}`;
	const prevSig = (0, import_react.useRef)(sig);
	(0, import_react.useEffect)(() => {
		if (prevSig.current === sig) return;
		prevSig.current = sig;
		if (!query.trim() && filter.length === 0) return;
		if (visible.length === 0) return;
		setMatchAt(0);
		const target = visible[0];
		setSelected(target.id);
		const next = sheetOf(target.id);
		if (next) {
			setSheet(next);
			setView("map");
			setMain(false);
		} else {
			setView("register");
			setRegisterMode((mode) => mode === "homes" ? "short" : mode);
		}
	}, [
		sig,
		query,
		filter,
		visible
	]);
	function choose(id) {
		setSelected(id);
		const index = visible.findIndex((item) => item.id === id);
		if (index >= 0) setMatchAt(index);
	}
	function openLot(id) {
		choose(id);
		const next = sheetOf(id);
		if (next) {
			setSheet(next);
			setMain(false);
		}
	}
	function showMatch(index) {
		if (visible.length === 0) return;
		const at = (index % visible.length + visible.length) % visible.length;
		setMatchAt(at);
		const target = visible[at];
		setSelected(target.id);
		const next = sheetOf(target.id);
		if (next) {
			setSheet(next);
			setView("map");
			setMain(false);
		} else setView("register");
	}
	const visibleIds = (0, import_react.useMemo)(() => new Set(visible.map((lot) => lot.id)), [visible]);
	const lot = lots.find((item) => item.id === selected) ?? null;
	const empty = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (item.status === "Empty" ? 1 : 0), 0), [lots]);
	const occupied = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (item.status === "Occupied" ? 1 : 0), 0), [lots]);
	const pastDue = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (matchesFilter(item, "past-due") ? 1 : 0), 0), [lots]);
	const notes = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (item.issues.trim() ? 1 : 0), 0), [lots]);
	const mapLabel = main ? "Main" : SHEET_COPY[sheet].title;
	const filterNames = [
		["empty", "Empty"],
		["occupied", "Occupied"],
		["issues", "Issues"],
		["renters", "Renters"],
		["owners", "Owners"],
		["no-owe", "NO-OWE"],
		["due", "Due"],
		["past-due", "Past due"],
		["roof", "Needs roof"],
		["pets", "Pets"],
		["wiring", "Wiring"],
		["lease-ending", "Lease ending"]
	];
	const filterLabel = filter.length === 0 ? "" : filter.length === 1 ? filterNames.find(([id]) => id === filter[0])?.[1] ?? "" : `${filter.length} on`;
	const narrowed = query.trim() !== "" || filter.length > 0;
	(0, import_react.useEffect)(() => {
		if (!mapsOpen && !filtersOpen && !dataOpen) return;
		const close = (e) => {
			if (e.target?.closest(".map-slot")) return;
			setMapsOpen(false);
			setFiltersOpen(false);
			setDataOpen(false);
		};
		const onKey = (e) => {
			if (e.key === "Escape") {
				setMapsOpen(false);
				setFiltersOpen(false);
				setDataOpen(false);
			}
		};
		window.addEventListener("mousedown", close);
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("mousedown", close);
			window.removeEventListener("keydown", onKey);
		};
	}, [
		mapsOpen,
		filtersOpen,
		dataOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "app",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "icon-defs",
				width: "0",
				height: "0",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
					id: "maintStripes",
					width: "8",
					height: "8",
					patternUnits: "userSpaceOnUse",
					patternTransform: "rotate(45)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "8",
						height: "8",
						fill: "#fff200"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "8",
						stroke: "#000",
						strokeWidth: "2"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
					id: "roofStripes",
					width: "8",
					height: "8",
					patternUnits: "userSpaceOnUse",
					patternTransform: "rotate(45)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "8",
						height: "8",
						fill: "#2f6bff"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "8",
						stroke: "#fff",
						strokeWidth: "2"
					})]
				})] })
			}),
			device ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "camera-panel",
				onSubmit: (e) => {
					e.preventDefault();
					const url = deviceUrl.trim();
					const key = DEVICE_LINKS[device].key;
					try {
						localStorage.setItem(key, url);
					} catch {}
					if (url) window.open(url, "_blank", "noopener,noreferrer");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: DEVICE_LINKS[device].title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [DEVICE_LINKS[device].label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: deviceUrl,
						placeholder: DEVICE_LINKS[device].placeholder,
						onChange: (e) => {
							setDeviceUrl(e.target.value);
							try {
								localStorage.setItem(DEVICE_LINKS[device].key, e.target.value);
							} catch {}
						}
					})] }),
					device === "alarm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "alarm-switch",
						role: "group",
						"aria-label": "Alarm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": alarmOn,
							onClick: () => {
								setAlarmOn(true);
								try {
									localStorage.setItem(ALARM_ON_KEY, "Yes");
								} catch {}
							},
							children: "On"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": !alarmOn,
							onClick: () => {
								setAlarmOn(false);
								try {
									localStorage.setItem(ALARM_ON_KEY, "No");
								} catch {}
							},
							children: "Off"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "camera-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "submit",
							children: "Open"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => setDevice(null),
							children: "Close"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Magnolia Central of Florida Estates" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "stats",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "stat-chip",
								onClick: () => {
									setFilter([]);
									setView("map");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: lots.length }), " lots"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "stat-chip",
								onClick: () => {
									setFilter(["occupied"]);
									setView("map");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: occupied }), " occupied"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "stat-chip",
								onClick: () => {
									setFilter(["empty"]);
									setView("map");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: empty }), " empty"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "stat-chip",
								onClick: () => {
									setFilter(["issues"]);
									setView("map");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: notes }), " notes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "stat-chip",
								onClick: () => {
									setFilter(["past-due"]);
									setView("map");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: pastDue }), " past due"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "search",
					value: query,
					placeholder: "Lot, name, or address",
					"aria-label": "Search lots",
					onChange: (e) => setQuery(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toolbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tabs",
						role: "tablist",
						"aria-label": "Sections",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "map-attach",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "map-slot",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "tab",
										type: "button",
										role: "tab",
										"aria-expanded": mapsOpen,
										"aria-pressed": view === "map",
										onClick: () => {
											if (view === "map") setMapsOpen((open) => !open);
											else {
												setView("map");
												setMapsOpen(true);
											}
											setFiltersOpen(false);
										},
										children: [
											"Maps · ",
											mapLabel,
											" ▾"
										]
									}), mapsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "map-drop",
										role: "menu",
										children: [
											["main", "Main"],
											["1", "Jaleen/Denise"],
											["2", "Denise/Leon"],
											["3", "Michelle/Kirkwood"]
										].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											role: "menuitemradio",
											"aria-checked": id === "main" ? main : !main && String(sheet) === id,
											onClick: () => {
												setView("map");
												if (id === "main") setMain(true);
												else {
													setMain(false);
													setSheet(Number(id));
												}
												setMapsOpen(false);
											},
											children: label
										}, id))
									}) : null]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "map-slot",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "tab",
										type: "button",
										role: "tab",
										"aria-expanded": filtersOpen,
										"aria-pressed": filtersOpen || filter.length > 0,
										onClick: () => {
											setMapsOpen(false);
											if (view !== "map") {
												setView("map");
												setFiltersOpen(true);
											} else setFiltersOpen((open) => !open);
										},
										children: filter.length === 0 ? "Filters ▾" : `Filters · ${filterLabel} ▾`
									}), filtersOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "map-drop filter-checks",
										role: "group",
										"aria-label": "Map filters",
										children: filterNames.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: filter.includes(id),
											onChange: () => {
												setFilter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
												setView("map");
											}
										}), label] }, id))
									}) : null]
								})]
							}),
							[
								["todo", "To-Do"],
								["mow", "Mow"],
								["meeting", "Meeting"],
								["business", "Business"],
								["heat", "Financial"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tab",
								type: "button",
								role: "tab",
								"aria-pressed": view === id,
								onClick: () => {
									setMapsOpen(false);
									setFiltersOpen(false);
									setDataOpen(false);
									setView(id);
								},
								children: label
							}, id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "tab tab-end",
								type: "button",
								role: "tab",
								"aria-pressed": view === "register",
								onClick: () => {
									setMapsOpen(false);
									setFiltersOpen(false);
									setDataOpen(false);
									setView("register");
								},
								children: "Register"
							})
						]
					}),
					narrowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "active-strip",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Showing ",
								visible.length,
								" of ",
								lots.length,
								filter.length ? ` · ${filterLabel}` : "",
								query.trim() ? ` · “${query.trim()}”` : ""
							] }),
							visible.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "match-nav",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Previous match",
										onClick: () => showMatch(matchAt - 1),
										children: "‹"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										Math.min(matchAt, visible.length - 1) + 1,
										" of ",
										visible.length
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Next match",
										onClick: () => showMatch(matchAt + 1),
										children: "›"
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "strip-clear",
								type: "button",
								onClick: () => {
									setFilter([]);
									setQuery("");
								},
								children: "Clear"
							})
						]
					}) : null,
					view === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "data-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "seg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "filter",
										type: "button",
										"aria-pressed": registerMode === "short",
										onClick: () => setRegisterMode("short"),
										children: "Short"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "filter",
										type: "button",
										"aria-pressed": registerMode === "full",
										onClick: () => setRegisterMode("full"),
										children: "Full"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "filter",
										type: "button",
										"aria-pressed": registerMode === "homes",
										onClick: () => setRegisterMode("homes"),
										children: "Homes"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "map-slot",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "filter",
									type: "button",
									"aria-expanded": dataOpen,
									onClick: () => setDataOpen((open) => !open),
									children: "Data ▾"
								}), dataOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "map-drop data-drop",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												downloadRegister(lots);
												setDataOpen(false);
											},
											children: "Download register"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												uploadRef.current?.click();
												setDataOpen(false);
											},
											children: "Upload register"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												downloadEverything(lots);
												setDataOpen(false);
											},
											children: "Download everything"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												backupRef.current?.click();
												setDataOpen(false);
											},
											children: "Upload everything"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												quickBooksRef.current?.click();
												setDataOpen(false);
											},
											children: "Import from QuickBooks"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												if (versions) {
													setVersions(null);
													return;
												}
												listVersions().then((list) => setVersions(list)).catch(() => setVersions([]));
											},
											children: "Restore version"
										}),
										versions ? versions.length ? versions.map((version) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												restoreVersion({ data: { id: version.id } }).then((book) => {
													const next = book.lots.map((lot) => withEmptyMow(lot));
													setLots(next);
													rememberLots(next);
													setVersions(null);
													setDataOpen(false);
													setQbNote(`Restored ${new Date(version.saved).toLocaleString("en-US", {
														month: "short",
														day: "numeric",
														hour: "numeric",
														minute: "2-digit"
													})}.`);
												}).catch(() => setQbNote("That version could not be restored."));
											},
											children: [
												new Date(version.saved).toLocaleString("en-US", {
													month: "short",
													day: "numeric",
													hour: "numeric",
													minute: "2-digit"
												}),
												" · ",
												version.count,
												" lots"
											]
										}, version.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: true,
											children: "No archived versions"
										}) : null
									]
								}) : null]
							}),
							qbNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "qb-note",
								children: qbNote
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: backupRef,
						hidden: true,
						type: "file",
						accept: ".json,application/json",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							const text = await file.text();
							try {
								setLots((prev) => importEverything(text, prev).map(withEmptyMow));
							} catch {
								setQbNote("That backup could not be read. Use a file from Download everything.");
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: uploadRef,
						hidden: true,
						type: "file",
						accept: ".csv,text/csv",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							const text = await file.text();
							setLots((prev) => importRegister(text, prev).map(withEmptyMow));
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: quickBooksRef,
						hidden: true,
						type: "file",
						accept: ".iif,.csv,.txt,text/plain,text/csv",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							const result = importFromQuickBooks(await file.text(), lots);
							setLots(result.lots.map(withEmptyMow));
							setQbNote(result.updated ? `QuickBooks updated ${result.updated} lot${result.updated === 1 ? "" : "s"}${result.missed ? `. ${result.missed} names did not match a lot` : ""}.` : result.missed ? "No lots matched. In QuickBooks 2020 use File, Utilities, Export, Lists to IIF Files, and put the lot number in the customer name." : "That file did not have any customer rows.");
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: view === "meeting" || view === "business" ? "stage stage-full" : "stage",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "map-frame",
					children: [
						view === "map" && legendOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "legend",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch" }), " Occupied"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch empty" }), " Empty"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch open" }), " Office"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch notes" }), " Issues"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "swatch mow-flag",
									"aria-hidden": "true"
								}), " Mow"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch late" }), " Late rent"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch leak" }), " Leak"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch roof" }), " Needs roof"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch maint" }), " Maintenance"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch eviction" }), " Eviction"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "legend-hide",
									type: "button",
									"aria-pressed": symbols,
									onClick: () => setSymbols((on) => !on),
									children: "Symbols"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "legend-hide legend-arrow",
									type: "button",
									"aria-label": "Hide legend",
									onClick: () => setLegendOn(false),
									children: "↑"
								})
							]
						}) : view === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "legend",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "legend-show legend-arrow",
								type: "button",
								"aria-label": "Show legend",
								onClick: () => setLegendOn(true),
								children: "↓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "legend-show",
								type: "button",
								"aria-pressed": symbols,
								onClick: () => setSymbols((on) => !on),
								children: "Symbols"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "map-scroll",
							children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "qb-note",
								children: "Loading saved lots…"
							}) : view === "todo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoBoard, {
								lots,
								onOpen: (id) => openLot(id)
							}) : view === "mow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MowBoard, {
								lots,
								onOpen: openLot
							}) : view === "increase" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncreaseBoard, {
								lots,
								onOpen: openLot
							}) : view === "alert" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertBoard, {
								lots,
								onOpen: openLot
							}) : view === "heat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeatBoard, {
								lots,
								scoped: visible,
								selected,
								onOpen: openLot
							}) : view === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BusinessBoard, { lots }) : view === "meeting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeetingBoard, {
								lots,
								onOpen: openLot,
								onSave: saveLot
							}) : view === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterTable, {
								lots: registerMode === "short" ? [...lots].sort(byStreetAddress) : lots,
								columns: registerMode === "homes" ? HOME_COLUMNS : registerMode === "full" ? REGISTER_COLUMNS : SHORT_COLUMNS,
								visibleIds,
								selected,
								onChoose: choose,
								onSave: saveLot
							}) : main ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "map-stack",
								children: [
									1,
									2,
									3
								].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									id: `map-${id}`,
									className: "map-block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "map-head",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: SHEET_COPY[id].title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "print-map",
											type: "button",
											onClick: () => printMap(id),
											children: "Print map"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatMap, {
										sheet: id,
										query,
										filter,
										selected,
										lots,
										symbols,
										onSelect: choose,
										onCamera: () => openDevice("office"),
										onPlantCamera: () => openDevice("plant"),
										onAlarm: () => openDevice("alarm"),
										alarmOn
									})]
								}, id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "map-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: SHEET_COPY[sheet].title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "print-map",
										type: "button",
										onClick: () => printMap(sheet),
										children: "Print map"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "map-stage",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "map-scaler",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatMap, {
											sheet,
											query,
											filter,
											selected,
											lots,
											symbols,
											onSelect: choose,
											onCamera: () => openDevice("office"),
											onPlantCamera: () => openDevice("plant"),
											onAlarm: () => openDevice("alarm"),
											alarmOn
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "map-nav prev",
									type: "button",
									"aria-label": "Previous map",
									onClick: () => setSheet(sheet === 1 ? 3 : sheet - 1),
									children: "‹"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "map-nav next",
									type: "button",
									"aria-label": "Next map",
									onClick: () => setSheet(sheet === 3 ? 1 : sheet + 1),
									children: "›"
								})
							] })
						}),
						view === "map" && main ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "map-nav prev",
							type: "button",
							"aria-label": "Previous map",
							onClick: () => {
								setMain(false);
								setSheet(3);
							},
							children: "‹"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "map-nav next",
							type: "button",
							"aria-label": "Next map",
							onClick: () => {
								setMain(false);
								setSheet(1);
							},
							children: "›"
						})] }) : null
					]
				}), view === "meeting" || view === "business" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotPanel, {
					lot,
					lots,
					onSave: saveLot,
					onOpen: openLot,
					onRentRoll: () => {
						setMapsOpen(false);
						setFiltersOpen(false);
						setDataOpen(false);
						setView("increase");
					},
					onAlert: () => {
						setMapsOpen(false);
						setFiltersOpen(false);
						setDataOpen(false);
						setView("alert");
					}
				})]
			})
		]
	});
}
var REGISTER_COLUMNS = [
	{
		label: "Lot",
		kind: "field",
		field: "lot"
	},
	{
		label: "Address",
		kind: "field",
		field: "address"
	},
	{
		label: "Street",
		kind: "field",
		field: "street"
	},
	{
		label: "Name(s)",
		kind: "field",
		field: "name"
	},
	{
		label: "First name",
		kind: "first"
	},
	{
		label: "Last name",
		kind: "last"
	},
	{
		label: "Issues",
		kind: "field",
		field: "issues"
	},
	{
		label: "Status",
		kind: "status"
	},
	{
		label: "Maintenance",
		kind: "field",
		field: "maintenance"
	},
	{
		label: "Renter/Owner",
		kind: "field",
		field: "renter"
	},
	{
		label: "Rental Amount",
		kind: "field",
		field: "rent"
	},
	{
		label: "Lot rent",
		kind: "field",
		field: "lotRent"
	},
	{
		label: "Home rent",
		kind: "field",
		field: "homeRent"
	},
	{
		label: "08/2026",
		kind: "field",
		field: "rentInc2026"
	},
	{
		label: "08/2027",
		kind: "field",
		field: "rentInc2027"
	},
	{
		label: "Move-in",
		kind: "field",
		field: "moveIn"
	},
	{
		label: "Rent due",
		kind: "field",
		field: "rentDue"
	},
	{
		label: "Deposit",
		kind: "field",
		field: "deposit"
	},
	{
		label: "Balance",
		kind: "field",
		field: "balance"
	},
	{
		label: "Notice date",
		kind: "field",
		field: "noticeDate"
	},
	{
		label: "Notice note",
		kind: "field",
		field: "noticeNote"
	},
	{
		label: "Lease end",
		kind: "field",
		field: "leaseEnd"
	},
	{
		label: "Emergency name",
		kind: "field",
		field: "emergencyName"
	},
	{
		label: "Emergency phone",
		kind: "field",
		field: "emergencyPhone"
	},
	{
		label: "Court date",
		kind: "field",
		field: "courtDate"
	},
	{
		label: "Court note",
		kind: "field",
		field: "courtNote"
	},
	{
		label: "Waiting name",
		kind: "field",
		field: "waitName"
	},
	{
		label: "Waiting phone",
		kind: "field",
		field: "waitPhone"
	},
	{
		label: "Key",
		kind: "field",
		field: "key"
	},
	{
		label: "Phone Number",
		kind: "field",
		field: "phone"
	},
	{
		label: "Email",
		kind: "field",
		field: "email"
	},
	{
		label: "MOW",
		kind: "mow"
	},
	{
		label: "Late Rent",
		kind: "field",
		field: "lateRent"
	},
	{
		label: "Bounced Check",
		kind: "field",
		field: "bouncedCheck"
	},
	{
		label: "Guest",
		kind: "field",
		field: "guest"
	},
	{
		label: "Vehicle",
		kind: "field",
		field: "vehicle"
	},
	{
		label: "A/C Filter",
		kind: "field",
		field: "acFilter"
	},
	{
		label: "A/C Cleaning",
		kind: "field",
		field: "acCleaning"
	},
	{
		label: "A/C Service",
		kind: "field",
		field: "acService"
	},
	{
		label: "Roof age",
		kind: "field",
		field: "roofAge"
	},
	{
		label: "Roof material",
		kind: "field",
		field: "roofMaterial"
	},
	{
		label: "Roof installed",
		kind: "field",
		field: "roofInstalled"
	},
	{
		label: "Roof needs replaced",
		kind: "roofReplace"
	},
	{
		label: "Exterior Pressure Wash",
		kind: "field",
		field: "pressureWash"
	},
	{
		label: "Violations",
		kind: "field",
		field: "violations"
	},
	{
		label: "Refrigerator",
		kind: "check",
		field: "fridge"
	},
	{
		label: "Stove",
		kind: "check",
		field: "stove"
	},
	{
		label: "Washer",
		kind: "check",
		field: "washer"
	},
	{
		label: "Dryer",
		kind: "check",
		field: "dryer"
	},
	{
		label: "Microwave",
		kind: "check",
		field: "microwave"
	},
	{
		label: "Dogs",
		kind: "dogs"
	},
	{
		label: "Cats",
		kind: "cats"
	},
	{
		label: "Home wiring insurance",
		kind: "wiring"
	},
	{
		label: "Home insurance",
		kind: "homeIns"
	},
	{
		label: "Yearly insurance cost",
		kind: "insShare"
	},
	{
		label: "Yearly taxes",
		kind: "lotShare"
	},
	{
		label: "Yearly sewer",
		kind: "sewerShare"
	},
	{
		label: "Yearly water",
		kind: "waterShare"
	},
	{
		label: "Yearly garbage",
		kind: "garbageShare"
	},
	{
		label: "Insurance expires",
		kind: "homeInsDate"
	},
	{
		label: "Power on",
		kind: "emptyCheck",
		field: "readyPower"
	},
	{
		label: "Cleaned",
		kind: "emptyCheck",
		field: "readyClean"
	},
	{
		label: "Inspected",
		kind: "emptyCheck",
		field: "readyInspected"
	},
	{
		label: "Listed on Zillow",
		kind: "zillow"
	},
	{
		label: "Zillow link",
		kind: "zillowUrl"
	},
	{
		label: "Year",
		kind: "field",
		field: "homeYear"
	},
	{
		label: "Make",
		kind: "field",
		field: "homeMake"
	},
	{
		label: "Model",
		kind: "field",
		field: "homeModel"
	},
	{
		label: "Width",
		kind: "field",
		field: "homeWidth"
	},
	{
		label: "Length",
		kind: "field",
		field: "homeLength"
	},
	{
		label: "Single or double",
		kind: "homeWide"
	},
	{
		label: "Inspection date",
		kind: "field",
		field: "inspectionDate"
	},
	{
		label: "Inspection notes",
		kind: "field",
		field: "inspectionNotes"
	}
];
var SHORT_COLUMNS = [
	{
		label: "Lot",
		kind: "field",
		field: "lot"
	},
	{
		label: "Address",
		kind: "field",
		field: "address"
	},
	{
		label: "Street",
		kind: "field",
		field: "street"
	},
	{
		label: "Name",
		kind: "field",
		field: "name"
	},
	{
		label: "MOW",
		kind: "mow"
	},
	{
		label: "Rent",
		kind: "field",
		field: "rent"
	},
	{
		label: "Notes",
		kind: "field",
		field: "issues"
	}
];
var HOME_COLUMNS = [
	{
		label: "Lot",
		kind: "field",
		field: "lot"
	},
	{
		label: "Address",
		kind: "field",
		field: "address"
	},
	{
		label: "Street",
		kind: "field",
		field: "street"
	},
	{
		label: "Name(s)",
		kind: "field",
		field: "name"
	},
	{
		label: "Year",
		kind: "field",
		field: "homeYear"
	},
	{
		label: "Make",
		kind: "field",
		field: "homeMake"
	},
	{
		label: "Model",
		kind: "field",
		field: "homeModel"
	},
	{
		label: "Width",
		kind: "field",
		field: "homeWidth"
	},
	{
		label: "Length",
		kind: "field",
		field: "homeLength"
	},
	{
		label: "Single or double",
		kind: "homeWide"
	}
];
function lotCostShares(lots) {
	return splitPool(lots, 3e4);
}
function insuranceShares(lots) {
	return splitPool(lots.filter((lot) => lot.homeIns === "Yes"), 7e3);
}
function splitPool(lots, dollars) {
	const shares = /* @__PURE__ */ new Map();
	if (!lots.length) return shares;
	const cents = dollars * 100;
	const base = Math.floor(cents / lots.length);
	let extra = cents - base * lots.length;
	for (const lot of lots) {
		const share = base + (extra > 0 ? 1 : 0);
		if (extra > 0) extra -= 1;
		shares.set(lot.id, share / 100);
	}
	return shares;
}
function sewerShares(lots) {
	return splitPool(lots, 3e4);
}
function waterShares(lots) {
	return splitPool(lots, 3e4);
}
function garbageShares(lots) {
	return splitPool(lots, 3e4);
}
function registerText(item, col) {
	if (col.kind === "check") {
		const raw = String(item[col.field] ?? "").trim().toLowerCase();
		return raw !== "" && raw !== "no" ? "Yes" : "";
	}
	if (col.kind === "status") return item.status;
	if (col.kind === "mow") return item.noMow === "Yes" || item.noMow === "No" || item.noMow === "Owe" ? item.noMow : "";
	if (col.kind === "first" || col.kind === "last") {
		const parts = nameParts(item.name);
		return col.kind === "first" ? parts.first : parts.last;
	}
	if (col.kind === "dogs" || col.kind === "cats") {
		const value = item[col.kind];
		return value === "1" || value === "2" ? value : "";
	}
	if (col.kind === "homeIns" || col.kind === "homeInsDate") {
		if (!isRenterLot(item)) return "—";
		if (col.kind === "homeInsDate") return item.homeInsDate ?? "";
		return item.homeIns === "Yes" || item.homeIns === "No" ? item.homeIns : "";
	}
	if (col.kind === "emptyCheck" || col.kind === "zillow" || col.kind === "zillowUrl") {
		if (item.status !== "Empty") return "—";
		if (col.kind === "emptyCheck") return item[col.field] === "Yes" ? "Yes" : "";
		if (col.kind === "zillow") return item.zillow === "Yes" || item.zillow === "No" ? item.zillow : "";
		return item.zillowUrl ?? "";
	}
	if (col.kind === "roofReplace") return item.roofReplace === "Yes" || item.roofReplace === "No" ? item.roofReplace : "";
	if (col.kind === "wiring") return item.wiring === "Yes" || item.wiring === "No" ? item.wiring : "";
	if (col.kind === "homeWide") return item.homeWide === "Single Wide" || item.homeWide === "Double Wide" ? item.homeWide : "";
	if (col.kind === "field") {
		const raw = item[col.field];
		return typeof raw === "string" ? raw : "";
	}
	return "";
}
var RegisterCell = (0, import_react.memo)(function RegisterCell({ item, col, onSave, live }) {
	if (!live) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: registerText(item, col) });
	const stop = (e) => e.stopPropagation();
	if (col.kind === "check") {
		const raw = String(item[col.field] ?? "").trim().toLowerCase();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: raw !== "" && raw !== "no",
				onChange: (e) => onSave({
					...item,
					[col.field]: e.target.checked ? "Yes" : ""
				})
			})
		});
	}
	if (col.kind === "status") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		onClick: stop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "cell-edit",
			value: item.status,
			onChange: (e) => {
				const status = e.target.value === "Empty" || e.target.value === "Open" || e.target.value === "Eviction" ? e.target.value : "Occupied";
				onSave({
					...item,
					status
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Occupied" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Empty" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Open" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Eviction" })
			]
		})
	});
	if (col.kind === "mow") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		onClick: stop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "cell-edit",
			value: item.noMow === "Yes" || item.noMow === "No" || item.noMow === "Owe" ? item.noMow : "",
			onChange: (e) => onSave({
				...item,
				noMow: e.target.value
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Owe" })
			]
		})
	});
	if (col.kind === "roofReplace") {
		const value = item.roofReplace === "Yes" || item.roofReplace === "No" ? item.roofReplace : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					roofReplace: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
				]
			})
		});
	}
	if (col.kind === "wiring") {
		const value = item.wiring === "Yes" || item.wiring === "No" ? item.wiring : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					wiring: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
				]
			})
		});
	}
	if (col.kind === "homeIns" || col.kind === "homeInsDate") {
		if (!isRenterLot(item)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: "—"
		});
		if (col.kind === "homeInsDate") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cell-edit",
				type: "date",
				value: item.homeInsDate ?? "",
				onChange: (e) => onSave({
					...item,
					homeInsDate: e.target.value
				})
			})
		});
		const value = item.homeIns === "Yes" || item.homeIns === "No" ? item.homeIns : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					homeIns: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
				]
			})
		});
	}
	if (col.kind === "emptyCheck" || col.kind === "zillow" || col.kind === "zillowUrl") {
		if (item.status !== "Empty") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: "—"
		});
		if (col.kind === "emptyCheck") {
			const on = item[col.field] === "Yes";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				onClick: stop,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: on,
					onChange: (e) => onSave({
						...item,
						[col.field]: e.target.checked ? "Yes" : ""
					})
				})
			});
		}
		if (col.kind === "zillow") {
			const value = item.zillow === "Yes" || item.zillow === "No" ? item.zillow : "";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				onClick: stop,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "cell-edit",
					value,
					onChange: (e) => onSave({
						...item,
						zillow: e.target.value
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
					]
				})
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cell-edit",
				value: item.zillowUrl ?? "",
				onChange: (e) => onSave({
					...item,
					zillowUrl: e.target.value
				})
			})
		});
	}
	if (col.kind === "dogs" || col.kind === "cats") {
		const value = item[col.kind] === "1" || item[col.kind] === "2" ? item[col.kind] : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					[col.kind]: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "1",
						children: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "2",
						children: "2"
					})
				]
			})
		});
	}
	if (col.kind === "first" || col.kind === "last") {
		const parts = nameParts(item.name);
		const value = col.kind === "first" ? parts.first : parts.last;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					name: col.kind === "first" ? joinName(parts.last, e.target.value) : joinName(e.target.value, parts.first)
				})
			})
		});
	}
	if (col.kind === "homeWide") {
		const value = item.homeWide === "Single Wide" || item.homeWide === "Double Wide" ? item.homeWide : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					homeWide: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Single Wide" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Double Wide" })
				]
			})
		});
	}
	if (col.kind === "field" && col.field === "renter") {
		const value = [
			"Renter",
			"Owner",
			"Rent-to-Own"
		].includes(item.renter) ? item.renter : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			onClick: stop,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "cell-edit",
				value,
				onChange: (e) => onSave({
					...item,
					renter: e.target.value
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Renter" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Owner" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rent-to-Own" })
				]
			})
		});
	}
	if (col.kind !== "field") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		onClick: stop,
		children: "—"
	});
	const field = col.field;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		onClick: stop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "cell-edit",
			value: String(item[field] ?? ""),
			onChange: (e) => onSave({
				...item,
				[field]: e.target.value
			})
		})
	});
});
function nameParts(name) {
	const raw = name.trim();
	if (!raw) return {
		first: "",
		last: ""
	};
	const comma = raw.indexOf(",");
	if (comma >= 0) return {
		last: raw.slice(0, comma).trim(),
		first: raw.slice(comma + 1).trim()
	};
	return {
		first: "",
		last: raw
	};
}
function joinName(last, first) {
	const l = last.trim();
	const f = first.trim();
	if (l && f) return `${l}, ${f}`;
	return l || f;
}
function neighbors(lots, lot) {
	const street = lot.street.trim().toLowerCase();
	const same = lots.filter((item) => item.street.trim().toLowerCase() === street);
	const list = (same.length > 0 ? same : lots).slice().sort((a, b) => {
		const na = Number(a.lot);
		const nb = Number(b.lot);
		if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
		return a.address.localeCompare(b.address, void 0, { numeric: true });
	});
	const index = list.findIndex((item) => item.id === lot.id);
	return {
		prev: index > 0 ? list[index - 1] : null,
		next: index >= 0 && index < list.length - 1 ? list[index + 1] : null
	};
}
function byStreetAddress(a, b) {
	const ga = streetGroup(a.street);
	const gb = streetGroup(b.street);
	if (ga.rank !== gb.rank) return ga.rank - gb.rank;
	if (ga.label !== gb.label) return ga.label.localeCompare(gb.label);
	const address = a.address.localeCompare(b.address, void 0, { numeric: true });
	if (address) return address;
	return a.lot.localeCompare(b.lot, void 0, { numeric: true });
}
function RegisterTable({ lots, columns, visibleIds, selected, onChoose, onSave }) {
	const pins = columns.findIndex((col) => col.label.startsWith("Name")) + 1;
	const shares = (0, import_react.useMemo)(() => insuranceShares(lots), [lots]);
	const taxes = (0, import_react.useMemo)(() => lotCostShares(lots), [lots]);
	const sewer = (0, import_react.useMemo)(() => sewerShares(lots), [lots]);
	const water = (0, import_react.useMemo)(() => waterShares(lots), [lots]);
	const garbage = (0, import_react.useMemo)(() => garbageShares(lots), [lots]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: `register pin-${pins >= 4 ? 4 : 3}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: col.label }, col.label)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lots.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
			"data-hit": visibleIds.has(item.id),
			"aria-selected": selected === item.id,
			onClick: () => onChoose(item.id),
			children: columns.map((col) => col.kind === "insShare" || col.kind === "lotShare" || col.kind === "sewerShare" || col.kind === "waterShare" || col.kind === "garbageShare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: col.kind === "insShare" && !shares.has(item.id) ? "" : dollar((col.kind === "insShare" ? shares : col.kind === "lotShare" ? taxes : col.kind === "sewerShare" ? sewer : col.kind === "waterShare" ? water : garbage).get(item.id) ?? 0) }, col.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterCell, {
				item,
				col,
				onSave,
				live: selected === item.id
			}, col.label))
		}, item.id)) })]
	});
}
function LotPanel({ lot, lots, onSave, onOpen, onRentRoll, onAlert }) {
	const [tab, setTab] = (0, import_react.useState)("personal");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const panelRef = (0, import_react.useRef)(null);
	const scrollRef = (0, import_react.useRef)(0);
	const seenLot = (0, import_react.useRef)(lot?.id);
	(0, import_react.useEffect)(() => {
		if (lot && tab === "empty" && lot.status !== "Empty") setTab("personal");
	}, [
		lot?.id,
		lot?.status,
		tab
	]);
	(0, import_react.useLayoutEffect)(() => {
		const panel = panelRef.current;
		if (!panel) return;
		if (seenLot.current !== lot?.id) {
			seenLot.current = lot?.id;
			panel.scrollTop = 0;
			scrollRef.current = 0;
			return;
		}
		panel.scrollTop = scrollRef.current;
	});
	if (!lot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "panel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel-body",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "quiet",
				children: "Select a lot on the map."
			})
		})
	});
	const current = lot;
	const where = sheetOf(current.id);
	const mates = neighbors(lots, current);
	const phoneDigits = current.phone.replace(/[^\d+]/g, "");
	const rentMark = Boolean(current.lateRent?.trim() || current.bouncedCheck?.trim());
	const notesMark = Boolean(current.issues?.trim() || current.violations?.trim());
	const save = (next) => {
		if (panelRef.current) scrollRef.current = panelRef.current.scrollTop;
		const y = window.scrollY;
		onSave({
			...current,
			...next
		});
		requestAnimationFrame(() => {
			if (panelRef.current) panelRef.current.scrollTop = scrollRef.current;
			if (Math.abs(window.scrollY - y) > 4) window.scrollTo(0, y);
		});
	};
	async function copyAddress() {
		const text = [current.address, current.street].filter(Boolean).join(" ");
		try {
			await navigator.clipboard.writeText(text);
		} catch {}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1200);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel-body",
				ref: panelRef,
				onScroll: () => {
					if (panelRef.current) scrollRef.current = panelRef.current.scrollTop;
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "quiet sheet-where",
						children: [where ? `Map ${where}` : "Register only", " · Saves to the master file"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lot-head",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "head-address",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "label-row",
									children: ["Address", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "mini",
										type: "button",
										onClick: copyAddress,
										children: copied ? "Copied" : "Copy"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "address-num",
									value: lot.address,
									onChange: (e) => save({ address: e.target.value })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Street" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "street-name",
									value: lot.street,
									onChange: (e) => save({ street: e.target.value })
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "head-lot",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: lot.lot,
									onChange: (e) => save({ lot: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "head-name",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: lot.name,
									onChange: (e) => save({ name: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NameSplit, {
								name: lot.name,
								onChange: (name) => save({ name })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "head-status",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `status-dot status-${lot.status.toLowerCase()}`,
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: lot.status,
										onChange: (e) => {
											const status = e.target.value;
											if (lot.status === "Occupied" && status === "Empty") {
												onSave(moveOutLot(lot));
												setTab("empty");
												return;
											}
											save({ status });
											if (status === "Empty") setTab("empty");
											else if (tab === "empty") setTab("personal");
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Occupied",
												children: "Occupied"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Empty",
												children: "Empty"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Open",
												children: "Office"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Eviction",
												children: "Eviction"
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "detail-tabs",
						role: "tablist",
						children: (lot.status === "Empty" ? [
							["empty", "Empty lot"],
							["personal", "Personal"],
							["home", "Home"],
							["rent", "Rent"],
							["maintenance", "Maintenance"],
							["notes", "Notes"]
						] : [
							["personal", "Personal"],
							["home", "Home"],
							["rent", "Rent"],
							["maintenance", "Maintenance"],
							["notes", "Notes"]
						]).map(([id, label]) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-pressed": tab === id,
								onClick: () => setTab(id),
								children: [label, id === "rent" && rentMark || id === "notes" && notesMark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "tab-dot",
									"aria-label": "Has something to see"
								}) : null]
							}, id);
						})
					}),
					tab === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pet-title",
								children: "People"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pet-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "phone-line",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: lot.phone,
										onChange: (e) => save({ phone: e.target.value })
									}), phoneDigits ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${phoneDigits}`,
										children: "Call"
									}) : null]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: lot.email,
									onChange: (e) => save({ email: e.target.value })
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pet-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Renter / owner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "mow-select",
									value: [
										"Renter",
										"Owner",
										"Rent-to-Own"
									].includes(lot.renter) ? lot.renter : "",
									onChange: (e) => save({ renter: e.target.value }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Renter" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Owner" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rent-to-Own" })
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Key" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: lot.key,
									onChange: (e) => save({ key: e.target.value })
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pet-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "mow-select",
									value: [
										"1",
										"2",
										"3",
										"4",
										"5"
									].includes(lot.guest) ? lot.guest : "",
									onChange: (e) => {
										const count = Number(e.target.value);
										const prev = lot.guests ?? [];
										const guests = count > 0 ? Array.from({ length: count }, (_, i) => prev[i] ?? blankGuest()) : [];
										save({
											guest: e.target.value,
											guests
										});
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "3" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "5" })
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vehicle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: lot.vehicle,
									onChange: (e) => save({ vehicle: e.target.value })
								})] })]
							}),
							(lot.guests ?? []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuestCards, {
								guests: lot.guests ?? [],
								onChange: (guests) => save({ guests })
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pet-title",
								children: "Pets"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetSelects, {
								dogs: lot.dogs ?? "",
								cats: lot.cats ?? "",
								onChange: save
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
						values: lot,
						part: "personal",
						onChange: save
					})] }) : null,
					tab === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeDetails, {
							lot,
							onChange: save
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
							values: lot,
							part: "home",
							onChange: save
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pet-block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "pet-title",
									children: "Insurance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeInsuranceFields, {
									lot,
									onChange: save,
									split: (() => {
										const share = insuranceShares(lots).get(lot.id);
										return share == null ? "" : dollar(share);
									})()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home wiring insurance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "mow-select",
										value: lot.wiring === "Yes" || lot.wiring === "No" ? lot.wiring : "",
										onChange: (e) => save({ wiring: e.target.value }),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pet-block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "pet-title",
									children: "Expenses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yearly taxes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: dollar(lotCostShares(lots).get(lot.id) ?? 0),
										readOnly: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: costSum([
											lot.maintCost,
											lot.mowCost,
											lot.acCost,
											lot.roofCost,
											lot.washCost,
											lot.inspectCost
										]),
										readOnly: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yearly sewer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: dollar(sewerShares(lots).get(lot.id) ?? 0),
										readOnly: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yearly water" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: dollar(waterShares(lots).get(lot.id) ?? 0),
										readOnly: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "wiring-field",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yearly garbage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: dollar(garbageShares(lots).get(lot.id) ?? 0),
										readOnly: true
									})]
								})
							]
						})
					] }) : null,
					tab === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
						values: lot,
						part: "rent",
						onChange: save,
						onMoveOut: () => {
							onSave(moveOutLot(lot));
							setTab("empty");
						},
						onRentRoll
					}) : null,
					tab === "maintenance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
						values: lot,
						part: "maintenance",
						onChange: save
					}) : null,
					tab === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pet-title",
								children: "Issues"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "wiring-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: lot.issues,
									onChange: (e) => save({ issues: e.target.value })
								})]
							}),
							lot.stickies?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lot-stickies",
								children: lot.stickies.map((sticky) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									style: { background: sticky.color },
									children: sticky.text
								}, sticky.id))
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "wiring-field",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Violations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									value: lot.violations,
									onChange: (e) => save({ violations: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "filter",
								type: "button",
								onClick: onAlert,
								children: "Emergency broadcast"
							})
						]
					}) : null,
					tab === "empty" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviousTenants, {
							values: lot,
							onChange: save
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLotChecklist, {
							lot,
							onChange: save
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
							values: lot,
							part: "empty",
							onChange: save
						})
					] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "panel-nav prev",
				type: "button",
				"aria-label": "Previous lot",
				disabled: !mates.prev,
				onClick: () => mates.prev && onOpen(mates.prev.id),
				children: "‹"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "panel-nav next",
				type: "button",
				"aria-label": "Next lot",
				disabled: !mates.next,
				onClick: () => mates.next && onOpen(mates.next.id),
				children: "›"
			})
		]
	});
}
function HomeDetails({ lot, onChange }) {
	const wide = lot.homeWide === "Single Wide" || lot.homeWide === "Double Wide" ? lot.homeWide : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pet-block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Home details"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.homeYear ?? "",
					onChange: (e) => onChange({ homeYear: e.target.value })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Make" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.homeMake ?? "",
					onChange: (e) => onChange({ homeMake: e.target.value })
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.homeModel ?? "",
					onChange: (e) => onChange({ homeModel: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Width" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.homeWidth ?? "",
					onChange: (e) => onChange({ homeWidth: e.target.value })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Length" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.homeLength ?? "",
					onChange: (e) => onChange({ homeLength: e.target.value })
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mow-select",
					value: wide,
					onChange: (e) => onChange({ homeWide: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Single Wide" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Double Wide" })
					]
				})]
			})
		]
	});
}
function listingHref(url) {
	const trimmed = url.trim();
	if (!trimmed) return "";
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
function EmptyLotChecklist({ lot, onChange }) {
	const href = listingHref(lot.zillowUrl ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pet-block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Empty lot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "inventory",
				children: [
					["readyPower", "Power on"],
					["readyClean", "Cleaned"],
					["readyInspected", "Inspected"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: lot[key] === "Yes",
					onChange: (e) => onChange({ [key]: e.target.checked ? "Yes" : "" })
				}), label] }) }, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Listed on Zillow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mow-select",
					value: lot.zillow === "Yes" || lot.zillow === "No" ? lot.zillow : "",
					onChange: (e) => onChange({ zillow: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Listing link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: lot.zillowUrl ?? "",
					placeholder: "https://www.zillow.com/...",
					onChange: (e) => onChange({ zillowUrl: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: `filter listing-link${href ? "" : " is-off"}`,
				href: href || void 0,
				target: "_blank",
				rel: "noreferrer",
				children: "Open listing"
			})
		]
	});
}
function HomeInsuranceFields({ lot, onChange, split }) {
	const value = lot.homeIns === "Yes" || lot.homeIns === "No" ? lot.homeIns : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "wiring-field",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home insurance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "mow-select",
				value,
				onChange: (e) => onChange({ homeIns: e.target.value }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "wiring-field",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Yearly insurance cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: split ?? "",
				readOnly: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "wiring-field",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Expires" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "date",
				value: lot.homeInsDate ?? "",
				onChange: (e) => onChange({ homeInsDate: e.target.value })
			})]
		})
	] });
}
function stayRows(stay) {
	return [
		["Phone", stay.phone],
		["Email", stay.email ?? ""],
		["Renter", stay.renter],
		["Rent", stay.rent],
		["Late rent", stay.lateRent ?? ""],
		["Bounced check", stay.bouncedCheck ?? ""],
		["Moved in", stay.moveIn],
		["Moved out", stay.moveOut],
		["Lease end", stay.leaseEnd ?? ""],
		["Rent due", stay.rentDue ?? ""],
		["Deposit", stay.deposit ?? ""],
		["Still owed", stay.balance],
		["Guest", [stay.guest, ...(stay.guests ?? []).map((guest) => guest.name)].filter(Boolean).join(" · ")],
		["Vehicle", stay.vehicle ?? ""],
		["Dogs", stay.dogs ?? ""],
		["Cats", stay.cats ?? ""],
		["Emergency", [stay.emergencyName, stay.emergencyPhone].filter(Boolean).join(" · ")],
		["Notice", [stay.noticeDate, stay.noticeNote].filter(Boolean).join(" · ")],
		["Court", [stay.courtDate, stay.courtNote].filter(Boolean).join(" · ")],
		["Insurance", [stay.homeIns, stay.homeInsDate].filter(Boolean).join(" · ")],
		["Issues", stay.issues ?? ""],
		["Violations", stay.violations ?? ""]
	].filter(([, value]) => value.trim());
}
function PreviousTenants({ values, onChange }) {
	const [opened, setOpened] = (0, import_react.useState)(null);
	const history = values.history ?? [];
	if (history.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pet-block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "pet-title",
			children: history.length === 1 ? "Previous tenant" : "Previous tenants"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "history",
			children: history.map((stay, index) => {
				const reminder = depositReminder(stay);
				const docs = [
					stay.lease,
					stay.rulesReceipt,
					stay.background,
					stay.noticeFile,
					...stay.otherDocs ?? []
				].filter((file) => Boolean(file?.data));
				const open = opened === index;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "stay-line",
					type: "button",
					"aria-expanded": open,
					onClick: () => setOpened(open ? null : index),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stay.name || "No name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shortDay(stay.moveOut) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stay.balance?.trim() || "—" })
					]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "stay-facts",
						children: stayRows(stay).map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value })] }, label))
					}),
					docs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "doc-list",
						children: docs.map((file, fileIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: file.data,
							download: file.name,
							children: file.name
						}, `${file.name}-${fileIndex}`))
					}) : null,
					reminder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "deposit-alert",
						children: reminder
					}) : null,
					stay.depositChoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Deposit ", stay.depositChoice === "Return" ? "returned" : "kept"] }) : null,
					stay.depositDue && !stay.depositChoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "deposit-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => onChange({ history: history.map((item, i) => i === index ? {
								...item,
								depositChoice: "Return"
							} : item) }),
							children: "Return deposit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => onChange({ history: history.map((item, i) => i === index ? {
								...item,
								depositChoice: "Keep"
							} : item) }),
							children: "Keep deposit"
						})]
					}) : null
				] }) : null] }, `${stay.moveOut}-${stay.name}-${index}`);
			})
		})]
	});
}
function updateJob(jobs, id, patch) {
	return (jobs ?? []).map((job) => job.id === id ? {
		...job,
		...patch
	} : job);
}
function sortedJobs(jobs) {
	return [...jobs ?? []].sort((a, b) => {
		const doneA = a.done === "Yes" ? 1 : 0;
		const doneB = b.done === "Yes" ? 1 : 0;
		if (doneA !== doneB) return doneA - doneB;
		return (b.date || "").localeCompare(a.date || "");
	});
}
function shortDay(value) {
	const day = parseDay(value);
	if (!day) return value?.trim() || "—";
	const [y, m, d] = day.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function Fold({ title, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pet-block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "fold",
			type: "button",
			"aria-expanded": open,
			onClick: () => setOpen((value) => !value),
			children: [
				open ? "▾" : "▸",
				" ",
				title
			]
		}), open ? children : null]
	});
}
function printMow(lots) {
	const win = window.open("", "_blank");
	if (!win) return;
	const body = groupTodos(lots.filter((lot) => lot.noMow === "Yes").map((lot) => ({
		street: lot.street,
		lot: lot.lot,
		address: [lot.address, lot.street].filter(Boolean).join(" "),
		name: displayName(lot)
	}))).map(([street, group]) => {
		const lines = group.items.map((item) => `<tr><td>${escapeHtml(item.lot || "—")}</td><td>${escapeHtml(item.address)}</td><td>${escapeHtml(item.name)}</td></tr>`).join("");
		return `<h2>${escapeHtml(street)}</h2><table><thead><tr><th>Lot</th><th>Address</th><th>Name</th></tr></thead><tbody>${lines}</tbody></table>`;
	}).join("");
	win.document.open();
	win.document.write(`<!doctype html><html><head><title>Mow list</title><style>
    @page { size: letter; margin: 0.6in; }
    body { margin: 0; color: #1c1916; font: 14px/1.4 Georgia, serif; }
    h1, h2 { letter-spacing: 0.08em; text-transform: uppercase; }
    h1 { font-size: 16px; margin: 0 0 12px; }
    h2 { font-size: 13px; margin: 18px 0 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 4px 8px 4px 0; border-bottom: 1px solid #ddd; }
  </style></head><body><h1>Mow list</h1>${body || "<p>No lots are set to Yes.</p>"}</body></html>`);
	win.document.close();
	const go = () => {
		if (win.closed) return;
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 200);
	setTimeout(go, 500);
}
var MOW_ROUNDS_KEY = "magnolia-mow-rounds";
function mowStops(lots) {
	return lots.filter((lot) => lot.noMow === "Yes").map((lot) => ({
		id: lot.id,
		street: lot.street,
		lot: lot.lot,
		address: [lot.address, lot.street].filter(Boolean).join(" "),
		name: displayName(lot),
		mowed: false,
		notes: ""
	}));
}
function mowTone(stop, balance) {
	if (balance > 72) return "mow-red";
	if (stop.notes.trim()) return "mow-yellow";
	if (stop.mowed) return "mow-green";
	return "mow-orange";
}
function asRounds(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const row = item;
		if (typeof row.date !== "string" || !Array.isArray(row.stops)) return [];
		return [{
			id: typeof row.id === "string" ? row.id : row.date,
			date: row.date,
			stops: row.stops.filter((stop) => stop && typeof stop.id === "string")
		}];
	});
}
function MowBoard({ lots, onOpen }) {
	const [rounds, setRounds] = (0, import_react.useState)([]);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [cursor, setCursor] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const balance = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const lot of lots) map.set(lot.id, moneyNumber(lot.balance ?? ""));
		return map;
	}, [lots]);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		readMaster().then((book) => {
			if (cancel) return;
			const saved = asRounds(book?.mowings);
			if (saved.length) setRounds(saved);
			else try {
				const local = asRounds(JSON.parse(localStorage.getItem(MOW_ROUNDS_KEY) ?? "[]"));
				if (local.length) setRounds(local);
			} catch {}
		}).catch(() => {}).finally(() => {
			if (!cancel) setReady(true);
		});
		return () => {
			cancel = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready || !rounds.length) return;
		try {
			localStorage.setItem(MOW_ROUNDS_KEY, JSON.stringify(rounds));
		} catch {}
		saveMowings({ data: { mowings: rounds } }).catch(() => {});
	}, [rounds, ready]);
	const viewing = cursor === null ? draft : rounds[cursor] ?? null;
	const editing = cursor === null && draft !== null;
	const rows = viewing?.stops ?? mowStops(lots);
	const groups = groupTodos(rows);
	const canLeft = cursor === null && rounds.length > 0 || cursor !== null && cursor < rounds.length - 1;
	const canRight = cursor !== null && cursor > 0;
	function startMowing() {
		if (draft) {
			setCursor(null);
			return;
		}
		const today = /* @__PURE__ */ new Date();
		const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
		setDraft({
			id: `mow-${Date.now()}`,
			date,
			stops: mowStops(lots)
		});
		setCursor(null);
	}
	function patchStop(id, patch) {
		setDraft((current) => current ? {
			...current,
			stops: current.stops.map((stop) => stop.id === id ? {
				...stop,
				...patch
			} : stop)
		} : current);
	}
	function submitMowing() {
		if (!draft?.date) return;
		setRounds((current) => [draft, ...current]);
		setDraft(null);
		setCursor(0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "todo-head",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Yes mow" }),
				canLeft || canRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mow-nav",
					children: [canLeft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "print-map",
						"aria-label": "Older mowing",
						onClick: () => setCursor(cursor === null ? 0 : cursor + 1),
						children: "‹"
					}) : null, canRight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "print-map",
						"aria-label": "Newer mowing",
						onClick: () => setCursor((cursor ?? 0) - 1),
						children: "›"
					}) : null]
				}) : null,
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mow-date",
					children: ["Mowing date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: draft.date,
						onChange: (event) => setDraft({
							...draft,
							date: event.target.value
						})
					})]
				}) : viewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mow-label",
					children: viewing.date
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map",
					type: "button",
					onClick: () => printMow(lots),
					children: "Print"
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map",
					type: "button",
					disabled: !draft.date,
					onClick: submitMowing,
					children: "Submit"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map mow-new",
					type: "button",
					onClick: startMowing,
					children: "New Mowing"
				})
			]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "todo-empty",
			children: "No lots are set to Yes."
		}) : groups.map(([street, group]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: street }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mow-list",
			children: group.items.map((item) => {
				const tone = viewing ? mowTone(item, balance.get(item.id) ?? 0) : "";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: editing || viewing ? "mow-active" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "todo-card " + tone,
						type: "button",
						onClick: () => onOpen(item.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lot" }),
								" ",
								item.lot || "—"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Address" }),
								" ",
								item.address || "—"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Name" }),
								" ",
								item.name || "—"
							] })
						]
					}), viewing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mow-side",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: item.mowed,
							disabled: !editing,
							onChange: (event) => patchStop(item.id, { mowed: event.target.checked })
						}), "Mowed"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							"aria-label": "Notes for " + (item.name || item.lot),
							value: item.notes,
							placeholder: "Notes",
							readOnly: !editing,
							onChange: (event) => patchStop(item.id, { notes: event.target.value })
						})]
					}) : null]
				}, item.id);
			})
		})] }, street))]
	});
}
function streetGroup(street) {
	const name = street.toLowerCase();
	if (name.includes("jaleen")) return {
		rank: 0,
		label: "Jaleen"
	};
	if (name.includes("denise")) return {
		rank: 1,
		label: "Denise"
	};
	if (name.includes("leon")) return {
		rank: 2,
		label: "Leon"
	};
	if (name.includes("michelle")) return {
		rank: 3,
		label: "Michelle"
	};
	if (name.includes("kirkwood")) return {
		rank: 4,
		label: "Kirkwood"
	};
	return {
		rank: 5,
		label: street.trim() || "Other"
	};
}
var NOTE_BANDS = [
	{
		label: "Rent, short, or owe",
		words: [
			"rent",
			"short",
			"owe"
		]
	},
	{
		label: "Check, bounced, or missing",
		words: [
			"check",
			"bounced",
			"missing"
		]
	},
	{
		label: "Title or guest",
		words: ["title", "guest"]
	},
	{
		label: "Dog, cat, or pet",
		words: [
			"dog",
			"cat",
			"pet"
		]
	}
];
function noteBand(notes) {
	const hay = notes.toLowerCase();
	return NOTE_BANDS.find((band) => band.words.some((word) => new RegExp(`\\b${word}`, "i").test(hay)))?.label ?? "Other";
}
function noteBands(items) {
	const groups = /* @__PURE__ */ new Map();
	for (const item of items) {
		const label = noteBand(item.notes);
		const current = groups.get(label);
		if (current) current.push(item);
		else groups.set(label, [item]);
	}
	return [...NOTE_BANDS.map((band) => band.label), "Other"].flatMap((label) => {
		const group = groups.get(label);
		return group?.length ? [[label, group]] : [];
	});
}
function groupTodos(items) {
	const groups = /* @__PURE__ */ new Map();
	for (const item of items) {
		const group = streetGroup(item.street);
		const current = groups.get(group.label);
		if (current) current.items.push(item);
		else groups.set(group.label, {
			rank: group.rank,
			items: [item]
		});
	}
	return [...groups.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
}
function TodoBoard({ lots, onOpen }) {
	const items = buildTodo(lots);
	const [done, setDone] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [rank, setRank] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(TODO_DONE_KEY);
			const ids = raw ? JSON.parse(raw) : [];
			if (Array.isArray(ids)) setDone(new Set(ids.filter((id) => typeof id === "string")));
		} catch {
			setDone(/* @__PURE__ */ new Set());
		}
		try {
			const raw = localStorage.getItem(TODO_RANK_KEY);
			const saved = raw ? JSON.parse(raw) : {};
			if (saved && typeof saved === "object" && !Array.isArray(saved)) {
				const next = {};
				for (const [id, value] of Object.entries(saved)) if (typeof value === "number") next[id] = value;
				setRank(next);
			}
		} catch {
			setRank({});
		}
	}, []);
	function toggle(id) {
		const checking = !done.has(id);
		const next = new Set(done);
		if (checking) next.add(id);
		else next.delete(id);
		localStorage.setItem(TODO_DONE_KEY, JSON.stringify([...next]));
		setDone(next);
		if (!checking) return;
		const current = items.find((item) => item.id === id);
		if (!current) return;
		const label = noteBand(current.notes);
		const bandItems = items.filter((item) => noteBand(item.notes) === label);
		const index = bandItems.findIndex((item) => item.id === id);
		const follow = [...bandItems.slice(index + 1), ...bandItems.slice(0, index)].find((item) => !next.has(item.id));
		if (follow) onOpen(follow.id);
	}
	function shift(id, dir, list) {
		const index = list.findIndex((item) => item.id === id);
		const other = index + dir;
		if (index < 0 || other < 0 || other >= list.length) return;
		setRank((prev) => {
			const next = { ...prev };
			list.forEach((item, i) => {
				if (typeof next[item.id] !== "number") next[item.id] = list.length - i;
			});
			const a = list[index].id;
			const b = list[other].id;
			const hold = next[a];
			next[a] = next[b];
			next[b] = hold;
			if (next[a] === next[b]) next[a] = next[b] + (dir < 0 ? 1 : -1);
			localStorage.setItem(TODO_RANK_KEY, JSON.stringify(next));
			return next;
		});
	}
	const [todoFilter, setTodoFilter] = (0, import_react.useState)("open");
	const openItems = items.filter((item) => !done.has(item.id));
	const doneItems = items.filter((item) => done.has(item.id));
	const shown = [...todoFilter === "open" ? openItems : doneItems].sort((a, b) => (rank[b.id] ?? 0) - (rank[a.id] ?? 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "todo-head",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "By notes" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "seg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "filter",
						type: "button",
						"aria-pressed": todoFilter === "open",
						onClick: () => setTodoFilter("open"),
						children: ["Open", openItems.length ? ` ${openItems.length}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "filter",
						type: "button",
						"aria-pressed": todoFilter === "done",
						onClick: () => setTodoFilter("done"),
						children: ["Done", doneItems.length ? ` ${doneItems.length}` : ""]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map",
					type: "button",
					onClick: () => printTodo(shown.map((item) => ({
						...item,
						done: done.has(item.id)
					}))),
					children: "Print"
				})
			]
		}), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "todo-empty",
			children: todoFilter === "done" ? "Nothing checked off." : "Nothing open."
		}) : noteBands(shown).map(([label, group]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoList, {
			items: group,
			done,
			onToggle: toggle,
			onShift: (id, dir) => shift(id, dir, group),
			onOpen,
			empty: ""
		})] }, label))]
	});
}
function shownAmount(value) {
	const raw = value?.trim() ?? "";
	if (!raw) return "";
	return raw.startsWith("$") ? raw : `$${raw}`;
}
function increaseLines(lot) {
	return [lot.rentInc2026?.trim() ? `08/2026 rent increase: ${shownAmount(lot.rentInc2026)}` : "", lot.rentInc2027?.trim() ? `08/2027 rent increase: ${shownAmount(lot.rentInc2027)}` : ""].filter(Boolean);
}
function increaseBody(lot) {
	return `Hello ${displayName(lot) || "Resident"},\n\nThis is notice of a rent increase for ${[lot.address, lot.street].filter(Boolean).join(" ")}, lot ${lot.lot}.\n\n${increaseLines(lot).join("\n")}\n\nMagnolia Central of Florida Estates`;
}
function openMail(to, subject, body) {
	window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}
function openMailAll(emails, subject, body) {
	const list = [...new Set(emails.map((item) => item.trim()).filter(Boolean))];
	if (list.length === 0) return;
	window.open(`mailto:?bcc=${encodeURIComponent(list.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}
function openText(phone, body) {
	const digits = phone.replace(/[^\d]/g, "");
	if (!digits) return;
	window.open(`sms:${digits}?&body=${encodeURIComponent(body)}`, "_blank");
}
function openTextAll(phones, body) {
	const list = [...new Set(phones.map((item) => item.replace(/[^\d]/g, "")).filter(Boolean))];
	if (list.length === 0) return;
	window.open(`sms:${list.join(",")}?&body=${encodeURIComponent(body)}`, "_blank");
}
function rollGroups(lots) {
	const sorted = [...lots].sort(byStreetAddress);
	const groups = /* @__PURE__ */ new Map();
	for (const lot of sorted) {
		const group = streetGroup(lot.street);
		const current = groups.get(group.label);
		if (current) current.items.push(lot);
		else groups.set(group.label, {
			rank: group.rank,
			items: [lot]
		});
	}
	return [...groups.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
}
function IncreaseBoard({ lots, onOpen }) {
	const rows = lots.filter((lot) => lot.rentInc2026?.trim() || lot.rentInc2027?.trim());
	const emails = rows.map((lot) => lot.email).filter((email) => email.trim());
	function mailOne(lot) {
		if (!lot.email.trim()) return;
		openMail(lot.email.trim(), `Rent increase · Lot ${lot.lot}`, increaseBody(lot));
	}
	function mailEach() {
		rows.forEach(mailOne);
	}
	function mailAll() {
		openMailAll(emails, "Rent increase · Magnolia Central of Florida Estates", "Hello,\n\nThis is notice of a rent increase from Magnolia Central of Florida Estates. Your 08/2026 and 08/2027 amounts are the figures on file for your lot.\n\nMagnolia Central of Florida Estates");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo roll",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "todo-head",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Rent increase" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map",
					type: "button",
					disabled: emails.length === 0,
					onClick: mailEach,
					children: "Email each"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "print-map",
					type: "button",
					disabled: emails.length === 0,
					onClick: mailAll,
					children: "Email all"
				})
			]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "todo-empty",
			children: "Enter an 08/2026 or 08/2027 amount in the register, then open this roll again."
		}) : rollGroups(rows).map(([street, group]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: street }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: group.items.map((lot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "roll-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "todo-card",
				type: "button",
				onClick: () => onOpen(lot.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lot" }),
						" ",
						lot.lot
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Address" }),
						" ",
						[lot.address, lot.street].filter(Boolean).join(" ")
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Name" }),
						" ",
						displayName(lot) || "—"
					] }),
					lot.rentInc2026?.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "08/2026" }),
						" ",
						shownAmount(lot.rentInc2026)
					] }) : null,
					lot.rentInc2027?.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "08/2027" }),
						" ",
						shownAmount(lot.rentInc2027)
					] }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "print-map",
				type: "button",
				disabled: !lot.email.trim(),
				onClick: () => mailOne(lot),
				children: "Email"
			})]
		}, lot.id)) })] }, street))]
	});
}
var ALERTS = [
	[
		"water",
		"Water outage",
		"The water is out at Magnolia Central of Florida Estates. We will let you know when it is back on."
	],
	[
		"storm",
		"Storm",
		"A storm is in the area. Please secure anything loose outside and stay inside until it passes."
	],
	[
		"power",
		"Power outage",
		"The power is out at Magnolia Central of Florida Estates. We will let you know when it is back on."
	],
	[
		"other",
		"Other",
		""
	]
];
function AlertBoard({ lots, onOpen }) {
	const [reason, setReason] = (0, import_react.useState)("water");
	const [other, setOther] = (0, import_react.useState)("");
	const picked = ALERTS.find((item) => item[0] === reason) ?? ALERTS[0];
	const message = reason === "other" ? other.trim() : picked[2];
	const rows = lots.filter((lot) => lot.status === "Occupied" || lot.status === "Eviction");
	const bodyFor = (lot) => `Hello ${displayName(lot) || "Resident"},\n\n${message || "Please see this notice from the park."}\n\n${[lot.address, lot.street].filter(Boolean).join(" ")}, lot ${lot.lot}\n\nMagnolia Central of Florida Estates`;
	const emails = rows.map((lot) => lot.email).filter((email) => email.trim());
	const phones = rows.map((lot) => lot.phone).filter((phone) => phone.replace(/[^\d]/g, ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo roll",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "todo-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Emergency broadcast" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mow-select",
						value: reason,
						onChange: (e) => setReason(e.target.value),
						children: ALERTS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: id,
							children: label
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || emails.length === 0,
						onClick: () => rows.forEach((lot) => lot.email.trim() && openMail(lot.email.trim(), picked[1], bodyFor(lot))),
						children: "Email each"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || emails.length === 0,
						onClick: () => openMailAll(emails, picked[1], `${message}\n\nMagnolia Central of Florida Estates`),
						children: "Email all"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || phones.length === 0,
						onClick: () => rows.forEach((lot) => openText(lot.phone, message)),
						children: "Text each"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || phones.length === 0,
						onClick: () => openTextAll(phones, message),
						children: "Text all"
					})
				]
			}),
			reason === "other" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field roll-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Other notice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 3,
					value: other,
					onChange: (e) => setOther(e.target.value),
					placeholder: "What should the message say?"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "roll-note",
				children: picked[2]
			}),
			rollGroups(rows).map(([street, group]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: street }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: group.items.map((lot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "roll-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "todo-card",
					type: "button",
					onClick: () => onOpen(lot.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lot" }),
							" ",
							lot.lot
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Address" }),
							" ",
							[lot.address, lot.street].filter(Boolean).join(" ")
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Name" }),
							" ",
							displayName(lot) || "—"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Email" }),
							" ",
							lot.email.trim() || "—"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Phone" }),
							" ",
							lot.phone.trim() || "—"
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "roll-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || !lot.email.trim(),
						onClick: () => openMail(lot.email.trim(), picked[1], bodyFor(lot)),
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "print-map",
						type: "button",
						disabled: !message || !lot.phone.replace(/[^\d]/g, ""),
						onClick: () => openText(lot.phone, message),
						children: "Text"
					})]
				})]
			}, lot.id)) })] }, street))
		]
	});
}
function costSum(values) {
	if (values.every((value) => !(value ?? "").trim())) return "";
	const sum = values.reduce((total, value) => total + (parseMoney(value) ?? 0), 0);
	const rounded = Math.round(sum * 100) / 100;
	return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
function parseMoney(value) {
	const raw = (value ?? "").replace(/[$,\s]/g, "");
	if (!raw) return null;
	const n = Number(raw);
	return Number.isFinite(n) ? n : null;
}
function dollar(amount) {
	return amount.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
	});
}
var HEAT_STOPS = [
	{
		min: 86,
		color: "#0d7a32",
		label: "Highest · top"
	},
	{
		min: 72,
		color: "#2f9e44",
		label: "High"
	},
	{
		min: 58,
		color: "#8fce4a",
		label: "Above average"
	},
	{
		min: 43,
		color: "#f2d031",
		label: "Moderate"
	},
	{
		min: 29,
		color: "#f08c00",
		label: "Below average"
	},
	{
		min: 15,
		color: "#e8590c",
		label: "Low"
	},
	{
		min: -Infinity,
		color: "#c92a2a",
		label: "Lowest · bottom"
	}
];
function heatBand(percent) {
	return HEAT_STOPS.find((stop) => percent >= stop.min) ?? HEAT_STOPS[HEAT_STOPS.length - 1];
}
function heatInk(hex) {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return r * .3 + g * .59 + b * .11 > 150 ? "#1c1916" : "#fff";
}
var HEAT_METRICS = [
	["overall", "Overall"],
	["roi", "Percentile"],
	["monthProfit", "Monthly profit"],
	["yearProfit", "Yearly profit"],
	["monthExpense", "Monthly expenses"],
	["yearExpense", "Yearly expenses"],
	["monthRent", "Monthly rent"],
	["yearRent", "Yearly rent"],
	["owed", "Still owed"]
];
function HeatBoard({ lots, scoped, selected, onOpen, mini = false }) {
	const [metric, setMetric] = (0, import_react.useState)("overall");
	const [metricsOpen, setMetricsOpen] = (0, import_react.useState)(false);
	const [listOpen, setListOpen] = (0, import_react.useState)(false);
	const homes = lots.filter((lot) => lot.status !== "Open");
	const insuredHomes = homes.filter((lot) => lot.homeIns === "Yes");
	const poolDefaults = {
		insurance: "7000",
		propertyTax: "30000",
		sewer: "30000",
		water: "30000",
		garbage: "30000",
		wiring: "0",
		materials: "0",
		maintenance: "0",
		utilities: "0",
		other: "0"
	};
	const [poolsOpen, setPoolsOpen] = (0, import_react.useState)(false);
	const [expensePools, setExpensePools] = (0, import_react.useState)(() => {
		try {
			const saved = typeof window !== "undefined" ? localStorage.getItem("magnolia-financial-expense-pools") : null;
			return saved ? {
				...poolDefaults,
				...JSON.parse(saved)
			} : poolDefaults;
		} catch {
			return poolDefaults;
		}
	});
	const updateExpensePool = (key, value) => {
		const next = {
			...expensePools,
			[key]: value
		};
		setExpensePools(next);
		try {
			localStorage.setItem("magnolia-financial-expense-pools", JSON.stringify(next));
		} catch {}
	};
	const poolLabels = [
		{
			key: "insurance",
			label: "Home insurance"
		},
		{
			key: "propertyTax",
			label: "Property taxes"
		},
		{
			key: "sewer",
			label: "Sewer"
		},
		{
			key: "water",
			label: "Water"
		},
		{
			key: "garbage",
			label: "Garbage"
		},
		{
			key: "wiring",
			label: "Home wiring insurance"
		},
		{
			key: "materials",
			label: "Materials / supplies"
		},
		{
			key: "maintenance",
			label: "Maintenance"
		},
		{
			key: "utilities",
			label: "Other utilities"
		},
		{
			key: "other",
			label: "Other expenses"
		}
	];
	const annualPoolTotal = poolLabels.reduce((sum, item) => sum + (parseMoney(expensePools[item.key]) ?? 0), 0);
	const lotSpecificAnnual = (lot) => [
		"maintCost",
		"mowCost",
		"acCost",
		"roofCost",
		"washCost",
		"inspectCost",
		"taxCost",
		"sewerCost",
		"waterCost",
		"garbageCost"
	].reduce((sum, key) => sum + (parseMoney(String(lot[key] ?? "")) ?? 0), 0);
	const monthlyExpense = (lot) => {
		return (poolLabels.reduce((sum, item) => {
			const amount = parseMoney(expensePools[item.key]) ?? 0;
			if (item.key === "insurance") return sum + (lot.homeIns === "Yes" && insuredHomes.length ? amount / insuredHomes.length : 0);
			if (item.key === "wiring") {
				const wiredHomes = homes.filter((home) => home.wiring === "Yes");
				return sum + (lot.wiring === "Yes" && wiredHomes.length ? amount / wiredHomes.length : 0);
			}
			return sum + (homes.length ? amount / homes.length : 0);
		}, 0) + lotSpecificAnnual(lot)) / 12;
	};
	const worseHigh = metric === "monthExpense" || metric === "yearExpense" || metric === "owed";
	const scored = homes.flatMap((lot) => {
		const rent = lot.status === "Empty" ? 0 : parseMoney(lot.rent) ?? 0;
		const expense = monthlyExpense(lot);
		const profit = rent - expense - (lot.status === "Empty" ? 540 : 0);
		const ratio = rent > 0 ? profit / rent * 100 : profit < 0 ? -100 : null;
		const pets = (lot.dogs === "1" || lot.dogs === "2" ? Number(lot.dogs) : 0) + (lot.cats === "1" || lot.cats === "2" ? Number(lot.cats) : 0);
		const violations = (lot.violations ?? "").split(/\n+/).map((line) => line.trim()).filter(Boolean).length;
		const marks = ((lot.lateRent ?? "").trim() ? 1 : 0) + ((lot.bouncedCheck ?? "").trim() ? 1 : 0);
		const residents = lot.name.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean).length;
		const amount = {
			overall: ratio == null ? null : ratio - pets * 10 - violations * 5 - marks * 10 + (residents === 1 ? 10 : 0),
			roi: ratio,
			monthProfit: profit,
			yearProfit: profit * 12,
			monthExpense: expense,
			yearExpense: expense * 12,
			monthRent: rent,
			yearRent: rent * 12,
			owed: parseMoney(lot.balance) ?? 0
		}[metric];
		if (amount == null || ratio == null) return [];
		return [{
			lot,
			amount,
			ratio
		}];
	}).sort((a, b) => (worseHigh ? a.amount - b.amount : b.amount - a.amount) || Number(a.lot.lot) - Number(b.lot.lot));
	const paint = {};
	const standing = (amount) => {
		if (scored.length <= 1) return 100;
		return (scored.filter((row) => worseHigh ? row.amount > amount : row.amount < amount).length + scored.filter((row) => row.amount === amount).length) / scored.length * 100;
	};
	const label = (amount) => metric === "roi" ? `${Math.round(standing(amount))}%` : metric === "overall" ? `${Math.round(amount)}%` : shownAmount(String(Math.round(amount * 100) / 100));
	scored.forEach((row) => {
		const band = heatBand(standing(row.amount));
		const value = label(row.amount);
		paint[row.lot.id] = {
			fill: band.color,
			ink: heatInk(band.color),
			value
		};
	});
	const metricLabel = HEAT_METRICS.find((item) => item[0] === metric)?.[1] ?? "Value";
	const counted = scoped.filter((lot) => lot.status !== "Open");
	const rentSum = counted.reduce((sum, lot) => sum + (lot.status === "Empty" ? 0 : parseMoney(lot.rent) ?? 0), 0);
	const expenseSum = counted.reduce((sum, lot) => sum + monthlyExpense(lot), 0);
	const emptyCount = counted.filter((lot) => lot.status === "Empty").length;
	const profitSum = rentSum - expenseSum - emptyCount * 540;
	const owedSum = counted.reduce((sum, lot) => sum + (parseMoney(lot.balance) ?? 0), 0);
	const metricTotal = metric === "roi" ? rentSum > 0 ? profitSum / rentSum * 100 : profitSum < 0 ? -100 : 0 : metric === "overall" ? scored.length ? scored.reduce((sum, row) => sum + row.amount, 0) / scored.length : 0 : metric === "monthProfit" ? profitSum : metric === "yearProfit" ? profitSum * 12 : metric === "monthExpense" ? expenseSum : metric === "yearExpense" ? expenseSum * 12 : metric === "monthRent" ? rentSum : metric === "yearRent" ? rentSum * 12 : owedSum;
	const metricText = metric === "roi" || metric === "overall" ? `${Math.round(metricTotal)}%` : dollar(metricTotal);
	if (mini) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mini-heat",
		children: [
			1,
			2,
			3
		].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatMap, {
			sheet: id,
			query: "",
			filter: "all",
			selected,
			lots,
			heat: paint,
			onSelect: onOpen
		}, id))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo heat-board",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "financial-window-actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tab",
					onClick: () => {
						window.open(`${window.location.origin}${window.location.pathname}?view=heat`, "_blank", "noopener,noreferrer");
					},
					children: "Open financial dashboard in new window ↗"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: poolsOpen ? "expense-pools" : "expense-pools is-collapsed",
				"aria-label": "Annual expense assumptions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "expense-pools-head",
					"aria-expanded": poolsOpen,
					onClick: () => setPoolsOpen((open) => !open),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Annual expense assumptions" }), poolsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Adjust these community-wide costs to match actual bills. Values are saved in this browser." }) : null] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [dollar(annualPoolTotal), " / year"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "expense-toggle",
							"aria-hidden": "true",
							children: poolsOpen ? "▴" : "▾"
						})
					]
				}), poolsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "expense-pool-grid",
					children: poolLabels.map(({ key, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "expense-input-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "$" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": label + " annual shared expense",
								inputMode: "decimal",
								value: expensePools[key],
								onChange: (event) => updateExpensePool(key, event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/ yr" })
						]
					})] }, key))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "expense-pools-note",
					children: "Shared costs are split across occupied and empty lots. A cost typed on a lot in the detail window stays on that lot only. Home insurance is split only across lots marked Home insurance Yes. Wiring insurance is split only across lots marked Yes."
				})] }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "map-slot heat-metric-drop",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "filter",
					type: "button",
					"aria-expanded": metricsOpen,
					onClick: () => setMetricsOpen((open) => !open),
					children: [metricLabel, " ▾"]
				}), metricsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "map-drop filter-checks",
					role: "group",
					"aria-label": "Financial filters",
					children: HEAT_METRICS.map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: metric === id,
						onChange: () => setMetric((current) => current === id ? "overall" : id)
					}), name] }, id))
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "money-totals",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					metric === "roi" ? "Profit" : metricLabel,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: metricText })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "heat-legend",
				children: [HEAT_STOPS.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { background: stop.color } }), stop.label] }, stop.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { background: "#d5d0c8" } }), "No figure"] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Profit ranking · green to red · best to worst from left to right" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "heat-rank-strip",
				"aria-label": `Lots ranked best to worst by ${metricLabel}`,
				children: scored.map((row, index) => {
					const color = paint[row.lot.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-lot-id": row.lot.id,
						title: `Rank ${index + 1}: Lot ${row.lot.lot} · ${label(row.amount)}`,
						style: {
							background: color?.fill ?? "#d5d0c8",
							color: color?.ink ?? "#1c1916"
						},
						onClick: () => onOpen(row.lot.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: row.lot.lot }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label(row.amount) })]
					}, row.lot.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "map-stack",
				children: [
					1,
					2,
					3
				].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "map-block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: SHEET_COPY[id].title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatMap, {
						sheet: id,
						query: "",
						filter: "all",
						selected,
						lots,
						heat: paint,
						onSelect: onOpen
					})]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "heat-list-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { children: ["Best to worst · ", metricLabel] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "map-slot heat-metric-drop",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "filter",
						type: "button",
						"aria-expanded": listOpen,
						onClick: () => setListOpen((open) => !open),
						children: [metricLabel, " ▾"]
					}), listOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "map-drop filter-checks",
						role: "group",
						"aria-label": "Best to worst filters",
						children: HEAT_METRICS.map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: metric === id,
							onChange: () => setMetric((current) => current === id ? "overall" : id)
						}), name] }, id))
					}) : null]
				})]
			}),
			scored.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "todo-empty",
				children: "Nothing to color for this filter."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "heat-rank",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Lot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Address" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: metricLabel })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: scored.map((row, index) => {
					const color = paint[row.lot.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "heat-rank-lot",
						style: {
							background: color?.fill ?? "#d5d0c8",
							color: color?.ink ?? "#1c1916"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: index + 1 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onOpen(row.lot.id),
								children: row.lot.lot
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: [row.lot.address, row.lot.street].filter(Boolean).join(" ") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: displayName(row.lot) || "—" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: label(row.amount) })
						]
					}, row.lot.id);
				}) })]
			})
		]
	});
}
function formatTodoDate(stamp) {
	const [y, m, d] = stamp.split("-").map(Number);
	if (!y || !m || !d) return stamp;
	return new Date(y, m - 1, d).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function TodoList({ items, done, onToggle, onShift, onOpen, empty }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "todo-empty",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: items.map((item, index) => {
		const checked = done.has(item.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: checked ? "done" : "",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "todo-controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "todo-arrow",
						"aria-label": "Higher priority",
						disabled: index === 0,
						onClick: () => onShift(item.id, -1),
						children: "↑"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked,
						"aria-label": checked ? "Mark not done" : "Completed",
						onChange: () => onToggle(item.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "todo-arrow",
						"aria-label": "Lower priority",
						disabled: index === items.length - 1,
						onClick: () => onShift(item.id, 1),
						children: "↓"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "todo-card",
				type: "button",
				onClick: () => onOpen(item.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: item.date ? formatTodoDate(item.date) : "No date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Lot" }),
						" ",
						item.lot || "—"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Address" }),
						" ",
						item.address || "—"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Name" }),
						" ",
						item.name || "—"
					] }),
					item.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Due" }),
						" ",
						item.text
					] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("em", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Notes" }),
						" ",
						item.notes || "—"
					] })
				]
			})]
		}, item.id);
	}) });
}
function blankGuest() {
	return {
		name: "",
		year: "",
		make: "",
		tag: "",
		state: "",
		arrival: "",
		departure: "",
		card: null
	};
}
function GuestCards({ guests, onChange }) {
	function set(index, patch) {
		onChange(guests.map((guest, i) => i === index ? {
			...guest,
			...patch
		} : guest));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: guests.map((guest, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "guest-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: guests.length > 1 ? `Guest ${index + 1}` : "Guest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guest's name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: guest.name,
					onChange: (e) => set(index, { name: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Guest's vehicle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "guest-vehicle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: guest.year,
							onChange: (e) => set(index, { year: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Make" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: guest.make,
							onChange: (e) => set(index, { make: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tag" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: guest.tag,
							onChange: (e) => set(index, { tag: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: guest.state,
							onChange: (e) => set(index, { state: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "guest-vehicle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Arrival date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: guest.arrival,
						onChange: (e) => set(index, { arrival: e.target.value })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Departure date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: guest.departure,
						onChange: (e) => set(index, { departure: e.target.value })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSlot, {
				label: "Upload guest card",
				file: guest.card,
				onChange: (card) => set(index, { card })
			})
		]
	}, index)) });
}
function FileSlot({ label, file, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "doc-slot",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), file?.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "doc-file",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: file.data,
				download: file.name,
				children: file.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "doc-remove",
				type: "button",
				onClick: () => onChange(null),
				children: "Remove"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			onChange: async (e) => {
				const picked = e.target.files?.[0];
				e.target.value = "";
				if (!picked) return;
				const data = await fileToData(picked);
				if (!data) return;
				onChange({
					name: picked.name,
					data
				});
			}
		})]
	});
}
var INSPECTION_ITEMS = [
	["maintenance", "Maintenance"],
	["mow", "MOW"],
	["acCleaning", "AC cleaning"],
	["acService", "AC service"],
	["acFilter", "AC filter"],
	["roofAge", "Roof age"],
	["roofMaterial", "Roof material"],
	["roofInstalled", "Roof installed"],
	["roofReplace", "Roof needs replaced"],
	["pressureWash", "Pressure wash"]
];
function LotExtras({ values, onChange, onMoveOut, onRentRoll, part }) {
	const yn = (value) => value === "Yes" || value === "No" ? value : "";
	const [noticeOpen, setNoticeOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		part === "maintenance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Maintenance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.maintenance ?? "",
							placeholder: "Leak",
							onChange: (e) => onChange({ maintenance: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.maintCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ maintCost: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "MOW"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MOW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mow-select",
							value: values.noMow === "Yes" || values.noMow === "No" || values.noMow === "Owe" ? values.noMow : "",
							onChange: (e) => onChange({ noMow: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Owe" })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.mowCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ mowCost: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "AC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cleaning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.acCleaning ?? "",
							onChange: (e) => onChange({ acCleaning: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Service" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.acService ?? "",
							onChange: (e) => onChange({ acService: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.acFilter ?? "",
							onChange: (e) => onChange({ acFilter: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.acCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ acCost: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Roof"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Age" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.roofAge ?? "",
							onChange: (e) => onChange({ roofAge: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Material" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.roofMaterial ?? "",
							onChange: (e) => onChange({ roofMaterial: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date installed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.roofInstalled ?? "",
							onChange: (e) => onChange({ roofInstalled: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Needs replaced" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mow-select",
							value: yn(values.roofReplace),
							onChange: (e) => onChange({ roofReplace: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "No" })
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.roofCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ roofCost: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Pressure wash"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pressure wash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.pressureWash,
							onChange: (e) => onChange({ pressureWash: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.washCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ washCost: e.target.value })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Home inspection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "inventory",
						children: INSPECTION_ITEMS.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: values.inspectionChecks?.[key] === "Yes",
							onChange: (e) => {
								const checks = {
									...values.inspectionChecks ?? {},
									[key]: e.target.checked ? "Yes" : ""
								};
								onChange({
									inspectionChecks: checks,
									inspectionDate: INSPECTION_ITEMS.every(([id]) => checks[id] === "Yes") ? values.inspectionDate?.trim() || dayStamp() : ""
								});
							}
						}), label] }) }, key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: values.inspectionDate ?? "",
							onChange: (e) => onChange({ inspectionDate: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 4,
							value: values.inspectionNotes ?? "",
							onChange: (e) => onChange({ inspectionNotes: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cost" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.inspectCost ?? "",
							inputMode: "decimal",
							onChange: (e) => onChange({ inspectCost: e.target.value })
						})]
					})
				]
			})
		] }) : null,
		part === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Home inventory"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "inventory",
				children: [
					["fridge", "Refrigerator"],
					["stove", "Stove"],
					["washer", "Washer"],
					["dryer", "Dryer"],
					["microwave", "Microwave"]
				].map(([key, label]) => {
					const raw = String(values[key] ?? "").trim().toLowerCase();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: raw !== "" && raw !== "no",
						onChange: (e) => onChange({ [key]: e.target.checked ? "Yes" : "" })
					}), label] }) }, key);
				})
			})]
		}) : null,
		part === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Money"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.rent,
							onChange: (e) => onChange({
								rent: e.target.value,
								homeRent: rentGap(e.target.value, values.lotRent ?? "", petFee(values.dogs, values.cats))
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Late rent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.lateRent,
							onChange: (e) => onChange({ lateRent: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lot rent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.status === "Occupied" ? values.lotRent ?? "" : "",
							disabled: values.status !== "Occupied",
							onChange: (e) => onChange({ lotRent: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home rent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.homeRent ?? "",
							onChange: (e) => onChange({
								homeRent: e.target.value,
								rent: rentTotal(values.lotRent, e.target.value, petFee(values.dogs, values.cats))
							})
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pet fee · $15 each" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: String(petFee(values.dogs, values.cats)),
							readOnly: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "08/2026 increase" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.rentInc2026 ?? "",
							onChange: (e) => onChange({ rentInc2026: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "08/2027" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.rentInc2027 ?? "",
							onChange: (e) => onChange({ rentInc2027: e.target.value })
						})] })]
					}),
					onRentRoll ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "filter",
						type: "button",
						onClick: onRentRoll,
						children: "Rent increase"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bounced check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.bouncedCheck ?? "",
							onChange: (e) => onChange({ bouncedCheck: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Move-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: values.moveIn ?? "",
							onChange: (e) => onChange({ moveIn: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lease end" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: values.leaseEnd ?? "",
							onChange: (e) => onChange({ leaseEnd: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rent due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: values.rentDue ?? "",
							onChange: (e) => onChange({ rentDue: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deposit" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.deposit ?? "",
							onChange: (e) => onChange({ deposit: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Still owed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: values.balance ?? "",
							onChange: (e) => onChange({ balance: e.target.value })
						})] })]
					}),
					onMoveOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "filter move-out",
						type: "button",
						onClick: onMoveOut,
						children: "Move out"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviousTenants, {
				values,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
				title: "Notice",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: values.noticeDate ?? "",
							onChange: (e) => onChange({ noticeDate: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: values.noticeNote ?? "",
							onChange: (e) => onChange({ noticeNote: e.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "notice-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => printNotice(values),
							children: "Print notice"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => setNoticeOpen(true),
							children: "Upload notice"
						})]
					}),
					values.noticeFile?.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "qb-note",
						children: values.noticeFile.name
					}) : null
				]
			})
		] }) : null,
		part === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fold, {
			title: "Emergency contact",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.emergencyName ?? "",
					onChange: (e) => onChange({ emergencyName: e.target.value })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.emergencyPhone ?? "",
					onChange: (e) => onChange({ emergencyPhone: e.target.value })
				})] })]
			})
		}) : null,
		part === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
			title: "Eviction",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Court date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: values.courtDate ?? "",
					onChange: (e) => onChange({ courtDate: e.target.value })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "wiring-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 3,
					value: values.courtNote ?? "",
					onChange: (e) => onChange({ courtNote: e.target.value })
				})]
			})]
		}) : null,
		part === "empty" && values.status === "Empty" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Waiting list"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.waitName ?? "",
					onChange: (e) => onChange({ waitName: e.target.value })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.waitPhone ?? "",
					onChange: (e) => onChange({ waitPhone: e.target.value })
				})] })]
			})]
		}) : null,
		part === "maintenance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Maintenance log"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "filter",
					type: "button",
					onClick: () => onChange({ maintLog: [{
						id: String(Date.now()),
						date: dayStamp(),
						note: "",
						done: ""
					}, ...values.maintLog ?? []] }),
					children: "Add job"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "maint-log",
					children: sortedJobs(values.maintLog).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: parseDay(job.date),
							onChange: (e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { date: e.target.value }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: job.note,
							placeholder: "What was wrong",
							onChange: (e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { note: e.target.value }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: job.done === "Yes",
							onChange: (e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { done: e.target.checked ? "Yes" : "" }) })
						}), "Done"] })
					] }, job.id))
				})
			]
		}) : null,
		part === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Photo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							onChange({ photo: await fileToData(file) });
						}
					})]
				}),
				values.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "lot-photo",
					src: values.photo,
					alt: ""
				}) : null,
				values.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "doc-remove",
					type: "button",
					onClick: () => onChange({ photo: "" }),
					children: "Remove photo"
				}) : null
			]
		}) : null,
		part === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Documents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSlot, {
					label: "Lease",
					file: values.lease,
					onChange: (lease) => onChange({ lease })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSlot, {
					label: "Rules receipt",
					file: values.rulesReceipt,
					onChange: (rulesReceipt) => onChange({ rulesReceipt })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSlot, {
					label: "Background check",
					file: values.background,
					onChange: (background) => onChange({ background })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "doc-slot",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Any other" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							onChange: async (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								if (!file) return;
								const data = await fileToData(file);
								if (!data) return;
								onChange({ otherDocs: [...values.otherDocs ?? [], {
									name: file.name,
									data
								}] });
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "doc-list",
							children: (values.otherDocs ?? []).map((doc, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: doc.data,
								download: doc.name,
								children: doc.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "doc-remove",
								type: "button",
								onClick: () => onChange({ otherDocs: (values.otherDocs ?? []).filter((_, i) => i !== index) }),
								children: "Remove"
							})] }, `${doc.name}-${index}`))
						})
					]
				})
			]
		}), noticeOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "notice-pop",
			role: "presentation",
			onClick: () => setNoticeOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "notice-card",
				role: "dialog",
				"aria-label": "Upload notice",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Upload notice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "notice-who",
						children: [
							"Lot ",
							values.lot,
							" · ",
							displayName(values)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "notice-drop",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: values.noticeFile?.name || "Choose a PDF or photo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*,.pdf,application/pdf",
							onChange: async (e) => {
								const file = e.target.files?.[0];
								e.target.value = "";
								if (!file) return;
								const data = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? file.size > 4e6 ? "" : await readAsData(file) : await fileToData(file);
								if (!data) return;
								onChange({ noticeFile: {
									name: file.name,
									data
								} });
							}
						})]
					}),
					values.noticeFile?.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "doc-file",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: values.noticeFile.data,
							download: values.noticeFile.name,
							children: "Open file"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "doc-remove",
							type: "button",
							onClick: () => onChange({ noticeFile: null }),
							children: "Remove"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "notice-actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => printNotice(values),
							children: "Print notice"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "filter",
							type: "button",
							onClick: () => setNoticeOpen(false),
							children: "Close"
						})]
					})
				]
			})
		}) : null] }) : null
	] });
}
function PetSelects({ dogs, cats, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pet-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dogs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "mow-select",
			value: dogs === "1" || dogs === "2" ? dogs : "",
			onChange: (e) => onChange({ dogs: e.target.value }),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "1",
					children: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "2",
					children: "2"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cats" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "mow-select",
			value: cats === "1" || cats === "2" ? cats : "",
			onChange: (e) => onChange({ cats: e.target.value }),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "1",
					children: "1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "2",
					children: "2"
				})
			]
		})] })]
	});
}
function residentsOf(name) {
	const chunks = name.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean);
	if (chunks.length === 0) return [{
		first: "",
		last: ""
	}];
	return chunks.map(nameParts);
}
function joinResidents(people) {
	return people.map((person) => joinName(person.last, person.first)).filter(Boolean).join(" / ");
}
function NameSplit({ name, onChange }) {
	const [people, setPeople] = (0, import_react.useState)(() => residentsOf(name));
	const written = (0, import_react.useRef)(name);
	(0, import_react.useEffect)(() => {
		if (name === written.current) return;
		written.current = name;
		setPeople(residentsOf(name));
	}, [name]);
	function commit(next) {
		const list = next.length > 0 ? next : [{
			first: "",
			last: ""
		}];
		const joined = joinResidents(list);
		written.current = joined;
		setPeople(list);
		onChange?.(joined);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "name-residents",
		children: [people.map((person, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: index > 0 ? "name-split extra-resident" : "name-split",
			children: [
				index > 0 && onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "remove-resident",
					type: "button",
					"aria-label": "Remove resident",
					onClick: () => commit(people.filter((_, i) => i !== index)),
					children: "×"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "First name" }), onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: person.first,
					onChange: (e) => commit(people.map((item, i) => i === index ? {
						...item,
						first: e.target.value
					} : item))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "name-box",
					children: person.first || "—"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last name" }), onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: person.last,
					onChange: (e) => commit(people.map((item, i) => i === index ? {
						...item,
						last: e.target.value
					} : item))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "name-box",
					children: person.last || "—"
				})] })
			]
		}, index)), onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "add-resident",
			type: "button",
			onClick: () => commit([...people, {
				first: "",
				last: ""
			}]),
			children: "Add resident"
		}) : null]
	});
}
//#endregion
export { Home as component };
