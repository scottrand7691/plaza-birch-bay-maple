import { useEffect, useState } from "react";
import type { Lot } from "@/data/lots";

type HomeCard = {
  id: string;
  title: string;
  count: number;
  detail: string;
  tone: "red" | "orange" | "green" | "neutral";
  onOpen: () => void;
};

export function HomeBoard({
  lots,
  onOpenMap,
  onOpenTodo,
  onOpenMow,
  onOpenFinancial,
  onOpenBusiness,
}: {
  lots: Lot[];
  onOpenMap: (filter?: string) => void;
  onOpenTodo: () => void;
  onOpenMow: () => void;
  onOpenFinancial: () => void;
  onOpenBusiness: () => void;
}) {
  const occupied = lots.filter((lot) => lot.status === "Occupied");
  const empty = lots.filter((lot) => lot.status === "Empty");
  const overdue = occupied.filter((lot) => (lot.lateRent ?? "").trim() || (lot.balance ?? "").trim());
  const unmowed = lots.filter((lot) => lot.noMow === "Unmowed");
  const oweMow = lots.filter((lot) => lot.noMow === "Owe-Mow" || lot.noMow === "Owe");
  const needsRoof = lots.filter((lot) => lot.roofReplace === "Yes");
  const needsWash = lots.filter((lot) => lot.pressureWash === "Needs");
  const withSticky = lots.filter((lot) => (lot.stickies?.length ?? 0) > 0);
  const rentSum = occupied.reduce((sum, lot) => sum + (Number((lot.rent ?? "").replace(/[$,\s]/g, "")) || 0), 0);
  const vacancy = empty.length * 540;

  const cards: HomeCard[] = [
    { id: "overdue", title: "Overdue rent", count: overdue.length, detail: overdue.slice(0, 3).map((lot) => lot.lot).join(", ") || "None", tone: overdue.length ? "red" : "green", onOpen: () => onOpenMap("due") },
    { id: "unmowed", title: "Unmowed", count: unmowed.length, detail: unmowed.slice(0, 3).map((lot) => lot.lot).join(", ") || "None", tone: unmowed.length ? "orange" : "green", onOpen: onOpenMow },
    { id: "owe-mow", title: "Owe-Mow", count: oweMow.length, detail: oweMow.slice(0, 3).map((lot) => lot.lot).join(", ") || "None", tone: oweMow.length ? "orange" : "green", onOpen: onOpenMow },
    { id: "empty", title: "Empty lots", count: empty.length, detail: `$${vacancy.toLocaleString()} / mo vacancy`, tone: empty.length ? "orange" : "green", onOpen: () => onOpenMap("empty") },
    { id: "roof", title: "Needs roof", count: needsRoof.length, detail: needsRoof.slice(0, 3).map((lot) => lot.lot).join(", ") || "None", tone: needsRoof.length ? "red" : "green", onOpen: () => onOpenMap("roof") },
    { id: "wash", title: "Needs wash", count: needsWash.length, detail: needsWash.slice(0, 3).map((lot) => lot.lot).join(", ") || "None", tone: needsWash.length ? "orange" : "green", onOpen: onOpenMap },
    { id: "sticky", title: "Sticky notes", count: withSticky.length, detail: "Open Meeting or To-Do", tone: "neutral", onOpen: onOpenTodo },
    { id: "rent", title: "Monthly rent", count: rentSum, detail: `${occupied.length} occupied`, tone: "green", onOpen: onOpenFinancial },
  ];

  return (
    <div className="home-board">
      <header className="home-head">
        <div>
          <p className="eyebrow">TODAY</p>
          <h2>Magnolia Estates</h2>
        </div>
        <button type="button" className="business-secondary" onClick={onOpenBusiness}>Open Business</button>
      </header>
      <div className="home-grid">
        {cards.map((card) => (
          <button key={card.id} type="button" className={`home-card home-${card.tone}`} onClick={card.onOpen}>
            <span>{card.title}</span>
            <strong>{card.id === "rent" ? `$${card.count.toLocaleString()}` : card.count}</strong>
            <small>{card.detail}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
