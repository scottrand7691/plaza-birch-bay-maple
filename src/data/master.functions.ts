import { createServerFn } from "@tanstack/react-start";

export type SerializableValue = string | number | boolean | null | SerializableValue[] | { [key: string]: SerializableValue | undefined };

export type MasterBook = {
  saved: string;
  lots: SerializableValue[];
  bills?: SerializableValue[];
  mowings?: SerializableValue[];
  board?: SerializableValue[];
};

const FILE = "data/magnolia-master.json";
const ARCHIVE = "data/archive";

async function archiveBook(book: MasterBook) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const saved = book.saved || new Date().toISOString();
  const id = `magnolia-${saved.replace(/[:.]/g, "-")}.json`;
  await mkdir(join(process.cwd(), ARCHIVE), { recursive: true });
  await writeFile(join(process.cwd(), ARCHIVE, id), `${JSON.stringify({ saved, lots: book.lots, bills: book.bills, mowings: book.mowings, board: book.board })}\n`);
  return id;
}

export const listVersions = createServerFn({ method: "GET" }).handler(async (): Promise<{ id: string; saved: string; count: number }[]> => {
  const { readdir, readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  try {
    const dir = join(process.cwd(), ARCHIVE);
    const names = (await readdir(dir)).filter((name) => name.endsWith(".json"));
    const versions = await Promise.all(
      names.map(async (id) => {
        try {
          const parsed = JSON.parse(await readFile(join(dir, id), "utf8")) as MasterBook;
          if (!parsed || !Array.isArray(parsed.lots)) return null;
          return { id, saved: typeof parsed.saved === "string" ? parsed.saved : id, count: parsed.lots.length };
        } catch {
          return null;
        }
      }),
    );
    return versions
      .filter((item): item is { id: string; saved: string; count: number } => Boolean(item))
      .sort((a, b) => b.saved.localeCompare(a.saved));
  } catch {
    return [];
  }
});

export const restoreVersion = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => {
    const id = typeof data?.id === "string" ? data.id : "";
    if (!/^magnolia-[\w-]+\.json$/.test(id)) throw new Error("Unknown version");
    return { id };
  })
  .handler(async ({ data }) => {
    const { readFile, writeFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const archived = JSON.parse(await readFile(join(process.cwd(), ARCHIVE, data.id), "utf8")) as MasterBook;
    if (!archived || !Array.isArray(archived.lots)) throw new Error("That version could not be read");
    const file = join(process.cwd(), FILE);
    try {
      const current = JSON.parse(await readFile(file, "utf8")) as MasterBook;
      if (current && Array.isArray(current.lots)) await archiveBook(current);
    } catch {
      /* nothing live to archive */
    }
    const saved = new Date().toISOString();
    await mkdir(join(process.cwd(), "data"), { recursive: true });
    let bills = archived.bills;
    let mowings = archived.mowings;
    let board = archived.board;
    if (!bills || !mowings || !board) {
      try {
        const live = JSON.parse(await readFile(file, "utf8")) as MasterBook;
        if (!bills && Array.isArray(live.bills)) bills = live.bills;
        if (!mowings && Array.isArray(live.mowings)) mowings = live.mowings;
        if (!board && Array.isArray(live.board)) board = live.board;
      } catch {
        /* no live extras to keep */
      }
    }
    await writeFile(file, `${JSON.stringify({ saved, lots: archived.lots, bills, mowings, board })}\n`);
    return { saved, lots: archived.lots, count: archived.lots.length };
  });

export const readMaster = createServerFn({ method: "GET" }).handler(async (): Promise<MasterBook | null> => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  try {
    const raw = await readFile(join(process.cwd(), FILE), "utf8");
    const parsed = JSON.parse(raw) as MasterBook;
    if (!parsed || !Array.isArray(parsed.lots)) return null;
    return parsed;
  } catch {
    return null;
  }
});

export const writeMaster = createServerFn({ method: "POST" })
  .validator((data: MasterBook) => {
    if (!data || !Array.isArray(data.lots)) throw new Error("Master file needs a lot list");
    return {
      saved: typeof data.saved === "string" ? data.saved : new Date().toISOString(),
      lots: data.lots,
      bills: Array.isArray(data.bills) ? data.bills : undefined,
      mowings: Array.isArray(data.mowings) ? data.mowings : undefined,
      board: Array.isArray(data.board) ? data.board : undefined,
    };
  })
  .handler(async ({ data }) => {
    const { mkdir, readFile, writeFile } = await import("node:fs/promises");
    const { dirname, join } = await import("node:path");
    const file = join(process.cwd(), FILE);
    await mkdir(dirname(file), { recursive: true });
    const lotsBody = JSON.stringify(data.lots);
    try {
      const current = JSON.parse(await readFile(file, "utf8")) as MasterBook;
      if (Array.isArray(current.lots)) {
        const previous = new Map(current.lots.map((lot) => [String((lot as { id?: string }).id), lot]));
        const merged = data.lots.map((lot) => {
          const older = previous.get(String((lot as { id?: string }).id));
          if (!older || typeof older !== "object") return lot;
          const next = { ...(older as object), ...(lot as object) } as { noMow?: string };
          const thin = Object.keys(lot as object).length < 40;
          const oldMow = (older as { noMow?: string }).noMow;
          if (thin && !next.noMow && (oldMow === "Yes" || oldMow === "No")) next.noMow = oldMow;
          return next;
        });
        const seen = new Set(merged.map((lot) => String((lot as { id?: string }).id)));
        for (const lot of current.lots) {
          const id = String((lot as { id?: string }).id);
          if (!seen.has(id)) merged.push(lot);
        }
        if (JSON.stringify(current.lots) === JSON.stringify(merged) && JSON.stringify(current.bills ?? null) === JSON.stringify(data.bills ?? current.bills ?? null) && JSON.stringify(current.mowings ?? null) === JSON.stringify(data.mowings ?? current.mowings ?? null) && JSON.stringify(current.board ?? null) === JSON.stringify(data.board ?? current.board ?? null)) {
          return { ok: true as const, count: merged.length };
        }
        await archiveBook(current);
        await writeFile(file, `${JSON.stringify({ saved: data.saved, lots: merged, bills: data.bills ?? current.bills, mowings: data.mowings ?? current.mowings, board: data.board ?? current.board })}\n`);
        return { ok: true as const, count: merged.length };
      }
      if (JSON.stringify(current.lots) === lotsBody) {
        return { ok: true as const, count: data.lots.length };
      }
    } catch {
      /* the file is created below */
    }
    await writeFile(file, `${JSON.stringify({ saved: data.saved, lots: data.lots, bills: data.bills, mowings: data.mowings, board: data.board })}\n`);
    return { ok: true as const, count: data.lots.length };
  });

export const saveBills = createServerFn({ method: "POST" })
  .validator((data: { bills: SerializableValue[] }) => {
    if (!data || !Array.isArray(data.bills)) throw new Error("Bills need a list");
    return { bills: data.bills };
  })
  .handler(async ({ data }) => {
    const { mkdir, readFile, writeFile } = await import("node:fs/promises");
    const { dirname, join } = await import("node:path");
    const file = join(process.cwd(), FILE);
    await mkdir(dirname(file), { recursive: true });
    let book: MasterBook = { saved: new Date().toISOString(), lots: [] };
    try {
      const current = JSON.parse(await readFile(file, "utf8")) as MasterBook;
      if (current && Array.isArray(current.lots)) book = current;
    } catch {
      /* a new register is created with the bills */
    }
    if (JSON.stringify(book.bills ?? null) === JSON.stringify(data.bills)) return { ok: true as const };
    book = { ...book, saved: new Date().toISOString(), bills: data.bills };
    await writeFile(file, `${JSON.stringify(book)}\n`);
    return { ok: true as const };
  });

export const saveMowings = createServerFn({ method: "POST" })
  .validator((data: { mowings: SerializableValue[] }) => {
    if (!data || !Array.isArray(data.mowings)) throw new Error("Mowings need a list");
    return { mowings: data.mowings };
  })
  .handler(async ({ data }) => {
    const { mkdir, readFile, writeFile } = await import("node:fs/promises");
    const { dirname, join } = await import("node:path");
    const file = join(process.cwd(), FILE);
    await mkdir(dirname(file), { recursive: true });
    let book: MasterBook = { saved: new Date().toISOString(), lots: [] };
    try {
      const current = JSON.parse(await readFile(file, "utf8")) as MasterBook;
      if (current && Array.isArray(current.lots)) book = current;
    } catch {
      /* a new register is created with the mowings */
    }
    if (JSON.stringify(book.mowings ?? null) === JSON.stringify(data.mowings)) return { ok: true as const };
    book = { ...book, saved: new Date().toISOString(), mowings: data.mowings };
    await writeFile(file, `${JSON.stringify(book)}\n`);
    return { ok: true as const };
  });

export const saveBoard = createServerFn({ method: "POST" })
  .validator((data: { board: SerializableValue[] }) => {
    if (!data || !Array.isArray(data.board)) throw new Error("Board needs a list");
    return { board: data.board };
  })
  .handler(async ({ data }) => {
    const { mkdir, readFile, writeFile } = await import("node:fs/promises");
    const { dirname, join } = await import("node:path");
    const file = join(process.cwd(), FILE);
    await mkdir(dirname(file), { recursive: true });
    let book: MasterBook = { saved: new Date().toISOString(), lots: [] };
    try {
      const current = JSON.parse(await readFile(file, "utf8")) as MasterBook;
      if (current && Array.isArray(current.lots)) book = current;
    } catch {
      /* a new register is created with the board */
    }
    if (JSON.stringify(book.board ?? null) === JSON.stringify(data.board)) return { ok: true as const };
    book = { ...book, saved: new Date().toISOString(), board: data.board };
    await writeFile(file, `${JSON.stringify(book)}\n`);
    return { ok: true as const };
  });
