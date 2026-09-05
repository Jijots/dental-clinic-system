"use client";

import { useEffect, useMemo, useState, useTransition, useActionState } from "react";
import { createAppointmentRequest, getTakenSlots, type BookingState } from "@/lib/actions/appointments";
import { Field, Input, Select } from "@/components/field";
import { Button } from "@/components/button";

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
  // Resolved after mount so the server and client don't disagree about "today"
  // across timezones during hydration.
  const [minDate, setMinDate] = useState("");
  const [, startTransition] = useTransition();
  const [state, formAction, pending] = useActionState(createAppointmentRequest, initialState);

  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    setMinDate(local.toISOString().slice(0, 10));
  }, []);

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
      <Field label="Branch" required>
        <Select
          name="branchId"
          required
          value={branchId}
          onChange={(e) => {
            setBranchId(e.target.value);
            setDentistId("");
            setTakenSlots([]);
          }}
        >
          <option value="">Select branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Dentist" required>
        <Select
          name="dentistId"
          required
          value={dentistId}
          onChange={(e) => {
            setDentistId(e.target.value);
            refreshTakenSlots(e.target.value, date);
          }}
        >
          <option value="">Select dentist</option>
          {dentistsForBranch.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Service">
        <Select name="serviceId">
          <option value="">Select service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Date" required>
        <Input
          type="date"
          name="date"
          required
          min={minDate || undefined}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            refreshTakenSlots(dentistId, e.target.value);
          }}
        />
      </Field>

      <fieldset>
        <legend className="block text-sm font-medium text-ink-muted">
          Time
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isTaken = takenSlots.includes(slot);
            return (
              <label
                key={slot}
                className={`cursor-pointer rounded-md border border-line-strong px-2 py-2 text-center text-sm ${
                  isTaken
                    ? "cursor-not-allowed bg-surface-sunken text-ink-faint line-through"
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
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required>
          <Input name="requesterName" required />
        </Field>
        <Field label="Contact Number" required>
          <Input name="requesterPhone" required />
        </Field>
      </div>

      <Field label="Email (optional)">
        <Input type="email" name="requesterEmail" />
      </Field>

      <Button type="submit" disabled={pending} className="w-full py-3">
        {pending ? "Sending..." : "Request Appointment"}
      </Button>

      {state.status !== "idle" && (
        <p
          role={state.status === "error" ? "alert" : undefined}
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
