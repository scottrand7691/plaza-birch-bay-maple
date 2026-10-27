import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type FormEvent } from "react";
import { PlatMap, SHEET_COPY, type SheetId } from "@/components/plat-maps";
import { buildTodo, dayStamp, depositReminder, displayName, isRenterLot, LOTS, matches, matchesFilter, moveOutLot, parseDay, petFee, rentGap, rentTotal, sheetOf, withEmptyMow, type Guest, type Lot, type LotFilter, type LotStatus, type MaintJob, type Stay } from "@/data/lots";
import { listVersions, readMaster, restoreVersion, saveBills, saveBoard, saveMowings, writeMaster } from "@/data/master.functions";
import { addBusinessAttachment, deleteBusinessAttachment, deleteBusinessTask, listBusinessAttachments, listBusinessHistory, listBusinessTasks, readBusinessAttachment, saveBusinessTask, type BusinessAttachment, type BusinessHistoryEntry, type BusinessTask } from "@/data/business.functions";

export const Route = createFileRoute("/")({ component: Home });

const STORAGE_KEY = "magnolia-lot-edits";
const STORAGE_AT = "magnolia-lot-edits-at";
const TODO_DONE_KEY = "magnolia-todo-done";
const TODO_RANK_KEY = "magnolia-todo-rank";
const MAP_KEY = "magnolia-last-map";
const CAMERA_KEY = "magnolia-camera-office";
const PLANT_CAMERA_KEY = "magnolia-camera-plant";
const ALARM_KEY = "magnolia-alarm-plant";
const ALARM_ON_KEY = "magnolia-alarm-on";
const DEVICE_LINKS = {
  office: { key: CAMERA_KEY, title: "Blue Iris", label: "Camera link", placeholder: "Paste the Blue Iris link" },
  plant: { key: PLANT_CAMERA_KEY, title: "Treatment plant camera", label: "Camera link", placeholder: "Paste the Blue Iris link" },
  alarm: { key: ALARM_KEY, title: "Alarm Connect", label: "Alarm link", placeholder: "Paste the Alarm Connect link" },
} as const;

function rememberLots(lots: Lot[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lots));
    localStorage.setItem(STORAGE_AT, new Date().toISOString());
  } catch {
    /* the master file is the copy that matters */
  }
}

let masterTimer = 0;
function queueMaster(lots: Lot[]) {
  window.clearTimeout(masterTimer);
  masterTimer = window.setTimeout(() => {
    void writeMaster({ data: { saved: new Date().toISOString(), lots } }).catch(() => {
      /* keep the browser copy if the file write fails */
    });
  }, 250);
}

function loadLots(): Lot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return LOTS.map(withEmptyMow);
    const saved = JSON.parse(raw) as Lot[];
    const byId = new Map(saved.map((lot) => [lot.id, lot]));
    return LOTS.map((lot) => {
      const next = byId.get(lot.id);
      if (!next) return withEmptyMow(lot);
      const status: LotStatus =
        next.status === "Empty" || next.status === "Open" || next.status === "Eviction" ? next.status : "Occupied";
      return withEmptyMow({ ...lot, ...next, id: lot.id, status, phone: next.phone?.trim() ? next.phone : lot.phone, bouncedCheck: next.bouncedCheck ?? "", maintenance: next.maintenance ?? "", dogs: next.dogs === "1" || next.dogs === "2" ? next.dogs : "", cats: next.cats === "1" || next.cats === "2" ? next.cats : "", wiring: next.wiring === "Yes" || next.wiring === "No" ? next.wiring : "", homeIns: next.homeIns === "Yes" || next.homeIns === "No" ? next.homeIns : "", homeInsDate: next.homeInsDate ?? "", readyPower: next.readyPower === "Yes" ? "Yes" : "", readyClean: next.readyClean === "Yes" ? "Yes" : "", readyInspected: next.readyInspected === "Yes" ? "Yes" : "", zillow: next.zillow === "Yes" || next.zillow === "No" ? next.zillow : "", zillowUrl: next.zillowUrl ?? "", homeYear: next.homeYear ?? "", homeMake: next.homeMake ?? "", homeModel: next.homeModel ?? "", homeWidth: next.homeWidth ?? "", homeLength: next.homeLength ?? "", homeWide: next.homeWide === "Single Wide" || next.homeWide === "Double Wide" ? next.homeWide : "", roofAge: next.roofAge ?? "", roofMaterial: next.roofMaterial ?? "", roofInstalled: next.roofInstalled ?? "", roofReplace: next.roofReplace === "Yes" || next.roofReplace === "No" ? next.roofReplace : "", acCleaning: next.acCleaning ?? "", acService: next.acService ?? "", inspectionDate: next.inspectionDate ?? "", inspectionNotes: next.inspectionNotes ?? "", moveIn: next.moveIn ?? "", rentDue: next.rentDue ?? "", deposit: next.deposit ?? "", balance: next.balance ?? "", noticeDate: next.noticeDate ?? "", noticeNote: next.noticeNote ?? "", photo: next.photo ?? "", lease: next.lease?.data ? next.lease : null, rulesReceipt: next.rulesReceipt?.data ? next.rulesReceipt : null, background: next.background?.data ? next.background : null, otherDocs: Array.isArray(next.otherDocs) ? next.otherDocs : [], leaseEnd: next.leaseEnd ?? "", emergencyName: next.emergencyName ?? "", emergencyPhone: next.emergencyPhone ?? "", courtDate: next.courtDate ?? "", courtNote: next.courtNote ?? "", waitName: next.waitName ?? "", waitPhone: next.waitPhone ?? "", history: Array.isArray(next.history) ? next.history : [], maintLog: Array.isArray(next.maintLog) ? next.maintLog : [], noticeFile: next.noticeFile?.data ? next.noticeFile : null, rentInc2026: next.rentInc2026 ?? "", rentInc2027: next.rentInc2027 ?? "" });
    });
  } catch {
    return LOTS.map(withEmptyMow);
  }
}

function printTodo(items: { lot: string; address: string; street: string; name: string; notes: string; text: string; date: string; done: boolean }[]) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rows = noteBands(items)
    .map(([label, group]) => {
      const cards = group
        .map(
          (item) => `<article class="${item.done ? "done" : ""}">
        <p class="when">${escapeHtml(item.date ? formatTodoDate(item.date) : "No date")}${item.done ? " · Done" : ""}</p>
        <p><b>Lot</b> ${escapeHtml(item.lot || "—")}</p>
        <p><b>Address</b> ${escapeHtml(item.address || "—")}</p>
        <p><b>Name</b> ${escapeHtml(item.name || "—")}</p>
        ${item.text ? `<p><b>Due</b> ${escapeHtml(item.text)}</p>` : ""}
        <p><b>Notes</b> ${escapeHtml(item.notes || "—")}</p>
      </article>`,
        )
        .join("");
      return `<h2>${escapeHtml(label)}</h2>${cards}`;
    })
    .join("");
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

const MAP_PRINT_CSS = `
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

function mapMarkup(id: SheetId) {
  const root = document.getElementById(`map-${id}`) ?? document.querySelector(".map-stage");
  const svg = root?.querySelector("svg");
  if (!svg) return "";
  const clone = svg.cloneNode(true) as SVGSVGElement;
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

function openMapPrint(title: string, body: string, page: "landscape" | "portrait" | "mixed") {
  const pageCss =
    page === "portrait"
      ? "@page { size: portrait; margin: 0.35in; }"
      : page === "landscape"
        ? "@page { size: landscape; margin: 0.35in; }"
        : "@page land { size: landscape; margin: 0.35in; } @page port { size: portrait; margin: 0.35in; } section.land { page: land; break-after: page; } section.port { page: port; }";
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

function printMap(id: SheetId) {
  const svg = mapMarkup(id);
  if (!svg) return;
  openMapPrint(SHEET_COPY[id].title, `<h1>${escapeHtml(SHEET_COPY[id].title)}</h1>${svg}`, id === 3 ? "portrait" : "landscape");
}

function escapeHtml(value: string) {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const gt = "&" + "gt;";
  const quot = "&" + "quot;";
  const apos = "&" + "#39;";
  return value.replace(/&/g, amp).replace(/</g, lt).replace(/>/g, gt).replace(/"/g, quot).replace(/'/g, apos);
}

function prettyDate(value?: string) {
  const day = parseDay(value);
  const date = day ? new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) : new Date();
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function printNotice(lot: Lot) {
  const win = window.open("", "_blank");
  if (!win) return;
  const file = lot.noticeFile?.data ?? "";
  const attached = file.startsWith("data:image/")
    ? `<img src="${file}" alt="Notice" />`
    : file.startsWith("data:application/pdf")
      ? `<iframe src="${file}" title="Notice"></iframe>`
      : "";
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

const EXPORT_COLUMNS: { key: keyof Lot; label: string }[] = [
  { key: "lot", label: "Lot" },
  { key: "address", label: "Address" },
  { key: "street", label: "Street" },
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "renter", label: "Renter/Owner" },
  { key: "rent", label: "Rental Amount" },
  { key: "lotRent", label: "Lot rent" },
  { key: "homeRent", label: "Home rent" },
  { key: "rentInc2026", label: "08/2026" },
  { key: "rentInc2027", label: "08/2027" },
  { key: "moveIn", label: "Move-in" },
  { key: "rentDue", label: "Rent due" },
  { key: "deposit", label: "Deposit" },
  { key: "balance", label: "Still owed" },
  { key: "noticeDate", label: "Notice date" },
  { key: "noticeNote", label: "Notice note" },
  { key: "issues", label: "Issues" },
  { key: "maintenance", label: "Maintenance" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "noMow", label: "MOW" },
  { key: "lateRent", label: "Late Rent" },
  { key: "bouncedCheck", label: "Bounced Check" },
  { key: "roofAge", label: "Roof age" },
  { key: "roofMaterial", label: "Roof material" },
  { key: "roofInstalled", label: "Roof installed" },
  { key: "roofReplace", label: "Roof needs replaced" },
  { key: "dogs", label: "Dogs" },
  { key: "cats", label: "Cats" },
  { key: "wiring", label: "Home wiring insurance" },
  { key: "homeIns", label: "Home insurance" },
  { key: "homeInsDate", label: "Insurance expires" },
  { key: "readyPower", label: "Power on" },
  { key: "readyClean", label: "Cleaned" },
  { key: "readyInspected", label: "Inspected" },
  { key: "zillow", label: "Listed on Zillow" },
  { key: "zillowUrl", label: "Zillow link" },
  { key: "homeYear", label: "Year" },
  { key: "homeMake", label: "Make" },
  { key: "homeModel", label: "Model" },
  { key: "homeWidth", label: "Width" },
  { key: "homeLength", label: "Length" },
  { key: "homeWide", label: "Single or double" },
];

function csvCell(value: string) {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function downloadRegister(lots: Lot[]) {
  const lines = [
    EXPORT_COLUMNS.map((col) => csvCell(col.label)).join(","),
    ...lots.map((lot) => EXPORT_COLUMNS.map((col) => csvCell(String(lot[col.key] ?? ""))).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "magnolia-register.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
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

function importRegister(text: string, current: Lot[]) {
  const rows = parseCsv(text);
  if (rows.length < 2) return current;
  const header = rows[0].map((item) => item.trim().toLowerCase());
  const lotIndex = header.findIndex((item) => item === "lot");
  if (lotIndex < 0) return current;
  const keys = header.map((name) => EXPORT_COLUMNS.find((col) => col.label.toLowerCase() === name)?.key);
  const incoming = new Map<string, Partial<Lot>>();
  for (const line of rows.slice(1)) {
    const lotNo = line[lotIndex]?.trim();
    if (!lotNo) continue;
    const patch: Partial<Lot> = {};
    keys.forEach((key, index) => {
      if (!key || key === "id" || key === "lot") return;
      (patch as Record<string, string>)[key] = line[index] ?? "";
    });
    incoming.set(lotNo, patch);
  }
  return current.map((lot) => {
    const patch = incoming.get(lot.lot);
    if (!patch) return lot;
    const status: LotStatus =
      patch.status === "Empty" || patch.status === "Open" || patch.status === "Eviction" || patch.status === "Occupied"
        ? patch.status
        : lot.status;
    return { ...lot, ...patch, id: lot.id, lot: lot.lot, status, photo: lot.photo, lease: lot.lease, rulesReceipt: lot.rulesReceipt, background: lot.background, otherDocs: lot.otherDocs };
  });
}

function readAsData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function fileToData(file: File) {
  if (file.type.startsWith("image/")) {
    const raw = await readAsData(file);
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const max = 720;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(raw);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => resolve(raw);
      img.src = raw;
    });
  }
  if (file.size > 1_200_000) return "";
  return readAsData(file);
}

function downloadEverything(lots: Lot[]) {
  const blob = new Blob([JSON.stringify({ saved: new Date().toISOString(), lots }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "magnolia-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importEverything(text: string, current: Lot[]) {
  const parsed = JSON.parse(text) as { lots?: Lot[] } | Lot[];
  const incoming = Array.isArray(parsed) ? parsed : parsed.lots ?? [];
  const byId = new Map(incoming.map((lot) => [lot.id, lot]));
  return current.map((lot) => {
    const next = byId.get(lot.id);
    if (!next) return lot;
    const status: LotStatus =
      next.status === "Empty" || next.status === "Open" || next.status === "Eviction" ? next.status : "Occupied";
    return { ...lot, ...next, id: lot.id, lot: lot.lot, status };
  });
}

function lotNumberIn(text: string) {
  const match = text.match(/\blot\s*#?\s*(\d+(?:\.5)?)\b/i);
  return match?.[1] ?? "";
}

function lastToken(name: string) {
  const head = name.split(",")[0]?.trim() || name.trim();
  return head.split(/\s+/).pop()?.toLowerCase() ?? "";
}

function moneyText(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function importFromQuickBooks(text: string, current: Lot[]) {
  const hits = parseQuickBooks(text);
  const used = new Set<string>();
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
  return { lots: next, updated, missed };
}

type QbHit = { lotNo: string; name: string; phone: string; email: string; balance: number | null; paid: number };

function parseQuickBooks(text: string): QbHit[] {
  if (/(^|\n)!?(CUST|TRNS|ENDTRNS)\b/.test(text) && text.includes("\t")) return parseIif(text);
  return parseQuickBooksCsv(text);
}

function parseIif(text: string): QbHit[] {
  const byName = new Map<string, QbHit>();
  let headers: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (line.startsWith("!")) {
      headers = cols.map((col) => col.replace(/^!/, "").toUpperCase());
      continue;
    }
    const rec: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (header) rec[header] = cols[index] ?? "";
    });
    const kind = (cols[0] ?? "").toUpperCase();
    if (kind === "CUST") {
      const name = rec.NAME || rec.COMPANYNAME || "";
      const hit = byName.get(name.toLowerCase()) ?? blankHit(name);
      hit.lotNo = hit.lotNo || lotNumberIn([name, rec.NOTE, rec.BADDR1, rec.BADDR2, rec.BADDR3].join(" "));
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

function parseQuickBooksCsv(text: string): QbHit[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const col = (...names: string[]) => header.findIndex((cell) => names.some((name) => cell.includes(name)));
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
      paid: 0,
    };
  });
}

function blankHit(name: string): QbHit {
  return { lotNo: lotNumberIn(name), name, phone: "", email: "", balance: null, paid: 0 };
}

function numberOrNull(value: string) {
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned || cleaned === "-") return null;
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

function matchQuickBooksLot(lots: Lot[], hit: QbHit) {
  if (hit.lotNo) {
    const byLot = lots.find((lot) => lot.lot === hit.lotNo);
    if (byLot) return byLot;
  }
  const stripped = hit.name.replace(/^lot\s*\d+(?:\.5)?\s*[-–:]?\s*/i, "").trim();
  const token = lastToken(stripped);
  if (!token || token.length < 2) return undefined;
  const named = lots.filter((lot) => {
    const lotToken = lastToken(lot.name);
    return lotToken === token || lot.name.trim().toLowerCase() === stripped.toLowerCase();
  });
  return named.length === 1 ? named[0] : undefined;
}

const BUSINESS_CATEGORIES = ["License / permit", "Vehicle", "Title work", "Insurance", "Tax / bill", "Maintenance", "Inspection", "Vendor", "Other"];
const BUSINESS_STATUSES = ["Open", "In progress", "Waiting", "Completed"];
const BUSINESS_KEY = "magnolia-business-tasks";

function businessDays(date: string) {
  if (!date) return null;
  const value = new Date(date + "T00:00:00");
  if (!Number.isFinite(value.getTime())) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((value.getTime() - today.getTime()) / 86400000);
}

function readFileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      const comma = value.indexOf(",");
      if (comma < 0) reject(new Error("The selected file could not be read."));
      else resolve(value.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("The selected file could not be read."));
    reader.readAsDataURL(file);
  });
}

function noteTasksFromLots(lots: Lot[]): BusinessTask[] {
  return buildTodo(lots).flatMap((item) => {
    const hay = `${item.notes}\n${item.text}`;
    const hit = (["title", "insurance", "power"] as const).find((word) => new RegExp(`\\b${word}`, "i").test(hay));
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
      notes: [item.notes, item.text].filter(Boolean).join(" · "),
    }];
  });
}

function BusinessBoard({ lots }: { lots: Lot[] }) {
  const [tasks, setTasks] = useState<BusinessTask[]>([]);
  const [parkBills, setParkBills] = useState<ParkBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("magnolia-business-hidden") ?? "[]");
      return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  });
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Title work");
  const [dueDate, setDueDate] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [owner, setOwner] = useState("");
  const [cost, setCost] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<Record<string, BusinessAttachment[]>>({});
  const [history, setHistory] = useState<Record<string, BusinessHistoryEntry[]>>({});
  const [expandedAttachments, setExpandedAttachments] = useState<Record<string, boolean>>({});
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});
  const [legacyCount, setLegacyCount] = useState(0);
  const [dismissedNotes, setDismissedNotes] = useState<Set<string>>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("magnolia-business-note-dismissed") ?? "[]");
      return new Set(Array.isArray(raw) ? raw.filter((id) => typeof id === "string") : []);
    } catch {
      return new Set();
    }
  });
  const boardTasks = useMemo(() => {
    const saved = new Set(tasks.map((task) => task.id));
    const fromNotes = noteTasksFromLots(lots).filter((task) => !saved.has(task.id) && !dismissedNotes.has(task.id) && !hiddenTasks.has(task.id));
    return [...fromNotes, ...tasks.filter((task) => !hiddenTasks.has(task.id))];
  }, [lots, tasks, dismissedNotes, hiddenTasks]);

  useEffect(() => {
    let active = true;
    try {
      const legacy = JSON.parse(localStorage.getItem(BUSINESS_KEY) ?? "[]");
      if (Array.isArray(legacy) && !localStorage.getItem(BUSINESS_KEY + "-imported")) {
        setLegacyCount(legacy.filter((item) => item && typeof item.title === "string").length);
      }
    } catch { /* ignore malformed legacy browser data */ }
    void listBusinessTasks().then((rows) => {
      if (!active) return;
      setTasks(rows.filter((row) => !hiddenTasks.has(row.id)));
      setLoading(false);
    }).catch((error: unknown) => {
      if (!active) return;
      setStorageError(error instanceof Error ? error.message : "Shared task storage is unavailable.");
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const active = boardTasks.filter((task) => task.status !== "Completed");
  const overdue = active.filter((task) => { const days = businessDays(task.dueDate); return days !== null && days < 0; });
  const upcoming = active.filter((task) => { const days = businessDays(task.dueDate); return days !== null && days >= 0 && days <= 30; });
  const followUpsDue = active.filter((task) => { const days = businessDays(task.followUp); return days !== null && days <= 0; });
  const waiting = active.filter((task) => task.status === "Waiting");
  const filtered = boardTasks.filter((task) => (
    filter === "All" || task.category === filter || task.status === filter ||
    (filter === "Overdue" && task.status !== "Completed" && businessDays(task.dueDate) !== null && businessDays(task.dueDate)! < 0) ||
    (filter === "Due soon" && task.status !== "Completed" && businessDays(task.dueDate) !== null && businessDays(task.dueDate)! >= 0 && businessDays(task.dueDate)! <= 30) ||
    (filter === "Follow-up due" && task.status !== "Completed" && businessDays(task.followUp) !== null && businessDays(task.followUp)! <= 0)
  ) && [task.title, task.category, task.owner, task.reference, task.notes].join(" ").toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (b.status === "Completed" && a.status !== "Completed") return -1;
    return (businessDays(a.dueDate) ?? 99999) - (businessDays(b.dueDate) ?? 99999);
  });

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setSaving(true); setStorageError("");
    const existing = editingId ? tasks.find((item) => item.id === editingId) : undefined;
    const task: BusinessTask = {
      id: existing?.id ?? crypto.randomUUID(), title: title.trim(), category, dueDate, followUp,
      status: existing?.status ?? "Open", owner: owner.trim(), cost: cost.trim(), reference: reference.trim(), notes: notes.trim(),
    };
    try {
      const saved = await saveBusinessTask({ data: { task, action: existing ? "Updated" : "Created" } });
      setTasks((current) => existing ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setTitle(""); setDueDate(""); setFollowUp(""); setOwner(""); setCost(""); setReference(""); setNotes("");
      setCategory("Title work"); setShowForm(false); setEditingId(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Task could not be saved.");
    } finally { setSaving(false); }
  }

  async function changeStatus(task: BusinessTask, status: string) {
    const next = { ...task, status };
    setStorageError("");
    try {
      const saved = await saveBusinessTask({ data: { task: next, action: "Updated" } });
      setTasks((current) => current.map((item) => item.id === saved.id ? saved : item));
      setHistory((current) => { const copy = { ...current }; delete copy[task.id]; return copy; });
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Task status could not be saved.");
    }
  }

  function beginEdit(task: BusinessTask) {
    setEditingId(task.id);
    setTitle(task.title); setCategory(task.category); setDueDate(task.dueDate); setFollowUp(task.followUp);
    setOwner(task.owner); setCost(task.cost); setReference(task.reference); setNotes(task.notes);
    setShowForm(true);
    setStorageError("");
  }

  async function removeTask(task: BusinessTask) {
    setConfirmId(null);
    setHiddenTasks((current) => {
      const next = new Set(current);
      next.add(task.id);
      localStorage.setItem("magnolia-business-hidden", JSON.stringify([...next]));
      return next;
    });
    if (task.id.startsWith("lot-note:")) {
      setDismissedNotes((current) => {
        const next = new Set(current);
        next.add(task.id);
        localStorage.setItem("magnolia-business-note-dismissed", JSON.stringify([...next]));
        return next;
      });
    }
    setTasks((current) => current.filter((item) => item.id !== task.id));
    if (task.id.startsWith("lot-note:") && !tasks.some((item) => item.id === task.id)) return;
    try {
      await deleteBusinessTask({ data: { id: task.id } });
      setAttachments((current) => { const copy = { ...current }; delete copy[task.id]; return copy; });
      setHistory((current) => { const copy = { ...current }; delete copy[task.id]; return copy; });
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Task could not be removed from shared storage, but it is hidden here.");
    }
  }

  async function toggleAttachments(taskId: string) {
    const open = !expandedAttachments[taskId];
    setExpandedAttachments((current) => ({ ...current, [taskId]: open }));
    if (open && !attachments[taskId]) {
      try {
        const rows = await listBusinessAttachments({ data: { taskId } });
        setAttachments((current) => ({ ...current, [taskId]: rows }));
      } catch (error) { setStorageError(error instanceof Error ? error.message : "Attachments could not be loaded."); }
    }
  }

  async function uploadAttachment(task: BusinessTask, file?: File) {
    if (!file) return;
    setStorageError("");
    try {
      const dataBase64 = await readFileBase64(file);
      const attachment = await addBusinessAttachment({ data: {
        taskId: task.id, name: file.name, mimeType: file.type || "application/octet-stream",
        size: file.size, dataBase64,
      }});
      setAttachments((current) => ({ ...current, [task.id]: [attachment, ...(current[task.id] ?? [])] }));
      setExpandedAttachments((current) => ({ ...current, [task.id]: true }));
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Attachment could not be uploaded.");
    }
  }

  async function downloadAttachment(attachment: BusinessAttachment) {
    try {
      const file = await readBusinessAttachment({ data: { id: attachment.id } });
      if (!file) throw new Error("Attachment not found.");
      const binary = atob(file.dataBase64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: file.mimeType }));
      const link = document.createElement("a"); link.href = url; link.download = file.name; link.click();
      URL.revokeObjectURL(url);
    } catch (error) { setStorageError(error instanceof Error ? error.message : "Attachment could not be downloaded."); }
  }

  async function removeAttachment(taskId: string, attachmentId: string) {
    try {
      await deleteBusinessAttachment({ data: { id: attachmentId } });
      setAttachments((current) => ({ ...current, [taskId]: (current[taskId] ?? []).filter((item) => item.id !== attachmentId) }));
    } catch (error) { setStorageError(error instanceof Error ? error.message : "Attachment could not be removed."); }
  }

  async function toggleHistory(taskId: string) {
    const open = !expandedHistory[taskId];
    setExpandedHistory((current) => ({ ...current, [taskId]: open }));
    if (open && !history[taskId]) {
      try {
        const rows = await listBusinessHistory({ data: { taskId } });
        setHistory((current) => ({ ...current, [taskId]: rows }));
      } catch (error) { setStorageError(error instanceof Error ? error.message : "Change history could not be loaded."); }
    }
  }

  async function importLegacyTasks() {
    let legacy: unknown;
    try { legacy = JSON.parse(localStorage.getItem(BUSINESS_KEY) ?? "[]"); } catch { legacy = []; }
    if (!Array.isArray(legacy) || !legacy.length) { setLegacyCount(0); return; }
    if (!window.confirm("Import tasks saved in this browser into the currently signed-in account? This does not delete the browser copy.")) return;
    setSaving(true); setStorageError("");
    try {
      const imported: BusinessTask[] = [];
      for (const raw of legacy) {
        if (!raw || typeof raw !== "object") continue;
        const old = raw as Partial<BusinessTask>;
        if (!old.title || !old.category) continue;
        const task: BusinessTask = {
          id: crypto.randomUUID(), title: String(old.title).slice(0, 200),
          category: BUSINESS_CATEGORIES.includes(String(old.category)) ? String(old.category) : "Other",
          dueDate: String(old.dueDate ?? ""), followUp: String(old.followUp ?? ""),
          status: BUSINESS_STATUSES.includes(String(old.status)) ? String(old.status) : "Open",
          owner: String(old.owner ?? ""), cost: String(old.cost ?? ""), reference: String(old.reference ?? ""), notes: String(old.notes ?? ""),
        };
        imported.push(await saveBusinessTask({ data: { task, action: "Created" } }));
      }
      setTasks((current) => [...imported, ...current]);
      localStorage.setItem(BUSINESS_KEY + "-imported", new Date().toISOString());
      setLegacyCount(0);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Some legacy tasks could not be imported.");
    } finally { setSaving(false); }
  }

  function exportTasks() {
    const headers = ["Task", "Category", "Due date", "Follow-up date", "Status", "Responsible", "Cost", "Reference", "Notes"];
    const rows = boardTasks.map((task) => [task.title, task.category, task.dueDate, task.followUp, task.status, task.owner, task.cost, task.reference, task.notes]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => '"' + String(cell ?? "").replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "business-task-tracker.csv"; link.click(); URL.revokeObjectURL(url);
  }

  return <div className="business-board">
    <div className="business-metrics">
      <button className="business-metric metric-overdue" type="button" onClick={() => setFilter("Overdue")}><span>Overdue</span><strong>{overdue.length}</strong><small>Past due · incomplete</small></button>
      <button className="business-metric" type="button" onClick={() => setFilter("Due soon")}><span>Due in 30 days</span><strong>{upcoming.length}</strong><small>Upcoming deadlines</small></button>
      <button className="business-metric" type="button" onClick={() => setFilter("Follow-up due")}><span>Follow-up due</span><strong>{followUpsDue.length}</strong><small>Check on the next action</small></button>
      <button className="business-metric" type="button" onClick={() => setFilter("Title work")}><span>Open title work</span><strong>{active.filter((task) => task.category === "Title work").length}</strong><small>Transfers and documents</small></button>
    </div>
    <div className="business-filters"><button type="button" aria-pressed={filter === "All"} onClick={() => setFilter("All")}>All tasks</button><button type="button" aria-pressed={filter === "Overdue"} onClick={() => setFilter("Overdue")}>Overdue</button><button type="button" aria-pressed={filter === "Due soon"} onClick={() => setFilter("Due soon")}>Due in 30 days</button><button type="button" aria-pressed={filter === "Follow-up due"} onClick={() => setFilter("Follow-up due")}>Follow-up due</button>{BUSINESS_CATEGORIES.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}{BUSINESS_STATUSES.map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    <div className="business-heading"><div><p className="eyebrow">OPERATIONS WORKSPACE</p><h2>Business center</h2><p className="business-subtitle">Shared renewals, title work, registrations, documents, and follow-ups.</p></div><div className="business-heading-actions"><button className="business-secondary" type="button" onClick={exportTasks}>Export CSV</button><button className="business-primary" type="button" onClick={() => setShowForm((open) => !open)}>{showForm ? "Cancel" : "+ Add task"}</button></div></div>
    <BillsBoard onChange={setParkBills}>
      <BusinessCalendar tasks={boardTasks} bills={parkBills} />
    </BillsBoard>
    {storageError ? <div className="business-error" role="alert">{storageError}<button className="business-secondary" type="button" onClick={() => setStorageError("")}>Dismiss</button></div> : null}
    {legacyCount > 0 ? <div className="business-notice"><span>{legacyCount} older task(s) were found in this browser and have not been moved to shared storage.</span><button className="business-secondary" type="button" disabled={saving} onClick={() => void importLegacyTasks()}>Import to my account</button></div> : null}
    {showForm ? <form className="business-form" onSubmit={(event) => void addTask(event)}><div className="business-form-title"><div><h3>{editingId ? "Edit business task" : "Create business task"}</h3><p>Track the deadline, next action, and reference details.</p></div></div>
      <label className="business-field business-field-wide">Task name<input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Submit title transfer for Lot 24" /></label>
      <label className="business-field">Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{BUSINESS_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="business-field">Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label>
      <label className="business-field">Follow-up date<input type="date" value={followUp} onChange={(event) => setFollowUp(event.target.value)} /></label>
      <label className="business-field">Responsible person<input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Name or team" /></label>
      <label className="business-field">Cost / fee ($)<input inputMode="decimal" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="0.00" /></label>
      <label className="business-field">Reference number<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="VIN, title case, permit #" /></label>
      <label className="business-field business-field-wide">Notes<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Missing documents, agency contact, next action…" /></label>
      <div className="business-form-actions"><button className="business-secondary" type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button><button className="business-primary" type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Save changes" : "Save task"}</button></div>
    </form> : null}
    <div className="business-list-head"><div><h3>Business task register</h3><p>{loading ? "Loading shared records…" : filtered.length + " records · nearest deadline first"}</p></div><input aria-label="Search business tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, people, references…" /></div>
    {loading ? <div className="business-empty"><h3>Loading your shared task register</h3><p>Checking the shared database…</p></div> : filtered.length ? <div className="business-task-list">{filtered.map((task) => { const days = businessDays(task.dueDate); const followDays = businessDays(task.followUp); const dueLabel = days === null ? "No due date" : days < 0 ? Math.abs(days) + "d overdue" : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : "Due in " + days + " days"; return <article className={"business-task " + (task.status === "Completed" ? "task-completed" : "")} key={task.id}>
      <div className="business-task-main"><span className="business-category">{task.category}</span><h4>{task.title}</h4><div className="business-task-meta">{task.owner ? <span>Owner: {task.owner}</span> : null}{task.reference ? <span>Ref: {task.reference}</span> : null}{task.cost ? <span>{"Fee: $" + task.cost}</span> : null}{task.followUp ? <span>Follow-up: {task.followUp}{followDays !== null && followDays <= 0 && task.status !== "Completed" ? " · due now" : ""}</span> : null}</div>{task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim() ? <p className="business-task-notes">{task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim()}</p> : null}{(loadTaskStickies()[task.id] ?? []).map((sticky) => <p className="business-task-notes task-sticky" key={sticky.id} style={{ background: sticky.color }}>{sticky.text}</p>)}
        <div className="business-inline-actions"><button className="business-secondary" type="button" onClick={() => void toggleAttachments(task.id)}>{expandedAttachments[task.id] ? "Hide documents" : "Documents (" + (attachments[task.id]?.length ?? "…") + ")"}</button><button className="business-secondary" type="button" onClick={() => void toggleHistory(task.id)}>{expandedHistory[task.id] ? "Hide history" : "Change history"}</button></div>
        {expandedAttachments[task.id] ? <div className="business-detail-panel"><label className="business-field">Attach PDF or image (max 3 MB)<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void uploadAttachment(task, file); }} /></label>{(attachments[task.id] ?? []).map((item) => <div className="business-attachment" key={item.id}><span>{item.name} · {(item.size / 1024).toFixed(0)} KB</span><button className="business-secondary" type="button" onClick={() => void downloadAttachment(item)}>Download</button><button className="business-delete" type="button" onClick={() => void removeAttachment(task.id, item.id)}>Remove</button></div>)}</div> : null}
        {expandedHistory[task.id] ? <div className="business-detail-panel"><h5>Recent changes</h5>{(history[task.id] ?? []).length ? (history[task.id] ?? []).map((entry) => <div className="business-history-entry" key={entry.id}><strong>{entry.action}</strong><span>{new Date(entry.changedAt).toLocaleString()}</span><small>{entry.snapshot.title || "Task record"}</small></div>) : <p>No change history available.</p>}</div> : null}
      </div>
      <div className="business-task-actions"><div className={"business-due " + (days !== null && days < 0 && task.status !== "Completed" ? "due-overdue" : days !== null && days <= 7 && task.status !== "Completed" ? "due-soon" : "")}>{task.status === "Completed" ? "Completed" : dueLabel}</div><button className="business-secondary" type="button" onClick={() => beginEdit(task)}>Edit</button><select aria-label={"Status for " + task.title} value={task.status} onChange={(event) => void changeStatus(task, event.target.value)}>{BUSINESS_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>{confirmId === task.id ? <span className="remove-confirm"><span>Are you sure?</span><button className="business-primary" type="button" onClick={() => void removeTask(task)}>Confirm</button><button className="business-secondary" type="button" onClick={() => setConfirmId(null)}>Cancel</button></span> : <button className="business-delete" type="button" onClick={() => setConfirmId(task.id)} aria-label={"Delete " + task.title}>Remove</button>}</div>
    </article>; })}</div> : <div className="business-empty"><div className="business-empty-icon">✓</div><h3>{tasks.length ? "No matching tasks" : "Your business task list is ready"}</h3><p>{tasks.length ? "Try another search or filter." : "Add a license renewal, vehicle registration, title transfer, or follow-up to start tracking deadlines."}</p>{!tasks.length ? <button className="business-primary" type="button" onClick={() => setShowForm(true)}>+ Add your first task</button> : <button className="business-secondary" type="button" onClick={() => { setSearch(""); setFilter("All"); }}>Clear filters</button>}</div>}
    <p className="business-storage-note">Tasks, change history, and attachments are stored in the shared database and scoped to the signed-in account. Due-date reminders appear in this workspace; external email or push notifications require a separately configured delivery provider.</p>
  </div>;
}

type BoardNote = { id: string; kind: "message" | "sticky" | "reminder" | "pin"; text: string; when: string; color: string; x?: number; y?: number; pin?: string };

const BOARD_KEY = "magnolia-meeting-board";
const TASK_STICKY_KEY = "magnolia-task-stickies";
type TaskSticky = { id: string; text: string; color: string };

function loadTaskStickies(): Record<string, TaskSticky[]> {
  try {
    const raw = JSON.parse(localStorage.getItem(TASK_STICKY_KEY) ?? "{}") as Record<string, TaskSticky[]>;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function writeTaskSticky(taskId: string, sticky: TaskSticky) {
  const all = loadTaskStickies();
  const list = Array.isArray(all[taskId]) ? all[taskId] : [];
  if (!list.some((item) => item.id === sticky.id)) all[taskId] = [...list, sticky];
  localStorage.setItem(TASK_STICKY_KEY, JSON.stringify(all));
}

function eraseTaskSticky(id: string) {
  const all = loadTaskStickies();
  for (const key of Object.keys(all)) all[key] = (all[key] ?? []).filter((item) => item.id !== id);
  localStorage.setItem(TASK_STICKY_KEY, JSON.stringify(all));
}
const STICKY_COLORS = [
  "rgba(240, 130, 0, 0.76)",
  "rgba(170, 255, 0, 0.7)",
  "rgba(70, 160, 255, 0.62)",
  "rgba(255, 64, 64, 0.55)",
  "rgba(255, 230, 40, 0.75)",
];

function loadBoard(): BoardNote[] {
  try {
    const raw = JSON.parse(localStorage.getItem(BOARD_KEY) ?? "[]") as BoardNote[];
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => item && typeof item.text === "string" && (item.kind === "message" || item.kind === "sticky" || item.kind === "reminder" || item.kind === "pin"));
  } catch {
    return [];
  }
}

function PinMarks({ notes, pin, open, onOpen, onRemove }: { notes: BoardNote[]; pin: string; open: string; onOpen: (id: string) => void; onRemove: (id: string) => void }) {
  const pins = notes.filter((note) => note.kind === "pin" && note.pin === pin);
  if (!pins.length) return null;
  return (
    <span className="pin-marks">
      {pins.map((item) => (
        <span className="pin-wrap" key={item.id}>
          <button type="button" className="pin-mark" style={{ background: item.color || "#ffe56a" }} aria-label="Open sticky note" onClick={(event) => { event.stopPropagation(); onOpen(open === item.id ? "" : item.id); }} />
          {open === item.id ? (
            <span className="pin-pop" role="note">
              {item.text}
              <button type="button" aria-label="Remove sticky" onClick={() => onRemove(item.id)}>×</button>
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

function taskStickyNotes(task: BusinessTask): BoardNote[] {
  const found: BoardNote[] = [];
  for (const match of task.notes.matchAll(/\[\[sticky:([^|\]]+)\|([^\]]+)\]\]([^\n]*)/g)) {
    found.push({ id: match[2], kind: "pin", text: match[3], when: "", color: match[1], pin: `task:${task.id}` });
  }
  return found;
}

function dropTarget(nodes: Element[]) {
  for (const node of nodes) {
    const el = node as HTMLElement;
    const task = el.closest?.("[data-task-id]") as HTMLElement | null;
    if (task?.dataset.taskId) return `task:${task.dataset.taskId}`;
    const todo = el.closest?.("[data-todo-id]") as HTMLElement | null;
    if (todo?.dataset.todoId) return `todo:${todo.dataset.todoId}`;
    const day = el.closest?.("[data-date]") as HTMLElement | null;
    if (day?.dataset.date) return `date:${day.dataset.date}`;
    const message = el.closest?.("[data-message-id]") as HTMLElement | null;
    if (message?.dataset.messageId) return `message:${message.dataset.messageId}`;
    const lot = el.closest?.("[data-lot-id]") as HTMLElement | null;
    if (lot?.dataset.lotId) return `lot:${lot.dataset.lotId}`;
  }
  return "";
}

function stickySpot(note: BoardNote, index: number) {
  return {
    x: typeof note.x === "number" ? note.x : (index % 4) * 176 + 12,
    y: typeof note.y === "number" ? note.y : Math.floor(index / 4) * 140 + 12,
  };
}

function MeetingBoard({ lots, onOpen, onSave }: { lots: Lot[]; onOpen: (id: string) => void; onSave: (lot: Lot) => void }) {
  const [notes, setNotes] = useState<BoardNote[]>(() => (typeof window === "undefined" ? [] : loadBoard()));
  const [text, setText] = useState("");
  const [stickyText, setStickyText] = useState("");
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[4]);
  const [messageColor, setMessageColor] = useState(STICKY_COLORS[4]);
  const [colorOpen, setColorOpen] = useState(false);
  const [messageColorOpen, setMessageColorOpen] = useState(false);
  const composeDrag = useRef<{ dx: number; dy: number; x: number; y: number; w: number; sx: number; sy: number; live: boolean } | null>(null);
  const [when, setWhen] = useState("");
  const [ready, setReady] = useState(false);
  const [biz, setBiz] = useState<BusinessTask[]>([]);
  const [bills, setBills] = useState<ParkBill[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number; x: number; y: number; homeX: number; homeY: number } | null>(null);
  const [dragging, setDragging] = useState("");
  const [dropHint, setDropHint] = useState("");
  const [openPin, setOpenPin] = useState("");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [dragTick, setDragTick] = useState(0);
  useEffect(() => {
    let active = true;
    void readMaster()
      .then((book) => {
        if (!active) return;
        const saved = Array.isArray(book?.board) ? (book.board as BoardNote[]) : [];
        if (saved.length) {
          setNotes((current) => {
            const map = new Map<string, BoardNote>();
            for (const item of saved) if (item && typeof item.text === "string") map.set(item.id, item);
            for (const item of current) if (item && typeof item.text === "string") map.set(item.id, item);
            return [...map.values()];
          });
        }
        if (Array.isArray(book?.bills)) setBills(book.bills.filter((item) => item && typeof (item as ParkBill).name === "string") as ParkBill[]);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setReady(true);
      });
    void listBusinessTasks()
      .then((rows) => {
        if (active) setBiz(rows);
      })
      .catch(() => {});
    try {
      const local = JSON.parse(localStorage.getItem(BILLS_KEY) ?? "[]") as ParkBill[];
      if (Array.isArray(local)) setBills(local.filter((item) => item && typeof item.name === "string"));
    } catch {
      /* the calendar still shows tasks */
    }
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(BOARD_KEY, JSON.stringify(notes));
    } catch {
      /* the notes stay on screen */
    }
    const timer = window.setTimeout(() => {
      void saveBoard({ data: { board: notes } }).catch(() => {});
    }, 400);
    return () => window.clearTimeout(timer);
  }, [notes, ready]);
  useEffect(() => {
    const root = frameRef.current;
    if (!root) return;
    const boxes = [...root.querySelectorAll<HTMLElement>("[data-resize]")];
    for (const el of boxes) {
      try {
        const saved = JSON.parse(localStorage.getItem("magnolia-resize-" + el.dataset.resize) ?? "") as { w?: number; h?: number };
        if (saved.w && el.dataset.resize !== "tasks" && el.dataset.resize !== "todo" && el.dataset.resize !== "calendar" && el.dataset.resize !== "finance" && el.dataset.resize !== "messages") el.style.width = `${saved.w}px`;
        if (saved.h && el.dataset.resize !== "tasks" && el.dataset.resize !== "todo" && el.dataset.resize !== "calendar" && el.dataset.resize !== "finance") el.style.height = `${saved.h}px`;
      } catch {
        /* keep the starting size */
      }
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const id = el.dataset.resize;
        if (!id) continue;
        localStorage.setItem("magnolia-resize-" + id, JSON.stringify({ w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) }));
      }
    });
    boxes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!ready) return;
    setNotes((current) => {
      const have = new Set(current.map((item) => item.id));
      const extra: BoardNote[] = [];
      for (const lot of lots) {
        for (const sticky of lot.stickies ?? []) {
          if (!have.has(sticky.id)) extra.push({ id: sticky.id, kind: "pin", text: sticky.text, when: "", color: sticky.color, pin: `todo:${lot.id}` });
        }
      }
      for (const task of biz) {
        for (const sticky of taskStickyNotes(task)) {
          if (!have.has(sticky.id)) extra.push(sticky);
        }
      }
      for (const [taskId, stickies] of Object.entries(loadTaskStickies())) {
        for (const sticky of stickies) {
          if (!have.has(sticky.id)) extra.push({ id: sticky.id, kind: "pin", text: sticky.text, when: "", color: sticky.color, pin: `task:${taskId}` });
        }
      }
      return extra.length ? [...extra, ...current] : current;
    });
  }, [lots, biz, ready]);
  function add(kind: BoardNote["kind"]) {
    const body = text.trim();
    if (!body || (kind === "reminder" && !when)) return;
    setNotes((current) => {
      const stickiesNow = current.filter((item) => item.kind === "sticky").length;
      return [{ id: `board-${Date.now()}`, kind, text: body, when: kind === "reminder" ? when : "", color: kind === "message" ? messageColor : STICKY_COLORS[current.length % STICKY_COLORS.length], x: kind === "sticky" ? 12 + (stickiesNow % 4) * 176 : undefined, y: kind === "sticky" ? 12 : undefined }, ...current];
    });
    setText("");
    if (kind === "reminder") setWhen("");
  }
  function pinCompose(pin: string) {
    const body = stickyText.trim();
    if (!body) return;
    const id = `pin-${Date.now()}`;
    const target = pin.startsWith("lot:") ? `todo:${pin.slice(4)}` : pin;
    setNotes((current) => [{ id, kind: "pin", text: body, when: "", color: stickyColor, pin: target }, ...current]);
    try {
      const saved = loadBoard().filter((item) => item.id !== id);
      localStorage.setItem(BOARD_KEY, JSON.stringify([{ id, kind: "pin", text: body, when: "", color: stickyColor, pin: target }, ...saved]));
    } catch {
      /* the next render writes the board again */
    }
    setStickyText("");
    setOpenPin(id);
    rememberPin(id, body, stickyColor, target);
  }
  function rememberPin(id: string, body: string, color: string, target: string) {
    const lotId = target.startsWith("todo:") ? target.slice(5) : target.startsWith("task:lot-note:") ? target.slice("task:lot-note:".length) : "";
    if (lotId) {
      const lot = lots.find((item) => item.id === lotId);
      if (lot) onSave({ ...lot, stickies: [...(lot.stickies ?? []), { id, text: body, color }] });
    }
    if (target.startsWith("task:")) {
      const taskId = target.slice(5);
      writeTaskSticky(taskId, { id, text: body, color });
      const task = biz.find((item) => item.id === taskId);
      if (task && !taskId.startsWith("lot-note:")) {
        const notesText = `${task.notes ? `${task.notes}\n` : ""}[[sticky:${color}|${id}]]${body}`;
        const next = { ...task, notes: notesText };
        setBiz((current) => current.map((item) => (item.id === taskId ? next : item)));
        void saveBusinessTask({ data: { task: next, action: "Updated" } })
          .then((saved) => setBiz((current) => current.map((item) => (item.id === saved.id ? saved : item))))
          .catch(() => {});
      }
    }
  }
  function forgetPin(id: string) {
    setNotes((current) => current.filter((item) => item.id !== id));
    eraseTaskSticky(id);
    const lot = lots.find((item) => item.stickies?.some((sticky) => sticky.id === id));
    if (lot) onSave({ ...lot, stickies: (lot.stickies ?? []).filter((sticky) => sticky.id !== id) });
    const task = biz.find((item) => item.notes.includes(`|${id}]]`));
    if (task) {
      const notesText = task.notes.split("\n").filter((line) => !line.includes(`|${id}]]`)).join("\n").trim();
      void saveBusinessTask({ data: { task: { ...task, notes: notesText }, action: "Updated" } })
        .then((saved) => setBiz((current) => current.map((item) => (item.id === saved.id ? saved : item))))
        .catch(() => {});
    }
  }
  const todos = useMemo(() => buildTodo(lots), [lots]);
  const business = useMemo(() => {
    const saved = new Set(biz.map((task) => task.id));
    return [...noteTasksFromLots(lots).filter((task) => !saved.has(task.id)), ...biz].filter((task) => task.status !== "Completed");
  }, [biz, lots]);
  const reminders = notes.filter((note) => note.kind === "reminder").sort((a, b) => a.when.localeCompare(b.when));
  const stickies = notes.filter((note) => note.kind === "sticky");
  const messages = notes.filter((note) => note.kind === "message");
  return (
    <div className="meeting-board" ref={frameRef}>
      <div className="meeting-main">
        <div className="meeting-tiles">
          <section className="meeting-tile bulletin-tile">
            <h2>Meeting Board</h2>
            <div className="meeting-compose">
              <div
                className={composeDrag.current ? "compose-sticky-wrap is-dragging" : "compose-sticky-wrap"}
                style={composeDrag.current ? { background: stickyColor, position: "fixed", left: composeDrag.current.x, top: composeDrag.current.y, width: composeDrag.current.w, zIndex: 80, pointerEvents: "none" } : { background: stickyColor }}
                onPointerDown={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest("button") || !stickyText.trim()) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  composeDrag.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, x: rect.left, y: rect.top, w: rect.width, sx: event.clientX, sy: event.clientY, live: false };
                }}
                onPointerMove={(event) => {
                  const active = composeDrag.current;
                  if (!active) return;
                  if (!active.live) {
                    if (Math.hypot(event.clientX - active.sx, event.clientY - active.sy) < 4) return;
                    active.live = true;
                    (event.currentTarget.querySelector("textarea") as HTMLTextAreaElement | null)?.blur();
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }
                  active.x = event.clientX - active.dx;
                  active.y = event.clientY - active.dy;
                  const hint = dropTarget(document.elementsFromPoint(event.clientX, event.clientY));
                  setDropHint((current) => (current === hint ? current : hint));
                  setDragTick((tick) => tick + 1);
                }}
                onPointerUp={(event) => {
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
                    setNotes((current) => [{ id: `board-${Date.now()}`, kind: "sticky", text: body, when: "", color: stickyColor, x: left, y: top }, ...current]);
                    setStickyText("");
                  }
                }}
              >
                <button type="button" className="sticky-color" style={{ background: stickyColor }} aria-label="Choose sticky color" aria-expanded={colorOpen} onMouseDown={(event) => event.preventDefault()} onClick={() => setColorOpen((open) => !open)} />
                {colorOpen ? (
                  <span className="sticky-colors">
                    {STICKY_COLORS.map((color) => (
                      <button key={color} type="button" style={{ background: color }} aria-label={`Sticky color ${color}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { setStickyColor(color); setColorOpen(false); }} />
                    ))}
                  </span>
                ) : null}
                <textarea
                  className="compose-sticky"
                  rows={3}
                  value={stickyText}
                  placeholder="Sticky note"
                  onChange={(event) => setStickyText(event.target.value)}
                />
              </div>
            </div>
          </section>
          <div className="message-float meeting-tile" data-resize="messages">
            {messages.length > 2 ? (
              <button type="button" className="message-all" onClick={() => setMessagesOpen((open) => !open)}>{messagesOpen ? "Show latest" : "All messages"}</button>
            ) : null}
            {messages.length ? (
              <ul className="meeting-messages">
                {(messagesOpen ? messages : messages.slice(0, 2)).map((note, index) => (
                  <li key={note.id} data-message-id={note.id} className={dropHint === `message:${note.id}` ? "drop-ready" : ""} style={{ background: note.color || "#fff" }}>
                    <p>{index === 0 ? <b>Latest</b> : index === 1 ? <b>Previous</b> : null} {note.text}</p>
                    <PinMarks notes={notes} pin={`message:${note.id}`} open={openPin} onOpen={setOpenPin} onRemove={forgetPin} />
                    <button type="button" aria-label="Remove message" onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))}>×</button>
                  </li>
                ))}
              </ul>
            ) : <p className="message-empty">No messages yet.</p>}
            <div className="message-compose">
              <textarea
                className="message-write"
                rows={2}
                value={text}
                placeholder="Write a message"
                style={{ background: messageColor }}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    add("message");
                  }
                }}
              />
              <button type="button" className="sticky-color message-color" style={{ background: messageColor }} aria-label="Choose message color" aria-expanded={messageColorOpen} onMouseDown={(event) => event.preventDefault()} onClick={() => setMessageColorOpen((open) => !open)} />
              {messageColorOpen ? (
                <span className="sticky-colors message-colors">
                  {STICKY_COLORS.map((color) => (
                    <button key={color} type="button" style={{ background: color }} aria-label={`Message color ${color}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { setMessageColor(color); setMessageColorOpen(false); }} />
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        <section className="mini-list resize-box" data-resize="tasks">
          <h3>Business tasks</h3>
          {business.length === 0 ? <p>No open tasks.</p> : (
            <ul>
              {business.map((task) => {
                const lotId = task.id.startsWith("lot-note:") ? task.id.slice("lot-note:".length) : "";
                const fromLot = (lots.find((lot) => lot.id === lotId)?.stickies ?? []).map((sticky) => ({ id: sticky.id, kind: "pin" as const, text: sticky.text, when: "", color: sticky.color, pin: `task:${task.id}` }));
                const fromSaved = (loadTaskStickies()[task.id] ?? []).filter((sticky) => !notes.some((item) => item.id === sticky.id)).map((sticky) => ({ id: sticky.id, kind: "pin" as const, text: sticky.text, when: "", color: sticky.color, pin: `task:${task.id}` }));
                const pinned = [...notes, ...fromLot, ...fromSaved].filter((note) => note.kind === "pin" && note.pin === `task:${task.id}`);
                const seen = new Set<string>();
                const shown = pinned.filter((note) => {
                  const key = note.text.trim().toLowerCase();
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                return (
                <li key={task.id} data-task-id={task.id} className={dropHint === `task:${task.id}` ? "drop-ready" : ""}>
                  <b>{task.title}</b>
                  <small>{task.category}{task.dueDate ? ` · ${task.dueDate}` : ""}</small>
                  <PinMarks notes={shown} pin={`task:${task.id}`} open={openPin} onOpen={setOpenPin} onRemove={forgetPin} />
                </li>
                );
              })}
            </ul>
          )}
        </section>
        <section className="mini-list resize-box" data-resize="todo">
          <h3>To-Do</h3>
          {todos.length === 0 ? <p>Nothing open.</p> : (
            <ul>
              {todos.map((item) => (
                <li key={item.id} data-todo-id={item.id} className={dropHint === `todo:${item.id}` ? "drop-ready" : ""}>
                  <button type="button" onClick={() => onOpen(item.id)}>
                    <b>Lot {item.lot}</b> {item.name || "—"}
                    <small>{item.notes || item.text || "No notes"}</small>
                  </button>
                  <PinMarks
                    notes={[
                      ...notes.map((note) => (note.pin === `lot:${item.id}` ? { ...note, pin: `todo:${item.id}` } : note)),
                      ...(lots.find((lot) => lot.id === item.id)?.stickies ?? [])
                        .filter((sticky) => !notes.some((note) => note.id === sticky.id))
                        .map((sticky) => ({ id: sticky.id, kind: "pin" as const, text: sticky.text, when: "", color: sticky.color, pin: `todo:${item.id}` })),
                    ]}
                    pin={`todo:${item.id}`}
                    open={openPin}
                    onOpen={setOpenPin}
                    onRemove={forgetPin}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="mini-calendar resize-box" data-resize="calendar">
          <BusinessCalendar
            mini
            dropDate={dropHint.startsWith("date:") ? dropHint.slice(5) : ""}
            pins={notes.filter((note) => note.kind === "pin" && note.pin?.startsWith("date:"))}
            openPin={openPin}
            onPin={setOpenPin}
            bills={bills}
            tasks={[
              ...business,
              ...reminders.map((note) => ({ id: note.id, title: note.text, category: "Other", dueDate: note.when, followUp: "", status: "Open", owner: "", cost: "", reference: "", notes: note.text })),
            ]}
          />
        </section>
        <section className="mini-finance resize-box" data-resize="finance">
          <h3>Financial</h3>
          <HeatBoard lots={lots} scoped={lots} selected={null} onOpen={onOpen} mini />
        </section>
        </div>
        {reminders.length ? (
          <section>
            <h3>Reminders</h3>
            <ul className="meeting-reminders">
              {reminders.map((note) => (
                <li key={note.id} className={note.when < dayStamp() ? "is-due" : ""}>
                  <time>{formatTodoDate(note.when)}</time>
                  <p>{note.text}</p>
                  <button type="button" aria-label="Remove reminder" onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))}>×</button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      {stickies.map((note) => {
        const live = drag.current?.id === note.id;
        const spot = live ? { x: drag.current!.x, y: drag.current!.y } : { x: note.x ?? 40, y: note.y ?? 80 };
        return (
          <article
            key={note.id}
            className={dragging === note.id ? "sticky is-dragging" : "sticky"}
            style={{ background: note.color, position: "fixed", left: spot.x, top: spot.y, zIndex: live ? 80 : 30, pointerEvents: live ? "none" : "auto" }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              const rect = event.currentTarget.getBoundingClientRect();
              drag.current = { id: note.id, dx: event.clientX - rect.left, dy: event.clientY - rect.top, x: rect.left, y: rect.top, homeX: rect.left, homeY: rect.top };
              setDragging(note.id);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const active = drag.current;
              if (!active || active.id !== note.id) return;
              active.x = event.clientX - active.dx;
              active.y = event.clientY - active.dy;
              const hint = dropTarget(document.elementsFromPoint(event.clientX, event.clientY));
              setDropHint((current) => (current === hint ? current : hint));
              setDragTick((tick) => tick + 1);
            }}
            onPointerUp={(event) => {
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
                setNotes((current) => current.map((item) => (item.id === note.id ? { ...item, kind: "pin", pin: target, x: undefined, y: undefined } : item)));
                setOpenPin(note.id);
                return;
              }
              setNotes((current) => current.map((item) => (item.id === note.id ? { ...item, x: left, y: top } : item)));
            }}
          >
            <button type="button" aria-label="Remove sticky" onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))}>×</button>
            <p>{note.text}</p>
          </article>
        );
      })}
    </div>
  );
}

const BILLS_KEY = "magnolia-park-bills";
const BILL_ROWS = [
  { id: "taxes", name: "Taxes" },
  { id: "electric", name: "Electric" },
  { id: "power", name: "Power" },
  { id: "water", name: "Water" },
  { id: "garbage", name: "Garbage" },
  { id: "utilities", name: "Pay utilities" },
  { id: "cards", name: "Credit cards" },
  { id: "wiring", name: "Wiring insurance" },
] as const;

type ParkBill = { id: string; name: string; amount: string; due: string };

function moneyNumber(value: string) {
  const n = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function billTone(days: number | null) {
  if (days === null) return "";
  if (days > 15) return "bill-green";
  if (days > 0) return "bill-orange";
  return "bill-red";
}

function billDueLabel(days: number | null) {
  if (days === null) return "Set a due date";
  if (days > 1) return `Due in ${days} days`;
  if (days === 1) return "Due in 1 day";
  if (days === 0) return "Due today";
  return `${Math.abs(days)} days past due`;
}

function BillsBoard({ onChange, children }: { onChange?: (bills: ParkBill[]) => void; children?: ReactNode }) {
  const [bills, setBills] = useState<ParkBill[]>(() => BILL_ROWS.map((row) => ({ ...row, amount: "", due: "" })));
  const [ready, setReady] = useState(false);
  const edited = useRef(false);

  useEffect(() => {
    let cancel = false;
    void readMaster()
      .then((book) => {
        if (cancel || edited.current) return;
        const saved = Array.isArray(book?.bills) ? (book.bills as Partial<ParkBill>[]) : null;
        const local = (() => {
          try {
            return JSON.parse(localStorage.getItem(BILLS_KEY) ?? "[]") as Partial<ParkBill>[];
          } catch {
            return [];
          }
        })();
        const source = saved?.some((item) => item.amount || item.due) ? saved : local;
        if (source.length) {
          setBills(
            BILL_ROWS.map((row) => {
              const found = source.find((item) => item.id === row.id);
              return { ...row, amount: found?.amount ?? "", due: found?.due ?? "" };
            }),
          );
        }
      })
      .catch(() => {
        /* the blank rows stay editable */
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
    } catch {
      /* the numbers stay on screen */
    }
    const timer = window.setTimeout(() => {
      onChange?.(bills);
      void saveBills({ data: { bills } }).catch(() => {
        /* the browser copy is still there */
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [bills, ready, onChange]);

  function update(id: string, patch: Partial<ParkBill>) {
    edited.current = true;
    setBills((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  return (
    <div className="bills-board">
      {children}
      <div className="bill-list">
        {bills.map((bill) => {
          const days = businessDays(bill.due);
          const tone = billTone(days);
          return (
            <article className={"bill-row " + tone} key={bill.id}>
              <h3>{bill.name}</h3>
              <label>
                Amount
                <input
                  inputMode="decimal"
                  value={bill.amount}
                  placeholder="0"
                  onChange={(event) => update(bill.id, { amount: event.target.value })}
                />
              </label>
              <label>
                Due date
                <input type="date" value={bill.due} onChange={(event) => update(bill.id, { due: event.target.value })} />
              </label>
              <p className={"bill-days " + tone}>{billDueLabel(days)}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

type CalendarItem = { date: string; title: string; kind: "due" | "follow" | "bill" };

function calendarStamp(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function calendarDays(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function nextDate(stamp: string) {
  const day = new Date(stamp + "T00:00:00");
  day.setDate(day.getDate() + 1);
  return calendarStamp(day).replace(/-/g, "");
}

function BusinessCalendar({ tasks, bills, mini = false, dropDate = "", pins = [], openPin = "", onPin }: { tasks: BusinessTask[]; bills: ParkBill[]; mini?: boolean; dropDate?: string; pins?: BoardNote[]; openPin?: string; onPin?: (id: string) => void }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [note, setNote] = useState("");
  const items = useMemo(() => {
    const rows: CalendarItem[] = [];
    for (const task of tasks) {
      if (task.status === "Completed") continue;
      if (task.dueDate) rows.push({ date: task.dueDate, title: task.title || "Task due", kind: "due" });
      if (task.followUp) rows.push({ date: task.followUp, title: `${task.title || "Task"} follow-up`, kind: "follow" });
    }
    for (const bill of bills) {
      if (bill.due) rows.push({ date: bill.due, title: `${bill.name} bill`, kind: "bill" });
    }
    return rows;
  }, [tasks, bills]);
  const days = calendarDays(cursor);
  const today = calendarStamp(new Date());
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function syncGoogle() {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Magnolia Estates//Business Center//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
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

  return (
    <section className={mini ? "park-calendar is-mini" : "park-calendar"}>
      <div className="park-calendar-head">
        <div>
          {mini ? null : <p className="eyebrow">CALENDAR</p>}
          <h3>{monthLabel}</h3>
        </div>
        <div className="park-calendar-actions">
          <button type="button" className="business-secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month">‹</button>
          <button type="button" className="business-secondary" onClick={() => setCursor(new Date())}>Today</button>
          <button type="button" className="business-secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month">›</button>
          {mini ? null : <button type="button" className="business-primary" onClick={syncGoogle}>Sync Google Calendar</button>}
        </div>
      </div>
      {note ? <p className="park-calendar-note">{note}</p> : null}
      <div className="park-calendar-week">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="park-calendar-grid">
        {days.map((day) => {
          const stamp = calendarStamp(day);
          const here = items.filter((item) => item.date === stamp);
          const outside = day.getMonth() !== cursor.getMonth();
          return (
            <div data-date={stamp} className={"park-day" + (outside ? " is-outside" : "") + (stamp === today ? " is-today" : "") + (dropDate === stamp ? " drop-ready" : "")} key={stamp + (outside ? "-x" : "")}>
              <strong>{day.getDate()}</strong>
              {pins.filter((note) => note.pin === `date:${stamp}`).map((note) => (
                <span className="pin-wrap" key={note.id}>
                  <button type="button" className="pin-mark" style={{ background: note.color || "#ffe56a" }} aria-label="Open sticky note" onClick={() => onPin?.(openPin === note.id ? "" : note.id)} />
                  {openPin === note.id ? <span className="pin-pop" role="note">{note.text}</span> : null}
                </span>
              ))}
              {here.slice(0, mini ? 1 : 3).map((item) => <em className={"cal-" + item.kind} key={item.kind + item.title}>{item.title}</em>)}
              {here.length > (mini ? 1 : 3) ? <em className="cal-more">+{here.length - (mini ? 1 : 3)}</em> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Home() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const backupRef = useRef<HTMLInputElement>(null);
  const quickBooksRef = useRef<HTMLInputElement>(null);
  const [sheet, setSheet] = useState<SheetId>(1);
  const [main, setMain] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LotFilter[]>([]);
  const [selected, setSelected] = useState<string | null>("1");
  const [view, setView] = useState<"map" | "register" | "todo" | "mow" | "increase" | "alert" | "heat" | "business" | "meeting">(() => (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("view") === "heat" ? "heat" : "map"));
  const [registerMode, setRegisterMode] = useState<"short" | "full" | "homes">("short");
  const [matchAt, setMatchAt] = useState(0);
  const [legendOn, setLegendOn] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [device, setDevice] = useState<keyof typeof DEVICE_LINKS | null>(null);
  const [deviceUrl, setDeviceUrl] = useState("");
  const [alarmOn, setAlarmOn] = useState(false);
  const [mapsOpen, setMapsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [versions, setVersions] = useState<{ id: string; saved: string; count: number }[] | null>(null);
  const [qbNote, setQbNote] = useState("");

  const [lots, setLots] = useState<Lot[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);
  const dirtyRef = useRef(false);
  const masterReady = useRef(false);
  const mapReady = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MAP_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { main?: boolean; sheet?: number };
        if (saved.sheet === 1 || saved.sheet === 2 || saved.sheet === 3) setSheet(saved.sheet);
        if (typeof saved.main === "boolean") setMain(saved.main);
      }
    } catch {
      /* keep the default map */
    }
    mapReady.current = true;
    try {
      setDeviceUrl(localStorage.getItem(CAMERA_KEY) ?? "");
      setAlarmOn(localStorage.getItem(ALARM_ON_KEY) === "Yes");
    } catch {
      /* the camera link can be typed in */
    }
  }, []);

  function openDevice(kind: keyof typeof DEVICE_LINKS) {
    let stored = "";
    try {
      stored = localStorage.getItem(DEVICE_LINKS[kind].key) ?? "";
    } catch {
      stored = "";
    }
    setDeviceUrl(stored);
    setDevice(kind);
  }

  useEffect(() => {
    if (!mapReady.current) return;
    localStorage.setItem(MAP_KEY, JSON.stringify({ main, sheet }));
  }, [main, sheet]);

  useEffect(() => {
    let cancel = false;
    void (async () => {
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
          const byId = new Map((master.lots as Lot[]).map((lot) => [lot.id, lot]));
          next = local.map((lot) => withEmptyMow({ ...(byId.get(lot.id) ?? {}), ...lot, id: lot.id }));
        } else if (master?.lots?.length) {
          next = (master.lots as Lot[]).map((lot) => withEmptyMow(lot));
        } else await writeMaster({ data: { saved: new Date().toISOString(), lots: local } });
      } catch {
        /* open the browser copy if the master file cannot be read */
      }
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

  const lotsRef = useRef(lots);
  lotsRef.current = lots;

  useEffect(() => {
    if (!hydrated || !masterReady.current) return;
    const id = window.setTimeout(() => {
      rememberLots(lotsRef.current);
      queueMaster(lotsRef.current);
    }, 300);
    return () => window.clearTimeout(id);
  }, [lots, hydrated]);

  useEffect(() => {
    if (!hydrated || !masterReady.current) return;
    const flush = () => {
      rememberLots(lotsRef.current);
      void writeMaster({ data: { saved: new Date().toISOString(), lots: lotsRef.current } }).catch(() => {});
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [hydrated]);

  function saveLot(next: Lot) {
    const prevLot = lotsRef.current.find((item) => item.id === next.id);
    const parkRate = lotsRef.current.find((item) => item.status === "Occupied" && (item.lotRent ?? "").trim())?.lotRent?.trim() || "540";
    const draft = next.status === "Occupied" && !(next.lotRent ?? "").trim() ? { ...next, lotRent: parkRate } : next;
    const lotRentChanged = Boolean(prevLot && (prevLot.lotRent ?? "").trim() && draft.status === "Occupied" && (prevLot.lotRent ?? "") !== (draft.lotRent ?? ""));
    const totalOnly = Boolean(prevLot && prevLot.rent !== draft.rent && (prevLot.homeRent ?? "") === (draft.homeRent ?? "") && !lotRentChanged);
    const edited = withEmptyMow(totalOnly ? { ...draft, homeRent: rentGap(draft.rent, draft.lotRent ?? "", petFee(draft.dogs, draft.cats)) } : draft);
    dirtyRef.current = true;
    setLots((prev) => {
      const nextLots = prev.map((item) => {
        if (lotRentChanged && item.status === "Occupied") return withEmptyMow({ ...item, ...(item.id === edited.id ? edited : {}), lotRent: edited.lotRent ?? "" });
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

  const visible = useMemo(() => {
    return lots.filter((lot) => (filter.length === 0 || filter.some((item) => matchesFilter(lot, item))) && matches(lot, query));
  }, [lots, filter, query]);

  const sig = `${filter.join(",")}|${query}`;
  const prevSig = useRef(sig);

  useEffect(() => {
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
      setRegisterMode((mode) => (mode === "homes" ? "short" : mode));
    }
  }, [sig, query, filter, visible]);

  function choose(id: string) {
    setSelected(id);
    const index = visible.findIndex((item) => item.id === id);
    if (index >= 0) setMatchAt(index);
  }

  function openLot(id: string) {
    choose(id);
    const next = sheetOf(id);
    if (next) {
      setSheet(next);
      setMain(false);
    }
  }

  function showMatch(index: number) {
    if (visible.length === 0) return;
    const at = ((index % visible.length) + visible.length) % visible.length;
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

  const visibleIds = useMemo(() => new Set(visible.map((lot) => lot.id)), [visible]);
  const lot = lots.find((item) => item.id === selected) ?? null;
  const empty = useMemo(() => lots.reduce((n, item) => n + (item.status === "Empty" ? 1 : 0), 0), [lots]);
  const notes = useMemo(() => lots.reduce((n, item) => n + (item.issues.trim() ? 1 : 0), 0), [lots]);
  const mapLabel = main ? "Main" : SHEET_COPY[sheet].title;
  const filterNames = (
    [
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
      ["lease-ending", "Lease ending"],
    ] as const
  );
  const filterLabel = filter.length === 0 ? "" : filter.length === 1 ? filterNames.find(([id]) => id === filter[0])?.[1] ?? "" : `${filter.length} on`;
  const narrowed = query.trim() !== "" || filter.length > 0;

  useEffect(() => {
    if (!mapsOpen && !filtersOpen && !dataOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".map-slot")) return;
      setMapsOpen(false);
      setFiltersOpen(false);
      setDataOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
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
  }, [mapsOpen, filtersOpen, dataOpen]);

  return (
    <main className="app">
      <svg className="icon-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <pattern id="maintStripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#fff200" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#000" strokeWidth="2" />
          </pattern>
          <pattern id="roofStripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#2f6bff" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeWidth="2" />
          </pattern>
        </defs>
      </svg>
      {device ? (
        <form
          className="camera-panel"
          onSubmit={(e) => {
            e.preventDefault();
            const url = deviceUrl.trim();
            const key = DEVICE_LINKS[device].key;
            try {
              localStorage.setItem(key, url);
            } catch {
              /* the link still opens this time */
            }
            if (url) window.open(url, "_blank", "noopener,noreferrer");
          }}
        >
          <h2>{DEVICE_LINKS[device].title}</h2>
          <label>
            {DEVICE_LINKS[device].label}
            <input
              autoFocus
              value={deviceUrl}
              placeholder={DEVICE_LINKS[device].placeholder}
              onChange={(e) => {
                setDeviceUrl(e.target.value);
                try {
                  localStorage.setItem(DEVICE_LINKS[device].key, e.target.value);
                } catch {
                  /* typed link is kept on screen */
                }
              }}
            />
          </label>
          {device === "alarm" ? (
            <div className="alarm-switch" role="group" aria-label="Alarm">
              <button
                type="button"
                aria-pressed={alarmOn}
                onClick={() => {
                  setAlarmOn(true);
                  try {
                    localStorage.setItem(ALARM_ON_KEY, "Yes");
                  } catch {
                    /* the light still follows the switch */
                  }
                }}
              >
                On
              </button>
              <button
                type="button"
                aria-pressed={!alarmOn}
                onClick={() => {
                  setAlarmOn(false);
                  try {
                    localStorage.setItem(ALARM_ON_KEY, "No");
                  } catch {
                    /* the light still follows the switch */
                  }
                }}
              >
                Off
              </button>
            </div>
          ) : null}
          <div className="camera-actions">
            <button className="filter" type="submit">
              Open
            </button>
            <button className="filter" type="button" onClick={() => setDevice(null)}>
              Close
            </button>
          </div>
        </form>
      ) : null}
      <header className="top">
        <div className="brand">
          <h1>Magnolia Central of Florida Estates</h1>
          <p className="stats">
            {lots.length} lots · {empty} empty · {notes} notes
          </p>
        </div>
        <input
          className="search"
          value={query}
          placeholder="Lot, name, or address"
          aria-label="Search lots"
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>
      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Sections">
          <div className="map-attach">
          <div className="map-slot">
            <button
              className="tab"
              type="button"
              role="tab"
              aria-expanded={mapsOpen}
              aria-pressed={view === "map"}
              onClick={() => {
                if (view === "map") setMapsOpen((open) => !open);
                else {
                  setView("map");
                  setMapsOpen(true);
                }
                setFiltersOpen(false);
              }}
            >
              Maps · {mapLabel} ▾
            </button>
            {mapsOpen ? (
              <div className="map-drop" role="menu">
                {(
                  [
                    ["main", "Main"],
                    ["1", "Jaleen/Denise"],
                    ["2", "Denise/Leon"],
                    ["3", "Michelle/Kirkwood"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={id === "main" ? main : !main && String(sheet) === id}
                    onClick={() => {
                      setView("map");
                      if (id === "main") setMain(true);
                      else {
                        setMain(false);
                        setSheet(Number(id) as SheetId);
                      }
                      setMapsOpen(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="map-slot">
            <button
              className="tab"
              type="button"
              role="tab"
              aria-expanded={filtersOpen}
              aria-pressed={filtersOpen || filter.length > 0}
              onClick={() => {
                setMapsOpen(false);
                if (view !== "map") {
                  setView("map");
                  setFiltersOpen(true);
                } else setFiltersOpen((open) => !open);
              }}
            >
              {filter.length === 0 ? "Filters ▾" : `Filters · ${filterLabel} ▾`}
            </button>
            {filtersOpen ? (
              <div className="map-drop filter-checks" role="group" aria-label="Map filters">
                {filterNames.map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={filter.includes(id)}
                      onChange={() => {
                        setFilter((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
                        setView("map");
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          </div>
          {(
            [
              ["todo", "To-Do"],
              ["mow", "Mow"],
              ["meeting", "Meeting"],
              ["business", "Business"],
              ["heat", "Financial"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className="tab" type="button" role="tab" aria-pressed={view === id} onClick={() => { setMapsOpen(false); setFiltersOpen(false); setDataOpen(false); setView(id); }}>
              {label}
            </button>
          ))}
          <button className="tab tab-end" type="button" role="tab" aria-pressed={view === "register"} onClick={() => { setMapsOpen(false); setFiltersOpen(false); setDataOpen(false); setView("register"); }}>
            Register
          </button>
        </div>
        {narrowed ? (
          <div className="active-strip">
            <span>
              Showing {visible.length} of {lots.length}
              {filter.length ? ` · ${filterLabel}` : ""}
              {query.trim() ? ` · “${query.trim()}”` : ""}
            </span>
            {visible.length > 1 ? (
              <span className="match-nav">
                <button type="button" aria-label="Previous match" onClick={() => showMatch(matchAt - 1)}>
                  ‹
                </button>
                <span>
                  {Math.min(matchAt, visible.length - 1) + 1} of {visible.length}
                </span>
                <button type="button" aria-label="Next match" onClick={() => showMatch(matchAt + 1)}>
                  ›
                </button>
              </span>
            ) : null}
            <button
              className="strip-clear"
              type="button"
              onClick={() => {
                setFilter([]);
                setQuery("");
              }}
            >
              Clear
            </button>
          </div>
        ) : null}
        {view === "register" ? (
          <div className="data-actions">
            <div className="seg">
              <button className="filter" type="button" aria-pressed={registerMode === "short"} onClick={() => setRegisterMode("short")}>
                Short
              </button>
              <button className="filter" type="button" aria-pressed={registerMode === "full"} onClick={() => setRegisterMode("full")}>
                Full
              </button>
              <button className="filter" type="button" aria-pressed={registerMode === "homes"} onClick={() => setRegisterMode("homes")}>
                Homes
              </button>
            </div>
            <div className="map-slot">
              <button className="filter" type="button" aria-expanded={dataOpen} onClick={() => setDataOpen((open) => !open)}>
                Data ▾
              </button>
              {dataOpen ? (
                <div className="map-drop data-drop">
                  <button type="button" onClick={() => { downloadRegister(lots); setDataOpen(false); }}>Download register</button>
                  <button type="button" onClick={() => { uploadRef.current?.click(); setDataOpen(false); }}>Upload register</button>
                  <button type="button" onClick={() => { downloadEverything(lots); setDataOpen(false); }}>Download everything</button>
                  <button type="button" onClick={() => { backupRef.current?.click(); setDataOpen(false); }}>Upload everything</button>
                  <button type="button" onClick={() => { quickBooksRef.current?.click(); setDataOpen(false); }}>Import from QuickBooks</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (versions) {
                        setVersions(null);
                        return;
                      }
                      void listVersions()
                        .then((list) => setVersions(list))
                        .catch(() => setVersions([]));
                    }}
                  >
                    Restore version
                  </button>
                  {versions ? (
                    versions.length ? (
                      versions.map((version) => (
                        <button
                          key={version.id}
                          type="button"
                          onClick={() => {
                            void restoreVersion({ data: { id: version.id } }).then((book) => {
                              const next = (book.lots as Lot[]).map((lot) => withEmptyMow(lot));
                              setLots(next);
                              rememberLots(next);
                              setVersions(null);
                              setDataOpen(false);
                              setQbNote(`Restored ${new Date(version.saved).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}.`);
                            }).catch(() => setQbNote("That version could not be restored."));
                          }}
                        >
                          {new Date(version.saved).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} · {version.count} lots
                        </button>
                      ))
                    ) : (
                      <button type="button" disabled>
                        No archived versions
                      </button>
                    )
                  ) : null}
                </div>
              ) : null}
            </div>
            {qbNote ? <p className="qb-note">{qbNote}</p> : null}
          </div>
        ) : null}
        <input
          ref={backupRef}
          hidden
          type="file"
          accept=".json,application/json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const text = await file.text();
            try {
              setLots((prev) => importEverything(text, prev).map(withEmptyMow));
            } catch {
              setQbNote("That backup could not be read. Use a file from Download everything.");
            }
          }}
        />
        <input
          ref={uploadRef}
          hidden
          type="file"
          accept=".csv,text/csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const text = await file.text();
            setLots((prev) => importRegister(text, prev).map(withEmptyMow));
          }}
        />
        <input
          ref={quickBooksRef}
          hidden
          type="file"
          accept=".iif,.csv,.txt,text/plain,text/csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const result = importFromQuickBooks(await file.text(), lots);
            setLots(result.lots.map(withEmptyMow));
            setQbNote(
              result.updated
                ? `QuickBooks updated ${result.updated} lot${result.updated === 1 ? "" : "s"}${result.missed ? `. ${result.missed} names did not match a lot` : ""}.`
                : result.missed
                  ? "No lots matched. In QuickBooks 2020 use File, Utilities, Export, Lists to IIF Files, and put the lot number in the customer name."
                  : "That file did not have any customer rows.",
            );
          }}
        />
      </div>
      <div className={view === "meeting" || view === "business" ? "stage stage-full" : "stage"}>
        <section className="map-frame">
          {view === "map" && legendOn ? (
            <div className="legend">
              <span>
                <i className="swatch" /> Occupied
              </span>
              <span>
                <i className="swatch empty" /> Empty
              </span>
              <span>
                <i className="swatch open" /> Office
              </span>
              <span>
                <i className="swatch notes" /> Issues
              </span>
              <span>
                <i className="swatch mow-flag" aria-hidden="true" /> Mow
              </span>
              <span>
                <i className="swatch late" /> Late rent
              </span>
              <span>
                <i className="swatch leak" /> Leak
              </span>
              <span>
                <i className="swatch roof" /> Needs roof
              </span>
              <span>
                <i className="swatch maint" /> Maintenance
              </span>
              <span>
                <i className="swatch eviction" /> Eviction
              </span>
              <button className="legend-hide" type="button" aria-pressed={symbols} onClick={() => setSymbols((on) => !on)}>
                Symbols
              </button>
              <button className="legend-hide legend-arrow" type="button" aria-label="Hide legend" onClick={() => setLegendOn(false)}>
                ↑
              </button>
            </div>
          ) : view === "map" ? (
            <div className="legend">
              <button className="legend-show legend-arrow" type="button" aria-label="Show legend" onClick={() => setLegendOn(true)}>
                ↓
              </button>
              <button className="legend-show" type="button" aria-pressed={symbols} onClick={() => setSymbols((on) => !on)}>
                Symbols
              </button>
            </div>
          ) : null}
          <div className="map-scroll">
          {!hydrated ? (
            <p className="qb-note">Loading saved lots…</p>
          ) : view === "todo" ? (
            <TodoBoard
              lots={lots}
              onOpen={(id) => openLot(id)}
            />
          ) : view === "mow" ? (
            <MowBoard lots={lots} onOpen={openLot} />
          ) : view === "increase" ? (
            <IncreaseBoard lots={lots} onOpen={openLot} />
          ) : view === "alert" ? (
            <AlertBoard lots={lots} onOpen={openLot} />
          ) : view === "heat" ? (
            <HeatBoard lots={lots} scoped={visible} selected={selected} onOpen={openLot} />
          ) : view === "business" ? (
            <BusinessBoard lots={lots} />
          ) : view === "meeting" ? (
            <MeetingBoard lots={lots} onOpen={openLot} onSave={saveLot} />
          ) : view === "register" ? (
            <RegisterTable
              lots={registerMode === "short" ? [...lots].sort(byStreetAddress) : lots}
              columns={registerMode === "homes" ? HOME_COLUMNS : registerMode === "full" ? REGISTER_COLUMNS : SHORT_COLUMNS}
              visibleIds={visibleIds}
              selected={selected}
              onChoose={choose}
              onSave={saveLot}
            />
          ) : main ? (
            <div className="map-stack">
              {([1, 2, 3] as const).map((id) => (
                <section key={id} id={`map-${id}`} className="map-block">
                  <div className="map-head">
                    <h2>{SHEET_COPY[id].title}</h2>
                    <button className="print-map" type="button" onClick={() => printMap(id)}>
                      Print map
                    </button>
                  </div>
                  <PlatMap sheet={id} query={query} filter={filter} selected={selected} lots={lots} symbols={symbols} onSelect={choose} onCamera={() => openDevice("office")} onPlantCamera={() => openDevice("plant")} onAlarm={() => openDevice("alarm")} alarmOn={alarmOn} />
                </section>
              ))}
            </div>
          ) : (
            <>
              <div className="map-head">
                <h2>{SHEET_COPY[sheet].title}</h2>
                <button className="print-map" type="button" onClick={() => printMap(sheet)}>
                  Print map
                </button>
              </div>
              <div className="map-stage">
                <div className="map-scaler">
                  <PlatMap sheet={sheet} query={query} filter={filter} selected={selected} lots={lots} symbols={symbols} onSelect={choose} onCamera={() => openDevice("office")} onPlantCamera={() => openDevice("plant")} onAlarm={() => openDevice("alarm")} alarmOn={alarmOn} />
                </div>
              </div>
              <button
                className="map-nav prev"
                type="button"
                aria-label="Previous map"
                onClick={() => setSheet(sheet === 1 ? 3 : ((sheet - 1) as SheetId))}
              >
                ‹
              </button>
              <button
                className="map-nav next"
                type="button"
                aria-label="Next map"
                onClick={() => setSheet(sheet === 3 ? 1 : ((sheet + 1) as SheetId))}
              >
                ›
              </button>
            </>
          )}
          </div>
          {view === "map" && main ? (
            <>
              <button
                className="map-nav prev"
                type="button"
                aria-label="Previous map"
                onClick={() => {
                  setMain(false);
                  setSheet(3);
                }}
              >
                ‹
              </button>
              <button
                className="map-nav next"
                type="button"
                aria-label="Next map"
                onClick={() => {
                  setMain(false);
                  setSheet(1);
                }}
              >
                ›
              </button>
            </>
          ) : null}
        </section>
        {view === "meeting" || view === "business" ? null : (
        <LotPanel
          lot={lot}
          lots={lots}
          onSave={saveLot}
          onOpen={openLot}
          onRentRoll={() => { setMapsOpen(false); setFiltersOpen(false); setDataOpen(false); setView("increase"); }}
          onAlert={() => { setMapsOpen(false); setFiltersOpen(false); setDataOpen(false); setView("alert"); }}
        />
        )}
      </div>
    </main>
  );
}

type RegisterCol =
  | { label: string; kind: "field"; field: keyof Lot }
  | { label: string; kind: "check"; field: "fridge" | "stove" | "washer" | "dryer" | "microwave" }
  | { label: string; kind: "homeIns" }
  | { label: string; kind: "insShare" }
  | { label: string; kind: "lotShare" }
  | { label: string; kind: "sewerShare" }
  | { label: string; kind: "waterShare" }
  | { label: string; kind: "garbageShare" }
  | { label: string; kind: "homeInsDate" }
  | { label: string; kind: "emptyCheck"; field: "readyPower" | "readyClean" | "readyInspected" }
  | { label: string; kind: "zillow" }
  | { label: string; kind: "zillowUrl" }
  | { label: string; kind: "homeWide" }
  | { label: string; kind: "first" }
  | { label: string; kind: "last" }
  | { label: string; kind: "status" }
  | { label: string; kind: "mow" }
  | { label: string; kind: "roofReplace" }
  | { label: string; kind: "dogs" }
  | { label: string; kind: "cats" }
  | { label: string; kind: "wiring" };

const REGISTER_COLUMNS: RegisterCol[] = [
  { label: "Lot", kind: "field", field: "lot" },
  { label: "Address", kind: "field", field: "address" },
  { label: "Street", kind: "field", field: "street" },
  { label: "Name(s)", kind: "field", field: "name" },
  { label: "First name", kind: "first" },
  { label: "Last name", kind: "last" },
  { label: "Issues", kind: "field", field: "issues" },
  { label: "Status", kind: "status" },
  { label: "Maintenance", kind: "field", field: "maintenance" },
  { label: "Renter/Owner", kind: "field", field: "renter" },
  { label: "Rental Amount", kind: "field", field: "rent" },
  { label: "Lot rent", kind: "field", field: "lotRent" },
  { label: "Home rent", kind: "field", field: "homeRent" },
  { label: "08/2026", kind: "field", field: "rentInc2026" },
  { label: "08/2027", kind: "field", field: "rentInc2027" },
  { label: "Move-in", kind: "field", field: "moveIn" },
  { label: "Rent due", kind: "field", field: "rentDue" },
  { label: "Deposit", kind: "field", field: "deposit" },
  { label: "Balance", kind: "field", field: "balance" },
  { label: "Notice date", kind: "field", field: "noticeDate" },
  { label: "Notice note", kind: "field", field: "noticeNote" },
  { label: "Lease end", kind: "field", field: "leaseEnd" },
  { label: "Emergency name", kind: "field", field: "emergencyName" },
  { label: "Emergency phone", kind: "field", field: "emergencyPhone" },
  { label: "Court date", kind: "field", field: "courtDate" },
  { label: "Court note", kind: "field", field: "courtNote" },
  { label: "Waiting name", kind: "field", field: "waitName" },
  { label: "Waiting phone", kind: "field", field: "waitPhone" },
  { label: "Key", kind: "field", field: "key" },
  { label: "Phone Number", kind: "field", field: "phone" },
  { label: "Email", kind: "field", field: "email" },
  { label: "MOW", kind: "mow" },
  { label: "Late Rent", kind: "field", field: "lateRent" },
  { label: "Bounced Check", kind: "field", field: "bouncedCheck" },
  { label: "Guest", kind: "field", field: "guest" },
  { label: "Vehicle", kind: "field", field: "vehicle" },
  { label: "A/C Filter", kind: "field", field: "acFilter" },
  { label: "A/C Cleaning", kind: "field", field: "acCleaning" },
  { label: "A/C Service", kind: "field", field: "acService" },
  { label: "Roof age", kind: "field", field: "roofAge" },
  { label: "Roof material", kind: "field", field: "roofMaterial" },
  { label: "Roof installed", kind: "field", field: "roofInstalled" },
  { label: "Roof needs replaced", kind: "roofReplace" },
  { label: "Exterior Pressure Wash", kind: "field", field: "pressureWash" },
  { label: "Violations", kind: "field", field: "violations" },
  { label: "Refrigerator", kind: "check", field: "fridge" },
  { label: "Stove", kind: "check", field: "stove" },
  { label: "Washer", kind: "check", field: "washer" },
  { label: "Dryer", kind: "check", field: "dryer" },
  { label: "Microwave", kind: "check", field: "microwave" },
  { label: "Dogs", kind: "dogs" },
  { label: "Cats", kind: "cats" },
  { label: "Home wiring insurance", kind: "wiring" },
  { label: "Home insurance", kind: "homeIns" },
  { label: "Yearly insurance cost", kind: "insShare" },
  { label: "Yearly taxes", kind: "lotShare" },
  { label: "Yearly sewer", kind: "sewerShare" },
  { label: "Yearly water", kind: "waterShare" },
  { label: "Yearly garbage", kind: "garbageShare" },
  { label: "Insurance expires", kind: "homeInsDate" },
  { label: "Power on", kind: "emptyCheck", field: "readyPower" },
  { label: "Cleaned", kind: "emptyCheck", field: "readyClean" },
  { label: "Inspected", kind: "emptyCheck", field: "readyInspected" },
  { label: "Listed on Zillow", kind: "zillow" },
  { label: "Zillow link", kind: "zillowUrl" },
  { label: "Year", kind: "field", field: "homeYear" },
  { label: "Make", kind: "field", field: "homeMake" },
  { label: "Model", kind: "field", field: "homeModel" },
  { label: "Width", kind: "field", field: "homeWidth" },
  { label: "Length", kind: "field", field: "homeLength" },
  { label: "Single or double", kind: "homeWide" },
  { label: "Inspection date", kind: "field", field: "inspectionDate" },
  { label: "Inspection notes", kind: "field", field: "inspectionNotes" },
];

const SHORT_COLUMNS: RegisterCol[] = [
  { label: "Lot", kind: "field", field: "lot" },
  { label: "Address", kind: "field", field: "address" },
  { label: "Street", kind: "field", field: "street" },
  { label: "Name", kind: "field", field: "name" },
  { label: "MOW", kind: "mow" },
  { label: "Rent", kind: "field", field: "rent" },
  { label: "Notes", kind: "field", field: "issues" },
];

const HOME_COLUMNS: RegisterCol[] = [
  { label: "Lot", kind: "field", field: "lot" },
  { label: "Address", kind: "field", field: "address" },
  { label: "Street", kind: "field", field: "street" },
  { label: "Name(s)", kind: "field", field: "name" },
  { label: "Year", kind: "field", field: "homeYear" },
  { label: "Make", kind: "field", field: "homeMake" },
  { label: "Model", kind: "field", field: "homeModel" },
  { label: "Width", kind: "field", field: "homeWidth" },
  { label: "Length", kind: "field", field: "homeLength" },
  { label: "Single or double", kind: "homeWide" },
];

function lotCostShares(lots: Lot[]) {
  return splitPool(lots, 30000);
}

function insuranceShares(lots: Lot[]) {
  return splitPool(
    lots.filter((lot) => lot.homeIns === "Yes"),
    7000,
  );
}

function splitPool(lots: Lot[], dollars: number) {
  const shares = new Map<string, number>();
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

function sewerShares(lots: Lot[]) {
  return splitPool(lots, 30000);
}

function waterShares(lots: Lot[]) {
  return splitPool(lots, 30000);
}

function garbageShares(lots: Lot[]) {
  return splitPool(lots, 30000);
}

function registerText(item: Lot, col: RegisterCol): string {
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

const RegisterCell = memo(function RegisterCell({
  item,
  col,
  onSave,
  live,
}: {
  item: Lot;
  col: RegisterCol;
  onSave: (next: Lot) => void;
  live: boolean;
}) {
  if (!live) return <td>{registerText(item, col)}</td>;
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  if (col.kind === "check") {
    const raw = String(item[col.field] ?? "").trim().toLowerCase();
    const on = raw !== "" && raw !== "no";
    return (
      <td onClick={stop}>
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => onSave({ ...item, [col.field]: e.target.checked ? "Yes" : "" })}
        />
      </td>
    );
  }
  if (col.kind === "status") {
    return (
      <td onClick={stop}>
        <select
          className="cell-edit"
          value={item.status}
          onChange={(e) => {
            const status: LotStatus =
              e.target.value === "Empty" || e.target.value === "Open" || e.target.value === "Eviction"
                ? e.target.value
                : "Occupied";
            onSave({ ...item, status });
          }}
        >
          <option>Occupied</option>
          <option>Empty</option>
          <option>Open</option>
          <option>Eviction</option>
        </select>
      </td>
    );
  }
  if (col.kind === "mow") {
    return (
      <td onClick={stop}>
        <select
          className="cell-edit"
          value={item.noMow === "Yes" || item.noMow === "No" || item.noMow === "Owe" ? item.noMow : ""}
          onChange={(e) => onSave({ ...item, noMow: e.target.value })}
        >
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
          <option>Owe</option>
        </select>
      </td>
    );
  }
  if (col.kind === "roofReplace") {
    const value = item.roofReplace === "Yes" || item.roofReplace === "No" ? item.roofReplace : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, roofReplace: e.target.value })}>
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </td>
    );
  }
  if (col.kind === "wiring") {
    const value = item.wiring === "Yes" || item.wiring === "No" ? item.wiring : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, wiring: e.target.value })}>
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </td>
    );
  }
  if (col.kind === "homeIns" || col.kind === "homeInsDate") {
    if (!isRenterLot(item)) return <td onClick={stop}>—</td>;
    if (col.kind === "homeInsDate") {
      return (
        <td onClick={stop}>
          <input
            className="cell-edit"
            type="date"
            value={item.homeInsDate ?? ""}
            onChange={(e) => onSave({ ...item, homeInsDate: e.target.value })}
          />
        </td>
      );
    }
    const value = item.homeIns === "Yes" || item.homeIns === "No" ? item.homeIns : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, homeIns: e.target.value })}>
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </td>
    );
  }
  if (col.kind === "emptyCheck" || col.kind === "zillow" || col.kind === "zillowUrl") {
    if (item.status !== "Empty") return <td onClick={stop}>—</td>;
    if (col.kind === "emptyCheck") {
      const on = item[col.field] === "Yes";
      return (
        <td onClick={stop}>
          <input type="checkbox" checked={on} onChange={(e) => onSave({ ...item, [col.field]: e.target.checked ? "Yes" : "" })} />
        </td>
      );
    }
    if (col.kind === "zillow") {
      const value = item.zillow === "Yes" || item.zillow === "No" ? item.zillow : "";
      return (
        <td onClick={stop}>
          <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, zillow: e.target.value })}>
            <option value="">—</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </td>
      );
    }
    return (
      <td onClick={stop}>
        <input className="cell-edit" value={item.zillowUrl ?? ""} onChange={(e) => onSave({ ...item, zillowUrl: e.target.value })} />
      </td>
    );
  }
  if (col.kind === "dogs" || col.kind === "cats") {
    const value = item[col.kind] === "1" || item[col.kind] === "2" ? item[col.kind] : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, [col.kind]: e.target.value })}>
          <option value="">—</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </td>
    );
  }
  if (col.kind === "first" || col.kind === "last") {
    const parts = nameParts(item.name);
    const value = col.kind === "first" ? parts.first : parts.last;
    return (
      <td onClick={stop}>
        <input
          className="cell-edit"
          value={value}
          onChange={(e) =>
            onSave({
              ...item,
              name: col.kind === "first" ? joinName(parts.last, e.target.value) : joinName(e.target.value, parts.first),
            })
          }
        />
      </td>
    );
  }
  if (col.kind === "homeWide") {
    const value = item.homeWide === "Single Wide" || item.homeWide === "Double Wide" ? item.homeWide : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, homeWide: e.target.value })}>
          <option value="">—</option>
          <option>Single Wide</option>
          <option>Double Wide</option>
        </select>
      </td>
    );
  }
  if (col.kind === "field" && col.field === "renter") {
    const value = ["Renter", "Owner", "Rent-to-Own"].includes(item.renter) ? item.renter : "";
    return (
      <td onClick={stop}>
        <select className="cell-edit" value={value} onChange={(e) => onSave({ ...item, renter: e.target.value })}>
          <option value="">—</option>
          <option>Renter</option>
          <option>Owner</option>
          <option>Rent-to-Own</option>
        </select>
      </td>
    );
  }
  if (col.kind !== "field") return <td onClick={stop}>—</td>;
  const field = col.field;
  return (
    <td onClick={stop}>
      <input
        className="cell-edit"
        value={String(item[field] ?? "")}
        onChange={(e) => onSave({ ...item, [field]: e.target.value })}
      />
    </td>
  );
});

function nameParts(name: string): { first: string; last: string } {
  const raw = name.trim();
  if (!raw) return { first: "", last: "" };
  const comma = raw.indexOf(",");
  if (comma >= 0) return { last: raw.slice(0, comma).trim(), first: raw.slice(comma + 1).trim() };
  return { first: "", last: raw };
}

function joinName(last: string, first: string) {
  const l = last.trim();
  const f = first.trim();
  if (l && f) return `${l}, ${f}`;
  return l || f;
}

function neighbors(lots: Lot[], lot: Lot) {
  const street = lot.street.trim().toLowerCase();
  const same = lots.filter((item) => item.street.trim().toLowerCase() === street);
  const list = (same.length > 0 ? same : lots).slice().sort((a, b) => {
    const na = Number(a.lot);
    const nb = Number(b.lot);
    if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
    return a.address.localeCompare(b.address, undefined, { numeric: true });
  });
  const index = list.findIndex((item) => item.id === lot.id);
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
  };
}

function byStreetAddress(a: Lot, b: Lot) {
  const ga = streetGroup(a.street);
  const gb = streetGroup(b.street);
  if (ga.rank !== gb.rank) return ga.rank - gb.rank;
  if (ga.label !== gb.label) return ga.label.localeCompare(gb.label);
  const address = a.address.localeCompare(b.address, undefined, { numeric: true });
  if (address) return address;
  return a.lot.localeCompare(b.lot, undefined, { numeric: true });
}

function RegisterTable({
  lots,
  columns,
  visibleIds,
  selected,
  onChoose,
  onSave,
}: {
  lots: Lot[];
  columns: RegisterCol[];
  visibleIds: Set<string>;
  selected: string | null;
  onChoose: (id: string) => void;
  onSave: (next: Lot) => void;
}) {
  const pins = columns.findIndex((col) => col.label.startsWith("Name")) + 1;
  const shares = useMemo(() => insuranceShares(lots), [lots]);
  const taxes = useMemo(() => lotCostShares(lots), [lots]);
  const sewer = useMemo(() => sewerShares(lots), [lots]);
  const water = useMemo(() => waterShares(lots), [lots]);
  const garbage = useMemo(() => garbageShares(lots), [lots]);
  return (
    <table className={`register pin-${pins >= 4 ? 4 : 3}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.label}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lots.map((item) => (
          <tr key={item.id} data-hit={visibleIds.has(item.id)} aria-selected={selected === item.id} onClick={() => onChoose(item.id)}>
            {columns.map((col) =>
              col.kind === "insShare" || col.kind === "lotShare" || col.kind === "sewerShare" || col.kind === "waterShare" || col.kind === "garbageShare" ? (
                <td key={col.label}>
                  {col.kind === "insShare" && !shares.has(item.id)
                    ? ""
                    : dollar(
                        (col.kind === "insShare"
                          ? shares
                          : col.kind === "lotShare"
                            ? taxes
                            : col.kind === "sewerShare"
                              ? sewer
                              : col.kind === "waterShare"
                                ? water
                                : garbage
                        ).get(item.id) ?? 0,
                      )}
                </td>
              ) : (
                <RegisterCell key={col.label} item={item} col={col} onSave={onSave} live={selected === item.id} />
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LotPanel({ lot, lots, onSave, onOpen, onRentRoll, onAlert }: { lot: Lot | null; lots: Lot[]; onSave: (next: Lot) => void; onOpen: (id: string) => void; onRentRoll: () => void; onAlert: () => void }) {
  const [tab, setTab] = useState<"personal" | "home" | "rent" | "maintenance" | "notes" | "empty">("personal");
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const seenLot = useRef(lot?.id);

  useEffect(() => {
    if (lot && tab === "empty" && lot.status !== "Empty") setTab("personal");
  }, [lot?.id, lot?.status, tab]);

  useLayoutEffect(() => {
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

  if (!lot) {
    return (
      <aside className="panel">
        <div className="panel-body">
          <p className="quiet">Select a lot on the map.</p>
        </div>
      </aside>
    );
  }
  const current = lot;
  const where = sheetOf(current.id);
  const mates = neighbors(lots, current);
  const phoneDigits = current.phone.replace(/[^\d+]/g, "");
  const rentMark = Boolean(current.lateRent?.trim() || current.bouncedCheck?.trim());
  const notesMark = Boolean(current.issues?.trim() || current.violations?.trim());
  const save = (next: Partial<Lot>) => {
    if (panelRef.current) scrollRef.current = panelRef.current.scrollTop;
    const y = window.scrollY;
    onSave({ ...current, ...next });
    requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.scrollTop = scrollRef.current;
      if (Math.abs(window.scrollY - y) > 4) window.scrollTo(0, y);
    });
  };
  async function copyAddress() {
    const text = [current.address, current.street].filter(Boolean).join(" ");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* the button still confirms */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return (
    <aside className="panel">
      <div
        className="panel-body"
        ref={panelRef}
        onScroll={() => {
          if (panelRef.current) scrollRef.current = panelRef.current.scrollTop;
        }}
      >
      <p className="quiet sheet-where">{where ? `Map ${where}` : "Register only"} · Saves to the master file</p>
      <div className="lot-head">
        <div className="head-address">
          <label>
            <span className="label-row">
              Address
              <button className="mini" type="button" onClick={copyAddress}>
                {copied ? "Copied" : "Copy"}
              </button>
            </span>
            <input className="address-num" value={lot.address} onChange={(e) => save({ address: e.target.value })} />
          </label>
          <label>
            <span>Street</span>
            <input className="street-name" value={lot.street} onChange={(e) => save({ street: e.target.value })} />
          </label>
        </div>
        <label className="head-lot">
          <span>Lot</span>
          <input value={lot.lot} onChange={(e) => save({ lot: e.target.value })} />
        </label>
        <label className="head-name">
          <span>Name</span>
          <textarea rows={2} value={lot.name} onChange={(e) => save({ name: e.target.value })} />
        </label>
        <NameSplit name={lot.name} onChange={(name) => save({ name })} />
        <label className="head-status">
          <span>Status</span>
          <span className={`status-dot status-${lot.status.toLowerCase()}`} aria-hidden="true" />
          <select
            value={lot.status}
            onChange={(e) => {
              const status = e.target.value as LotStatus;
              if (lot.status === "Occupied" && status === "Empty") {
                onSave(moveOutLot(lot));
                setTab("empty");
                return;
              }
              save({ status });
              if (status === "Empty") setTab("empty");
              else if (tab === "empty") setTab("personal");
            }}
          >
            <option value="Occupied">Occupied</option>
            <option value="Empty">Empty</option>
            <option value="Open">Office</option>
            <option value="Eviction">Eviction</option>
          </select>
        </label>
      </div>
      <div className="detail-tabs" role="tablist">
        {(lot.status === "Empty"
          ? ([
              ["empty", "Empty lot"],
              ["personal", "Personal"],
              ["home", "Home"],
              ["rent", "Rent"],
              ["maintenance", "Maintenance"],
              ["notes", "Notes"],
            ] as const)
          : ([
              ["personal", "Personal"],
              ["home", "Home"],
              ["rent", "Rent"],
              ["maintenance", "Maintenance"],
              ["notes", "Notes"],
            ] as const)
        ).map(([id, label]) => {
          const mark = (id === "rent" && rentMark) || (id === "notes" && notesMark);
          return (
            <button key={id} type="button" role="tab" aria-pressed={tab === id} onClick={() => setTab(id)}>
              {label}
              {mark ? <i className="tab-dot" aria-label="Has something to see" /> : null}
            </button>
          );
        })}
      </div>
      {tab === "personal" ? (
        <>
          <div className="pet-block">
            <p className="pet-title">People</p>
            <div className="pet-row">
              <label>
                <span>Phone</span>
                <span className="phone-line">
                  <input value={lot.phone} onChange={(e) => save({ phone: e.target.value })} />
                  {phoneDigits ? <a href={`tel:${phoneDigits}`}>Call</a> : null}
                </span>
              </label>
              <label>
                <span>Email</span>
                <input value={lot.email} onChange={(e) => save({ email: e.target.value })} />
              </label>
            </div>
            <div className="pet-row">
              <label>
                <span>Renter / owner</span>
                <select
                  className="mow-select"
                  value={["Renter", "Owner", "Rent-to-Own"].includes(lot.renter) ? lot.renter : ""}
                  onChange={(e) => save({ renter: e.target.value })}
                >
                  <option value="">—</option>
                  <option>Renter</option>
                  <option>Owner</option>
                  <option>Rent-to-Own</option>
                </select>
              </label>
              <label>
                <span>Key</span>
                <input value={lot.key} onChange={(e) => save({ key: e.target.value })} />
              </label>
            </div>
            <div className="pet-row">
              <label>
                <span>Guest</span>
                <select
                  className="mow-select"
                  value={["1", "2", "3", "4", "5"].includes(lot.guest) ? lot.guest : ""}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    const prev = lot.guests ?? [];
                    const guests = count > 0 ? Array.from({ length: count }, (_, i) => prev[i] ?? blankGuest()) : [];
                    save({ guest: e.target.value, guests });
                  }}
                >
                  <option value="">—</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </label>
              <label>
                <span>Vehicle</span>
                <input value={lot.vehicle} onChange={(e) => save({ vehicle: e.target.value })} />
              </label>
            </div>
            {(lot.guests ?? []).length > 0 ? <GuestCards guests={lot.guests ?? []} onChange={(guests) => save({ guests })} /> : null}
            <p className="pet-title">Pets</p>
            <PetSelects dogs={lot.dogs ?? ""} cats={lot.cats ?? ""} onChange={save} />
          </div>
          <LotExtras values={lot} part="personal" onChange={save} />
        </>
      ) : null}
      {tab === "home" ? (
        <>
          <HomeDetails lot={lot} onChange={save} />
          <LotExtras values={lot} part="home" onChange={save} />
          <div className="pet-block">
            <p className="pet-title">Insurance</p>
            <HomeInsuranceFields
              lot={lot}
              onChange={save}
              split={(() => {
                const share = insuranceShares(lots).get(lot.id);
                return share == null ? "" : dollar(share);
              })()}
            />
            <label className="wiring-field">
              <span>Home wiring insurance</span>
              <select
                className="mow-select"
                value={lot.wiring === "Yes" || lot.wiring === "No" ? lot.wiring : ""}
                onChange={(e) => save({ wiring: e.target.value })}
              >
                <option value="">—</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          </div>
          <div className="pet-block">
            <p className="pet-title">Expenses</p>
            <label className="wiring-field">
              <span>Yearly taxes</span>
              <input value={dollar(lotCostShares(lots).get(lot.id) ?? 0)} readOnly />
            </label>
            <label className="wiring-field">
              <span>Maintenance</span>
              <input value={costSum([lot.maintCost, lot.mowCost, lot.acCost, lot.roofCost, lot.washCost, lot.inspectCost])} readOnly />
            </label>
            <label className="wiring-field">
              <span>Yearly sewer</span>
              <input value={dollar(sewerShares(lots).get(lot.id) ?? 0)} readOnly />
            </label>
            <label className="wiring-field">
              <span>Yearly water</span>
              <input value={dollar(waterShares(lots).get(lot.id) ?? 0)} readOnly />
            </label>
            <label className="wiring-field">
              <span>Yearly garbage</span>
              <input value={dollar(garbageShares(lots).get(lot.id) ?? 0)} readOnly />
            </label>
          </div>
        </>
      ) : null}
      {tab === "rent" ? (
        <LotExtras values={lot} part="rent" onChange={save} onMoveOut={() => { onSave(moveOutLot(lot)); setTab("empty"); }} onRentRoll={onRentRoll} />
      ) : null}
      {tab === "maintenance" ? (
        <LotExtras values={lot} part="maintenance" onChange={save} />
      ) : null}
      {tab === "notes" ? (
        <div className="pet-block">
          <p className="pet-title">Issues</p>
          <label className="wiring-field">
            <span>Note</span>
            <textarea rows={4} value={lot.issues} onChange={(e) => save({ issues: e.target.value })} />
          </label>
          {lot.stickies?.length ? (
            <div className="lot-stickies">
              {lot.stickies.map((sticky) => (
                <p key={sticky.id} style={{ background: sticky.color }}>{sticky.text}</p>
              ))}
            </div>
          ) : null}
          <label className="wiring-field">
            <span>Violations</span>
            <textarea rows={3} value={lot.violations} onChange={(e) => save({ violations: e.target.value })} />
          </label>
          <button className="filter" type="button" onClick={onAlert}>
            Emergency broadcast
          </button>
        </div>
      ) : null}
      {tab === "empty" ? (
        <>
          <PreviousTenants values={lot} onChange={save} />
          <EmptyLotChecklist lot={lot} onChange={save} />
          <LotExtras values={lot} part="empty" onChange={save} />
        </>
      ) : null}
      </div>
      <button className="panel-nav prev" type="button" aria-label="Previous lot" disabled={!mates.prev} onClick={() => mates.prev && onOpen(mates.prev.id)}>
        ‹
      </button>
      <button className="panel-nav next" type="button" aria-label="Next lot" disabled={!mates.next} onClick={() => mates.next && onOpen(mates.next.id)}>
        ›
      </button>
    </aside>
  );
}

function HomeDetails({ lot, onChange }: { lot: Lot; onChange: (next: Partial<Lot>) => void }) {
  const wide = lot.homeWide === "Single Wide" || lot.homeWide === "Double Wide" ? lot.homeWide : "";
  return (
    <div className="pet-block">
      <p className="pet-title">Home details</p>
      <div className="pet-row">
        <label>
          <span>Year</span>
          <input value={lot.homeYear ?? ""} onChange={(e) => onChange({ homeYear: e.target.value })} />
        </label>
        <label>
          <span>Make</span>
          <input value={lot.homeMake ?? ""} onChange={(e) => onChange({ homeMake: e.target.value })} />
        </label>
      </div>
      <label className="wiring-field">
        <span>Model</span>
        <input value={lot.homeModel ?? ""} onChange={(e) => onChange({ homeModel: e.target.value })} />
      </label>
      <div className="pet-row">
        <label>
          <span>Width</span>
          <input value={lot.homeWidth ?? ""} onChange={(e) => onChange({ homeWidth: e.target.value })} />
        </label>
        <label>
          <span>Length</span>
          <input value={lot.homeLength ?? ""} onChange={(e) => onChange({ homeLength: e.target.value })} />
        </label>
      </div>
      <label className="wiring-field">
        <span>Type</span>
        <select className="mow-select" value={wide} onChange={(e) => onChange({ homeWide: e.target.value })}>
          <option value="">—</option>
          <option>Single Wide</option>
          <option>Double Wide</option>
        </select>
      </label>
    </div>
  );
}

function listingHref(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function EmptyLotChecklist({ lot, onChange }: { lot: Lot; onChange: (next: Partial<Lot>) => void }) {
  const href = listingHref(lot.zillowUrl ?? "");
  const checks = [
    ["readyPower", "Power on"],
    ["readyClean", "Cleaned"],
    ["readyInspected", "Inspected"],
  ] as const;
  return (
    <div className="pet-block">
      <p className="pet-title">Empty lot</p>
      <ul className="inventory">
        {checks.map(([key, label]) => (
          <li key={key}>
            <label>
              <input
                type="checkbox"
                checked={lot[key] === "Yes"}
                onChange={(e) => onChange({ [key]: e.target.checked ? "Yes" : "" })}
              />
              {label}
            </label>
          </li>
        ))}
      </ul>
      <label className="wiring-field">
        <span>Listed on Zillow</span>
        <select
          className="mow-select"
          value={lot.zillow === "Yes" || lot.zillow === "No" ? lot.zillow : ""}
          onChange={(e) => onChange({ zillow: e.target.value })}
        >
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>
      <label className="wiring-field">
        <span>Listing link</span>
        <input value={lot.zillowUrl ?? ""} placeholder="https://www.zillow.com/..." onChange={(e) => onChange({ zillowUrl: e.target.value })} />
      </label>
      <a className={`filter listing-link${href ? "" : " is-off"}`} href={href || undefined} target="_blank" rel="noreferrer">
        Open listing
      </a>
    </div>
  );
}

function HomeInsuranceFields({ lot, onChange, split }: { lot: Lot; onChange: (next: Partial<Lot>) => void; split?: string }) {
  const value = lot.homeIns === "Yes" || lot.homeIns === "No" ? lot.homeIns : "";
  return (
    <>
      <label className="wiring-field">
        <span>Home insurance</span>
        <select className="mow-select" value={value} onChange={(e) => onChange({ homeIns: e.target.value })}>
          <option value="">—</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </label>
      <label className="wiring-field">
        <span>Yearly insurance cost</span>
        <input value={split ?? ""} readOnly />
      </label>
      <label className="wiring-field">
        <span>Expires</span>
        <input type="date" value={lot.homeInsDate ?? ""} onChange={(e) => onChange({ homeInsDate: e.target.value })} />
      </label>
    </>
  );
}

function stayRows(stay: Stay): [string, string][] {
  const rows: [string, string][] = [
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
    ["Violations", stay.violations ?? ""],
  ];
  return rows.filter(([, value]) => value.trim());
}

function PreviousTenants({ values, onChange }: { values: Lot; onChange: (next: Partial<Lot>) => void }) {
  const [opened, setOpened] = useState<number | null>(null);
  const history = values.history ?? [];
  if (history.length === 0) return null;
  return (
    <div className="pet-block">
      <p className="pet-title">{history.length === 1 ? "Previous tenant" : "Previous tenants"}</p>
      <ul className="history">
        {history.map((stay, index) => {
          const reminder = depositReminder(stay);
          const docs = [stay.lease, stay.rulesReceipt, stay.background, stay.noticeFile, ...(stay.otherDocs ?? [])].filter(
            (file): file is { name: string; data: string } => Boolean(file?.data),
          );
          const open = opened === index;
          return (
            <li key={`${stay.moveOut}-${stay.name}-${index}`}>
              <button className="stay-line" type="button" aria-expanded={open} onClick={() => setOpened(open ? null : index)}>
                <strong>{stay.name || "No name"}</strong>
                <span>{shortDay(stay.moveOut)}</span>
                <span>{stay.balance?.trim() || "—"}</span>
              </button>
              {open ? (
                <>
                  <dl className="stay-facts">
                    {stayRows(stay).map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {docs.length > 0 ? (
                    <div className="doc-list">
                      {docs.map((file, fileIndex) => (
                        <a key={`${file.name}-${fileIndex}`} href={file.data} download={file.name}>
                          {file.name}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {reminder ? <span className="deposit-alert">{reminder}</span> : null}
                  {stay.depositChoice ? <span>Deposit {stay.depositChoice === "Return" ? "returned" : "kept"}</span> : null}
                  {stay.depositDue && !stay.depositChoice ? (
                    <div className="deposit-actions">
                      <button
                        className="filter"
                        type="button"
                        onClick={() =>
                          onChange({
                            history: history.map((item, i) => (i === index ? { ...item, depositChoice: "Return" } : item)),
                          })
                        }
                      >
                        Return deposit
                      </button>
                      <button
                        className="filter"
                        type="button"
                        onClick={() =>
                          onChange({
                            history: history.map((item, i) => (i === index ? { ...item, depositChoice: "Keep" } : item)),
                          })
                        }
                      >
                        Keep deposit
                      </button>
                    </div>
                  ) : null}
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function updateJob(jobs: MaintJob[] | undefined, id: string, patch: Partial<MaintJob>) {
  return (jobs ?? []).map((job) => (job.id === id ? { ...job, ...patch } : job));
}

function sortedJobs(jobs: MaintJob[] | undefined) {
  return [...(jobs ?? [])].sort((a, b) => {
    const doneA = a.done === "Yes" ? 1 : 0;
    const doneB = b.done === "Yes" ? 1 : 0;
    if (doneA !== doneB) return doneA - doneB;
    return (b.date || "").localeCompare(a.date || "");
  });
}

function shortDay(value?: string) {
  const day = parseDay(value);
  if (!day) return value?.trim() || "—";
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Fold({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pet-block">
      <button className="fold" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? "▾" : "▸"} {title}
      </button>
      {open ? children : null}
    </div>
  );
}

function printMow(lots: Lot[]) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rows = lots
    .filter((lot) => lot.noMow === "Yes")
    .map((lot) => ({ street: lot.street, lot: lot.lot, address: [lot.address, lot.street].filter(Boolean).join(" "), name: displayName(lot) }));
  const body = groupTodos(rows)
    .map(([street, group]) => {
      const lines = group.items
        .map((item) => `<tr><td>${escapeHtml(item.lot || "—")}</td><td>${escapeHtml(item.address)}</td><td>${escapeHtml(item.name)}</td></tr>`)
        .join("");
      return `<h2>${escapeHtml(street)}</h2><table><thead><tr><th>Lot</th><th>Address</th><th>Name</th></tr></thead><tbody>${lines}</tbody></table>`;
    })
    .join("");
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

const MOW_ROUNDS_KEY = "magnolia-mow-rounds";

type MowStop = { id: string; lot: string; address: string; name: string; street: string; mowed: boolean; notes: string };
type MowRound = { id: string; date: string; stops: MowStop[] };

function mowStops(lots: Lot[]): MowStop[] {
  return lots
    .filter((lot) => lot.noMow === "Yes")
    .map((lot) => ({
      id: lot.id,
      street: lot.street,
      lot: lot.lot,
      address: [lot.address, lot.street].filter(Boolean).join(" "),
      name: displayName(lot),
      mowed: false,
      notes: "",
    }));
}

function mowTone(stop: MowStop, balance: number) {
  if (balance > 72) return "mow-red";
  if (stop.notes.trim()) return "mow-yellow";
  if (stop.mowed) return "mow-green";
  return "mow-orange";
}

function asRounds(value: unknown): MowRound[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Partial<MowRound>;
    if (typeof row.date !== "string" || !Array.isArray(row.stops)) return [];
    return [{ id: typeof row.id === "string" ? row.id : row.date, date: row.date, stops: row.stops.filter((stop) => stop && typeof stop.id === "string") as MowStop[] }];
  });
}

function MowBoard({ lots, onOpen }: { lots: Lot[]; onOpen: (id: string) => void }) {
  const [rounds, setRounds] = useState<MowRound[]>([]);
  const [draft, setDraft] = useState<MowRound | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const balance = useMemo(() => {
    const map = new Map<string, number>();
    for (const lot of lots) map.set(lot.id, moneyNumber(lot.balance ?? ""));
    return map;
  }, [lots]);

  useEffect(() => {
    let cancel = false;
    void readMaster()
      .then((book) => {
        if (cancel) return;
        const saved = asRounds(book?.mowings);
        if (saved.length) setRounds(saved);
        else {
          try {
            const local = asRounds(JSON.parse(localStorage.getItem(MOW_ROUNDS_KEY) ?? "[]"));
            if (local.length) setRounds(local);
          } catch {
            /* start with no saved mowings */
          }
        }
      })
      .catch(() => {
        /* the list still works */
      })
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !rounds.length) return;
    try {
      localStorage.setItem(MOW_ROUNDS_KEY, JSON.stringify(rounds));
    } catch {
      /* the round stays on screen */
    }
    void saveMowings({ data: { mowings: rounds } }).catch(() => {
      /* the browser copy is still there */
    });
  }, [rounds, ready]);

  const viewing = cursor === null ? draft : rounds[cursor] ?? null;
  const editing = cursor === null && draft !== null;
  const rows = viewing?.stops ?? mowStops(lots);
  const groups = groupTodos(rows);
  const canLeft = (cursor === null && rounds.length > 0) || (cursor !== null && cursor < rounds.length - 1);
  const canRight = cursor !== null && cursor > 0;

  function startMowing() {
    if (draft) {
      setCursor(null);
      return;
    }
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setDraft({ id: `mow-${Date.now()}`, date, stops: mowStops(lots) });
    setCursor(null);
  }

  function patchStop(id: string, patch: Partial<MowStop>) {
    setDraft((current) => (current ? { ...current, stops: current.stops.map((stop) => (stop.id === id ? { ...stop, ...patch } : stop)) } : current));
  }

  function submitMowing() {
    if (!draft?.date) return;
    setRounds((current) => [draft, ...current]);
    setDraft(null);
    setCursor(0);
  }

  return (
    <div className="todo">
      <div className="todo-head">
        <h2>Yes mow</h2>
        {canLeft || canRight ? (
          <div className="mow-nav">
            {canLeft ? <button type="button" className="print-map" aria-label="Older mowing" onClick={() => setCursor(cursor === null ? 0 : cursor + 1)}>‹</button> : null}
            {canRight ? <button type="button" className="print-map" aria-label="Newer mowing" onClick={() => setCursor((cursor ?? 0) - 1)}>›</button> : null}
          </div>
        ) : null}
        {editing ? (
          <label className="mow-date">
            Mowing date
            <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
          </label>
        ) : viewing ? (
          <p className="mow-label">{viewing.date}</p>
        ) : null}
        <button className="print-map" type="button" onClick={() => printMow(lots)}>
          Print
        </button>
        {editing ? (
          <button className="print-map" type="button" disabled={!draft.date} onClick={submitMowing}>
            Submit
          </button>
        ) : null}
        <button className="print-map mow-new" type="button" onClick={startMowing}>
          New Mowing
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="todo-empty">No lots are set to Yes.</p>
      ) : (
        groups.map(([street, group]) => (
          <section key={street}>
            <h3>{street}</h3>
            <ul className="mow-list">
              {group.items.map((item) => {
                const tone = viewing ? mowTone(item, balance.get(item.id) ?? 0) : "";
                return (
                  <li key={item.id} className={editing || viewing ? "mow-active" : ""}>
                    <button className={"todo-card " + tone} type="button" onClick={() => onOpen(item.id)}>
                      <span><b>Lot</b> {item.lot || "—"}</span>
                      <span><b>Address</b> {item.address || "—"}</span>
                      <span><b>Name</b> {item.name || "—"}</span>
                    </button>
                    {viewing ? (
                      <div className="mow-side">
                        <label>
                          <input type="checkbox" checked={item.mowed} disabled={!editing} onChange={(event) => patchStop(item.id, { mowed: event.target.checked })} />
                          Mowed
                        </label>
                        <input aria-label={"Notes for " + (item.name || item.lot)} value={item.notes} placeholder="Notes" readOnly={!editing} onChange={(event) => patchStop(item.id, { notes: event.target.value })} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function streetGroup(street: string) {
  const name = street.toLowerCase();
  if (name.includes("jaleen")) return { rank: 0, label: "Jaleen" };
  if (name.includes("denise")) return { rank: 1, label: "Denise" };
  if (name.includes("leon")) return { rank: 2, label: "Leon" };
  if (name.includes("michelle")) return { rank: 3, label: "Michelle" };
  if (name.includes("kirkwood")) return { rank: 4, label: "Kirkwood" };
  return { rank: 5, label: street.trim() || "Other" };
}

const NOTE_BANDS = [
  { label: "Rent, short, or owe", words: ["rent", "short", "owe"] },
  { label: "Check, bounced, or missing", words: ["check", "bounced", "missing"] },
  { label: "Title or guest", words: ["title", "guest"] },
  { label: "Dog, cat, or pet", words: ["dog", "cat", "pet"] },
] as const;

function noteBand(notes: string) {
  const hay = notes.toLowerCase();
  const hit = NOTE_BANDS.find((band) => band.words.some((word) => new RegExp(`\\b${word}`, "i").test(hay)));
  return hit?.label ?? "Other";
}

function noteBands<T extends { notes: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const label = noteBand(item.notes);
    const current = groups.get(label);
    if (current) current.push(item);
    else groups.set(label, [item]);
  }
  const order = [...NOTE_BANDS.map((band) => band.label), "Other"];
  return order.flatMap((label) => {
    const group = groups.get(label);
    return group?.length ? [[label, group] as const] : [];
  });
}

function groupTodos<T extends { street: string }>(items: T[]) {
  const groups = new Map<string, { rank: number; items: T[] }>();
  for (const item of items) {
    const group = streetGroup(item.street);
    const current = groups.get(group.label);
    if (current) current.items.push(item);
    else groups.set(group.label, { rank: group.rank, items: [item] });
  }
  return [...groups.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
}
function TodoBoard({ lots, onOpen }: { lots: Lot[]; onOpen: (id: string) => void }) {
  const items = buildTodo(lots);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [rank, setRank] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TODO_DONE_KEY);
      const ids = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(ids)) setDone(new Set(ids.filter((id) => typeof id === "string")));
    } catch {
      setDone(new Set());
    }
    try {
      const raw = localStorage.getItem(TODO_RANK_KEY);
      const saved = raw ? (JSON.parse(raw) as unknown) : {};
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        const next: Record<string, number> = {};
        for (const [id, value] of Object.entries(saved)) {
          if (typeof value === "number") next[id] = value;
        }
        setRank(next);
      }
    } catch {
      setRank({});
    }
  }, []);
  function toggle(id: string) {
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
  function shift(id: string, dir: -1 | 1, list: { id: string }[]) {
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
  const [todoFilter, setTodoFilter] = useState<"open" | "done">("open");
  const openItems = items.filter((item) => !done.has(item.id));
  const doneItems = items.filter((item) => done.has(item.id));
  const shown = [...(todoFilter === "open" ? openItems : doneItems)].sort((a, b) => (rank[b.id] ?? 0) - (rank[a.id] ?? 0));
  return (
    <div className="todo">
      <div className="todo-head">
        <h2>By notes</h2>
        <div className="seg">
          <button className="filter" type="button" aria-pressed={todoFilter === "open"} onClick={() => setTodoFilter("open")}>
            Open{openItems.length ? ` ${openItems.length}` : ""}
          </button>
          <button className="filter" type="button" aria-pressed={todoFilter === "done"} onClick={() => setTodoFilter("done")}>
            Done{doneItems.length ? ` ${doneItems.length}` : ""}
          </button>
        </div>
        <button className="print-map" type="button" onClick={() => printTodo(shown.map((item) => ({ ...item, done: done.has(item.id) })))}>
          Print
        </button>
      </div>
      {shown.length === 0 ? (
        <p className="todo-empty">{todoFilter === "done" ? "Nothing checked off." : "Nothing open."}</p>
      ) : (
        noteBands(shown).map(([label, group]) => (
          <section key={label}>
            <h3>{label}</h3>
            <TodoList items={group} done={done} onToggle={toggle} onShift={(id, dir) => shift(id, dir, group)} onOpen={onOpen} empty="" />
          </section>
        ))
      )}
    </div>
  );
}

function shownAmount(value?: string) {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function increaseLines(lot: Lot) {
  return [
    lot.rentInc2026?.trim() ? `08/2026 rent increase: ${shownAmount(lot.rentInc2026)}` : "",
    lot.rentInc2027?.trim() ? `08/2027 rent increase: ${shownAmount(lot.rentInc2027)}` : "",
  ].filter(Boolean);
}

function increaseBody(lot: Lot) {
  const who = displayName(lot) || "Resident";
  return `Hello ${who},\n\nThis is notice of a rent increase for ${[lot.address, lot.street].filter(Boolean).join(" ")}, lot ${lot.lot}.\n\n${increaseLines(lot).join("\n")}\n\nMagnolia Central of Florida Estates`;
}

function openMail(to: string, subject: string, body: string) {
  window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}

function openMailAll(emails: string[], subject: string, body: string) {
  const list = [...new Set(emails.map((item) => item.trim()).filter(Boolean))];
  if (list.length === 0) return;
  window.open(`mailto:?bcc=${encodeURIComponent(list.join(","))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
}

function openText(phone: string, body: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return;
  window.open(`sms:${digits}?&body=${encodeURIComponent(body)}`, "_blank");
}

function openTextAll(phones: string[], body: string) {
  const list = [...new Set(phones.map((item) => item.replace(/[^\d]/g, "")).filter(Boolean))];
  if (list.length === 0) return;
  window.open(`sms:${list.join(",")}?&body=${encodeURIComponent(body)}`, "_blank");
}

function rollGroups(lots: Lot[]) {
  const sorted = [...lots].sort(byStreetAddress);
  const groups = new Map<string, { rank: number; items: Lot[] }>();
  for (const lot of sorted) {
    const group = streetGroup(lot.street);
    const current = groups.get(group.label);
    if (current) current.items.push(lot);
    else groups.set(group.label, { rank: group.rank, items: [lot] });
  }
  return [...groups.entries()].sort((a, b) => a[1].rank - b[1].rank || a[0].localeCompare(b[0]));
}

function IncreaseBoard({ lots, onOpen }: { lots: Lot[]; onOpen: (id: string) => void }) {
  const rows = lots.filter((lot) => lot.rentInc2026?.trim() || lot.rentInc2027?.trim());
  const emails = rows.map((lot) => lot.email).filter((email) => email.trim());
  function mailOne(lot: Lot) {
    if (!lot.email.trim()) return;
    openMail(lot.email.trim(), `Rent increase · Lot ${lot.lot}`, increaseBody(lot));
  }
  function mailEach() {
    rows.forEach(mailOne);
  }
  function mailAll() {
    openMailAll(
      emails,
      "Rent increase · Magnolia Central of Florida Estates",
      "Hello,\n\nThis is notice of a rent increase from Magnolia Central of Florida Estates. Your 08/2026 and 08/2027 amounts are the figures on file for your lot.\n\nMagnolia Central of Florida Estates",
    );
  }
  return (
    <div className="todo roll">
      <div className="todo-head">
        <h2>Rent increase</h2>
        <button className="print-map" type="button" disabled={emails.length === 0} onClick={mailEach}>
          Email each
        </button>
        <button className="print-map" type="button" disabled={emails.length === 0} onClick={mailAll}>
          Email all
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="todo-empty">Enter an 08/2026 or 08/2027 amount in the register, then open this roll again.</p>
      ) : (
        rollGroups(rows).map(([street, group]) => (
          <section key={street}>
            <h3>{street}</h3>
            <ul>
              {group.items.map((lot) => (
                <li key={lot.id} className="roll-row">
                  <button className="todo-card" type="button" onClick={() => onOpen(lot.id)}>
                    <span><b>Lot</b> {lot.lot}</span>
                    <span><b>Address</b> {[lot.address, lot.street].filter(Boolean).join(" ")}</span>
                    <span><b>Name</b> {displayName(lot) || "—"}</span>
                    {lot.rentInc2026?.trim() ? <span><b>08/2026</b> {shownAmount(lot.rentInc2026)}</span> : null}
                    {lot.rentInc2027?.trim() ? <span><b>08/2027</b> {shownAmount(lot.rentInc2027)}</span> : null}
                  </button>
                  <button className="print-map" type="button" disabled={!lot.email.trim()} onClick={() => mailOne(lot)}>
                    Email
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

const ALERTS = [
  ["water", "Water outage", "The water is out at Magnolia Central of Florida Estates. We will let you know when it is back on."],
  ["storm", "Storm", "A storm is in the area. Please secure anything loose outside and stay inside until it passes."],
  ["power", "Power outage", "The power is out at Magnolia Central of Florida Estates. We will let you know when it is back on."],
  ["other", "Other", ""],
] as const;

function AlertBoard({ lots, onOpen }: { lots: Lot[]; onOpen: (id: string) => void }) {
  const [reason, setReason] = useState<(typeof ALERTS)[number][0]>("water");
  const [other, setOther] = useState("");
  const picked = ALERTS.find((item) => item[0] === reason) ?? ALERTS[0];
  const message = reason === "other" ? other.trim() : picked[2];
  const rows = lots.filter((lot) => lot.status === "Occupied" || lot.status === "Eviction");
  const bodyFor = (lot: Lot) => `Hello ${displayName(lot) || "Resident"},\n\n${message || "Please see this notice from the park."}\n\n${[lot.address, lot.street].filter(Boolean).join(" ")}, lot ${lot.lot}\n\nMagnolia Central of Florida Estates`;
  const emails = rows.map((lot) => lot.email).filter((email) => email.trim());
  const phones = rows.map((lot) => lot.phone).filter((phone) => phone.replace(/[^\d]/g, ""));
  return (
    <div className="todo roll">
      <div className="todo-head">
        <h2>Emergency broadcast</h2>
        <select className="mow-select" value={reason} onChange={(e) => setReason(e.target.value as (typeof ALERTS)[number][0])}>
          {ALERTS.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <button className="print-map" type="button" disabled={!message || emails.length === 0} onClick={() => rows.forEach((lot) => lot.email.trim() && openMail(lot.email.trim(), picked[1], bodyFor(lot)))}>
          Email each
        </button>
        <button className="print-map" type="button" disabled={!message || emails.length === 0} onClick={() => openMailAll(emails, picked[1], `${message}\n\nMagnolia Central of Florida Estates`)}>
          Email all
        </button>
        <button className="print-map" type="button" disabled={!message || phones.length === 0} onClick={() => rows.forEach((lot) => openText(lot.phone, message))}>
          Text each
        </button>
        <button className="print-map" type="button" disabled={!message || phones.length === 0} onClick={() => openTextAll(phones, message)}>
          Text all
        </button>
      </div>
      {reason === "other" ? (
        <label className="wiring-field roll-note">
          <span>Other notice</span>
          <textarea rows={3} value={other} onChange={(e) => setOther(e.target.value)} placeholder="What should the message say?" />
        </label>
      ) : (
        <p className="roll-note">{picked[2]}</p>
      )}
      {rollGroups(rows).map(([street, group]) => (
        <section key={street}>
          <h3>{street}</h3>
          <ul>
            {group.items.map((lot) => (
              <li key={lot.id} className="roll-row">
                <button className="todo-card" type="button" onClick={() => onOpen(lot.id)}>
                  <span><b>Lot</b> {lot.lot}</span>
                  <span><b>Address</b> {[lot.address, lot.street].filter(Boolean).join(" ")}</span>
                  <span><b>Name</b> {displayName(lot) || "—"}</span>
                  <span><b>Email</b> {lot.email.trim() || "—"}</span>
                  <span><b>Phone</b> {lot.phone.trim() || "—"}</span>
                </button>
                <div className="roll-actions">
                  <button className="print-map" type="button" disabled={!message || !lot.email.trim()} onClick={() => openMail(lot.email.trim(), picked[1], bodyFor(lot))}>
                    Email
                  </button>
                  <button className="print-map" type="button" disabled={!message || !lot.phone.replace(/[^\d]/g, "")} onClick={() => openText(lot.phone, message)}>
                    Text
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function costSum(values: (string | undefined)[]) {
  if (values.every((value) => !(value ?? "").trim())) return "";
  const sum = values.reduce((total, value) => total + (parseMoney(value) ?? 0), 0);
  const rounded = Math.round(sum * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function parseMoney(value?: string): number | null {
  const raw = (value ?? "").replace(/[$,\s]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function dollar(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 });
}

const HEAT_STOPS: { min: number; color: string; label: string }[] = [
  { min: 86, color: "#0d7a32", label: "Highest · top" },
  { min: 72, color: "#2f9e44", label: "High" },
  { min: 58, color: "#8fce4a", label: "Above average" },
  { min: 43, color: "#f2d031", label: "Moderate" },
  { min: 29, color: "#f08c00", label: "Below average" },
  { min: 15, color: "#e8590c", label: "Low" },
  { min: -Infinity, color: "#c92a2a", label: "Lowest · bottom" },
];

function heatBand(percent: number) {
  return HEAT_STOPS.find((stop) => percent >= stop.min) ?? HEAT_STOPS[HEAT_STOPS.length - 1];
}

function heatInk(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return r * 0.3 + g * 0.59 + b * 0.11 > 150 ? "#1c1916" : "#fff";
}

const HEAT_METRICS = [
  ["overall", "Overall"],
  ["roi", "Percentile"],
  ["monthProfit", "Monthly profit"],
  ["yearProfit", "Yearly profit"],
  ["monthExpense", "Monthly expenses"],
  ["yearExpense", "Yearly expenses"],
  ["monthRent", "Monthly rent"],
  ["yearRent", "Yearly rent"],
  ["owed", "Still owed"],
] as const;

type HeatMetric = (typeof HEAT_METRICS)[number][0];

function HeatBoard({ lots, scoped, selected, onOpen, mini = false }: { lots: Lot[]; scoped: Lot[]; selected: string | null; onOpen: (id: string) => void; mini?: boolean }) {
  const [metric, setMetric] = useState<HeatMetric>("overall");
  const [metricsOpen, setMetricsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
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
    other: "0",
  };
  const [poolsOpen, setPoolsOpen] = useState(false);
  const [expensePools, setExpensePools] = useState<Record<keyof typeof poolDefaults, string>>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("magnolia-financial-expense-pools") : null;
      return saved ? { ...poolDefaults, ...JSON.parse(saved) } : poolDefaults;
    } catch {
      return poolDefaults;
    }
  });
  const updateExpensePool = (key: keyof typeof poolDefaults, value: string) => {
    const next = { ...expensePools, [key]: value };
    setExpensePools(next);
    try {
      localStorage.setItem("magnolia-financial-expense-pools", JSON.stringify(next));
    } catch {
      /* keep the values in the current session if browser storage is unavailable */
    }
  };
  const poolLabels: { key: keyof typeof poolDefaults; label: string }[] = [
    { key: "insurance", label: "Home insurance" },
    { key: "propertyTax", label: "Property taxes" },
    { key: "sewer", label: "Sewer" },
    { key: "water", label: "Water" },
    { key: "garbage", label: "Garbage" },
    { key: "wiring", label: "Home wiring insurance" },
    { key: "materials", label: "Materials / supplies" },
    { key: "maintenance", label: "Maintenance" },
    { key: "utilities", label: "Other utilities" },
    { key: "other", label: "Other expenses" },
  ];
  const annualPoolTotal = poolLabels.reduce((sum, item) => sum + (parseMoney(expensePools[item.key]) ?? 0), 0);
  const lotSpecificAnnual = (lot: Lot) =>
    ["maintCost", "mowCost", "acCost", "roofCost", "washCost", "inspectCost", "taxCost", "sewerCost", "waterCost", "garbageCost"]
      .reduce((sum, key) => sum + (parseMoney(String(lot[key as keyof Lot] ?? "")) ?? 0), 0);
  const monthlyExpense = (lot: Lot) => {
    const sharedAnnual = poolLabels.reduce((sum, item) => {
      const amount = parseMoney(expensePools[item.key]) ?? 0;
      if (item.key === "insurance") {
        return sum + (lot.homeIns === "Yes" && insuredHomes.length ? amount / insuredHomes.length : 0);
      }
      if (item.key === "wiring") {
        const wiredHomes = homes.filter((home) => home.wiring === "Yes");
        return sum + (lot.wiring === "Yes" && wiredHomes.length ? amount / wiredHomes.length : 0);
      }
      return sum + (homes.length ? amount / homes.length : 0);
    }, 0);
    return (sharedAnnual + lotSpecificAnnual(lot)) / 12;
  };
  const worseHigh = metric === "monthExpense" || metric === "yearExpense" || metric === "owed";
  const scored = homes
    .flatMap((lot) => {
      const rent = lot.status === "Empty" ? 0 : (parseMoney(lot.rent) ?? 0);
      const expense = monthlyExpense(lot);
      const profit = rent - expense - (lot.status === "Empty" ? 540 : 0);
      const ratio = rent > 0 ? (profit / rent) * 100 : profit < 0 ? -100 : null;
      const pets = (lot.dogs === "1" || lot.dogs === "2" ? Number(lot.dogs) : 0) + (lot.cats === "1" || lot.cats === "2" ? Number(lot.cats) : 0);
      const violations = (lot.violations ?? "").split(/\n+/).map((line) => line.trim()).filter(Boolean).length;
      const marks = ((lot.lateRent ?? "").trim() ? 1 : 0) + ((lot.bouncedCheck ?? "").trim() ? 1 : 0);
      const residents = lot.name.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean).length;
      const overall = ratio == null ? null : ratio - pets * 10 - violations * 5 - marks * 10 + (residents === 1 ? 10 : 0);
      const figures: Record<HeatMetric, number | null> = {
        overall,
        roi: ratio,
        monthProfit: profit,
        yearProfit: profit * 12,
        monthExpense: expense,
        yearExpense: expense * 12,
        monthRent: rent,
        yearRent: rent * 12,
        owed: parseMoney(lot.balance) ?? 0,
      };
      const amount = figures[metric];
      if (amount == null || ratio == null) return [];
      return [{ lot, amount, ratio }];
    })
    .sort((a, b) => (worseHigh ? a.amount - b.amount : b.amount - a.amount) || Number(a.lot.lot) - Number(b.lot.lot));
  const paint: Record<string, { fill: string; ink: string; value: string }> = {};
  const standing = (amount: number) => {
    if (scored.length <= 1) return 100;
    const behind = scored.filter((row) => (worseHigh ? row.amount > amount : row.amount < amount)).length;
    const tied = scored.filter((row) => row.amount === amount).length;
    return ((behind + tied) / scored.length) * 100;
  };
  const label = (amount: number) => (metric === "roi" ? `${Math.round(standing(amount))}%` : metric === "overall" ? `${Math.round(amount)}%` : shownAmount(String(Math.round(amount * 100) / 100)));
  scored.forEach((row) => {
    const band = heatBand(standing(row.amount));
    const value = label(row.amount);
    paint[row.lot.id] = { fill: band.color, ink: heatInk(band.color), value };
  });
  const metricLabel = HEAT_METRICS.find((item) => item[0] === metric)?.[1] ?? "Value";
  const counted = scoped.filter((lot) => lot.status !== "Open");
  const rentSum = counted.reduce((sum, lot) => sum + (lot.status === "Empty" ? 0 : (parseMoney(lot.rent) ?? 0)), 0);
  const expenseSum = counted.reduce((sum, lot) => sum + monthlyExpense(lot), 0);
  const emptyCount = counted.filter((lot) => lot.status === "Empty").length;
  const profitSum = rentSum - expenseSum - emptyCount * 540;
  const owedSum = counted.reduce((sum, lot) => sum + (parseMoney(lot.balance) ?? 0), 0);
  const metricTotal =
    metric === "roi" ? (rentSum > 0 ? (profitSum / rentSum) * 100 : profitSum < 0 ? -100 : 0)
    : metric === "overall" ? (scored.length ? scored.reduce((sum, row) => sum + row.amount, 0) / scored.length : 0)
    : metric === "monthProfit" ? profitSum
    : metric === "yearProfit" ? profitSum * 12
    : metric === "monthExpense" ? expenseSum
    : metric === "yearExpense" ? expenseSum * 12
    : metric === "monthRent" ? rentSum
    : metric === "yearRent" ? rentSum * 12
    : owedSum;
  const metricText = metric === "roi" || metric === "overall" ? `${Math.round(metricTotal)}%` : dollar(metricTotal);
  if (mini) {
    return (
      <div className="mini-heat">
        {([1, 2, 3] as const).map((id) => (
          <PlatMap key={id} sheet={id} query="" filter="all" selected={selected} lots={lots} heat={paint} onSelect={onOpen} />
        ))}
      </div>
    );
  }
  return (
    <div className="todo heat-board">
      <div className="financial-window-actions">
        <button type="button" className="tab" onClick={() => { window.open(`${window.location.origin}${window.location.pathname}?view=heat`, "_blank", "noopener,noreferrer"); }}>
          Open financial dashboard in new window ↗
        </button>
      </div>
      <section className={poolsOpen ? "expense-pools" : "expense-pools is-collapsed"} aria-label="Annual expense assumptions">
        <button type="button" className="expense-pools-head" aria-expanded={poolsOpen} onClick={() => setPoolsOpen((open) => !open)}>
          <div>
            <h3>Annual expense assumptions</h3>
            {poolsOpen ? <p>Adjust these community-wide costs to match actual bills. Values are saved in this browser.</p> : null}
          </div>
          <strong>{dollar(annualPoolTotal)} / year</strong>
          <span className="expense-toggle" aria-hidden="true">{poolsOpen ? "▴" : "▾"}</span>
        </button>
        {poolsOpen ? (
          <>
            <div className="expense-pool-grid">
              {poolLabels.map(({ key, label }) => (
                <label key={key}>
                  <span>{label}</span>
                  <div className="expense-input-wrap">
                    <span>$</span>
                    <input
                      aria-label={label + " annual shared expense"}
                      inputMode="decimal"
                      value={expensePools[key]}
                      onChange={(event) => updateExpensePool(key, event.target.value)}
                    />
                    <small>/ yr</small>
                  </div>
                </label>
              ))}
            </div>
            <p className="expense-pools-note">Shared costs are split across occupied and empty lots. A cost typed on a lot in the detail window stays on that lot only. Home insurance is split only across lots marked Home insurance Yes. Wiring insurance is split only across lots marked Yes.</p>
          </>
        ) : null}
      </section>
      <div className="map-slot heat-metric-drop">
        <button className="filter" type="button" aria-expanded={metricsOpen} onClick={() => setMetricsOpen((open) => !open)}>
          {metricLabel} ▾
        </button>
        {metricsOpen ? (
          <div className="map-drop filter-checks" role="group" aria-label="Financial filters">
            {HEAT_METRICS.map(([id, name]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={metric === id}
                  onChange={() => setMetric((current) => (current === id ? "overall" : id))}
                />
                {name}
              </label>
            ))}
          </div>
        ) : null}
      </div>
      <div className="money-totals">
        <span>{metric === "roi" ? "Profit" : metricLabel} <b>{metricText}</b></span>
      </div>
      <div className="heat-legend">
        {HEAT_STOPS.map((stop) => (
          <span key={stop.label}>
            <i style={{ background: stop.color }} />
            {stop.label}
          </span>
        ))}
        <span>
          <i style={{ background: "#d5d0c8" }} />
          No figure
        </span>
      </div>
      <h3>Profit ranking · green to red · best to worst from left to right</h3>
      <div className="heat-rank-strip" aria-label={`Lots ranked best to worst by ${metricLabel}`}>
        {scored.map((row, index) => {
          const color = paint[row.lot.id];
          return (
            <button
              key={row.lot.id}
              type="button"
              data-lot-id={row.lot.id}
              title={`Rank ${index + 1}: Lot ${row.lot.lot} · ${label(row.amount)}`}
              style={{ background: color?.fill ?? "#d5d0c8", color: color?.ink ?? "#1c1916" }}
              onClick={() => onOpen(row.lot.id)}
            >
              <b>{row.lot.lot}</b>
              <span>{label(row.amount)}</span>
            </button>
          );
        })}
      </div>
      <div className="map-stack">
        {([1, 2, 3] as const).map((id) => (
          <section key={id} className="map-block">
            <h2>{SHEET_COPY[id].title}</h2>
            <PlatMap sheet={id} query="" filter="all" selected={selected} lots={lots} heat={paint} onSelect={onOpen} />
          </section>
        ))}
      </div>
      <div className="heat-list-head">
        <h3>Best to worst · {metricLabel}</h3>
        <div className="map-slot heat-metric-drop">
          <button className="filter" type="button" aria-expanded={listOpen} onClick={() => setListOpen((open) => !open)}>
            {metricLabel} ▾
          </button>
          {listOpen ? (
            <div className="map-drop filter-checks" role="group" aria-label="Best to worst filters">
              {HEAT_METRICS.map(([id, name]) => (
                <label key={id}>
                  <input
                    type="checkbox"
                    checked={metric === id}
                    onChange={() => setMetric((current) => (current === id ? "overall" : id))}
                  />
                  {name}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {scored.length === 0 ? (
        <p className="todo-empty">Nothing to color for this filter.</p>
      ) : (
        <table className="heat-rank">
          <thead>
            <tr>
              <th>#</th>
              <th>Lot</th>
              <th>Address</th>
              <th>Name</th>
              <th>{metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((row, index) => {
              const color = paint[row.lot.id];
              return (
                <tr key={row.lot.id} className="heat-rank-lot" style={{ background: color?.fill ?? "#d5d0c8", color: color?.ink ?? "#1c1916" }}>
                  <td>{index + 1}</td>
                  <td>
                    <button type="button" onClick={() => onOpen(row.lot.id)}>
                      {row.lot.lot}
                    </button>
                  </td>
                  <td>{[row.lot.address, row.lot.street].filter(Boolean).join(" ")}</td>
                  <td>{displayName(row.lot) || "—"}</td>
                  <td>{label(row.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function formatTodoDate(stamp: string) {
  const [y, m, d] = stamp.split("-").map(Number);
  if (!y || !m || !d) return stamp;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TodoList({
  items,
  done,
  onToggle,
  onShift,
  onOpen,
  empty,
}: {
  items: { id: string; lot: string; address: string; name: string; notes: string; text: string; date: string }[];
  done: Set<string>;
  onToggle: (id: string) => void;
  onShift: (id: string, dir: -1 | 1) => void;
  onOpen: (id: string) => void;
  empty: string;
}) {
  if (items.length === 0) return <p className="todo-empty">{empty}</p>;
  return (
    <ul>
      {items.map((item, index) => {
        const checked = done.has(item.id);
        return (
          <li key={item.id} className={checked ? "done" : ""}>
            <div className="todo-controls">
              <button type="button" className="todo-arrow" aria-label="Higher priority" disabled={index === 0} onClick={() => onShift(item.id, -1)}>
                ↑
              </button>
              <input type="checkbox" checked={checked} aria-label={checked ? "Mark not done" : "Completed"} onChange={() => onToggle(item.id)} />
              <button type="button" className="todo-arrow" aria-label="Lower priority" disabled={index === items.length - 1} onClick={() => onShift(item.id, 1)}>
                ↓
              </button>
            </div>
            <button className="todo-card" type="button" onClick={() => onOpen(item.id)}>
              <time>{item.date ? formatTodoDate(item.date) : "No date"}</time>
              <span><b>Lot</b> {item.lot || "—"}</span>
              <span><b>Address</b> {item.address || "—"}</span>
              <span><b>Name</b> {item.name || "—"}</span>
              {item.text ? <span><b>Due</b> {item.text}</span> : null}
              <em><b>Notes</b> {item.notes || "—"}</em>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function blankGuest(): Guest {
  return { name: "", year: "", make: "", tag: "", state: "", arrival: "", departure: "", card: null };
}

function GuestCards({ guests, onChange }: { guests: Guest[]; onChange: (next: Guest[]) => void }) {
  function set(index: number, patch: Partial<Guest>) {
    onChange(guests.map((guest, i) => (i === index ? { ...guest, ...patch } : guest)));
  }
  return (
    <>
      {guests.map((guest, index) => (
        <div className="guest-card" key={index}>
          <p className="pet-title">{guests.length > 1 ? `Guest ${index + 1}` : "Guest"}</p>
          <label className="wiring-field">
            <span>Guest's name</span>
            <input value={guest.name} onChange={(e) => set(index, { name: e.target.value })} />
          </label>
          <p className="pet-title">Guest's vehicle</p>
          <div className="guest-vehicle">
            <label className="wiring-field">
              <span>Year</span>
              <input value={guest.year} onChange={(e) => set(index, { year: e.target.value })} />
            </label>
            <label className="wiring-field">
              <span>Make</span>
              <input value={guest.make} onChange={(e) => set(index, { make: e.target.value })} />
            </label>
            <label className="wiring-field">
              <span>Tag</span>
              <input value={guest.tag} onChange={(e) => set(index, { tag: e.target.value })} />
            </label>
            <label className="wiring-field">
              <span>State</span>
              <input value={guest.state} onChange={(e) => set(index, { state: e.target.value })} />
            </label>
          </div>
          <div className="guest-vehicle">
            <label className="wiring-field">
              <span>Arrival date</span>
              <input type="date" value={guest.arrival} onChange={(e) => set(index, { arrival: e.target.value })} />
            </label>
            <label className="wiring-field">
              <span>Departure date</span>
              <input type="date" value={guest.departure} onChange={(e) => set(index, { departure: e.target.value })} />
            </label>
          </div>
          <FileSlot label="Upload guest card" file={guest.card} onChange={(card) => set(index, { card })} />
        </div>
      ))}
    </>
  );
}

function FileSlot({
  label,
  file,
  onChange,
}: {
  label: string;
  file?: { name: string; data: string } | null;
  onChange: (next: { name: string; data: string } | null) => void;
}) {
  return (
    <div className="doc-slot">
      <span>{label}</span>
      {file?.data ? (
        <div className="doc-file">
          <a href={file.data} download={file.name}>
            {file.name}
          </a>
          <button className="doc-remove" type="button" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      ) : (
        <input
          type="file"
          onChange={async (e) => {
            const picked = e.target.files?.[0];
            e.target.value = "";
            if (!picked) return;
            const data = await fileToData(picked);
            if (!data) return;
            onChange({ name: picked.name, data });
          }}
        />
      )}
    </div>
  );
}

const INSPECTION_ITEMS = [
  ["maintenance", "Maintenance"],
  ["mow", "MOW"],
  ["acCleaning", "AC cleaning"],
  ["acService", "AC service"],
  ["acFilter", "AC filter"],
  ["roofAge", "Roof age"],
  ["roofMaterial", "Roof material"],
  ["roofInstalled", "Roof installed"],
  ["roofReplace", "Roof needs replaced"],
  ["pressureWash", "Pressure wash"],
] as const;

function LotExtras({
  values,
  onChange,
  onMoveOut,
  onRentRoll,
  part,
}: {
  values: Lot;
  onChange: (next: Partial<Lot>) => void;
  onMoveOut?: () => void;
  onRentRoll?: () => void;
  part: "personal" | "home" | "rent" | "notes" | "maintenance" | "empty";
}) {
  const yn = (value?: string) => (value === "Yes" || value === "No" ? value : "");
  const [noticeOpen, setNoticeOpen] = useState(false);
  return (
    <>
      {part === "maintenance" ? (
      <>
      <div className="pet-block">
        <p className="pet-title">Maintenance</p>
        <label className="wiring-field">
          <span>Maintenance</span>
          <input value={values.maintenance ?? ""} placeholder="Leak" onChange={(e) => onChange({ maintenance: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.maintCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ maintCost: e.target.value })} />
        </label>
      </div>
      <div className="pet-block">
        <p className="pet-title">MOW</p>
        <label className="wiring-field">
          <span>MOW</span>
          <select className="mow-select" value={values.noMow === "Yes" || values.noMow === "No" || values.noMow === "Owe" ? values.noMow : ""} onChange={(e) => onChange({ noMow: e.target.value })}>
            <option value="">—</option>
            <option>Yes</option>
            <option>No</option>
            <option>Owe</option>
          </select>
        </label>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.mowCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ mowCost: e.target.value })} />
        </label>
      </div>
      <div className="pet-block">
        <p className="pet-title">AC</p>
        <div className="pet-row">
          <label>
            <span>Cleaning</span>
            <input value={values.acCleaning ?? ""} onChange={(e) => onChange({ acCleaning: e.target.value })} />
          </label>
          <label>
            <span>Service</span>
            <input value={values.acService ?? ""} onChange={(e) => onChange({ acService: e.target.value })} />
          </label>
        </div>
        <label className="wiring-field">
          <span>Filter</span>
          <input value={values.acFilter ?? ""} onChange={(e) => onChange({ acFilter: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.acCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ acCost: e.target.value })} />
        </label>
      </div>
      <div className="pet-block">
        <p className="pet-title">Roof</p>
        <div className="pet-row">
          <label>
            <span>Age</span>
            <input value={values.roofAge ?? ""} onChange={(e) => onChange({ roofAge: e.target.value })} />
          </label>
          <label>
            <span>Material</span>
            <input value={values.roofMaterial ?? ""} onChange={(e) => onChange({ roofMaterial: e.target.value })} />
          </label>
        </div>
        <div className="pet-row">
          <label>
            <span>Date installed</span>
            <input value={values.roofInstalled ?? ""} onChange={(e) => onChange({ roofInstalled: e.target.value })} />
          </label>
          <label>
            <span>Needs replaced</span>
            <select className="mow-select" value={yn(values.roofReplace)} onChange={(e) => onChange({ roofReplace: e.target.value })}>
              <option value="">—</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
        </div>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.roofCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ roofCost: e.target.value })} />
        </label>
      </div>
      <div className="pet-block">
        <p className="pet-title">Pressure wash</p>
        <label className="wiring-field">
          <span>Pressure wash</span>
          <input value={values.pressureWash} onChange={(e) => onChange({ pressureWash: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.washCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ washCost: e.target.value })} />
        </label>
      </div>
      <div className="pet-block">
        <p className="pet-title">Home inspection</p>
        <ul className="inventory">
          {INSPECTION_ITEMS.map(([key, label]) => (
            <li key={key}>
              <label>
                <input
                  type="checkbox"
                  checked={values.inspectionChecks?.[key] === "Yes"}
                  onChange={(e) => {
                    const checks = { ...(values.inspectionChecks ?? {}), [key]: e.target.checked ? "Yes" : "" };
                    const done = INSPECTION_ITEMS.every(([id]) => checks[id] === "Yes");
                    onChange({ inspectionChecks: checks, inspectionDate: done ? values.inspectionDate?.trim() || dayStamp() : "" });
                  }}
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
        <label className="wiring-field">
          <span>Date</span>
          <input type="date" value={values.inspectionDate ?? ""} onChange={(e) => onChange({ inspectionDate: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Notes</span>
          <textarea rows={4} value={values.inspectionNotes ?? ""} onChange={(e) => onChange({ inspectionNotes: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Cost</span>
          <input value={values.inspectCost ?? ""} inputMode="decimal" onChange={(e) => onChange({ inspectCost: e.target.value })} />
        </label>
      </div>
      </>
      ) : null}
      {part === "home" ? (
      <div className="pet-block">
        <p className="pet-title">Home inventory</p>
        <ul className="inventory">
          {(
            [
              ["fridge", "Refrigerator"],
              ["stove", "Stove"],
              ["washer", "Washer"],
              ["dryer", "Dryer"],
              ["microwave", "Microwave"],
            ] as const
          ).map(([key, label]) => {
            const raw = String(values[key] ?? "").trim().toLowerCase();
            const on = raw !== "" && raw !== "no";
            return (
              <li key={key}>
                <label>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => onChange({ [key]: e.target.checked ? "Yes" : "" })}
                  />
                  {label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      ) : null}
      {part === "rent" ? (
      <>
      <div className="pet-block">
        <p className="pet-title">Money</p>
        <div className="pet-row">
          <label>
            <span>Total</span>
            <input
              value={values.rent}
              onChange={(e) => onChange({ rent: e.target.value, homeRent: rentGap(e.target.value, values.lotRent ?? "", petFee(values.dogs, values.cats)) })}
            />
          </label>
          <label>
            <span>Late rent</span>
            <input value={values.lateRent} onChange={(e) => onChange({ lateRent: e.target.value })} />
          </label>
        </div>
        <div className="pet-row">
          <label>
            <span>Lot rent</span>
            <input
              value={values.status === "Occupied" ? (values.lotRent ?? "") : ""}
              disabled={values.status !== "Occupied"}
              onChange={(e) => onChange({ lotRent: e.target.value })}
            />
          </label>
          <label>
            <span>Home rent</span>
            <input
              value={values.homeRent ?? ""}
              onChange={(e) => onChange({ homeRent: e.target.value, rent: rentTotal(values.lotRent, e.target.value, petFee(values.dogs, values.cats)) })}
            />
          </label>
        </div>
        <label className="wiring-field">
          <span>Pet fee · $15 each</span>
          <input value={String(petFee(values.dogs, values.cats))} readOnly />
        </label>
        <div className="pet-row">
          <label>
            <span>08/2026 increase</span>
            <input value={values.rentInc2026 ?? ""} onChange={(e) => onChange({ rentInc2026: e.target.value })} />
          </label>
          <label>
            <span>08/2027</span>
            <input value={values.rentInc2027 ?? ""} onChange={(e) => onChange({ rentInc2027: e.target.value })} />
          </label>
        </div>
        {onRentRoll ? (
          <button className="filter" type="button" onClick={onRentRoll}>
            Rent increase
          </button>
        ) : null}
        <label className="wiring-field">
          <span>Bounced check</span>
          <input value={values.bouncedCheck ?? ""} onChange={(e) => onChange({ bouncedCheck: e.target.value })} />
        </label>
        <div className="pet-row">
          <label>
            <span>Move-in</span>
            <input type="date" value={values.moveIn ?? ""} onChange={(e) => onChange({ moveIn: e.target.value })} />
          </label>
          <label>
            <span>Lease end</span>
            <input type="date" value={values.leaseEnd ?? ""} onChange={(e) => onChange({ leaseEnd: e.target.value })} />
          </label>
        </div>
        <label className="wiring-field">
          <span>Rent due</span>
          <input type="date" value={values.rentDue ?? ""} onChange={(e) => onChange({ rentDue: e.target.value })} />
        </label>
        <div className="pet-row">
          <label>
            <span>Deposit</span>
            <input value={values.deposit ?? ""} onChange={(e) => onChange({ deposit: e.target.value })} />
          </label>
          <label>
            <span>Still owed</span>
            <input value={values.balance ?? ""} onChange={(e) => onChange({ balance: e.target.value })} />
          </label>
        </div>
        {onMoveOut ? (
          <button className="filter move-out" type="button" onClick={onMoveOut}>
            Move out
          </button>
        ) : null}
      </div>
      <PreviousTenants values={values} onChange={onChange} />
      <Fold title="Notice">
        <label className="wiring-field">
          <span>Date</span>
          <input type="date" value={values.noticeDate ?? ""} onChange={(e) => onChange({ noticeDate: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Note</span>
          <textarea rows={3} value={values.noticeNote ?? ""} onChange={(e) => onChange({ noticeNote: e.target.value })} />
        </label>
        <div className="notice-actions">
          <button className="filter" type="button" onClick={() => printNotice(values)}>
            Print notice
          </button>
          <button className="filter" type="button" onClick={() => setNoticeOpen(true)}>
            Upload notice
          </button>
        </div>
        {values.noticeFile?.name ? <p className="qb-note">{values.noticeFile.name}</p> : null}
      </Fold>
      </>
      ) : null}
      {part === "personal" ? (
      <Fold title="Emergency contact">
        <div className="pet-row">
          <label>
            <span>Name</span>
            <input value={values.emergencyName ?? ""} onChange={(e) => onChange({ emergencyName: e.target.value })} />
          </label>
          <label>
            <span>Phone</span>
            <input value={values.emergencyPhone ?? ""} onChange={(e) => onChange({ emergencyPhone: e.target.value })} />
          </label>
        </div>
      </Fold>
      ) : null}
      {part === "rent" ? (
      <Fold title="Eviction">
        <label className="wiring-field">
          <span>Court date</span>
          <input type="date" value={values.courtDate ?? ""} onChange={(e) => onChange({ courtDate: e.target.value })} />
        </label>
        <label className="wiring-field">
          <span>Note</span>
          <textarea rows={3} value={values.courtNote ?? ""} onChange={(e) => onChange({ courtNote: e.target.value })} />
        </label>
      </Fold>
      ) : null}
      {part === "empty" && values.status === "Empty" ? (
      <div className="pet-block">
        <p className="pet-title">Waiting list</p>
        <div className="pet-row">
          <label>
            <span>Name</span>
            <input value={values.waitName ?? ""} onChange={(e) => onChange({ waitName: e.target.value })} />
          </label>
          <label>
            <span>Phone</span>
            <input value={values.waitPhone ?? ""} onChange={(e) => onChange({ waitPhone: e.target.value })} />
          </label>
        </div>
      </div>
      ) : null}
      {part === "maintenance" ? (
      <div className="pet-block">
        <p className="pet-title">Maintenance log</p>
        <button
          className="filter"
          type="button"
          onClick={() =>
            onChange({
              maintLog: [{ id: String(Date.now()), date: dayStamp(), note: "", done: "" }, ...(values.maintLog ?? [])],
            })
          }
        >
          Add job
        </button>
        <ul className="maint-log">
          {sortedJobs(values.maintLog).map((job) => (
            <li key={job.id}>
              <input
                type="date"
                value={parseDay(job.date)}
                onChange={(e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { date: e.target.value }) })}
              />
              <input
                value={job.note}
                placeholder="What was wrong"
                onChange={(e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { note: e.target.value }) })}
              />
              <label>
                <input
                  type="checkbox"
                  checked={job.done === "Yes"}
                  onChange={(e) => onChange({ maintLog: updateJob(values.maintLog, job.id, { done: e.target.checked ? "Yes" : "" }) })}
                />
                Done
              </label>
            </li>
          ))}
        </ul>
      </div>
      ) : null}
      {part === "home" ? (
      <div className="pet-block">
        <p className="pet-title">Photo</p>
        <label className="wiring-field">
          <span>Home</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              onChange({ photo: await fileToData(file) });
            }}
          />
        </label>
        {values.photo ? <img className="lot-photo" src={values.photo} alt="" /> : null}
        {values.photo ? (
          <button className="doc-remove" type="button" onClick={() => onChange({ photo: "" })}>
            Remove photo
          </button>
        ) : null}
      </div>
      ) : null}
      {part === "rent" ? (
      <>
      <div className="pet-block">
        <p className="pet-title">Documents</p>
        <FileSlot label="Lease" file={values.lease} onChange={(lease) => onChange({ lease })} />
        <FileSlot label="Rules receipt" file={values.rulesReceipt} onChange={(rulesReceipt) => onChange({ rulesReceipt })} />
        <FileSlot label="Background check" file={values.background} onChange={(background) => onChange({ background })} />
        <div className="doc-slot">
          <span>Any other</span>
          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const data = await fileToData(file);
              if (!data) return;
              onChange({ otherDocs: [...(values.otherDocs ?? []), { name: file.name, data }] });
            }}
          />
          <ul className="doc-list">
            {(values.otherDocs ?? []).map((doc, index) => (
              <li key={`${doc.name}-${index}`}>
                <a href={doc.data} download={doc.name}>
                  {doc.name}
                </a>
                <button
                  className="doc-remove"
                  type="button"
                  onClick={() => onChange({ otherDocs: (values.otherDocs ?? []).filter((_, i) => i !== index) })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {noticeOpen ? (
        <div className="notice-pop" role="presentation" onClick={() => setNoticeOpen(false)}>
          <div className="notice-card" role="dialog" aria-label="Upload notice" onClick={(e) => e.stopPropagation()}>
            <p className="pet-title">Upload notice</p>
            <p className="notice-who">
              Lot {values.lot} · {displayName(values)}
            </p>
            <label className="notice-drop">
              <span>{values.noticeFile?.name || "Choose a PDF or photo"}</span>
              <input
                type="file"
                accept="image/*,.pdf,application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const data = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
                    ? file.size > 4_000_000
                      ? ""
                      : await readAsData(file)
                    : await fileToData(file);
                  if (!data) return;
                  onChange({ noticeFile: { name: file.name, data } });
                }}
              />
            </label>
            {values.noticeFile?.data ? (
              <div className="doc-file">
                <a href={values.noticeFile.data} download={values.noticeFile.name}>
                  Open file
                </a>
                <button className="doc-remove" type="button" onClick={() => onChange({ noticeFile: null })}>
                  Remove
                </button>
              </div>
            ) : null}
            <div className="notice-actions">
              <button className="filter" type="button" onClick={() => printNotice(values)}>
                Print notice
              </button>
              <button className="filter" type="button" onClick={() => setNoticeOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </>
      ) : null}
    </>
  );
}

function PetSelects({
  dogs,
  cats,
  onChange,
}: {
  dogs: string;
  cats: string;
  onChange: (next: { dogs?: string; cats?: string }) => void;
}) {
  return (
    <div className="pet-row">
      <label>
        <span>Dogs</span>
        <select className="mow-select" value={dogs === "1" || dogs === "2" ? dogs : ""} onChange={(e) => onChange({ dogs: e.target.value })}>
          <option value="">—</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </label>
      <label>
        <span>Cats</span>
        <select className="mow-select" value={cats === "1" || cats === "2" ? cats : ""} onChange={(e) => onChange({ cats: e.target.value })}>
          <option value="">—</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </label>
    </div>
  );
}

function residentsOf(name: string): { first: string; last: string }[] {
  const chunks = name.split(/\s*\/\s*/).map((part) => part.trim()).filter(Boolean);
  if (chunks.length === 0) return [{ first: "", last: "" }];
  return chunks.map(nameParts);
}

function joinResidents(people: { first: string; last: string }[]) {
  return people.map((person) => joinName(person.last, person.first)).filter(Boolean).join(" / ");
}

function NameSplit({ name, onChange }: { name: string; onChange?: (name: string) => void }) {
  const [people, setPeople] = useState(() => residentsOf(name));
  const written = useRef(name);
  useEffect(() => {
    if (name === written.current) return;
    written.current = name;
    setPeople(residentsOf(name));
  }, [name]);
  function commit(next: { first: string; last: string }[]) {
    const list = next.length > 0 ? next : [{ first: "", last: "" }];
    const joined = joinResidents(list);
    written.current = joined;
    setPeople(list);
    onChange?.(joined);
  }
  return (
    <div className="name-residents">
      {people.map((person, index) => (
        <div className={index > 0 ? "name-split extra-resident" : "name-split"} key={index}>
          {index > 0 && onChange ? (
            <button
              className="remove-resident"
              type="button"
              aria-label="Remove resident"
              onClick={() => commit(people.filter((_, i) => i !== index))}
            >
              ×
            </button>
          ) : null}
          <label>
            <span>First name</span>
            {onChange ? (
              <input
                value={person.first}
                onChange={(e) => commit(people.map((item, i) => (i === index ? { ...item, first: e.target.value } : item)))}
              />
            ) : (
              <div className="name-box">{person.first || "—"}</div>
            )}
          </label>
          <label>
            <span>Last name</span>
            {onChange ? (
              <input
                value={person.last}
                onChange={(e) => commit(people.map((item, i) => (i === index ? { ...item, last: e.target.value } : item)))}
              />
            ) : (
              <div className="name-box">{person.last || "—"}</div>
            )}
          </label>
        </div>
      ))}
      {onChange ? (
        <button className="add-resident" type="button" onClick={() => commit([...people, { first: "", last: "" }])}>
          Add resident
        </button>
      ) : null}
    </div>
  );
}


