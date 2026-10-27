import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-E0ptKr0j.mjs";
import { r as getSql } from "./db-_FU_9GN0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/business.functions-C_7BOQa5.js
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
function mapTask(row) {
	return {
		id: String(row.id),
		title: String(row.title),
		category: String(row.category),
		dueDate: row.due_date ? String(row.due_date).slice(0, 10) : "",
		followUp: row.follow_up ? String(row.follow_up).slice(0, 10) : "",
		status: String(row.status),
		owner: String(row.owner ?? ""),
		cost: String(row.cost ?? ""),
		reference: String(row.reference ?? ""),
		notes: String(row.notes ?? ""),
		createdAt: row.created_at ? String(row.created_at) : void 0,
		updatedAt: row.updated_at ? String(row.updated_at) : void 0
	};
}
var listBusinessTasks_createServerFn_handler = createServerRpc({
	id: "a5927577ce861885ea3c00c3753b5f2ae9f213a553abe39b4337e148b1984362",
	name: "listBusinessTasks",
	filename: "src/data/business.functions.ts"
}, (opts) => listBusinessTasks.__executeServer(opts));
var listBusinessTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBusinessTasks_createServerFn_handler, async ({ context }) => {
	return (await (await getSql()).query("SELECT id, title, category, due_date::text AS due_date, follow_up::text AS follow_up, status, owner, cost, reference, notes, created_at, updated_at FROM business_tasks WHERE user_id = $1 ORDER BY CASE WHEN status = 'Completed' THEN 1 ELSE 0 END, due_date NULLS LAST, created_at DESC", [context.userId])).map(mapTask);
});
var saveBusinessTask_createServerFn_handler = createServerRpc({
	id: "0d283d3d517162bd48f85e35e2d927aecdd4330c6221170586dedfcc4acd49c7",
	name: "saveBusinessTask",
	filename: "src/data/business.functions.ts"
}, (opts) => saveBusinessTask.__executeServer(opts));
var saveBusinessTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => ({
	task: normalizeTask(data?.task),
	action: data?.action === "Created" ? "Created" : "Updated"
})).handler(saveBusinessTask_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const task = data.task;
	const existing = await sql.query("SELECT id FROM business_tasks WHERE user_id = $1 AND id = $2", [context.userId, task.id]);
	await sql.query("INSERT INTO business_tasks (id, user_id, title, category, due_date, follow_up, status, owner, cost, reference, notes, updated_at) VALUES ($1,$2,$3,$4,NULLIF($5,'')::date,NULLIF($6,'')::date,$7,$8,$9,$10,$11,now()) ON CONFLICT (user_id,id) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, due_date=EXCLUDED.due_date, follow_up=EXCLUDED.follow_up, status=EXCLUDED.status, owner=EXCLUDED.owner, cost=EXCLUDED.cost, reference=EXCLUDED.reference, notes=EXCLUDED.notes, updated_at=now()", [
		task.id,
		context.userId,
		task.title,
		task.category,
		task.dueDate,
		task.followUp,
		task.status,
		task.owner,
		task.cost,
		task.reference,
		task.notes
	]);
	await sql.query("INSERT INTO business_task_history (id,user_id,task_id,action,snapshot) VALUES ($1,$2,$3,$4,$5::jsonb)", [
		crypto.randomUUID(),
		context.userId,
		task.id,
		existing.length ? data.action : "Created",
		JSON.stringify(task)
	]);
	return task;
});
var deleteBusinessTask_createServerFn_handler = createServerRpc({
	id: "1925c895ac0841476583c81f943169d9c2408c84137bd32b94e4702282cc7b68",
	name: "deleteBusinessTask",
	filename: "src/data/business.functions.ts"
}, (opts) => deleteBusinessTask.__executeServer(opts));
var deleteBusinessTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid task id.");
	return { id: data.id };
}).handler(deleteBusinessTask_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const rows = await sql.query("DELETE FROM business_tasks WHERE user_id = $1 AND id = $2 RETURNING id", [context.userId, data.id]);
	if (rows.length) {
		await sql.query("DELETE FROM business_task_attachments WHERE user_id = $1 AND task_id = $2", [context.userId, data.id]);
		await sql.query("INSERT INTO business_task_history (id,user_id,task_id,action,snapshot) VALUES ($1,$2,$3,'Deleted',$4::jsonb)", [
			crypto.randomUUID(),
			context.userId,
			data.id,
			JSON.stringify({ id: data.id })
		]);
	}
	return { deleted: rows.length > 0 };
});
var listBusinessHistory_createServerFn_handler = createServerRpc({
	id: "cfc0b9ac2b14c5ef3ff5442b1f586f4ea5aa8c4ee1b2c819abb5b52c9f8e7294",
	name: "listBusinessHistory",
	filename: "src/data/business.functions.ts"
}, (opts) => listBusinessHistory.__executeServer(opts));
var listBusinessHistory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.taskId)) throw new Error("Invalid task id.");
	return { taskId: data.taskId };
}).handler(listBusinessHistory_createServerFn_handler, async ({ data, context }) => {
	return (await (await getSql()).query("SELECT id, task_id, action, snapshot, changed_at FROM business_task_history WHERE user_id = $1 AND task_id = $2 ORDER BY changed_at DESC LIMIT 100", [context.userId, data.taskId])).map((row) => ({
		id: String(row.id),
		taskId: String(row.task_id),
		action: String(row.action),
		snapshot: typeof row.snapshot === "string" ? JSON.parse(row.snapshot) : row.snapshot,
		changedAt: String(row.changed_at)
	}));
});
var listBusinessAttachments_createServerFn_handler = createServerRpc({
	id: "728d9011e139b7691e25ed4b000ca7249ef42843a601eb07b93fb0fb6d8402e3",
	name: "listBusinessAttachments",
	filename: "src/data/business.functions.ts"
}, (opts) => listBusinessAttachments.__executeServer(opts));
var listBusinessAttachments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.taskId)) throw new Error("Invalid task id.");
	return { taskId: data.taskId };
}).handler(listBusinessAttachments_createServerFn_handler, async ({ data, context }) => {
	return (await (await getSql()).query("SELECT id, task_id, file_name, mime_type, byte_size, created_at FROM business_task_attachments WHERE user_id = $1 AND task_id = $2 ORDER BY created_at DESC", [context.userId, data.taskId])).map((row) => ({
		id: String(row.id),
		taskId: String(row.task_id),
		name: String(row.file_name),
		mimeType: String(row.mime_type),
		size: Number(row.byte_size),
		createdAt: String(row.created_at)
	}));
});
var addBusinessAttachment_createServerFn_handler = createServerRpc({
	id: "81d85d3e1ed96526137983ca2ca9e8749801d3fb5bf98ff108ec1affaab820f5",
	name: "addBusinessAttachment",
	filename: "src/data/business.functions.ts"
}, (opts) => addBusinessAttachment.__executeServer(opts));
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
}).handler(addBusinessAttachment_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	if (!(await sql.query("SELECT id FROM business_tasks WHERE user_id = $1 AND id = $2", [context.userId, data.taskId])).length) throw new Error("Task not found.");
	const id = crypto.randomUUID();
	const row = (await sql.query("INSERT INTO business_task_attachments (id,user_id,task_id,file_name,mime_type,byte_size,data_base64) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,task_id,file_name,mime_type,byte_size,created_at", [
		id,
		context.userId,
		data.taskId,
		data.name,
		data.mimeType,
		data.size,
		data.dataBase64
	]))[0];
	return {
		id: String(row.id),
		taskId: String(row.task_id),
		name: String(row.file_name),
		mimeType: String(row.mime_type),
		size: Number(row.byte_size),
		createdAt: String(row.created_at)
	};
});
var readBusinessAttachment_createServerFn_handler = createServerRpc({
	id: "1a1fd9891ffa60846cb36aa3af906502a1b7e742c8f2b4799b710794f9ae757f",
	name: "readBusinessAttachment",
	filename: "src/data/business.functions.ts"
}, (opts) => readBusinessAttachment.__executeServer(opts));
var readBusinessAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid attachment id.");
	return { id: data.id };
}).handler(readBusinessAttachment_createServerFn_handler, async ({ data, context }) => {
	const row = (await (await getSql()).query("SELECT file_name, mime_type, data_base64 FROM business_task_attachments WHERE user_id = $1 AND id = $2", [context.userId, data.id]))[0];
	return row ? {
		name: String(row.file_name),
		mimeType: String(row.mime_type),
		dataBase64: String(row.data_base64)
	} : null;
});
var deleteBusinessAttachment_createServerFn_handler = createServerRpc({
	id: "2ef8254051bee5948228ea49ef0a9f659af201aeae53b6baab7aa3b24755fc11",
	name: "deleteBusinessAttachment",
	filename: "src/data/business.functions.ts"
}, (opts) => deleteBusinessAttachment.__executeServer(opts));
var deleteBusinessAttachment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!validId(data?.id)) throw new Error("Invalid attachment id.");
	return { id: data.id };
}).handler(deleteBusinessAttachment_createServerFn_handler, async ({ data, context }) => {
	return { deleted: (await (await getSql()).query("DELETE FROM business_task_attachments WHERE user_id = $1 AND id = $2 RETURNING id", [context.userId, data.id])).length > 0 };
});
//#endregion
export { addBusinessAttachment_createServerFn_handler, deleteBusinessAttachment_createServerFn_handler, deleteBusinessTask_createServerFn_handler, listBusinessAttachments_createServerFn_handler, listBusinessHistory_createServerFn_handler, listBusinessTasks_createServerFn_handler, readBusinessAttachment_createServerFn_handler, saveBusinessTask_createServerFn_handler };
