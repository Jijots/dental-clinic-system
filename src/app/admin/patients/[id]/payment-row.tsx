"use client";

import { useState } from "react";
import { addPayment } from "@/lib/actions/treatments";

type Payment = { id: string; amount: number; paymentType: string; paidAt: string };
type Treatment = {
  id: string;
  date: string;
  dentistName: string;
  toothNumbers: string | null;
  procedure: string;
  fee: number;
  payments: Payment[];
};

export function PaymentRow({ patientId, treatment }: { patientId: string; treatment: Treatment }) {
  const [showForm, setShowForm] = useState(false);
  const paid = treatment.payments.reduce((s, p) => s + p.amount, 0);
  const balance = treatment.fee - paid;

  return (
    <>
      <tr>
        <td className="px-4 py-3">{treatment.date}</td>
        <td className="px-4 py-3">{treatment.dentistName}</td>
        <td className="px-4 py-3">{treatment.toothNumbers ?? "-"}</td>
        <td className="px-4 py-3">{treatment.procedure}</td>
        <td className="px-4 py-3">₱{treatment.fee.toLocaleString()}</td>
        <td className="px-4 py-3">₱{paid.toLocaleString()}</td>
        <td className="px-4 py-3">₱{balance.toLocaleString()}</td>
        <td className="px-4 py-3 text-right">
          {balance > 0 && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="text-xs text-emerald-700 hover:underline"
            >
              {showForm ? "Cancel" : "Add Payment"}
            </button>
          )}
        </td>
      </tr>
      {showForm && (
        <tr className="bg-gray-50">
          <td colSpan={8} className="px-4 py-3">
            <form
              action={async (formData) => {
                await addPayment(formData);
                setShowForm(false);
              }}
              className="flex flex-wrap items-end gap-3"
            >
              <input type="hidden" name="treatmentRecordId" value={treatment.id} />
              <input type="hidden" name="patientId" value={patientId} />
              <div>
                <label className="block text-xs text-gray-500">Amount</label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  max={balance}
                  required
                  className="mt-1 w-32 rounded-md border px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Payment Type</label>
                <select name="paymentType" className="mt-1 rounded-md border px-2 py-1 text-sm">
                  <option value="CASH">Cash</option>
                  <option value="GCASH">GCash</option>
                  <option value="MAYA">Maya</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Card</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800"
              >
                Save Payment
              </button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
