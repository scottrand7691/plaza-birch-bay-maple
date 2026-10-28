import { memo, type CSSProperties } from "react";
import { displayName, matches, matchesFilter, type Lot, type LotFilter } from "@/data/lots";

export type SheetId = 1 | 2 | 3;

type Box = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "lot" | "landmark";
  label?: string;
  points?: string;
  textDy?: number;
};

type Label = {
  text: string;
  x: number;
  y: number;
  rotate?: number;
  anchor?: "start" | "middle" | "end";
  size?: number;
};

type Sheet = {
  viewBox: string;
  boxes: Box[];
  labels: Label[];
  north: "left" | "up" | "down";
  roads?: { x: number; y: number; w: number; h: number; openBottom?: boolean }[];
  rose?: { x: number; y: number };
};

function row(
  ids: string[],
  y: number,
  opts: { x?: number; right?: number; w: number; h: number; gap?: number },
): Box[] {
  const gap = opts.gap ?? 4;
  const total = ids.length * opts.w + (ids.length - 1) * gap;
  const start = opts.right != null ? opts.right - total : (opts.x ?? 0);
  return ids.map((id, i) => ({
    id,
    x: start + i * (opts.w + gap),
    y,
    w: opts.w,
    h: opts.h,
    kind: "lot" as const,
  }));
}

function mark(id: string, label: string, x: number, y: number, w: number, h: number): Box {
  return { id, label, x, y, w, h, kind: "landmark" };
}

function lotBox(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  extra?: Pick<Box, "points" | "textDy">,
): Box {
  return { id, x, y, w, h, kind: "lot", ...extra };
}

/** Map 1 — landscape. North is left. Leon Circle is an L: along the north side of the inner lots, then west. */
function sheet1(): Sheet {
  const boxes: Box[] = [];
  const put = (
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    extra?: Pick<Box, "points" | "textDy">,
  ) => boxes.push(lotBox(id, x, y, w, h, extra));
  const right = 1180;
  const colX = 292;
  const colW = 168;
  const g = 3;
  const topY = 18;
  const topH = 90;
  const bigH = 116;
  const x = colX;
  const y = topY;
  const w = colW;
  const len = Math.hypot(w, bigH);
  const ox = (bigH / len) * 3;
  const oy = (-w / len) * 3;
  put("59", x + w * 0.4, y + 6, w * 0.56, bigH - 14, {
    points: `${x + ox},${y} ${x + w},${y} ${x + w},${y + bigH + oy}`,
  });
  const x60 = colX + colW + g;
  const topW = (right - x60 - 3 * g) / 4;
  ["60", "61", "62", "63"].forEach((id, i) => put(id, x60 + i * (topW + g), topY, topW, topH));
  put("47", x + 6, y + bigH * 0.38, w * 0.52, bigH * 0.58, {
    points: `${x},${y - oy} ${x + w - ox},${y + bigH} ${x},${y + bigH}`,
  });
  const stackH = 80;
  const y46 = topY + bigH + 8;
  put("46", colX, y46, colW, stackH);
  const y45 = y46 + stackH + g;
  put("45", colX, y45, colW, stackH);
  const gutter = 22;
  const innerX = x60 + gutter;
  const portraitW = 56;
  const innerRight = right - portraitW - g;
  const span4 = innerRight - innerX;
  const inW = (span4 - 3 * g) / 4;
  const yLow = y45 + stackH + g;
  const hLow = 86;
  const y51 = yLow - g - stackH;
  const y52 = y51 - g - stackH;
  ["52", "54", "56"].forEach((id, i) => put(id, innerX + i * (inW + g), y52, inW, stackH));
  ["51", "53", "55"].forEach((id, i) => put(id, innerX + i * (inW + g), y51, inW, stackH));
  const x58 = innerX + 3 * (inW + g);
  const side = 28;
  put("58", x58, y52, inW - side, stackH);
  put("57", x58, y51, inW - side, stackH);
  const xPortrait = x58 + (inW - side) + g;
  const widePortrait = right - xPortrait;
  const pairBottom = yLow + hLow;
  const pairH = (pairBottom - y52 - g) / 2;
  put("64", xPortrait, y52, widePortrait, pairH);
  put("65", xPortrait, y52 + pairH + g, widePortrait, pairH);
  put("42", 52, yLow, 124, hLow);
  put("43", 180, yLow, colX - g - 180, hLow);
  put("44", colX, yLow, colW, hLow);
  const dw = (span4 - 2 * g) / 3;
  ["48", "49"].forEach((id, i) => put(id, innerX + i * (dw + g), yLow, dw, hLow));
  const x50 = innerX + 2 * (dw + g);
  const right57 = x58 + (inW - side);
  put("50", x50, yLow, right57 - x50, hLow);
  const gridX = 52;
  const cols = 9;
  const cw = (right - gridX - (cols - 1) * g) / cols;
  const ch = 70;
  const y0 = yLow + hLow + 26;
  put("9", gridX, y0, cw, ch);
  const w17 = cw * 2 + g;
  const x17 = gridX + cw + g;
  put("17", x17, y0, w17, ch);
  ["21", "25", "29", "33", "37", "41"].forEach((id, i) => put(id, x17 + w17 + g + i * (cw + g), y0, cw, ch));
  const denise = [
    ["8", "12", "16", "20", "24", "28", "32", "36", "40"],
    ["7", "11", "15", "19", "23", "27", "31", "35", "39"],
    ["6", "10", "14", "18", "22", "26", "30", "34", "38"],
  ];
  denise.forEach((ids, r) => {
    ids.forEach((id, c) => put(id, gridX + c * (cw + g), y0 + (r + 1) * (ch + g), cw, ch));
  });
  const clubY = y0 + 4 * (ch + g) + 28;
  ["1", "2", "3", "4", "5"].forEach((id, i) => put(id, 52 + i * 168, clubY, 162, 94));
  const x38 = gridX + 8 * (cw + g);
  put("13", x38, clubY, cw, 94);
  const labels: Label[] = [
    { text: "DR. LOVE ROAD", x: 22, y: 520, rotate: -90, size: 13 },
    { text: "LEON CIRCLE", x: (innerX + right) / 2, y: (topY + topH + y52) / 2 + 4, size: 13 },
    { text: "LEON CIRCLE", x: x60 + gutter / 2, y: y52 + stackH, rotate: -90, size: 12 },
    { text: "DENISE AVE", x: (gridX + right) / 2, y: y0 - 8, size: 13 },
    { text: "JALEEN AVE", x: (gridX + right) / 2, y: clubY - 10, size: 13 },
  ];
  return { viewBox: `0 0 1240 ${clubY + 120}`, boxes, labels, north: "left" };
}

/** Map 2 — landscape. North is up, same as the sheet. */
function sheet2(): Sheet {
  const x = 78;
  const width = 1420;
  const gap = 4;
  const w8 = (width - 7 * gap) / 8;
  const w14 = (width - 13 * gap) / 14;
  const hTop = 125;
  const hMid = 203;
  const hBot = 125;
  const hPond = 150;
  const y1 = 22;
  const y2 = y1 + hTop + 42;
  const y3 = y2 + hMid + 10;
  const y4 = y3 + hMid + 36;
  const yPond = y4 + hBot + 21;
  const boxes: Box[] = [
    ...row(["130", "129", "128", "127", "126", "125", "124", "123"], y1, { x, w: w8, h: hTop, gap }),
    ...row(
      ["109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122"],
      y2,
      { x, w: w14, h: hMid, gap },
    ),
    ...row(
      ["108", "107", "106", "105", "104", "103", "102", "101", "100", "99", "98", "97", "96", "95"],
      y3,
      { x, w: w14, h: hMid, gap },
    ),
    ...row(["88", "89"], y4, { x, w: w8, h: hBot, gap }),
    mark("plant", "Treatment Plant", x + 2 * (w8 + gap), y4, w8, hBot),
    ...row(["90", "91", "92", "93", "94"], y4, { x: x + 3 * (w8 + gap), w: w8, h: hBot, gap }),
    mark("retain", "Retention Pond", x, yPond, (width - 2 * 16) / 3, hPond),
    mark("hold", "Holding Pond", x + (width - 2 * 16) / 3 + 16, yPond, (width - 2 * 16) / 3, hPond),
    mark("rv", "R.V. Lot", x + 2 * ((width - 2 * 16) / 3 + 16), yPond, (width - 2 * 16) / 3, hPond),
  ];
  const labels: Label[] = [
    { text: "JALEEN AVENUE", x: 22, y: (y1 + yPond + hPond) / 2, rotate: -90, size: 12 },
    { text: "LEON CIRCLE", x: x + width / 2, y: y1 + hTop + 26, size: 13 },
    { text: "DENISE AVE", x: x + width / 2, y: y3 + hMid + 24, size: 13 },
  ];
  return { viewBox: `0 0 1540 ${yPond + hPond + 22}`, boxes, labels, north: "left" };
}

/** Map 3 — portrait. North is up. Michelle Avenue runs between 85 and 66. */
function sheet3(): Sheet {
  const colW = 206;
  const colH = 78;
  const gap = 5;
  const wingW = 166;
  const wingGap = 6;
  const street = 44;
  const x87 = 28;
  const x86 = x87 + wingW + wingGap;
  const westX = x86 + wingW + wingGap;
  const eastX = westX + colW + street;
  const west = ["76", "77", "78", "79", "80", "81", "82", "83", "84"];
  const east = ["75", "74", "73", "72", "71", "70", "69", "68", "67"];
  const y0 = 44;
  const boxes: Box[] = [
    ...west.map((id, i) => lotBox(id, westX, y0 + i * (colH + gap), colW, colH)),
    ...east.map((id, i) => lotBox(id, eastX, y0 + i * (colH + gap), colW, colH)),
  ];
  const kirkY = y0 + 9 * (colH + gap);
  const kirkH = 98;
  const belowGap = 36;
  boxes.push(lotBox("87", x87, kirkY, wingW, kirkH));
  boxes.push(lotBox("130.5", x87, kirkY + kirkH + belowGap, wingW, kirkH));
  boxes.push(lotBox("86", x86, kirkY, wingW, kirkH));
  boxes.push(lotBox("85", westX, kirkY, colW, kirkH));
  boxes.push(lotBox("66", eastX, kirkY, colW, kirkH));
  const mid = westX + colW + street / 2;
  const loveX = (westX + eastX + colW) / 2;
  const kirkRoadY = kirkY + kirkH + 8;
  const labels: Label[] = [
    { text: "DR. LOVE ROAD", x: loveX, y: 20, size: 13 },
    { text: "MICHELLE AVENUE", x: mid, y: (y0 + kirkY + 40) / 2, rotate: -90, size: 12 },
    { text: "KIRKWOOD STREET", x: (x87 + eastX + colW) / 2, y: kirkRoadY + 19, size: 13 },
    { text: "MAGNOLIA HOMES ROAD", x: 16, y: 428, rotate: -90, size: 11 },
  ];
  const width = eastX + colW + 36;
  const bottom = kirkY + kirkH + belowGap + kirkH + 16;
  return {
    viewBox: `0 0 ${width} ${bottom}`,
    boxes,
    labels,
    north: "up",
  };
}

const SHEETS: Record<SheetId, Sheet> = { 1: sheet1(), 2: sheet2(), 3: sheet3() };

function mapNameLines(lot: Lot): string[] {
  if (!lot.name.trim()) {
    if (lot.status === "Empty") return ["Empty"];
    if (lot.status === "Open") return ["Open"];
    return [""];
  }
  const raw = displayName(lot).replace(/\s*\/\s*/g, "/");
  if (raw.includes("/") && !/house|office/i.test(raw)) {
    return raw.split("/").map((part) => part.trim()).filter(Boolean);
  }
  const comma = raw.indexOf(",");
  const head = (comma >= 0 ? raw.slice(0, comma) : raw).trim();
  return splitSurnames(head);
}

function splitSurnames(surname: string): string[] {
  const parts = surname.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return [surname];
  const particles = new Set(["de", "del", "la", "von", "van", "da", "di"]);
  const words: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (particles.has(parts[i].toLowerCase()) && i + 1 < parts.length) {
      words.push(`${parts[i]} ${parts[++i]}`);
    } else {
      words.push(parts[i]);
    }
  }
  if (words.length <= 1) return [surname];
  return [words[0], words.slice(1).join(" ")];
}

const HYPHEN_BREAKS: Record<string, [string, string]> = {
  mendenhall: ["Menden-", "hall"],
  vonkretchmann: ["VonKret-", "chmann"],
  offenhauer: ["Offen-", "hauer"],
};

function textWidth(text: string, size: number) {
  return text.length * size * 0.6;
}

function wrapLine(text: string, maxW: number, size: number): string[] {
  if (textWidth(text, size) <= maxW) return [text];
  const key = text.toLowerCase().replace(/[^a-z]/g, "");
  if (
    key === "allbritton" ||
    key === "polikoff" ||
    key === "jimenez" ||
    key === "soriano" ||
    key === "stuckey" ||
    key === "sembrat" ||
    key === "walther" ||
    key === "benitez"
  )
    return [text];
  const known = HYPHEN_BREAKS[key];
  if (known) return [...known];
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    let at = 1;
    let best = Infinity;
    for (let i = 1; i < words.length; i++) {
      const score = Math.abs(textWidth(words.slice(0, i).join(" "), size) - textWidth(words.slice(i).join(" "), size));
      if (score < best) {
        best = score;
        at = i;
      }
    }
    return [words.slice(0, at).join(" "), words.slice(at).join(" ")];
  }
  const mid = Math.ceil(text.length / 2);
  return [`${text.slice(0, mid)}-`, text.slice(mid)];
}

function North({ dir }: { dir: Sheet["north"] }) {
  if (dir === "left") {
    return (
      <g transform="translate(36 250)" aria-hidden="true">
        <text x="0" y="-16" textAnchor="middle" fontSize="14" fontWeight="700">
          N
        </text>
        <line x1="18" y1="0" x2="-2" y2="0" stroke="var(--color-ink)" strokeWidth="1.5" />
        <polygon points="-14,-5 -26,0 -14,5" fill="var(--color-ink)" />
      </g>
    );
  }
  if (dir === "up") {
    return (
      <g transform="translate(24 96)" aria-hidden="true">
        <text x="0" y="-6" textAnchor="middle" fontSize="14" fontWeight="700">
          N
        </text>
        <line x1="0" y1="8" x2="0" y2="28" stroke="var(--color-ink)" strokeWidth="1.5" />
        <polygon points="-5,10 0,-2 5,10" fill="var(--color-ink)" />
      </g>
    );
  }
  return (
    <g transform="translate(590 240)" aria-hidden="true">
      <circle cx="0" cy="0" r="26" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.25" />
      <text x="0" y="-34" textAnchor="middle" fontSize="12" fontWeight="650">
        S
      </text>
      <text x="-40" y="4" textAnchor="middle" fontSize="12" fontWeight="650">
        E
      </text>
      <text x="40" y="4" textAnchor="middle" fontSize="12" fontWeight="650">
        W
      </text>
      <text x="0" y="48" textAnchor="middle" fontSize="14" fontWeight="700">
        N
      </text>
      <polygon points="-4,10 0,24 4,10" fill="var(--color-ink)" />
    </g>
  );
}

export function PlatMap({
  sheet,
  query,
  filter,
  selected,
  lots,
  textScale = 1,
  symbols = false,
  heat,
  dropLot = "",
  stickyIds,
  onSelect,
  onCamera,
  onPlantCamera,
  onAlarm,
  alarmOn = false,
}: {
  sheet: SheetId;
  query: string;
  filter: LotFilter | readonly LotFilter[];
  selected: string | null;
  lots: Lot[];
  textScale?: number;
  symbols?: boolean;
  heat?: Record<string, { fill: string; ink: string; value: string }>;
  dropLot?: string;
  stickyIds?: ReadonlySet<string>;
  onSelect: (id: string) => void;
  onCamera?: () => void;
  onPlantCamera?: () => void;
  onAlarm?: () => void;
  alarmOn?: boolean;
}) {
  const spec = SHEETS[sheet];
  const [, , vbW, vbH] = spec.viewBox.split(/[ ,]/).map(Number);
  const byId = new Map(lots.map((item) => [item.id, item]));
  const picked = Array.isArray(filter) ? filter : filter === "all" ? [] : [filter];
  const filtering = query.trim().length > 0 || picked.length > 0;
  const extra = sheet === 2 ? 3.5 : 0;
  return (
    <svg
      className={sheet === 3 ? "map-svg portrait" : "map-svg landscape"}
      viewBox={spec.viewBox}
      style={{ aspectRatio: `${vbW} / ${vbH}` }}
      preserveAspectRatio={sheet === 1 ? "xMidYMin meet" : "xMidYMid meet"}
      role="img"
      aria-label={sheet === 3 ? "Michelle and Kirkwood site plan" : `Site plan sheet ${sheet}`}
    >
      <rect width="100%" height="100%" fill="var(--color-paper)" />
      {spec.rose ? <Rose x={spec.rose.x} y={spec.rose.y} /> : <North dir={spec.north} />}
      {spec.roads?.map((road, i) =>
        road.openBottom ? (
          <path
            key={`road-${i}`}
            className="road"
            fill="none"
            d={`M ${road.x} ${road.y + road.h} V ${road.y} H ${road.x + road.w} V ${road.y + road.h}`}
          />
        ) : (
          <rect key={`road-${i}`} className="road" x={road.x} y={road.y} width={road.w} height={road.h} />
        ),
      )}
      {spec.labels.map((label) => (
        <text
          key={label.text + label.x}
          className="street-label"
          x={label.x}
          y={label.y}
          textAnchor={label.anchor ?? "middle"}
          fontSize={(label.size ?? 13) + 4 + extra}
          transform={label.rotate ? `rotate(${label.rotate} ${label.x} ${label.y})` : undefined}
        >
          {label.text}
        </text>
      ))}
      {spec.boxes.map((box) => {
        if (box.kind === "landmark") {
          return (
            <g key={box.id} className={box.id === "plant" ? "landmark plant" : "landmark"}>
              <rect x={box.x} y={box.y} width={box.w} height={box.h} />
              {box.id === "plant" ? (
                <text x={box.x + box.w / 2} y={box.y + box.h / 2} textAnchor="middle" fontSize={23 * textScale + extra} fontWeight="650">
                  <tspan x={box.x + box.w / 2} dy="-0.55em">
                    TREATMENT
                  </tspan>
                  <tspan x={box.x + box.w / 2} dy="1.15em">
                    PLANT
                  </tspan>
                </text>
              ) : (box.label ?? "").split(" ").length > 3 ? (
                <text x={box.x + box.w / 2} y={box.y + box.h / 2} textAnchor="middle" fontSize="15" fontWeight="650">
                  <tspan x={box.x + box.w / 2} dy="-0.6em">
                    Magnolia Central
                  </tspan>
                  <tspan x={box.x + box.w / 2} dy="1.25em">
                    of Florida Estates
                  </tspan>
                </text>
              ) : (
                <text
                  x={box.x + box.w / 2}
                  y={box.y + box.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={((box.h > 100 ? 18 : 13) + 4 + extra) * textScale}
                  fontWeight="650"
                  letterSpacing="0.08em"
                >
                  {(box.label ?? "").toUpperCase()}
                </text>
              )}
            </g>
          );
        }
        const lot = byId.get(box.id);
        if (!lot) return null;
        const out = (picked.length > 0 && !picked.some((item) => matchesFilter(lot, item))) || (query.trim().length > 0 && !matches(lot, query));
        return (
          <LotBox
            key={box.id}
            box={box}
            lot={lot}
            dim={filtering && out}
            selected={selected === lot.id}
            onSelect={onSelect}
            textScale={textScale}
            sizeBoost={extra}
            symbols={symbols}
            heat={heat ? (heat[lot.id] ?? { fill: "#d5d0c8", ink: "#1c1916", value: "" }) : null}
            hot={dropLot === lot.id}
            marked={stickyIds?.has(lot.id) ?? false}
          />
        );
      })}
      {onCamera && sheet === 1
        ? spec.boxes
            .filter((box) => box.id === "1")
            .map((box) => (
              <g key="office-camera" transform={`translate(${box.x + 20} ${box.y})`}>
                <path
                  className="camera-cone"
                  d="M -64 0 A 64 64 0 0 1 64 0 Z"
                  pointerEvents="none"
                >
                  <title>180° view from north through east to south</title>
                </path>
                <g
                  className="map-camera"
                  role="button"
                  tabIndex={0}
                  aria-label="Office camera, paste Blue Iris link"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCamera();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onCamera();
                    }
                  }}
                >
                  <title>Office camera · Blue Iris link</title>
                  <rect className="camera-hit" x={-22} y={-22} width={44} height={48} />
                  <rect x={-16} y={-12} width={32} height={16} rx={4} />
                  <rect x={-7} y={2} width={14} height={12} rx={2} fill="none" stroke="#fff" strokeWidth={1.6} />
                  <circle cx={0} cy={8} r={2.4} fill="none" stroke="#fff" strokeWidth={1.4} />
                  <path d="M -4 14 L 4 14 L 0 20 Z" fill="#fff" />
                </g>
              </g>
            ))
        : null}
      {sheet === 2
        ? spec.boxes
            .filter((box) => box.id === "plant")
            .map((box) => (
              <g key="plant-devices">
                {onPlantCamera ? (
                  <g transform={`translate(${box.x + box.w / 2} ${box.y})`}>
                    <path className="camera-cone" d="M -64 0 A 64 64 0 0 1 64 0 Z" pointerEvents="none">
                      <title>180° view facing down</title>
                    </path>
                    <g
                      className="map-camera"
                      role="button"
                      tabIndex={0}
                      aria-label="Treatment plant camera"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlantCamera();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onPlantCamera();
                        }
                      }}
                    >
                      <title>Treatment plant camera</title>
                      <rect className="camera-hit" x={-22} y={-12} width={44} height={40} />
                      <rect x={-16} y={-14} width={32} height={16} rx={4} />
                      <rect x={-7} y={2} width={14} height={12} rx={2} fill="none" stroke="#fff" strokeWidth={1.6} />
                      <circle cx={0} cy={8} r={2.4} fill="none" stroke="#fff" strokeWidth={1.4} />
                      <path d="M -4 14 L 4 14 L 0 20 Z" fill="#fff" />
                    </g>
                  </g>
                ) : null}
                {onAlarm ? (
                  <g
                    className={alarmOn ? "alarm-light on" : "alarm-light"}
                    role="button"
                    tabIndex={0}
                    aria-label="Treatment plant alarm"
                    transform={`translate(${box.x + box.w - 16} ${box.y + box.h - 16})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlarm();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onAlarm();
                      }
                    }}
                  >
                    <title>Alarm Connect</title>
                    <ellipse className="alarm-hit" cx="0" cy="-14" rx="16" ry="28" />
                    <g className="alarm-mark" pointerEvents="none" transform="translate(0 5) scale(1 2) translate(0 -5)">
                      <path d="M 0 -15 V -11 M -10 -10 L -7 -7 M 10 -10 L 7 -7" />
                      <path d="M -9 1 A 9 9 0 0 1 9 1 Z" />
                      <rect x="-11" y="1" width="22" height="4" rx="1" />
                    </g>
                  </g>
                ) : null}
              </g>
            ))
        : null}
    </svg>
  );
}

function Rose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r="22" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="1.25" />
      <text y="-30" textAnchor="middle" fontSize="13" fontWeight="700">
        N
      </text>
      <polygon points="-4,-8 0,-22 4,-8" fill="var(--color-ink)" />
      <text y="38" textAnchor="middle" fontSize="11" fontWeight="650">
        S
      </text>
      <text x="-34" y="4" textAnchor="middle" fontSize="11" fontWeight="650">
        W
      </text>
      <text x="34" y="4" textAnchor="middle" fontSize="11" fontWeight="650">
        E
      </text>
    </g>
  );
}

function petCount(value?: string) {
  return value === "1" ? 1 : value === "2" ? 2 : 0;
}

function DogMark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill="#1c1916">
      <ellipse cx="3.6" cy="8.4" rx="2.5" ry="4.4" />
      <ellipse cx="12.4" cy="8.4" rx="2.5" ry="4.4" />
      <circle cx="8" cy="8.8" r="4.8" />
      <ellipse cx="8" cy="12.4" rx="2.3" ry="1.7" />
    </g>
  );
}

function CatMark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill="#1c1916">
      <path d="M2.6 8.6 L4.8 1.4 L7.6 7.2 Z" />
      <path d="M8.4 7.2 L11.2 1.4 L13.4 8.6 Z" />
      <circle cx="8" cy="10" r="5" />
    </g>
  );
}

function SprayMark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16}) translate(16 0) scale(-1 1)`} fill="#0b4db5" stroke="#0b4db5" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
      <path d="M0.6 6.4 H4.8 L5.8 4.8 H7.6 L9.4 6.6 V9.4 L7.6 11.2 H5.8 L4.8 9.6 H0.6 Z" />
      <path d="M10 8 H15.6" fill="none" />
      <path d="M10 7.2 L14.8 2.6" fill="none" />
      <path d="M10 8.8 L14.8 13.4" fill="none" />
    </g>
  );
}

function KeyMark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill="none" stroke="#000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
      <circle cx="4.6" cy="6.2" r="3.1" />
      <path d="M7.6 6.2 H15.2 M12.1 6.2 V10 M14.4 6.2 V9" />
    </g>
  );
}
function PersonMark({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  const warn = fill !== "#1c1916";
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill={fill} stroke={warn ? "#fff" : "none"} strokeWidth={warn ? 1.15 : 0} pointerEvents="none">
      <circle cx="8" cy="4.1" r="3.05" />
      <path d="M1.8 15.4 C2.4 9.8 4.6 8.2 8 8.2 C11.4 8.2 13.6 9.8 14.2 15.4 Z" />
    </g>
  );
}

function BoltMark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill="#1c1916">
      <path d="M9.2 0.8 L3.8 9.2 H7.4 L5.6 15.2 L13.2 6.4 H9.2 L11 0.8 Z" />
    </g>
  );
}

function BanMark({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const stroke = Math.max(1.6, r * 0.22);
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={r} fill="#f6f3ec" fillOpacity={0.35} stroke="#000" strokeWidth={stroke} />
      <line
        x1={cx - r * 0.62}
        y1={cy - r * 0.62}
        x2={cx + r * 0.62}
        y2={cy + r * 0.62}
        stroke="#000"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </g>
  );
}

function PetMarks({ box, size, dogs, cats }: { box: Box; size: number; dogs?: string; cats?: string }) {
  const kinds = [...Array(petCount(dogs)).fill("dog"), ...Array(petCount(cats)).fill("cat")] as Array<"dog" | "cat">;
  if (kinds.length === 0 || size < 6) return null;
  const gap = 1.5;
  let x = box.x + box.w - 3 - kinds.length * size - (kinds.length - 1) * gap;
  const y = box.y + box.h - 2 - size;
  return (
    <g pointerEvents="none">
      {kinds.map((kind, i) => {
        const mark = kind === "dog" ? <DogMark key={i} x={x} y={y} s={size} /> : <CatMark key={i} x={x} y={y} s={size} />;
        x += size + gap;
        return mark;
      })}
    </g>
  );
}

const LotBox = memo(function LotBox({
  box,
  lot,
  dim,
  selected,
  onSelect,
  textScale,
  sizeBoost = 0,
  symbols = false,
  heat = null,
  hot = false,
  marked = false,
}: {
  box: Box;
  lot: Lot;
  dim: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  textScale: number;
  sizeBoost?: number;
  symbols?: boolean;
  heat?: { fill: string; ink: string; value: string } | null;
  hot?: boolean;
  marked?: boolean;
}) {
  const shown = displayName(lot);
  const names =
    lot.id === "7"
      ? ["Mena Sosa"]
      : lot.id === "67"
        ? ["Costales Torres"]
        : lot.id === "68"
          ? ["Rojas Gill"]
          : mapNameLines(lot).filter((text) => text.length > 0);
  const plain = names[0] === "Empty" || names[0] === "Open";
  const address = lot.address || "—";
  const padX = 4;
  const padY = 3;
  const innerW = Math.max(12, box.w - padX * 2);
  const innerH = Math.max(12, box.h - padY * 2);
  const n = Number(lot.lot);
  const nameUp = new Set([9, 17, 21, 25, 29, 33, 37, 41, 8, 12, 16, 20, 24, 28, 32, 36, 40, 7, 11, 15, 19, 23, 27, 31, 35, 39, 6, 10, 14, 18, 22, 26, 30, 34, 38]).has(n);
  const bump = (lot.id === "96" ? 1 : 0) + (n >= 9 && n <= 38 ? 1 : 0);
  const bodySize = 20 * textScale + sizeBoost;
  const sameAs60 = lot.id === "47" || lot.id === "59";
  const keepWhole = sameAs60 || lot.id === "67" || lot.id === "68" || lot.id === "65";
  const fsLot = (sameAs60 ? 17 * textScale + sizeBoost : Math.min(17 * textScale + sizeBoost, innerH * 0.36)) + bump;
  const texts = [address, ...names].flatMap((text) =>
    keepWhole ? [text] : wrapLine(text, innerW, sizeBoost > 0 ? bodySize - 1.5 : bodySize),
  );
  const gap = 2;
  let addressGap = bodySize * 0.55;
  const stack = texts.length * bodySize + (texts.length > 1 ? addressGap : 0) + gap * Math.max(0, texts.length - 2);
  const room = Math.max(8, innerH - fsLot - 4);
  const fitted =
    sameAs60 || stack <= room
      ? bodySize
      : (room - (texts.length > 1 ? addressGap : 0) - gap * Math.max(0, texts.length - 2)) / texts.length;
  const lines = texts.map((text, index) => {
    const widthFit = innerW / Math.max(1, text.length * 0.6);
    return {
      text,
      size: (sameAs60 ? bodySize : Math.min(fitted, widthFit)) + bump + (nameUp && index > 0 ? 2 : 0),
      weight: plain && text !== address ? 500 : 700,
    };
  });
  if (lot.id === "65") {
    for (let i = 1; i < lines.length; i++) lines[i].size += 1;
  }
  if (lot.id === "124" && lines.length > 0) {
    const drop = sizeBoost > 0 ? bodySize * 0.9 : 0;
    const blockHeight = (sizes: number[], afterAddress: number) => {
      let y = padY + fsLot + sizes[0] * 0.82 + drop;
      for (let i = 1; i < sizes.length; i++) y += sizes[i] + (i === 1 ? afterAddress : gap);
      return y;
    };
    const limit = box.h - 5;
    const used = blockHeight(
      lines.map((line) => line.size),
      addressGap,
    );
    if (used > limit) {
      const scale = limit / used;
      for (const line of lines) line.size *= scale;
      addressGap *= scale;
    }
  }
  const dy = box.textDy ?? 0;
  const halfSpace = bodySize * 0.3;
  const textDx = lot.id === "59" ? 12 : lot.id === "47" ? -10 + halfSpace : 0;
  const textDyExtra = lot.id === "59" ? -28 + halfSpace : 0;
  const lotNo = n;
  const middleDrop = sizeBoost > 0 && lotNo >= 95 && lotNo <= 122 ? bodySize * 0.9 : 0;
  const bottomLift = sizeBoost > 0 && lotNo >= 88 && lotNo <= 94 ? bodySize * 0.9 : 0;
  const drop64 = lot.id === "64" || lot.id === "65" ? bodySize * 0.9 : 0;
  let baseline = box.y + padY + fsLot + dy + lines[0].size * 0.82 + textDyExtra + (sizeBoost > 0 ? bodySize * 0.9 : 0) + middleDrop - bottomLift + drop64;
  const cx = box.x + box.w / 2 + textDx;
  const lotNumX =
    box.x +
    5 +
    (lot.id === "47" ? -16 + textWidth("47", fsLot) : 0) +
    (lot.id === "59" ? -textWidth("5", fsLot) : 0);
  const lotNumY = box.y + fsLot + 3 + dy + (lot.id === "47" ? -22 + halfSpace : 0);
  const maint = lot.maintenance?.trim() ?? "";
  const isLeak = /^leak$/i.test(maint);
  const needsRoof = lot.roofReplace === "Yes";
  const cls = [
    "lot",
    heat ? "heat" : "",
    !heat && lot.status === "Occupied" ? "occupied" : "",
    !heat && lot.status === "Empty" ? "empty" : "",
    !heat && lot.status === "Open" ? "open" : "",
    !heat && lot.status === "Eviction" ? "eviction" : "",
    !heat && lot.issues ? "notes" : "",
    !heat && lot.lateRent?.trim() ? "late" : "",
    !heat && maint && !isLeak ? "maint" : "",
    !heat && isLeak ? "leak" : "",
    !heat && needsRoof ? "roof" : "",
    dim ? "dim" : "",
    selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const note = Math.max(8, Math.min(16, Math.min(box.w, box.h) * 0.28));
  const showFlag = symbols && !heat && (lot.noMow === "Yes" || lot.noMow === "Owe" || lot.noMow === "NO-OWE" || lot.noMow === "Owe-Mow" || lot.noMow === "Unmowed");
  const flagSize = Math.max(18, Math.min(30, Math.min(box.w, box.h) * 0.375));
  let noteX = box.x + box.w - note - 2;
  let noteY = box.y + 2;
  if (showFlag) {
    const owe = lot.noMow === "Owe" || lot.noMow === "NO-OWE" || lot.noMow === "Owe-Mow";
    const r = flagSize * 0.72;
    const flagCx = (4.4 + flagSize) / 3;
    const flagCy = (1 + flagSize * 1.06) / 3;
    const flagX = owe ? box.x + box.w - r - 3 - flagCx : box.x + box.w - flagSize - 3;
    const flagY = owe ? box.y + r + 2 - flagCy - flagSize * 0.14 : box.y + 2;
    noteX = flagX + flagSize - note;
    noteY = flagY + flagSize + 2;
  }
  return (
    <g
      className={cls + (hot ? " is-drop" : "")}
      data-lot-id={lot.id}
      style={heat ? ({ "--heat-fill": heat.fill, "--heat-ink": heat.ink } as CSSProperties) : undefined}
      role="button"
      tabIndex={0}
      aria-label={`Lot ${lot.lot}, ${lot.address} ${lot.street}, ${shown}`}
      aria-pressed={selected}
      onClick={() => onSelect(lot.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(lot.id);
        }
      }}
    >
      <title>{`Lot ${lot.lot} · ${lot.address} ${lot.street} · ${shown}`}</title>
      {box.points ? (
        <polygon points={box.points} pointerEvents="fill" data-lot-id={lot.id} />
      ) : (
        <rect x={box.x} y={box.y} width={box.w} height={box.h} pointerEvents="fill" data-lot-id={lot.id} />
      )}
      {marked ? (
        <rect data-lot-id={lot.id} x={noteX} y={noteY} width={note} height={note} rx={1} fill="#ffe56a" stroke="#1c1916" strokeWidth={1} transform={`rotate(-8 ${noteX + note / 2} ${noteY + note / 2})`} />
      ) : null}
      {symbols && !heat && (lot.noMow === "Yes" || lot.noMow === "Owe" || lot.noMow === "NO-OWE" || lot.noMow === "Owe-Mow" || lot.noMow === "Unmowed") ? (
        <g pointerEvents="none">
          {(() => {
            const s = Math.max(18, Math.min(30, Math.min(box.w, box.h) * 0.375));
            const owe = lot.noMow === "Owe" || lot.noMow === "NO-OWE" || lot.noMow === "Owe-Mow";
            const unmowed = lot.noMow === "Unmowed";
            const r = s * 0.72;
            const cx = box.x + box.w - r - 3;
            const cy = box.y + r + 2;
            const flagCx = (4.4 + s) / 3;
            const flagCy = (1 + s * 1.06) / 3;
            const x = owe ? cx - flagCx : box.x + box.w - s - 3;
            const y = owe ? cy - flagCy - s * 0.14 : box.y + 2;
            const pole = unmowed ? "#9f1d16" : "#148a38";
            const cloth = unmowed ? "#d32f2f" : "#1f9d45";
            return (
              <>
                <line x1={x + 1.4} y1={y} x2={x + 1.4} y2={y + s} stroke={pole} strokeWidth={1.5} />
                <path
                  d={`M ${x + 2.2} ${y + 1} L ${x + s} ${y + s * 0.36} L ${x + 2.2} ${y + s * 0.7} Z`}
                  fill={cloth}
                  fillOpacity={1}
                  stroke={pole}
                  strokeWidth={1.2}
                />
                {owe ? (
                  <>
                    <circle cx={cx} cy={cy} r={r} fill="#f6f3ec" fillOpacity={0.35} stroke="#000" strokeWidth={2} />
                    <line
                      x1={cx - r * 0.62}
                      y1={cy - r * 0.62}
                      x2={cx + r * 0.62}
                      y2={cy + r * 0.62}
                      stroke="#000"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </>
                ) : null}
              </>
            );
          })()}
        </g>
      ) : null}
      <text x={lotNumX} y={lotNumY} fontSize={fsLot} fontWeight="800" pointerEvents="none" style={heat ? { fill: heat.ink } : undefined}>
        {lot.lot}
      </text>
      {heat ? (
        <text
          x={box.x + box.w / 2}
          y={box.y + box.h / 2 + fsLot * 0.15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.max(12, Math.min(box.h * 0.24, 18))}
          fontWeight="700"
          pointerEvents="none"
          style={{ fill: heat.ink }}
        >
          {heat.value}
        </text>
      ) : (
      <>
      <clipPath id={`clip-${lot.id}`}>
        {box.points ? (
          <polygon points={box.points} />
        ) : (
          <rect x={box.x + 3} y={box.y + fsLot + 2} width={box.w - 6} height={box.h - fsLot - 6} />
        )}
      </clipPath>
      <g clipPath={sameAs60 ? undefined : `url(#clip-${lot.id})`} pointerEvents="none">
        <text x={cx} y={baseline} textAnchor="middle" fontSize={lines[0].size} fontWeight={lines[0].weight}>
          {lines[0].text}
        </text>
        {lines.slice(1).map((line, i) => {
          baseline += line.size + (i === 0 ? addressGap : gap) - (lot.id === "124" && i === 0 ? line.size * 0.5 : 0);
          return (
            <text
              key={`${lot.id}-${line.text}-${baseline}`}
              x={cx + (lot.id === "47" ? halfSpace : 0)}
              y={baseline - (nameUp || lot.id === "1" ? halfSpace * 2 : 0) - (lot.id === "59" || lot.id === "47" ? bodySize * 0.5 : 0)}
              textAnchor="middle"
              fontSize={line.size}
              fontWeight={line.weight}
            >
              {line.text}
            </text>
          );
        })}
      </g>
      </>
      )}
      {symbols && !heat && /^(yes|y)$/i.test(lot.key?.trim() ?? "") ? (
        <KeyMark
          x={box.x + 3}
          y={
            lot.wiring === "Yes" || lot.wiring === "No"
              ? box.y + box.h - 3 - Math.min(fsLot * 0.85, box.h * 0.34) * 2
              : box.y + box.h - 2 - Math.min(fsLot * 0.85, box.h * 0.34)
          }
          s={Math.min(fsLot * 0.85, box.h * 0.34)}
        />
      ) : null}
      {symbols && !heat && lot.pressureWash === "Needs" ? (
        <SprayMark
          x={box.x + box.w - 3 - Math.min(fsLot * 0.85, box.h * 0.34)}
          y={
            /^(yes|y)$/i.test(lot.key?.trim() ?? "")
              ? Math.max(box.y + 2, box.y + box.h - 3 - Math.min(fsLot * 0.85, box.h * 0.34) * 2.55)
              : box.y + box.h - 3 - Math.min(fsLot * 0.85, box.h * 0.34) * 1.15
          }
          s={Math.min(fsLot * 0.85, box.h * 0.34)}
        />
      ) : null}
      {symbols && !heat && (lot.wiring === "Yes" || lot.wiring === "No") ? (
        <g pointerEvents="none">
          {(() => {
            const s = Math.min(fsLot * 0.85, box.h * 0.34);
            const x = box.x + 3;
            const y = box.y + box.h - 2 - s;
            return (
              <>
                <BoltMark x={x} y={y} s={s} />
                {lot.wiring === "No" ? <BanMark cx={x + s * 0.52} cy={y + s * 0.5} r={s * 0.62} /> : null}
              </>
            );
          })()}
        </g>
      ) : null}
      {symbols && !heat && (/^[1-5]$/.test(lot.guest?.trim() ?? "") || /^(yes|y)$/i.test(lot.guest?.trim() ?? "")) ? (
        <PersonMark
          x={box.x + (box.w - Math.min(fsLot * 1.05, box.h * 0.42)) / 2}
          y={box.y + box.h - Math.min(fsLot * 1.05, box.h * 0.42)}
          s={Math.min(fsLot * 1.05, box.h * 0.42)}
          fill={(lot.guests ?? []).length > 0 && (lot.guests ?? []).every((guest) => guest.name.trim()) ? "#1c1916" : "#ff5a00"}
        />
      ) : null}
      {symbols && !heat ? <PetMarks box={box} size={Math.min(fsLot * 0.85, box.h * 0.34)} dogs={lot.dogs} cats={lot.cats} /> : null}
    </g>
  );
});

export const SHEET_COPY: Record<SheetId, { title: string; note: string }> = {
  1: {
    title: "Jaleen/Denise",
    note: "Landscape. North points left, along Dr. Love Road — same direction as the original sheet.",
  },
  2: {
    title: "Denise/Leon",
    note: "",
  },
  3: {
    title: "Michelle/Kirkwood",
    note: "Portrait. Flipped so north points up, toward Dr. Love Road.",
  },
};
