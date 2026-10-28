import { useEffect, useMemo, useState } from "react";
import type { Lot } from "@/data/lots";

type Job = { id: string; lot: string; category: string; note: string; priority: "Low" | "Medium" | "High"; status: "Open" | "In progress" | "Done"; started?: string; done?: string };

export function HandymanBoard({ lots }: { lots: Lot[] }) {
  const fromLots = useMemo<Job[]>(() => lots.flatMap((lot) => (lot.maintLog ?? []).map((job) => ({
    id: job.id,
    lot: lot.lot,
    category: "General",
    note: job.note,
    priority: "Medium" as const,
    status: job.done ? "Done" as const : "Open" as const,
  }))), [lots]);
  const [extra, setExtra] = useState<Job[]>([]);
  const [note, setNote] = useState("");
  const [lot, setLot] = useState("");
  const jobs = [...extra, ...fromLots];
  function add() {
    if (!note.trim()) return;
    setExtra((current) => [{ id: crypto.randomUUID(), lot, category: "General", note: note.trim(), priority: "Medium", status: "Open" }, ...current]);
    setNote("");
  }
  return (
    <div className="handyman-board">
      <header className="home-head">
        <div>
          <p className="eyebrow">HANDYMAN</p>
          <h2>Work orders</h2>
        </div>
      </header>
      <div className="plant-form">
        <input value={lot} placeholder="Lot" onChange={(e) => setLot(e.target.value)} />
        <input value={note} placeholder="Job" onChange={(e) => setNote(e.target.value)} />
        <button type="button" className="business-primary" onClick={add}>Add</button>
      </div>
      <ul className="plant-log">
        {jobs.map((job) => (
          <li key={job.id}>
            <b>Lot {job.lot || "—"}</b>
            <span>{job.note}</span>
            <small>{job.status} · {job.priority}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
