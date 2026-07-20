"use client";

import { useMemo, useState, useTransition, useActionState } from "react";
import { createAppointmentRequest, getTakenSlots, type BookingState } from "@/lib/actions/appointments";

type Branch = { id: string; name: string };
type Dentist = { id: string; name: string; branchId: string | null };
type Service = { id: string; name: string };

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

const initialState: BookingState = { status: "idle" };

export function BookingForm({
  branches,
  dentists,
  services,
}: {
  branches: Branch[];
  dentists: Dentist[];
  services: Service[];
}) {
  const [branchId, setBranchId] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const [state, formAction, pending] = useActionState(createAppointmentRequest, initialState);

  const dentistsForBranch = useMemo(
    () => dentists.filter((d) => !branchId || d.branchId === branchId),
    [dentists, branchId]
  );

  function refreshTakenSlots(nextDentistId: string, nextDate: string) {
    if (!nextDentistId || !nextDate) {
      setTakenSlots([]);
      return;
    }
    startTransition(async () => {
      const taken = await getTakenSlots(nextDentistId, nextDate);
      setTakenSlots(taken);
    });
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Branch</label>
        <select
          name="branchId"
          required
          value={branchId}
          onChange={(e) => {
            setBranchId(e.target.value);
            setDentistId("");
            setTakenSlots([]);
          }}
          className="mt-1 w-full rounded-md border px-3 py-2"
        >
          <option value="">Select branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dentist</label>
        <select
          name="dentistId"
          required
          value={dentistId}
          onChange={(e) => {
            setDentistId(e.target.value);
            refreshTakenSlots(e.target.value, date);
          }}
          className="mt-1 w-full rounded-md border px-3 py-2"
        >
          <option value="">Select dentist</option>
          {dentistsForBranch.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <select name="serviceId" className="mt-1 w-full rounded-md border px-3 py-2">
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          required
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            refreshTakenSlots(dentistId, e.target.value);
          }}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isTaken = takenSlots.includes(slot);
            return (
              <label
                key={slot}
                className={`cursor-pointer rounded-md border px-2 py-2 text-center text-sm ${
                  isTaken
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                    : "hover:border-brand-600"
                }`}
              >
                <input
                  type="radio"
                  name="time"
                  value={slot}
                  required
                  disabled={isTaken}
                  className="sr-only"
                />
                {slot}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            name="requesterName"
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            name="requesterPhone"
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email (optional)</label>
        <input
          type="email"
          name="requesterEmail"
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-700 px-4 py-3 font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Request Appointment"}
      </button>

      {state.status !== "idle" && (
        <p
          className={`text-sm ${
            state.status === "success" ? "text-brand-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
