import { useEffect, useState } from "react";

const KEY = "magnolia-inventory";

type Item = { id: string; name: string; qty: string; reorder: string; note?: string };

const SECTIONS: { title: string; items: string[] }[] = [
  { title: "AC parts", items: ["Motor", "Contactor", "Breaker", "Fan blade", "Tester capacitor", ...[65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 12.5, 10, 7.5, 5].map((size) => `Capacitor ${size}`)] },
  { title: "Plumbing", items: ["Coupler", "Elbow", "Pipe", "Glue", "PVC primer", "Light bulbs", "Kitchen faucet", "Bathroom faucet", "Toilet", "Toilet seat", "Toilet handle", "Flusher kit", "Flapper kit", "Toilet chain", "Wax ring", "Shower head", "Tub spout", "P-trap", "Drain snake", "Bladder"] },
  { title: "Wood", items: ["2x4", "2x6", "4x4", "Screws"] },
  { title: "Roofing", items: ["Peel and stick", "Shingles", "Blackjack tar", "Termination bar", "Rubber roof"] },
  { title: "Paint", items: ["Roller", "Brush", "Paint", "Tray", "Cover-up spray"] },
  { title: "Handyman", items: ["Pressure washer", "Step ladder", "Extension ladder", "Extension cord", "Door hardware", "Screen mesh", "Caulk", "Foam", "Smoke detector", "Shop vac"] },
  { title: "Mowing", items: ["Cub Cadet mower", "Edger", "Blower", "Weed eater", "Hedge trimmer", "Oil", "Hydraulic fluid", "Weed eater wire", "Mixed gas", "Regular gas (5 gal)"] },
];

function seed(): Record<string, Item[]> {
  return Object.fromEntries(SECTIONS.map((section) => [section.title, section.items.map((name) => ({ id: name, name, qty: "", reorder: "" }))]));
}

export function Inventory() {
  const [stock, setStock] = useState<Record<string, Item[]>>(() => {
    try {
      return { ...seed(), ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
    } catch {
      return seed();
    }
  });
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(stock));
  }, [stock]);
  function patch(section: string, id: string, next: Partial<Item>) {
    setStock((current) => ({ ...current, [section]: current[section].map((item) => (item.id === id ? { ...item, ...next } : item)) }));
  }
  return (
    <div className="inventory-board">
      <header className="home-head">
        <div>
          <p className="eyebrow">SUPPLIES</p>
          <h2>Inventory</h2>
        </div>
      </header>
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          <div className="inventory-grid">
            {(stock[section.title] ?? []).map((item) => (
              <label key={item.id}>
                <span>{item.name}</span>
                <input value={item.qty} placeholder="Qty" onChange={(e) => patch(section.title, item.id, { qty: e.target.value })} />
                <input value={item.reorder} placeholder="Reorder" onChange={(e) => patch(section.title, item.id, { reorder: e.target.value })} />
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
