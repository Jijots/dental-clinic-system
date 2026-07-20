"use client";

import { useState } from "react";
import { addTreatmentRecord } from "@/lib/actions/treatments";

export function AddTreatmentForm({
  patientId,
  branchId,
  dentists,
  hmoProviders,
}: {
  patientId: string;
  branchId: string;
  dentists: { id: string; name: string }[];
  hmoProviders: { id: string; name: string }[];
}) {
  const [hmoCovered, setHmoCovered] = useState(false);

  return (
    <form
      action={addTreatmentRecord}
      className="mt-3 space-y-3 rounded-lg border bg-white p-4"
    >
      <input type="hidden" name="patientId" value={patientId} />
      <input type="hidden" name="branchId" value={branchId} />

      <div className="grid gap-3 sm:grid-cols-4">
        <select name="dentistId" required className="rounded-md border px-3 py-2 text-sm">
          <option value="">Dentist</option>
          {dentists.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <input type="date" name="date" required className="rounded-md border px-3 py-2 text-sm" />
        <input
          name="toothNumbers"
          placeholder="Tooth # (e.g. #12, #11)"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          name="fee"
          type="number"
          step="0.01"
          placeholder="Fee"
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <input
        name="procedure"
        placeholder="Procedure"
        required
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input name="diagnosis" placeholder="Diagnosis" className="rounded-md border px-3 py-2 text-sm" />
        <input name="remarks" placeholder="Remarks" className="rounded-md border px-3 py-2 text-sm" />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="hmoCovered"
            checked={hmoCovered}
            onChange={(e) => setHmoCovered(e.target.checked)}
          />
          Covered by HMO
        </label>
        {hmoCovered && (
          <select name="hmoProviderId" className="rounded-md border px-3 py-2 text-sm">
            <option value="">Select HMO</option>
            {hmoProviders.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Add Treatment Record
      </button>
    </form>
  );
}
