import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DvyptDIO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isNoOwe(value) {
	const v = value?.trim().toLowerCase() ?? "";
	return v === "" || v === "no" || v === "no-owe";
}
function isRenterLot(lot) {
	const role = lot.renter?.trim().toLowerCase() ?? "";
	return role.includes("renter") || role.includes("rent-to-own") || role.includes("rent to own");
}
function mowChoice(value) {
	return value?.trim().toLowerCase() === "yes" ? "Yes" : "NO-OWE";
}
function matchesFilter(lot, filter) {
	const role = lot.renter.trim().toLowerCase();
	const rentToOwn = role.includes("rent-to-own") || role.includes("rent to own");
	if (filter === "empty") return lot.status === "Empty";
	if (filter === "occupied") return lot.status === "Occupied";
	if (filter === "issues") return lot.issues.trim().length > 0;
	if (filter === "renters") return isRenterLot(lot);
	if (filter === "owners") return lot.status === "Occupied" && !role.includes("renter") && !rentToOwn;
	if (filter === "no-owe") return isNoOwe(lot.noMow);
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
		renter: lot.renter,
		moveIn: lot.moveIn ?? "",
		moveOut: moved,
		rent: lot.rent,
		balance: lot.balance ?? "",
		deposit: lot.deposit ?? "",
		depositDue: addDays(moved, 15),
		depositChoice: ""
	};
	const keep = lot.name.trim() || lot.phone.trim() || (lot.moveIn ?? "").trim();
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
		readyPower: "",
		readyClean: "",
		readyInspected: "",
		zillow: "",
		zillowUrl: "",
		lease: null,
		rulesReceipt: null,
		background: null,
		status: "Empty"
	};
}
function buildTodo(lots) {
	const today = dayStamp();
	const weekEnd = addDays(today, 7);
	const todayItems = [];
	const weekItems = [];
	const push = (when, lot, text) => {
		const item = {
			id: lot.id,
			lot: lot.lot,
			name: displayName(lot),
			text
		};
		if (when === "today") todayItems.push(item);
		else weekItems.push(item);
	};
	for (const lot of lots) {
		const rent = parseDay(lot.rentDue);
		if (rent && rent <= today) push("today", lot, rent < today ? `Past due rent, was due ${rent}` : "Rent due today");
		else if (rent && rent <= weekEnd) push("week", lot, `Rent due ${rent}`);
		const lease = parseDay(lot.leaseEnd);
		if (lease && lease <= today) push("today", lot, lease < today ? `Lease ended ${lease}` : "Lease ends today");
		else if (lease && lease <= weekEnd) push("week", lot, `Lease ends ${lease}`);
		const court = parseDay(lot.courtDate);
		if (court && court <= today) push("today", lot, court < today ? `Court date passed ${court}` : "Court today");
		else if (court && court <= weekEnd) push("week", lot, `Court ${court}`);
		const notice = parseDay(lot.noticeDate);
		if (lot.noticeNote?.trim() && !notice) push("today", lot, "Notice to send");
		else if (notice && notice <= today) push("today", lot, notice < today ? `Notice was due ${notice}` : "Notice today");
		else if (notice && notice <= weekEnd) push("week", lot, `Notice ${notice}`);
		if (lot.roofReplace === "Yes") push("week", lot, "Roof needs replaced");
		if (isRenterLot(lot)) {
			const insurance = parseDay(lot.homeInsDate);
			if (insurance && insurance <= today) push("today", lot, insurance < today ? `Home insurance expired ${insurance}` : "Home insurance expires today");
			else if (insurance && insurance <= weekEnd) push("week", lot, `Home insurance expires ${insurance}`);
		}
		if (lot.lateRent?.trim()) push("today", lot, `Late rent: ${lot.lateRent}`);
		for (const stay of lot.history ?? []) {
			const reminder = depositReminder(stay);
			if (reminder) push("today", lot, `${stay.name || "Former tenant"}: ${reminder}`);
		}
		for (const job of lot.maintLog ?? []) {
			if (job.done === "Yes") continue;
			const when = parseDay(job.date);
			const text = job.note.trim() || "Maintenance";
			if (!when || when <= today) push("today", lot, text);
			else if (when <= weekEnd) push("week", lot, text);
		}
	}
	return {
		today: todayItems,
		week: weekItems
	};
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
		id: "47",
		lot: "47",
		address: "5531",
		street: "Leon Circle",
		name: "Campbell",
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
		id: "76",
		lot: "76",
		address: "5558",
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
		street: "Leon Circle",
		name: "Jimenez, Juan + Betty",
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
		address: "",
		street: "Block House",
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
	if (!Number.isFinite(n)) return null;
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
	const y0 = 96;
	const boxes = [...west.map((id, i) => lotBox(id, westX, y0 + i * 83, colW, colH)), ...east.map((id, i) => lotBox(id, eastX, y0 + i * 83, colW, colH))];
	const kirkY = 843;
	const kirkH = 98;
	boxes.push(lotBox("87", x87, kirkY, wingW, kirkH));
	boxes.push(lotBox("86", x86, kirkY, wingW, kirkH));
	boxes.push(lotBox("85", westX, kirkY, colW, kirkH));
	boxes.push(lotBox("66", eastX, kirkY, colW, kirkH));
	return {
		viewBox: `0 0 864 993`,
		boxes,
		labels: [
			{
				text: "DR. LOVE ROAD",
				x: 600,
				y: 36,
				size: 13
			},
			{
				text: "MICHELLE AVENUE",
				x: 600,
				y: 979 / 2,
				rotate: -90,
				size: 12
			},
			{
				text: "KIRKWOOD STREET",
				x: 428,
				y: 968,
				size: 13
			},
			{
				text: "MAGNOLIA HOMES ROAD",
				x: 16,
				y: 480,
				rotate: -90,
				size: 11
			}
		],
		roads: [{
			x: x87,
			y: 949,
			w: 800,
			h: 28,
			openBottom: true
		}],
		north: "up",
		rose: {
			x: 730,
			y: 40
		}
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
		transform: "translate(46 78)",
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
function PlatMap({ sheet, query, filter, selected, lots, textScale = 1, onSelect }) {
	const spec = SHEETS[sheet];
	const [, , vbW, vbH] = spec.viewBox.split(/[ ,]/).map(Number);
	const byId = new Map(lots.map((item) => [item.id, item]));
	const filtering = query.trim().length > 0 || filter !== "all";
	const extra = sheet === 2 ? 3.5 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: sheet === 3 ? "map-svg portrait" : "map-svg landscape",
		viewBox: spec.viewBox,
		style: { aspectRatio: `${vbW} / ${vbH}` },
		preserveAspectRatio: "xMidYMid meet",
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
				const out = !matchesFilter(lot, filter) || query.trim().length > 0 && !matches(lot, query);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotBox, {
					box,
					lot,
					dim: filtering && out,
					selected: selected === lot.id,
					onSelect,
					textScale,
					sizeBoost: extra
				}, box.id);
			})
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
				cx: "6.5",
				cy: "11.2",
				rx: "4.6",
				ry: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "11.2",
				cy: "7.4",
				r: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "9.2",
				cy: "4.8",
				rx: "1.1",
				ry: "1.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "13.5",
				cy: "8.2",
				rx: "1.7",
				ry: "1.1"
			})
		]
	});
}
function CatMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "#1c1916",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "10.2",
				r: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4.8 7.4 L6.3 2.6 L8.2 6.8 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11.2 6.8 L13.1 2.6 L14.8 7.4 Z" })
		]
	});
}
function BoltMark({ x, y, s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
		transform: `translate(${x} ${y}) scale(${s / 16})`,
		fill: "#1c1916",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.2 0.8 L3.8 9.2 H7.4 L5.6 15.2 L13.2 6.4 H9.2 L11 0.8 Z" })
	});
}
function PetMarks({ box, size, dogs, cats, wiring }) {
	const kinds = [
		...wiring === "Yes" ? ["bolt"] : [],
		...Array(petCount(dogs)).fill("dog"),
		...Array(petCount(cats)).fill("cat")
	];
	if (kinds.length === 0 || size < 6) return null;
	const gap = 1.5;
	let x = box.x + box.w - 3 - kinds.length * size - (kinds.length - 1) * gap;
	const y = box.y + box.h - 2 - size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
		pointerEvents: "none",
		children: kinds.map((kind, i) => {
			const mark = kind === "bolt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoltMark, {
				x,
				y,
				s: size
			}, i) : kind === "dog" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DogMark, {
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
var LotBox = (0, import_react.memo)(function LotBox({ box, lot, dim, selected, onSelect, textScale, sizeBoost = 0 }) {
	const shown = displayName(lot);
	const names = lot.id === "7" ? ["Mena Sosa"] : lot.id === "67" ? ["Costales Torres"] : lot.id === "68" ? ["Rojas Gill"] : mapNameLines(lot).filter((text) => text.length > 0);
	const plain = names[0] === "Empty" || names[0] === "Open";
	const address = lot.address || "—";
	const padY = 3;
	const innerW = Math.max(12, box.w - 8);
	const innerH = Math.max(12, box.h - 6);
	const n = Number(lot.lot);
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
	const lines = texts.map((text) => {
		const widthFit = innerW / Math.max(1, text.length * .6);
		return {
			text,
			size: (sameAs60 ? bodySize : Math.min(fitted, widthFit)) + bump,
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
	const lotNumY = box.y + fsLot + 3 + dy + (lot.id === "47" ? -22 : 0);
	const maint = lot.maintenance?.trim() ?? "";
	const isLeak = /^leak$/i.test(maint);
	const needsRoof = lot.roofReplace === "Yes";
	const cls = [
		"lot",
		lot.status === "Occupied" ? "occupied" : "",
		lot.status === "Empty" ? "empty" : "",
		lot.status === "Open" ? "open" : "",
		lot.status === "Eviction" ? "eviction" : "",
		lot.issues ? "notes" : "",
		lot.lateRent?.trim() ? "late" : "",
		maint && !isLeak ? "maint" : "",
		isLeak ? "leak" : "",
		needsRoof ? "roof" : "",
		dim ? "dim" : "",
		selected ? "selected" : ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: cls,
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
			lot.noMow === "Yes" || lot.noMow === "No" || lot.noMow === "NO-OWE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				pointerEvents: "none",
				children: (() => {
					const s = Math.max(18, Math.min(30, Math.min(box.w, box.h) * .375));
					const no = lot.noMow === "No" || lot.noMow === "NO-OWE";
					const r = s * .72;
					const cx = box.x + box.w - r - 3;
					const cy = box.y + r + 2;
					const flagCx = (4.4 + s) / 3;
					const flagCy = (1 + s * 1.06) / 3;
					const x = no ? cx - flagCx : box.x + box.w - s - 3;
					const y = no ? cy - flagCy - s * .14 : box.y + 2;
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
						no ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
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
				children: lot.lot
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
				id: `clip-${lot.id}`,
				children: box.points ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", { points: box.points }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: box.x + 3,
					y: box.y + fsLot + 2,
					width: box.w - 6,
					height: box.h - fsLot - 6
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
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
						y: baseline - (lot.id === "59" || lot.id === "47" ? bodySize * .5 : 0),
						textAnchor: "middle",
						fontSize: line.size,
						fontWeight: line.weight,
						children: line.text
					}, `${lot.id}-${line.text}-${baseline}`);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetMarks, {
				box,
				size: Math.min(fsLot * .85, box.h * .34),
				dogs: lot.dogs,
				cats: lot.cats,
				wiring: lot.wiring
			})
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
		note: "Landscape. North points up — same direction as the original sheet."
	},
	3: {
		title: "Michelle/Kirkwood",
		note: "Portrait. Flipped so north points up, toward Dr. Love Road."
	}
};
var STORAGE_KEY = "magnolia-lot-edits";
function loadLots() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return LOTS;
		const saved = JSON.parse(raw);
		const byId = new Map(saved.map((lot) => [lot.id, lot]));
		return LOTS.map((lot) => {
			const next = byId.get(lot.id);
			if (!next) return lot;
			const status = next.status === "Empty" || next.status === "Open" || next.status === "Eviction" ? next.status : "Occupied";
			return {
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
				noticeFile: next.noticeFile?.data ? next.noticeFile : null
			};
		});
	} catch {
		return LOTS;
	}
}
function printMap(id) {
	const svg = (document.getElementById(`map-${id}`) ?? document.querySelector(".map-stage"))?.querySelector("svg");
	if (!svg) return;
	const css = [...document.styleSheets].map((sheet) => {
		try {
			return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
		} catch {
			return "";
		}
	}).join("\n");
	const page = id === 3 ? "portrait" : "landscape";
	const win = window.open("", "_blank");
	if (!win) return;
	win.document.open();
	win.document.write(`<!doctype html><html><head><title>${SHEET_COPY[id].title}</title><style>
    ${css}
    @page { size: ${page}; margin: 0.4in; }
    html, body { margin: 0; height: auto; background: white; }
    h1 { margin: 0 0 8px; font: 700 16px sans-serif; letter-spacing: 0.08em; text-transform: uppercase; }
    svg { width: 100% !important; height: auto !important; max-height: none !important; display: block; }
    * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  </style></head><body><h1>${SHEET_COPY[id].title}</h1></body></html>`);
	win.document.close();
	win.document.body.appendChild(win.document.importNode(svg, true));
	const go = () => {
		if (win.closed || win.document.body.dataset.printed === "1") return;
		win.document.body.dataset.printed = "1";
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 200);
	setTimeout(go, 500);
}
function printMain() {
	const ids = [
		1,
		2,
		3
	];
	const svgs = ids.map((id) => document.querySelector(`#map-${id} svg`)).filter((node) => node instanceof SVGSVGElement);
	if (svgs.length === 0) return;
	const css = [...document.styleSheets].map((sheet) => {
		try {
			return [...sheet.cssRules].map((rule) => rule.cssText).join("\n");
		} catch {
			return "";
		}
	}).join("\n");
	const win = window.open("", "_blank");
	if (!win) return;
	win.document.open();
	win.document.write(`<!doctype html><html><head><title>Main</title><style>
    ${css}
    @page land { size: landscape; margin: 0.4in; }
    @page port { size: portrait; margin: 0.4in; }
    html, body { margin: 0; height: auto; background: white; }
    h1 { margin: 0 0 8px; font: 700 16px sans-serif; letter-spacing: 0.08em; text-transform: uppercase; }
    section.land { page: land; break-after: page; }
    section.port { page: port; break-after: page; }
    svg { width: 100% !important; height: auto !important; max-height: none !important; display: block; }
    * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  </style></head><body></body></html>`);
	win.document.close();
	svgs.forEach((svg, index) => {
		const id = ids[index];
		const section = win.document.createElement("section");
		section.className = id === 3 ? "port" : "land";
		const heading = win.document.createElement("h1");
		heading.textContent = SHEET_COPY[id].title;
		section.append(heading, win.document.importNode(svg, true));
		win.document.body.appendChild(section);
	});
	const go = () => {
		if (win.closed || win.document.body.dataset.printed === "1") return;
		win.document.body.dataset.printed = "1";
		win.focus();
		win.print();
	};
	win.onload = () => setTimeout(go, 200);
	setTimeout(go, 500);
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
function Home() {
	const uploadRef = (0, import_react.useRef)(null);
	const backupRef = (0, import_react.useRef)(null);
	const quickBooksRef = (0, import_react.useRef)(null);
	const [sheet, setSheet] = (0, import_react.useState)(1);
	const [main, setMain] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [selected, setSelected] = (0, import_react.useState)("1");
	const [view, setView] = (0, import_react.useState)("map");
	const [homes, setHomes] = (0, import_react.useState)(false);
	const [mapsOpen, setMapsOpen] = (0, import_react.useState)(false);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [dataOpen, setDataOpen] = (0, import_react.useState)(false);
	const [qbNote, setQbNote] = (0, import_react.useState)("");
	const [lots, setLots] = (0, import_react.useState)(LOTS);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setLots(loadLots());
		setHydrated(true);
	}, []);
	const lotsRef = (0, import_react.useRef)(lots);
	lotsRef.current = lots;
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const id = window.setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(lotsRef.current));
		}, 300);
		return () => window.clearTimeout(id);
	}, [lots, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const flush = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(lotsRef.current));
		window.addEventListener("pagehide", flush);
		return () => window.removeEventListener("pagehide", flush);
	}, [hydrated]);
	function saveLot(next) {
		setLots((prev) => prev.map((item) => item.id === next.id ? next : item));
	}
	const visible = (0, import_react.useMemo)(() => {
		return lots.filter((lot) => matchesFilter(lot, filter) && matches(lot, query));
	}, [
		lots,
		filter,
		query
	]);
	const sig = `${filter}|${query}`;
	const prevSig = (0, import_react.useRef)(sig);
	(0, import_react.useEffect)(() => {
		if (prevSig.current === sig) return;
		prevSig.current = sig;
		if (!query.trim() && filter === "all") return;
		if (visible.length === 1) {
			setSelected(visible[0].id);
			const next = sheetOf(visible[0].id);
			if (next) {
				setSheet(next);
				setView("map");
				setMain(false);
			} else {
				setView("register");
				setHomes(false);
			}
			return;
		}
		const sheets = new Set(visible.map((lot) => sheetOf(lot.id)).filter((n) => n != null));
		if (sheets.size === 1 && visible.length > 0 && visible.every((lot) => sheetOf(lot.id))) {
			setSheet([...sheets][0]);
			setView("map");
			setMain(false);
		}
	}, [
		sig,
		query,
		filter,
		visible
	]);
	const visibleIds = (0, import_react.useMemo)(() => new Set(visible.map((lot) => lot.id)), [visible]);
	const lot = lots.find((item) => item.id === selected) ?? null;
	const empty = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (item.status === "Empty" ? 1 : 0), 0), [lots]);
	const notes = (0, import_react.useMemo)(() => lots.reduce((n, item) => n + (item.issues.trim() ? 1 : 0), 0), [lots]);
	const mapLabel = main ? "Main" : SHEET_COPY[sheet].title;
	const filterLabel = [
		["all", "All"],
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
	].find(([id]) => id === filter)?.[1] ?? "All";
	const narrowed = query.trim() !== "" || filter !== "all";
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
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
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
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Site plan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Magnolia Central of Florida Estates" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "stats",
						children: [
							lots.length,
							" records · ",
							empty,
							" empty · ",
							notes,
							" with a note · names from the lot register"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "map-slot",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "tab",
									type: "button",
									role: "tab",
									"aria-expanded": filtersOpen,
									"aria-pressed": filtersOpen || filter !== "all",
									onClick: () => {
										setMapsOpen(false);
										if (view !== "map") {
											setView("map");
											setFiltersOpen(true);
										} else setFiltersOpen((open) => !open);
									},
									children: filter === "all" ? "Filters ▾" : `Filters · ${filterLabel} ▾`
								}), filtersOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "map-drop",
									role: "menu",
									children: [
										["all", "All"],
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
									].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										role: "menuitemradio",
										"aria-checked": filter === id,
										onClick: () => {
											setFilter(id);
											setView("map");
											setFiltersOpen(false);
										},
										children: label
									}, id))
								}) : null]
							}),
							[["register", "Register"], ["todo", "To-Do"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
							}, id))
						]
					}),
					narrowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "active-strip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Showing ",
							visible.length,
							" of ",
							lots.length,
							filter !== "all" ? ` · ${filterLabel}` : "",
							query.trim() ? ` · “${query.trim()}”` : ""
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "strip-clear",
							type: "button",
							onClick: () => {
								setFilter("all");
								setQuery("");
							},
							children: "Clear"
						})]
					}) : null,
					view === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "swatch eviction" }), " Eviction"] })
						]
					}) : null,
					view === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "data-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "seg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "filter",
									type: "button",
									"aria-pressed": !homes,
									onClick: () => setHomes(false),
									children: "Lots"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "filter",
									type: "button",
									"aria-pressed": homes,
									onClick: () => setHomes(true),
									children: "Homes"
								})]
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
										})
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
								setLots((prev) => importEverything(text, prev));
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
							setLots((prev) => importRegister(text, prev));
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
							setLots(result.lots);
							setQbNote(result.updated ? `QuickBooks updated ${result.updated} lot${result.updated === 1 ? "" : "s"}${result.missed ? `. ${result.missed} names did not match a lot` : ""}.` : result.missed ? "No lots matched. In QuickBooks 2020 use File, Utilities, Export, Lists to IIF Files, and put the lot number in the customer name." : "That file did not have any customer rows.");
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stage",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "map-frame",
					children: view === "register" && homes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "register",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: HOME_COLUMNS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: col.label }, col.label)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lots.map((item) => {
							const hit = visibleIds.has(item.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								"data-hit": hit,
								"aria-selected": selected === item.id,
								onClick: () => setSelected(item.id),
								children: HOME_COLUMNS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterCell, {
									item,
									col,
									onSave: saveLot,
									live: selected === item.id
								}, col.label))
							}, item.id);
						}) })]
					}) : view === "todo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoBoard, {
						lots,
						onOpen: (id) => {
							setSelected(id);
							setView("map");
							setHomes(false);
							setMain(true);
						}
					}) : view === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "register",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: REGISTER_COLUMNS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: col.label }, col.label)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lots.map((item) => {
							const hit = visibleIds.has(item.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								"data-hit": hit,
								"aria-selected": selected === item.id,
								onClick: () => setSelected(item.id),
								children: REGISTER_COLUMNS.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterCell, {
									item,
									col,
									onSave: saveLot,
									live: selected === item.id
								}, col.label))
							}, item.id);
						}) })]
					}) : main ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "map-stack",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "main-print",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "print-map",
								type: "button",
								onClick: printMain,
								children: "Print map"
							})
						}), [
							1,
							2,
							3
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							id: `map-${id}`,
							className: "map-block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: SHEET_COPY[id].title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatMap, {
								sheet: id,
								query,
								filter,
								selected,
								lots,
								onSelect: setSelected
							})]
						}, id))]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sheet-note",
							children: SHEET_COPY[sheet].note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "print-map corner",
							type: "button",
							onClick: () => printMap(sheet),
							children: "Print map"
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
									onSelect: setSelected
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotPanel, {
					lot,
					onSave: (next) => setLots((prev) => prev.map((item) => item.id === next.id ? next : item))
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
function registerText(item, col) {
	if (col.kind === "check") {
		const raw = String(item[col.field] ?? "").trim().toLowerCase();
		return raw !== "" && raw !== "no" ? "Yes" : "";
	}
	if (col.kind === "status") return item.status;
	if (col.kind === "mow") return mowChoice(item.noMow);
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
			value: mowChoice(item.noMow),
			onChange: (e) => onSave({
				...item,
				noMow: e.target.value
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "NO-OWE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" })]
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		onClick: stop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "cell-edit",
			value: String(item[col.field] ?? ""),
			onChange: (e) => onSave({
				...item,
				[col.field]: e.target.value
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
function LotPanel({ lot, onSave }) {
	const [tab, setTab] = (0, import_react.useState)("personal");
	(0, import_react.useEffect)(() => {
		setTab("personal");
	}, [lot?.id]);
	if (!lot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "panel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "quiet",
			children: "Select a lot on the map."
		})
	});
	const where = sheetOf(lot.id);
	const save = (next) => onSave({
		...lot,
		...next
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "quiet sheet-where",
				children: where ? `Map ${where}` : "Register only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lot-head",
				children: [
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "head-address",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.address,
							onChange: (e) => save({ address: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Street" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
						className: "head-status",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `status-dot status-${lot.status.toLowerCase()}`,
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: lot.status,
								onChange: (e) => save({ status: e.target.value }),
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
				children: [
					["personal", "Personal"],
					["home", "Home"],
					["rent", "Rent"],
					["notes", "Notes"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-pressed": tab === id,
					onClick: () => setTab(id),
					children: label
				}, id))
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.phone,
							onChange: (e) => save({ phone: e.target.value })
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.guest,
							onChange: (e) => save({ guest: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vehicle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.vehicle,
							onChange: (e) => save({ vehicle: e.target.value })
						})] })]
					}),
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeInsuranceFields, {
							lot,
							onChange: save
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "wiring-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "mow-select",
								value: mowChoice(lot.noMow),
								onChange: (e) => save({ noMow: e.target.value }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "NO-OWE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Yes" })]
							})]
						})
					]
				})
			] }) : null,
			tab === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Rent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pet-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.rent,
							onChange: (e) => save({ rent: e.target.value })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Late rent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.lateRent,
							onChange: (e) => save({ lateRent: e.target.value })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "wiring-field",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bounced check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: lot.bouncedCheck ?? "",
							onChange: (e) => save({ bouncedCheck: e.target.value })
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
				values: lot,
				part: "rent",
				onChange: save,
				onMoveOut: () => onSave(moveOutLot(lot))
			})] }) : null,
			tab === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "wiring-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: lot.maintenance ?? "",
								placeholder: "Leak",
								onChange: (e) => save({ maintenance: e.target.value })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "wiring-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pressure wash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: lot.pressureWash,
								onChange: (e) => save({ pressureWash: e.target.value })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "wiring-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Violations" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: lot.violations,
								onChange: (e) => save({ violations: e.target.value })
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLotChecklist, {
					lot,
					onChange: save
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LotExtras, {
					values: lot,
					part: "notes",
					onChange: save
				})
			] }) : null
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
	if (lot.status !== "Empty") return null;
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
function HomeInsuranceFields({ lot, onChange }) {
	if (!isRenterLot(lot)) return null;
	const value = lot.homeIns === "Yes" || lot.homeIns === "No" ? lot.homeIns : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
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
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "wiring-field",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Expires" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "date",
			value: lot.homeInsDate ?? "",
			onChange: (e) => onChange({ homeInsDate: e.target.value })
		})]
	})] });
}
function updateJob(jobs, id, patch) {
	return (jobs ?? []).map((job) => job.id === id ? {
		...job,
		...patch
	} : job);
}
function TodoBoard({ lots, onOpen }) {
	const { today, week } = buildTodo(lots);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "todo",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoList, {
			items: today,
			onOpen,
			empty: "Nothing due today."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "This week" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodoList, {
			items: week,
			onOpen,
			empty: "Nothing else this week."
		})] })]
	});
}
function TodoList({ items, onOpen, empty }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "todo-empty",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onOpen(item.id),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Lot ", item.lot] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: item.text })
		]
	}) }, `${item.id}-${item.text}-${index}`)) });
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
function LotExtras({ values, onChange, onMoveOut, part }) {
	const yn = (value) => value === "Yes" || value === "No" ? value : "";
	const [noticeOpen, setNoticeOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		part === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pet-title",
						children: "Home inspection"
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
					})
				]
			})
		] }) : null,
		part === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Money"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pet-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Move-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: values.moveIn ?? "",
						onChange: (e) => onChange({ moveIn: e.target.value })
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rent due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: values.rentDue ?? "",
						onChange: (e) => onChange({ rentDue: e.target.value })
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lease end" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: values.leaseEnd ?? "",
						onChange: (e) => onChange({ leaseEnd: e.target.value })
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
				}) : null,
				(values.history ?? []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "history",
					children: (values.history ?? []).map((stay, index) => {
						const reminder = depositReminder(stay);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stay.name || "No name" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								stay.moveIn || "—",
								" to ",
								stay.moveOut || "—",
								stay.deposit ? ` · deposit ${stay.deposit}` : "",
								stay.balance ? ` · owed ${stay.balance}` : "",
								stay.phone ? ` · ${stay.phone}` : ""
							] }),
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
									onClick: () => onChange({ history: (values.history ?? []).map((item, i) => i === index ? {
										...item,
										depositChoice: "Return"
									} : item) }),
									children: "Return deposit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "filter",
									type: "button",
									onClick: () => onChange({ history: (values.history ?? []).map((item, i) => i === index ? {
										...item,
										depositChoice: "Keep"
									} : item) }),
									children: "Keep deposit"
								})]
							}) : null
						] }, `${stay.moveOut}-${index}`);
					})
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Notice"
				}),
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
		})] }) : null,
		part === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pet-title",
				children: "Emergency contact"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pet-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.emergencyName ?? "",
					onChange: (e) => onChange({ emergencyName: e.target.value })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: values.emergencyPhone ?? "",
					onChange: (e) => onChange({ emergencyPhone: e.target.value })
				})] })]
			})]
		}) : null,
		part === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pet-block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pet-title",
					children: "Eviction"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Court date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: values.courtDate ?? "",
						onChange: (e) => onChange({ courtDate: e.target.value })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "wiring-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: values.courtNote ?? "",
						onChange: (e) => onChange({ courtNote: e.target.value })
					})]
				})
			]
		}) : null,
		part === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
		part === "notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					children: (values.maintLog ?? []).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
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
function NameSplit({ name, onChange }) {
	const parts = nameParts(name);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "name-split",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "First name" }), onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: parts.first,
			onChange: (e) => onChange(joinName(parts.last, e.target.value))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "name-box",
			children: parts.first || "—"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last name" }), onChange ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: parts.last,
			onChange: (e) => onChange(joinName(e.target.value, parts.first))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "name-box",
			children: parts.last || "—"
		})] })]
	});
}
//#endregion
export { Home as component };
