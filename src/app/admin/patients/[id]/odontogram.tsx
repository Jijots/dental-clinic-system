"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
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

function colorFor(condition?: string) {
  return TOOTH_CONDITIONS.find((c) => c.code === condition)?.color;
}

/** SVG path for one annular "slice" of a ring (a quadrant with a hole in the middle). */
function sectorPath(
  center: number,
  outer: number,
  inner: number,
  startDeg: number,
  endDeg: number
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const point = (r: number, deg: number): [number, number] => [
    center + r * Math.sin(toRad(deg)),
    center - r * Math.cos(toRad(deg)),
  ];
  const [x1, y1] = point(outer, startDeg);
  const [x2, y2] = point(outer, endDeg);
  const [x3, y3] = point(inner, endDeg);
  const [x4, y4] = point(inner, startDeg);
  return `M ${x1} ${y1} A ${outer} ${outer} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 0 0 ${x4} ${y4} Z`;
}

/** The tooth ring itself: 4 arc segments (Buccal/Distal/Lingual/Mesial) + an Occlusal center circle. */
function ToothRing({
  size,
  bySurface,
  onSegmentClick,
  activeSurface,
}: {
  size: number;
  bySurface: (s: Surface) => Entry | undefined;
  onSegmentClick?: (s: Surface) => void;
  activeSurface?: Surface | null;
}) {
  const center = size / 2;
  const outer = size * 0.44;
  const inner = size * 0.2;
  const stroke = size < 60 ? 1 : 2;
  const occlusal = bySurface("OCCLUSAL");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={onSegmentClick ? "overflow-visible" : "pointer-events-none overflow-visible"}
    >
      {RING_SURFACES.map((s) => {
        const entry = bySurface(s.key);
        const color = colorFor(entry?.condition);
        return (
          <path
            key={s.key}
            d={sectorPath(center, outer, inner, s.start, s.end)}
            fill={color ?? "#ffffff"}
            stroke={activeSurface === s.key ? "#5b3fb8" : "#94a3b8"}
            strokeWidth={activeSurface === s.key ? stroke * 2 : stroke}
            className={onSegmentClick ? "cursor-pointer hover:opacity-70" : undefined}
            onClick={onSegmentClick ? () => onSegmentClick(s.key) : undefined}
          >
            <title>{`${s.label}: ${entry?.condition ?? "unmarked"}`}</title>
          </path>
        );
      })}
      <circle
        cx={center}
        cy={center}
        r={inner}
        fill={colorFor(occlusal?.condition) ?? "#ffffff"}
        stroke={activeSurface === "OCCLUSAL" ? "#5b3fb8" : "#94a3b8"}
        strokeWidth={activeSurface === "OCCLUSAL" ? stroke * 2 : stroke}
        className={onSegmentClick ? "cursor-pointer hover:opacity-70" : undefined}
        onClick={onSegmentClick ? () => onSegmentClick("OCCLUSAL") : undefined}
      >
        <title>{`O: ${occlusal?.condition ?? "unmarked"}`}</title>
      </circle>
    </svg>
  );
}

function ZoomModal({
  patientId,
  toothNumber,
  entries,
  onClose,
}: {
  patientId: string;
  toothNumber: number;
  entries: Entry[];
  onClose: () => void;
}) {
  const [activeSurface, setActiveSurface] = useState<Surface | null>(null);
  const [, startTransition] = useTransition();

  const bySurface = (s: Surface) => entries.find((e) => e.toothNumber === toothNumber && e.surface === s);

  function pick(surface: Surface, code: string | null) {
    startTransition(async () => {
      if (code === null) {
        await clearToothCondition(patientId, toothNumber, surface);
      } else {
        await setToothCondition(patientId, toothNumber, surface, code as never);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">Tooth {toothNumber}</p>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <ToothRing
            size={200}
            bySurface={bySurface}
            onSegmentClick={(s) => setActiveSurface(activeSurface === s ? null : s)}
            activeSurface={activeSurface}
          />
        </div>
        <p className="mt-2 text-center text-xs text-gray-500">
          Click a surface above to assign its condition.
        </p>

        {activeSurface && (
          <div className="mt-4 rounded-lg border bg-gray-50 p-3">
            <p className="mb-2 text-xs font-medium text-gray-500">
              {activeSurface} — pick a condition
            </p>
            <div className="grid max-h-56 grid-cols-2 gap-1 overflow-y-auto">
              {TOOTH_CONDITIONS.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => pick(activeSurface, c.code)}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-white"
                >
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => pick(activeSurface, null)}
              className="mt-2 w-full rounded px-2 py-1.5 text-left text-xs text-gray-400 hover:bg-white"
            >
              Clear this surface
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Tooth({ toothNumber, entries, onZoom }: { toothNumber: number; entries: Entry[]; onZoom: () => void }) {
  const bySurface = (s: Surface) => entries.find((e) => e.toothNumber === toothNumber && e.surface === s);

  return (
    <button
      type="button"
      onClick={onZoom}
      className="flex flex-col items-center gap-0.5 rounded p-0.5 hover:bg-gray-100"
      title={`Tooth ${toothNumber} — click to zoom in and assign conditions`}
    >
      <span className="text-[10px] text-gray-500">{toothNumber}</span>
      <ToothRing size={36} bySurface={bySurface} />
    </button>
  );
}

function ToothRow({ numbers, entries, onZoom }: { numbers: number[]; entries: Entry[]; onZoom: (n: number) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {numbers.map((n) => (
        <Tooth key={n} toothNumber={n} entries={entries} onZoom={() => onZoom(n)} />
      ))}
    </div>
  );
}

export function Odontogram({ patientId, entries }: { patientId: string; entries: Entry[] }) {
  const [zoomedTooth, setZoomedTooth] = useState<number | null>(null);

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
        <ToothRow numbers={PERMANENT_UPPER} entries={entries} onZoom={setZoomedTooth} />
        <div className="my-3 border-t" />
        <ToothRow numbers={PERMANENT_LOWER} entries={entries} onZoom={setZoomedTooth} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">TEMPORARY (PRIMARY) TEETH</p>
        <ToothRow numbers={PRIMARY_UPPER} entries={entries} onZoom={setZoomedTooth} />
        <div className="my-3 border-t" />
        <ToothRow numbers={PRIMARY_LOWER} entries={entries} onZoom={setZoomedTooth} />
      </div>

      {zoomedTooth !== null && (
        <ZoomModal
          patientId={patientId}
          toothNumber={zoomedTooth}
          entries={entries}
          onClose={() => setZoomedTooth(null)}
        />
      )}
    </div>
  );
}
