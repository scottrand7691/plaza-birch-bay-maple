import { useEffect, useState } from "react";

const KEY = "magnolia-audit";

export type AuditEntry = {
  id: string;
  at: string;
  action: string;
  lot?: string;
  detail: string;
};

export function logAudit(action: string, detail: string, lot?: string) {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as AuditEntry[];
    const next = [{ id: crypto.randomUUID(), at: new Date().toISOString(), action, detail, lot }, ...raw].slice(0, 500);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* keep working if storage is full */
  }
}

export function AuditLog() {
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    try {
      setRows(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
    } catch {
      setRows([]);
    }
  }, []);
  const shown = rows.filter((row) => [row.action, row.detail, row.lot].join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="audit-log">
      <header className="home-head">
        <div>
          <p className="eyebrow">HISTORY</p>
          <h2>Audit log</h2>
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search action, lot, detail" />
      </header>
      <ul>
        {shown.length ? shown.map((row) => (
          <li key={row.id}>
            <b>{new Date(row.at).toLocaleString()}</b>
            <span>{row.action}</span>
            <small>{row.lot ? `Lot ${row.lot} · ` : ""}{row.detail}</small>
          </li>
        )) : <li>No entries yet.</li>}
      </ul>
    </div>
  );
}
