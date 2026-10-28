import { useEffect, useState } from "react";

type Doc = { uploaded?: string; expires?: string; provider?: string; number?: string };
type Vendor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  trade: string;
  notes: string;
  liability: Doc;
  license: Doc;
  workersComp: Doc;
};

const KEY = "magnolia-vendors";
const YEAR = 365 * 86400000;

function load(): Vendor[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function stamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function expires(uploaded?: string) {
  if (!uploaded) return "";
  return new Date(new Date(uploaded).getTime() + YEAR).toISOString().slice(0, 10);
}

function status(doc: Doc) {
  if (!doc.uploaded) return "missing";
  const end = doc.expires || expires(doc.uploaded);
  const left = (new Date(end).getTime() - Date.now()) / 86400000;
  if (left < 0) return "expired";
  if (left <= 30) return "expiring";
  return "current";
}

export function VendorDirectory() {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = load();
    if (saved.length) return saved;
    return [{
      id: "cool-cat-pat",
      name: "Cool Cat Pat AC Repair",
      phone: "",
      email: "",
      trade: "AC",
      notes: "Default AC vendor",
      liability: {},
      license: {},
      workersComp: {},
    }];
  });
  const [approvedOnly, setApprovedOnly] = useState(false);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(vendors));
  }, [vendors]);
  const approved = (vendor: Vendor) => status(vendor.liability) === "current" && status(vendor.license) === "current" && status(vendor.workersComp) === "current";
  const shown = approvedOnly ? vendors.filter(approved) : vendors;
  function add() {
    setVendors((current) => [{ id: crypto.randomUUID(), name: "New vendor", phone: "", email: "", trade: "", notes: "", liability: {}, license: {}, workersComp: {} }, ...current]);
  }
  function patch(id: string, next: Partial<Vendor>) {
    setVendors((current) => current.map((vendor) => (vendor.id === id ? { ...vendor, ...next } : vendor)));
  }
  return (
    <div className="vendor-board">
      <header className="home-head">
        <div>
          <p className="eyebrow">COMPLIANCE</p>
          <h2>Approved vendors</h2>
        </div>
        <div className="business-heading-actions">
          <button type="button" className="business-secondary" onClick={() => setApprovedOnly((on) => !on)}>{approvedOnly ? "Show all" : "Approved only"}</button>
          <button type="button" className="business-primary" onClick={add}>+ Vendor</button>
        </div>
      </header>
      <p className="quiet">Liability, business license, and workers' comp are good for one year from the upload date.</p>
      <div className="vendor-list">
        {shown.map((vendor) => (
          <article key={vendor.id} className={approved(vendor) ? "vendor-card is-approved" : "vendor-card"}>
            <input value={vendor.name} onChange={(e) => patch(vendor.id, { name: e.target.value })} />
            <div className="vendor-meta">
              <input value={vendor.trade} placeholder="Trade" onChange={(e) => patch(vendor.id, { trade: e.target.value })} />
              <input value={vendor.phone} placeholder="Phone" onChange={(e) => patch(vendor.id, { phone: e.target.value })} />
              <input value={vendor.email} placeholder="Email" onChange={(e) => patch(vendor.id, { email: e.target.value })} />
            </div>
            {(["liability", "license", "workersComp"] as const).map((key) => {
              const label = key === "liability" ? "Liability" : key === "license" ? "Business license" : "Workers' comp";
              const doc = vendor[key];
              return (
                <label key={key} className={`vendor-doc is-${status(doc)}`}>
                  <span>{label}</span>
                  <input type="date" value={doc.uploaded ?? ""} onChange={(e) => patch(vendor.id, { [key]: { ...doc, uploaded: e.target.value, expires: expires(e.target.value) } })} />
                  <small>{status(doc)}{doc.expires ? ` · expires ${doc.expires}` : ""}</small>
                </label>
              );
            })}
          </article>
        ))}
      </div>
    </div>
  );
}
