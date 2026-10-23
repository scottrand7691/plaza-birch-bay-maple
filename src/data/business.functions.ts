import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type BusinessTask = {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  followUp: string;
  status: string;
  owner: string;
  cost: string;
  reference: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BusinessAttachment = {
  id: string;
  taskId: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export type BusinessHistoryEntry = {
  id: string;
  taskId: string;
  action: string;
  snapshot: BusinessTask;
  changedAt: string;
};

const validId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const text = (value: unknown, max = 4000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const date = (value: unknown) => {
  const valueText = text(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(valueText) ? valueText : "";
};
const categories = ["License / permit", "Vehicle", "Title work", "Insurance", "Tax / bill", "Maintenance", "Inspection", "Vendor", "Other"];
const statuses = ["Open", "In progress", "Waiting", "Completed"];

function normalizeTask(input: unknown): BusinessTask {
  if (!input || typeof input !== "object") throw new Error("A task is required.");
  const value = input as Record<string, unknown>;
  if (!validId(value.id)) throw new Error("Invalid task id.");
  const title = text(value.title, 200);
  const category = text(value.category, 60);
  const status = text(value.status, 30);
  if (!title) throw new Error("Task title is required.");
  if (!categories.includes(category)) throw new Error("Invalid task category.");
  if (!statuses.includes(status)) throw new Error("Invalid task status.");
  const cost = text(value.cost, 30);
  if (cost && !/^\d{1,9}(\.\d{1,2})?$/.test(cost)) throw new Error("Cost must be a non-negative amount.");
  return {
    id: value.id, title, category, status, cost,
    dueDate: date(value.dueDate), followUp: date(value.followUp),
    owner: text(value.owner, 200), reference: text(value.reference, 200),
    notes: text(value.notes, 4000),
  };
}

function mapTask(row: Record<string, unknown>): BusinessTask {
  return {
    id: String(row.id), title: String(row.title), category: String(row.category),
    dueDate: row.due_date ? String(row.due_date).slice(0, 10) : "",
    followUp: row.follow_up ? String(row.follow_up).slice(0, 10) : "",
    status: String(row.status), owner: String(row.owner ?? ""), cost: String(row.cost ?? ""),
    reference: String(row.reference ?? ""), notes: String(row.notes ?? ""),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export const listBusinessTasks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BusinessTask[]> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "SELECT id, title, category, due_date::text AS due_date, follow_up::text AS follow_up, status, owner, cost, reference, notes, created_at, updated_at FROM business_tasks WHERE user_id = $1 ORDER BY CASE WHEN status = 'Completed' THEN 1 ELSE 0 END, due_date NULLS LAST, created_at DESC",
      [context.userId],
    );
    return rows.map(mapTask);
  });

export const saveBusinessTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { task: unknown; action?: string }) => ({
    task: normalizeTask(data?.task),
    action: data?.action === "Created" ? "Created" : "Updated",
  }))
  .handler(async ({ data, context }): Promise<BusinessTask> => {
    const sql = await getSql();
    const task = data.task;
    const existing = await sql.query<{ id: string }>(
      "SELECT id FROM business_tasks WHERE user_id = $1 AND id = $2",
      [context.userId, task.id],
    );
    await sql.query(
      "INSERT INTO business_tasks (id, user_id, title, category, due_date, follow_up, status, owner, cost, reference, notes, updated_at) VALUES ($1,$2,$3,$4,NULLIF($5,'')::date,NULLIF($6,'')::date,$7,$8,$9,$10,$11,now()) ON CONFLICT (user_id,id) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, due_date=EXCLUDED.due_date, follow_up=EXCLUDED.follow_up, status=EXCLUDED.status, owner=EXCLUDED.owner, cost=EXCLUDED.cost, reference=EXCLUDED.reference, notes=EXCLUDED.notes, updated_at=now()",
      [task.id, context.userId, task.title, task.category, task.dueDate, task.followUp, task.status, task.owner, task.cost, task.reference, task.notes],
    );
    await sql.query(
      "INSERT INTO business_task_history (id,user_id,task_id,action,snapshot) VALUES ($1,$2,$3,$4,$5::jsonb)",
      [crypto.randomUUID(), context.userId, task.id, existing.length ? data.action : "Created", JSON.stringify(task)],
    );
    return task;
  });

export const deleteBusinessTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => {
    if (!validId(data?.id)) throw new Error("Invalid task id.");
    return { id: data.id };
  })
  .handler(async ({ data, context }): Promise<{ deleted: boolean }> => {
    const sql = await getSql();
    const rows = await sql.query<{ id: string }>(
      "DELETE FROM business_tasks WHERE user_id = $1 AND id = $2 RETURNING id",
      [context.userId, data.id],
    );
    if (rows.length) {
      await sql.query("DELETE FROM business_task_attachments WHERE user_id = $1 AND task_id = $2", [context.userId, data.id]);
      await sql.query("INSERT INTO business_task_history (id,user_id,task_id,action,snapshot) VALUES ($1,$2,$3,'Deleted',$4::jsonb)", [crypto.randomUUID(), context.userId, data.id, JSON.stringify({ id: data.id })]);
    }
    return { deleted: rows.length > 0 };
  });

export const listBusinessHistory = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { taskId: string }) => {
    if (!validId(data?.taskId)) throw new Error("Invalid task id.");
    return { taskId: data.taskId };
  })
  .handler(async ({ data, context }): Promise<BusinessHistoryEntry[]> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "SELECT id, task_id, action, snapshot, changed_at FROM business_task_history WHERE user_id = $1 AND task_id = $2 ORDER BY changed_at DESC LIMIT 100",
      [context.userId, data.taskId],
    );
    return rows.map((row) => ({
      id: String(row.id), taskId: String(row.task_id), action: String(row.action),
      snapshot: typeof row.snapshot === "string" ? JSON.parse(row.snapshot) as BusinessTask : row.snapshot as BusinessTask,
      changedAt: String(row.changed_at),
    }));
  });

export const listBusinessAttachments = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { taskId: string }) => {
    if (!validId(data?.taskId)) throw new Error("Invalid task id.");
    return { taskId: data.taskId };
  })
  .handler(async ({ data, context }): Promise<BusinessAttachment[]> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "SELECT id, task_id, file_name, mime_type, byte_size, created_at FROM business_task_attachments WHERE user_id = $1 AND task_id = $2 ORDER BY created_at DESC",
      [context.userId, data.taskId],
    );
    return rows.map((row) => ({
      id: String(row.id), taskId: String(row.task_id), name: String(row.file_name),
      mimeType: String(row.mime_type), size: Number(row.byte_size), createdAt: String(row.created_at),
    }));
  });

export const addBusinessAttachment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { taskId: string; name: string; mimeType: string; size: number; dataBase64: string }) => {
    if (!validId(data?.taskId)) throw new Error("Invalid task id.");
    const name = text(data.name, 200);
    const mimeType = text(data.mimeType, 100);
    if (!name || !/^(application\/pdf|image\/(png|jpeg|webp))$/.test(mimeType)) throw new Error("Only PDF, PNG, JPEG, and WebP attachments are supported.");
    if (!Number.isInteger(data.size) || data.size < 1 || data.size > 3_000_000) throw new Error("Attachments must be 3 MB or smaller.");
    if (typeof data.dataBase64 !== "string" || data.dataBase64.length > 4_100_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.dataBase64)) throw new Error("Invalid attachment data.");
    return { taskId: data.taskId, name, mimeType, size: data.size, dataBase64: data.dataBase64 };
  })
  .handler(async ({ data, context }): Promise<BusinessAttachment> => {
    const sql = await getSql();
    const tasks = await sql.query<{ id: string }>("SELECT id FROM business_tasks WHERE user_id = $1 AND id = $2", [context.userId, data.taskId]);
    if (!tasks.length) throw new Error("Task not found.");
    const id = crypto.randomUUID();
    const rows = await sql.query<Record<string, unknown>>(
      "INSERT INTO business_task_attachments (id,user_id,task_id,file_name,mime_type,byte_size,data_base64) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,task_id,file_name,mime_type,byte_size,created_at",
      [id, context.userId, data.taskId, data.name, data.mimeType, data.size, data.dataBase64],
    );
    const row = rows[0];
    return { id: String(row.id), taskId: String(row.task_id), name: String(row.file_name), mimeType: String(row.mime_type), size: Number(row.byte_size), createdAt: String(row.created_at) };
  });

export const readBusinessAttachment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => {
    if (!validId(data?.id)) throw new Error("Invalid attachment id.");
    return { id: data.id };
  })
  .handler(async ({ data, context }): Promise<{ name: string; mimeType: string; dataBase64: string } | null> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "SELECT file_name, mime_type, data_base64 FROM business_task_attachments WHERE user_id = $1 AND id = $2",
      [context.userId, data.id],
    );
    const row = rows[0];
    return row ? { name: String(row.file_name), mimeType: String(row.mime_type), dataBase64: String(row.data_base64) } : null;
  });

export const deleteBusinessAttachment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => {
    if (!validId(data?.id)) throw new Error("Invalid attachment id.");
    return { id: data.id };
  })
  .handler(async ({ data, context }): Promise<{ deleted: boolean }> => {
    const sql = await getSql();
    const rows = await sql.query<{ id: string }>("DELETE FROM business_task_attachments WHERE user_id = $1 AND id = $2 RETURNING id", [context.userId, data.id]);
    return { deleted: rows.length > 0 };
  });
