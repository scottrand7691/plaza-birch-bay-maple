import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/master.functions-BO6zQBLH.js
var FILE = "data/magnolia-master.json";
var ARCHIVE = "data/archive";
async function archiveBook(book) {
	const { mkdir, writeFile } = await import("node:fs/promises");
	const { join } = await import("node:path");
	const saved = book.saved || (/* @__PURE__ */ new Date()).toISOString();
	const id = `magnolia-${saved.replace(/[:.]/g, "-")}.json`;
	await mkdir(join(process.cwd(), ARCHIVE), { recursive: true });
	await writeFile(join(process.cwd(), ARCHIVE, id), `${JSON.stringify({
		saved,
		lots: book.lots,
		bills: book.bills,
		mowings: book.mowings,
		board: book.board
	})}\n`);
	return id;
}
var listVersions_createServerFn_handler = createServerRpc({
	id: "63b2278e80f850fb8a80f752dae9b14d45011a628e2335494e988a272f4c8a3d",
	name: "listVersions",
	filename: "src/data/master.functions.ts"
}, (opts) => listVersions.__executeServer(opts));
var listVersions = createServerFn({ method: "GET" }).handler(listVersions_createServerFn_handler, async () => {
	const { readdir, readFile } = await import("node:fs/promises");
	const { join } = await import("node:path");
	try {
		const dir = join(process.cwd(), ARCHIVE);
		const names = (await readdir(dir)).filter((name) => name.endsWith(".json"));
		return (await Promise.all(names.map(async (id) => {
			try {
				const parsed = JSON.parse(await readFile(join(dir, id), "utf8"));
				if (!parsed || !Array.isArray(parsed.lots)) return null;
				return {
					id,
					saved: typeof parsed.saved === "string" ? parsed.saved : id,
					count: parsed.lots.length
				};
			} catch {
				return null;
			}
		}))).filter((item) => Boolean(item)).sort((a, b) => b.saved.localeCompare(a.saved));
	} catch {
		return [];
	}
});
var restoreVersion_createServerFn_handler = createServerRpc({
	id: "e6440476118fcdacc74a3fe14b5285fa6e88db22cd0c8c49c06f9cf6d20d1c9a",
	name: "restoreVersion",
	filename: "src/data/master.functions.ts"
}, (opts) => restoreVersion.__executeServer(opts));
var restoreVersion = createServerFn({ method: "POST" }).validator((data) => {
	const id = typeof data?.id === "string" ? data.id : "";
	if (!/^magnolia-[\w-]+\.json$/.test(id)) throw new Error("Unknown version");
	return { id };
}).handler(restoreVersion_createServerFn_handler, async ({ data }) => {
	const { readFile, writeFile, mkdir } = await import("node:fs/promises");
	const { join } = await import("node:path");
	const archived = JSON.parse(await readFile(join(process.cwd(), ARCHIVE, data.id), "utf8"));
	if (!archived || !Array.isArray(archived.lots)) throw new Error("That version could not be read");
	const file = join(process.cwd(), FILE);
	try {
		const current = JSON.parse(await readFile(file, "utf8"));
		if (current && Array.isArray(current.lots)) await archiveBook(current);
	} catch {}
	const saved = (/* @__PURE__ */ new Date()).toISOString();
	await mkdir(join(process.cwd(), "data"), { recursive: true });
	let bills = archived.bills;
	let mowings = archived.mowings;
	let board = archived.board;
	if (!bills || !mowings || !board) try {
		const live = JSON.parse(await readFile(file, "utf8"));
		if (!bills && Array.isArray(live.bills)) bills = live.bills;
		if (!mowings && Array.isArray(live.mowings)) mowings = live.mowings;
		if (!board && Array.isArray(live.board)) board = live.board;
	} catch {}
	await writeFile(file, `${JSON.stringify({
		saved,
		lots: archived.lots,
		bills,
		mowings,
		board
	})}\n`);
	return {
		saved,
		lots: archived.lots,
		count: archived.lots.length
	};
});
var readMaster_createServerFn_handler = createServerRpc({
	id: "93f4e9998517322f949f4cdcf16a741c3e82df3147f942aeda823f14047ef63c",
	name: "readMaster",
	filename: "src/data/master.functions.ts"
}, (opts) => readMaster.__executeServer(opts));
var readMaster = createServerFn({ method: "GET" }).handler(readMaster_createServerFn_handler, async () => {
	const { readFile } = await import("node:fs/promises");
	const { join } = await import("node:path");
	try {
		const raw = await readFile(join(process.cwd(), FILE), "utf8");
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.lots)) return null;
		return parsed;
	} catch {
		return null;
	}
});
var writeMaster_createServerFn_handler = createServerRpc({
	id: "a69e9ce8decaba572e2a0b279bb6090ff0d09bec755a1b4e3629e0bc1600ddf1",
	name: "writeMaster",
	filename: "src/data/master.functions.ts"
}, (opts) => writeMaster.__executeServer(opts));
var writeMaster = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.lots)) throw new Error("Master file needs a lot list");
	return {
		saved: typeof data.saved === "string" ? data.saved : (/* @__PURE__ */ new Date()).toISOString(),
		lots: data.lots,
		bills: Array.isArray(data.bills) ? data.bills : void 0,
		mowings: Array.isArray(data.mowings) ? data.mowings : void 0,
		board: Array.isArray(data.board) ? data.board : void 0
	};
}).handler(writeMaster_createServerFn_handler, async ({ data }) => {
	const { mkdir, readFile, writeFile } = await import("node:fs/promises");
	const { dirname, join } = await import("node:path");
	const file = join(process.cwd(), FILE);
	await mkdir(dirname(file), { recursive: true });
	const lotsBody = JSON.stringify(data.lots);
	try {
		const current = JSON.parse(await readFile(file, "utf8"));
		if (Array.isArray(current.lots)) {
			const previous = new Map(current.lots.map((lot) => [String(lot.id), lot]));
			const merged = data.lots.map((lot) => {
				const older = previous.get(String(lot.id));
				if (!older || typeof older !== "object") return lot;
				const next = {
					...older,
					...lot
				};
				const thin = Object.keys(lot).length < 40;
				const oldMow = older.noMow;
				if (thin && !next.noMow && (oldMow === "Yes" || oldMow === "No")) next.noMow = oldMow;
				return next;
			});
			const seen = new Set(merged.map((lot) => String(lot.id)));
			for (const lot of current.lots) {
				const id = String(lot.id);
				if (!seen.has(id)) merged.push(lot);
			}
			if (JSON.stringify(current.lots) === JSON.stringify(merged) && JSON.stringify(current.bills ?? null) === JSON.stringify(data.bills ?? current.bills ?? null) && JSON.stringify(current.mowings ?? null) === JSON.stringify(data.mowings ?? current.mowings ?? null) && JSON.stringify(current.board ?? null) === JSON.stringify(data.board ?? current.board ?? null)) return {
				ok: true,
				count: merged.length
			};
			await archiveBook(current);
			await writeFile(file, `${JSON.stringify({
				saved: data.saved,
				lots: merged,
				bills: data.bills ?? current.bills,
				mowings: data.mowings ?? current.mowings,
				board: data.board ?? current.board
			})}\n`);
			return {
				ok: true,
				count: merged.length
			};
		}
		if (JSON.stringify(current.lots) === lotsBody) return {
			ok: true,
			count: data.lots.length
		};
	} catch {}
	await writeFile(file, `${JSON.stringify({
		saved: data.saved,
		lots: data.lots,
		bills: data.bills,
		mowings: data.mowings,
		board: data.board
	})}\n`);
	return {
		ok: true,
		count: data.lots.length
	};
});
var saveBills_createServerFn_handler = createServerRpc({
	id: "8a5c096e51c7fa1603bcbebdffe4f71a0c7c825cc457d059b29c650e22041394",
	name: "saveBills",
	filename: "src/data/master.functions.ts"
}, (opts) => saveBills.__executeServer(opts));
var saveBills = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.bills)) throw new Error("Bills need a list");
	return { bills: data.bills };
}).handler(saveBills_createServerFn_handler, async ({ data }) => {
	const { mkdir, readFile, writeFile } = await import("node:fs/promises");
	const { dirname, join } = await import("node:path");
	const file = join(process.cwd(), FILE);
	await mkdir(dirname(file), { recursive: true });
	let book = {
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		lots: []
	};
	try {
		const current = JSON.parse(await readFile(file, "utf8"));
		if (current && Array.isArray(current.lots)) book = current;
	} catch {}
	if (JSON.stringify(book.bills ?? null) === JSON.stringify(data.bills)) return { ok: true };
	book = {
		...book,
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		bills: data.bills
	};
	await writeFile(file, `${JSON.stringify(book)}\n`);
	return { ok: true };
});
var saveMowings_createServerFn_handler = createServerRpc({
	id: "af7d6386af86ff7e1e46913c237d29b24079d16eb53d52c4d5130cae25c217c0",
	name: "saveMowings",
	filename: "src/data/master.functions.ts"
}, (opts) => saveMowings.__executeServer(opts));
var saveMowings = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.mowings)) throw new Error("Mowings need a list");
	return { mowings: data.mowings };
}).handler(saveMowings_createServerFn_handler, async ({ data }) => {
	const { mkdir, readFile, writeFile } = await import("node:fs/promises");
	const { dirname, join } = await import("node:path");
	const file = join(process.cwd(), FILE);
	await mkdir(dirname(file), { recursive: true });
	let book = {
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		lots: []
	};
	try {
		const current = JSON.parse(await readFile(file, "utf8"));
		if (current && Array.isArray(current.lots)) book = current;
	} catch {}
	if (JSON.stringify(book.mowings ?? null) === JSON.stringify(data.mowings)) return { ok: true };
	book = {
		...book,
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		mowings: data.mowings
	};
	await writeFile(file, `${JSON.stringify(book)}\n`);
	return { ok: true };
});
var saveBoard_createServerFn_handler = createServerRpc({
	id: "d369c18cc29680223a2bc5a4ac5ceadfe62a988c086856d0301f283a1c882af7",
	name: "saveBoard",
	filename: "src/data/master.functions.ts"
}, (opts) => saveBoard.__executeServer(opts));
var saveBoard = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || !Array.isArray(data.board)) throw new Error("Board needs a list");
	return { board: data.board };
}).handler(saveBoard_createServerFn_handler, async ({ data }) => {
	const { mkdir, readFile, writeFile } = await import("node:fs/promises");
	const { dirname, join } = await import("node:path");
	const file = join(process.cwd(), FILE);
	await mkdir(dirname(file), { recursive: true });
	let book = {
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		lots: []
	};
	try {
		const current = JSON.parse(await readFile(file, "utf8"));
		if (current && Array.isArray(current.lots)) book = current;
	} catch {}
	if (JSON.stringify(book.board ?? null) === JSON.stringify(data.board)) return { ok: true };
	book = {
		...book,
		saved: (/* @__PURE__ */ new Date()).toISOString(),
		board: data.board
	};
	await writeFile(file, `${JSON.stringify(book)}\n`);
	return { ok: true };
});
//#endregion
export { listVersions_createServerFn_handler, readMaster_createServerFn_handler, restoreVersion_createServerFn_handler, saveBills_createServerFn_handler, saveBoard_createServerFn_handler, saveMowings_createServerFn_handler, writeMaster_createServerFn_handler };
