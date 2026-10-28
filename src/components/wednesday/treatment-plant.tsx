import { useEffect, useState } from "react";

const KEY = "magnolia-treatment-plant";

type Check = { date: string; note: string; ok: boolean };
type Plant = {
  chlorineLevel: "full" | "half" | "low";
  lastPumpOut: string;
  pumpOutCost: string;
  sampleDue: string;
  alarmOn: boolean;
  cameraLink: string;
  weatherLink: string;
  generatorLast: string;
  daily: Check[];
  weekly: Check[];
  monthly: Check[];
  clogs: { id: string; date: string; pump: "1" | "2"; cleared: boolean }[];
};

const empty: Plant = {
  chlorineLevel: "full",
  lastPumpOut: "",
  pumpOutCost: "",
  sampleDue: "",
  alarmOn: false,
  cameraLink: "",
  weatherLink: "",
  generatorLast: "",
  daily: [],
  weekly: [],
  monthly: [],
  clogs: [],
};

function load(): Plant {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return empty;
  }
}

export function TreatmentPlant() {
  const [plant, setPlant] = useState<Plant>(load);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(plant));
  }, [plant]);
  function patch(next: Partial<Plant>) {
    setPlant((current) => ({ ...current, ...next }));
  }
  function addCheck(kind: "daily" | "weekly" | "monthly", note: string) {
    patch({ [kind]: [{ date: new Date().toISOString().slice(0, 10), note, ok: true }, ...plant[kind]] });
  }
  function addClog(pump: "1" | "2") {
    patch({ clogs: [{ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), pump, cleared: false }, ...plant.clogs] });
  }
  const sampleLate = plant.sampleDue && plant.sampleDue < new Date().toISOString().slice(0, 10);
  return (
    <div className="plant-board">
      <header className="home-head">
        <div>
          <p className="eyebrow">TREATMENT PLANT</p>
          <h2>Today</h2>
        </div>
        <button type="button" className={plant.alarmOn ? "business-primary" : "business-secondary"} onClick={() => patch({ alarmOn: !plant.alarmOn })}>
          Alarm {plant.alarmOn ? "on" : "off"}
        </button>
      </header>
      <div className="home-grid">
        <article className="home-card"><span>Chlorine drum</span><strong>{plant.chlorineLevel}</strong><small>50 gallon</small></article>
        <article className="home-card"><span>Last pump-out</span><strong>{plant.lastPumpOut || "—"}</strong><small>{plant.pumpOutCost ? `$${plant.pumpOutCost}` : "No cost"}</small></article>
        <article className={`home-card ${sampleLate ? "home-red" : "home-green"}`}><span>Sample due</span><strong>{plant.sampleDue || "15th"}</strong><small>{sampleLate ? "Past due" : "Monthly"}</small></article>
        <article className="home-card"><span>Generator</span><strong>{plant.generatorLast || "—"}</strong><small>Quarterly test</small></article>
      </div>
      <section className="plant-form">
        <label>Chlorine level
          <select value={plant.chlorineLevel} onChange={(e) => patch({ chlorineLevel: e.target.value as Plant["chlorineLevel"] })}>
            <option value="full">Full</option>
            <option value="half">Half</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label>Last pump-out<input type="date" value={plant.lastPumpOut} onChange={(e) => patch({ lastPumpOut: e.target.value })} /></label>
        <label>Pump-out cost<input value={plant.pumpOutCost} onChange={(e) => patch({ pumpOutCost: e.target.value })} /></label>
        <label>Sample due<input type="date" value={plant.sampleDue} onChange={(e) => patch({ sampleDue: e.target.value })} /></label>
        <label>Camera link<input value={plant.cameraLink} placeholder="Blue Iris" onChange={(e) => patch({ cameraLink: e.target.value })} /></label>
        <label>Weather gauge<input value={plant.weatherLink} placeholder="Weather station link" onChange={(e) => patch({ weatherLink: e.target.value })} /></label>
        <label>Generator last test<input type="date" value={plant.generatorLast} onChange={(e) => patch({ generatorLast: e.target.value })} /></label>
      </section>
      <section className="plant-checks">
        <button type="button" onClick={() => addCheck("daily", "Breaker on morning / evening / night")}>Log daily check</button>
        <button type="button" onClick={() => addCheck("weekly", "Pump, mesh panel, chlorine drum")}>Log weekly check</button>
        <button type="button" onClick={() => addCheck("monthly", "Blower motors, sludge, sample")}>Log monthly check</button>
        <button type="button" onClick={() => addClog("1")}>Pump 1 clog</button>
        <button type="button" onClick={() => addClog("2")}>Pump 2 clog</button>
      </section>
      <ul className="plant-log">
        {plant.clogs.map((clog) => <li key={clog.id}>Pump {clog.pump} clog · {clog.date}{clog.cleared ? " · cleared" : ""}</li>)}
        {plant.daily.slice(0, 5).map((row, i) => <li key={`d${i}`}>Daily · {row.date} · {row.note}</li>)}
      </ul>
    </div>
  );
}
