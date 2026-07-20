"use client";

import { useState, useTransition } from "react";
import { setToothCondition, clearToothCondition } from "@/lib/actions/odontogram";
import { TOOTH_CONDITIONS } from "@/lib/tooth-conditions";

type Surface = "WHOLE" | "MESIAL" | "DISTAL" | "OCCLUSAL" | "BUCCAL" | "LINGUAL";
type Entry = { toothNumber: number; surface: string; condition: string };

const PERMANENT_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const PERMANENT_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
const PRIMARY_UPPER = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
const PRIMARY_LOWER = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

const RING_SURFACES: { key: Surface; label: string; start: number; end: number }[] = [
  { key: "BUCCAL", label: "B", start: -45, end: 45 },
  { key: "DISTAL", label: "D", start: 45, end: 135 },
  { key: "LINGUAL", label: "L", start: 135, end: 225 },
  { key: "MESIAL", label: "M", start: 225, end: 315 },
];

const RING_CENTER = 18;
const RING_OUTER = 16;
const RING_INNER = 7;

function colorFor(condition?: string) {
  return TOOTH_CONDITIONS.find((c) => c.code === condition)?.color;
}

/** SVG path for one annular "slice" of the tooth ring (a quadrant with a hole in the middle). */
function sectorPath(startDeg: number, endDeg: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const point = (r: number, deg: number): [number, number] => [
    RING_CENTER + r * Math.sin(toRad(deg)),
    RING_CENTER - r * Math.cos(toRad(deg)),
  ];
  const [x1, y1] = point(RING_OUTER, startDeg);
  const [x2, y2] = point(RING_OUTER, endDeg);
  const [x3, y3] = point(RING_INNER, endDeg);
  const [x4, y4] = point(RING_INNER, startDeg);
  return `M ${x1} ${y1} A ${RING_OUTER} ${RING_OUTER} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${RING_INNER} ${RING_INNER} 0 0 0 ${x4} ${y4} Z`;
}

function Tooth({
  patientId,
  toothNumber,
  entries,
}: {
  patientId: string;
  toothNumber: number;
  entries: Entry[];
}) {
  const [open, setOpen] = useState<Surface | null>(null);
  const [, startTransition] = useTransition();

  const bySurface = (s: Surface) => entries.find((e) => e.toothNumber === toothNumber && e.surface === s);

  function pick(surface: Surface, code: string | null) {
    setOpen(null);
    startTransition(async () => {
      if (code === null) {
        await clearToothCondition(patientId, toothNumber, surface);
      } else {
        await setToothCondition(patientId, toothNumber, surface, code as never);
      }
    });
  }

  const occlusal = bySurface("OCCLUSAL");
  const occlusalColor = colorFor(occlusal?.condition);

  return (
    <div className="relative flex flex-col items-center">
      <span className="text-[10px] text-gray-500">{toothNumber}</span>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        className="cursor-pointer overflow-visible"
      >
        {RING_SURFACES.map((s) => {
          const entry = bySurface(s.key);
          const color = colorFor(entry?.condition);
          return (
            <path
              key={s.key}
              d={sectorPath(s.start, s.end)}
              fill={color ?? "#ffffff"}
              stroke="#94a3b8"
              strokeWidth={1}
              className="hover:opacity-70"
              onClick={() => setOpen(open === s.key ? null : s.key)}
            >
              <title>{`${s.label}: ${entry?.condition ?? "unmarked"}`}</title>
            </path>
          );
        })}
        <circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={RING_INNER}
          fill={occlusalColor ?? "#ffffff"}
          stroke="#94a3b8"
          strokeWidth={1}
          className="cursor-pointer hover:opacity-70"
          onClick={() => setOpen(open === "OCCLUSAL" ? null : "OCCLUSAL")}
        >
          <title>{`O: ${occlusal?.condition ?? "unmarked"}`}</title>
        </circle>
      </svg>

      {open && (
        <div className="absolute top-full z-10 mt-1 w-48 rounded-md border bg-white p-2 shadow-lg">
          <p className="mb-1 text-[10px] font-medium text-gray-500">
            Tooth {toothNumber} — {open}
          </p>
          <div className="max-h-48 overflow-y-auto">
            {TOOTH_CONDITIONS.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => pick(open, c.code)}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => pick(open, null)}
              className="mt-1 w-full rounded px-2 py-1 text-left text-xs text-gray-400 hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToothRow({
  patientId,
  numbers,
  entries,
}: {
  patientId: string;
  numbers: number[];
  entries: Entry[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {numbers.map((n) => (
        <Tooth key={n} patientId={patientId} toothNumber={n} entries={entries} />
      ))}
    </div>
  );
}

export function Odontogram({ patientId, entries }: { patientId: string; entries: Entry[] }) {
  return (
    <div className="mt-3 space-y-6 rounded-lg border bg-white p-6">
      <div className="flex flex-wrap gap-3 border-b pb-4 text-[11px] text-gray-600">
        {TOOTH_CONDITIONS.map((c) => (
          <span key={c.code} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">PERMANENT TEETH</p>
        <ToothRow patientId={patientId} numbers={PERMANENT_UPPER} entries={entries} />
        <div className="my-3 border-t" />
        <ToothRow patientId={patientId} numbers={PERMANENT_LOWER} entries={entries} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">TEMPORARY (PRIMARY) TEETH</p>
        <ToothRow patientId={patientId} numbers={PRIMARY_UPPER} entries={entries} />
        <div className="my-3 border-t" />
        <ToothRow patientId={patientId} numbers={PRIMARY_LOWER} entries={entries} />
      </div>
    </div>
  );
}
