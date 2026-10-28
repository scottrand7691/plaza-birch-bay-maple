import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Lot } from "@/data/lots";
import { buildTodo } from "@/data/lots";
import { addBusinessAttachment, deleteBusinessAttachment, deleteBusinessTask, listBusinessAttachments, listBusinessHistory, listBusinessTasks, readBusinessAttachment, saveBusinessTask, type BusinessAttachment, type BusinessHistoryEntry, type BusinessTask } from "@/data/business.functions";

type ParkBill = { id: string; name: string; amount?: string; due?: string };

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

export default function BusinessBoard({ lots }: { lots: Lot[] }) {
  const [tasks, setTasks] = useState<BusinessTask[]>([]);
  const [parkBills, setParkBills] = useState<ParkBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
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
  const [board, setBoard] = useState<BoardNote[]>(() => (typeof window === "undefined" ? [] : loadBoard()));
  function removeSticky(task: BusinessTask, id: string) {
    eraseTaskSticky(id);
    dismissSticky(id);
    const nextBoard = loadBoard().filter((note) => note.id !== id);
    setBoard(nextBoard);
    try {
      localStorage.setItem(BOARD_KEY, JSON.stringify(nextBoard));
    } catch {
      /* the on-screen list is already updated */
    }
    void saveBoard({ data: { board: nextBoard } }).catch(() => {});
    if (task.notes.includes(id)) {
      const notesText = task.notes.split("\n").filter((line) => !line.includes(id)).join("\n").trim();
      const next = { ...task, notes: notesText };
      setTasks((current) => current.map((item) => (item.id === task.id ? next : item)));
      void saveBusinessTask({ data: { task: next, action: "Updated" } }).catch(() => {});
    }
  }
  useEffect(() => {
    const refresh = () => setBoard(loadBoard());
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

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
      setTasks((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
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
    <div className="business-heading"><div><p className="eyebrow">OPERATIONS WORKSPACE</p><h2>Business center</h2><p className="business-subtitle">Shared renewals, title work, registrations, documents, and follow-ups.</p></div></div>
    {storageError ? <div className="business-error" role="alert">{storageError}<button className="business-secondary" type="button" onClick={() => setStorageError("")}>Dismiss</button></div> : null}
    {legacyCount > 0 ? <div className="business-notice"><span>{legacyCount} older task(s) were found in this browser and have not been moved to shared storage.</span><button className="business-secondary" type="button" disabled={saving} onClick={() => void importLegacyTasks()}>Import to my account</button></div> : null}
    <div className="business-list-head"><div><h3>Business task register</h3><p>{loading ? "Loading shared records…" : filtered.length + " records · nearest deadline first"}</p></div><div className="business-heading-actions"><div className="map-slot business-filter-drop"><button className="business-secondary" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>{filter === "All" ? "Filter" : filter} ▾</button>{filtersOpen ? <div className="map-drop" role="menu">{[["All", "All tasks"], ["Overdue", "Overdue"], ["Due soon", "Due in 30 days"], ["Follow-up due", "Follow-up due"], ...BUSINESS_CATEGORIES.map((item) => [item, item] as [string, string]), ...BUSINESS_STATUSES.map((item) => [item, item] as [string, string])].map(([id, name]) => <button key={id} type="button" role="menuitemradio" aria-checked={filter === id} onClick={() => { setFilter(id); setFiltersOpen(false); }}>{name}</button>)}</div> : null}</div><input aria-label="Search business tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, people, references…" /><button className="business-secondary" type="button" onClick={exportTasks}>Export CSV</button><button className="business-primary" type="button" onClick={() => setShowForm((open) => !open)}>{showForm ? "Cancel" : "+ Add task"}</button></div></div>
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
    {loading ? <div className="business-empty"><h3>Loading your shared task register</h3><p>Checking the shared database…</p></div> : filtered.length ? <div className="business-task-list">{filtered.map((task) => { const days = businessDays(task.dueDate); const followDays = businessDays(task.followUp); const dueLabel = days === null ? "No due date" : days < 0 ? Math.abs(days) + "d overdue" : days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : "Due in " + days + " days"; return <article className={"business-task " + (task.status === "Completed" ? "task-completed" : "")} key={task.id}>
      <div className="business-task-main"><span className="business-category">{task.category}</span><h4>{task.title}</h4><div className="business-task-meta">{task.owner ? <span>Owner: {task.owner}</span> : null}{task.reference ? <span>Ref: {task.reference}</span> : null}{task.cost ? <span>{"Fee: $" + task.cost}</span> : null}{task.followUp ? <span>Follow-up: {task.followUp}{followDays !== null && followDays <= 0 && task.status !== "Completed" ? " · due now" : ""}</span> : null}</div>{task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim() ? <p className="business-task-notes">{task.notes.replace(/\[\[sticky:[^\]]+\]\]/g, "").trim()}</p> : null}{[...(loadTaskStickies()[task.id] ?? []), ...board.filter((note) => note.kind === "pin" && note.pin === `task:${task.id}`).map((note) => ({ id: note.id, text: note.text, color: note.color }))].filter((sticky, index, list) => !loadDismissedStickies().has(sticky.id) && list.findIndex((item) => item.id === sticky.id) === index).map((sticky) => <p className="business-task-notes task-sticky" key={sticky.id} style={{ background: sticky.color }}>{sticky.text}<button type="button" aria-label="Remove sticky" onClick={() => removeSticky(task, sticky.id)}>×</button></p>)}
        <div className="business-inline-actions"><button className="business-secondary" type="button" onClick={() => void toggleAttachments(task.id)}>{expandedAttachments[task.id] ? "Hide documents" : "Documents (" + (attachments[task.id]?.length ?? "…") + ")"}</button><button className="business-secondary" type="button" onClick={() => void toggleHistory(task.id)}>{expandedHistory[task.id] ? "Hide history" : "Change history"}</button></div>
        {expandedAttachments[task.id] ? <div className="business-detail-panel"><label className="business-field">Attach PDF or image (max 3 MB)<input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void uploadAttachment(task, file); }} /></label>{(attachments[task.id] ?? []).map((item) => <div className="business-attachment" key={item.id}><span>{item.name} · {(item.size / 1024).toFixed(0)} KB</span><button className="business-secondary" type="button" onClick={() => void downloadAttachment(item)}>Download</button><button className="business-delete" type="button" onClick={() => void removeAttachment(task.id, item.id)}>Remove</button></div>)}</div> : null}
        {expandedHistory[task.id] ? <div className="business-detail-panel"><h5>Recent changes</h5>{(history[task.id] ?? []).length ? (history[task.id] ?? []).map((entry) => <div className="business-history-entry" key={entry.id}><strong>{entry.action}</strong><span>{new Date(entry.changedAt).toLocaleString()}</span><small>{entry.snapshot.title || "Task record"}</small></div>) : <p>No change history available.</p>}</div> : null}
      </div>
      <div className="business-task-actions"><div className={"business-due " + (days !== null && days < 0 && task.status !== "Completed" ? "due-overdue" : days !== null && days <= 7 && task.status !== "Completed" ? "due-soon" : "")}>{task.status === "Completed" ? "Completed" : dueLabel}</div><button className="business-secondary" type="button" onClick={() => beginEdit(task)}>Edit</button><select aria-label={"Status for " + task.title} value={task.status} onChange={(event) => void changeStatus(task, event.target.value)}>{BUSINESS_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>{confirmId === task.id ? <span className="remove-confirm"><span>Are you sure?</span><button className="business-primary" type="button" onClick={() => void removeTask(task)}>Confirm</button><button className="business-secondary" type="button" onClick={() => setConfirmId(null)}>Cancel</button></span> : <button className="business-delete" type="button" onClick={() => setConfirmId(task.id)} aria-label={"Delete " + task.title}>Remove</button>}</div>
    </article>; })}</div> : <div className="business-empty"><div className="business-empty-icon">✓</div><h3>{tasks.length ? "No matching tasks" : "Your business task list is ready"}</h3><p>{tasks.length ? "Try another search or filter." : "Add a license renewal, vehicle registration, title transfer, or follow-up to start tracking deadlines."}</p>{!tasks.length ? <button className="business-primary" type="button" onClick={() => setShowForm(true)}>+ Add your first task</button> : <button className="business-secondary" type="button" onClick={() => { setSearch(""); setFilter("All"); }}>Clear filters</button>}</div>}
    <BillsBoard onChange={setParkBills}>
      <BusinessCalendar
        tasks={[
          ...boardTasks,
          ...board.filter((note) => note.kind === "reminder" && note.when).map((note) => ({ id: note.id, title: note.text, category: "Other", dueDate: note.when, followUp: "", status: "Open", owner: "", cost: "", reference: "", notes: note.text })),
        ]}
        bills={parkBills}
        pins={board.filter((note) => note.kind === "pin" && note.pin?.startsWith("date:"))}
      />
    </BillsBoard>
    <p className="business-storage-note">Tasks, change history, and attachments are stored in the shared database and scoped to the signed-in account. Due-date reminders appear in this workspace; external email or push notifications require a separately configured delivery provider.</p>
  </div>;
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
      <h3 className="bills-title">Bills</h3>
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
