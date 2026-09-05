"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type BookingState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/** Times a dentist is already booked for on a given date, so the UI can hide them. */
export async function getTakenSlots(dentistId: string, dateISO: string) {
  if (!dentistId || !dateISO) return [];
  const date = new Date(dateISO);
  const appointments = await prisma.appointment.findMany({
    where: {
      dentistId,
      date,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { time: true },
  });
  return appointments.map((a) => a.time);
}

export async function createAppointmentRequest(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const branchId = formData.get("branchId") as string;
  const dentistId = formData.get("dentistId") as string;
  const serviceId = (formData.get("serviceId") as string) || null;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const requesterName = formData.get("requesterName") as string;
  const requesterPhone = formData.get("requesterPhone") as string;
  const requesterEmail = (formData.get("requesterEmail") as string) || null;

  if (!branchId || !dentistId || !date || !time || !requesterName || !requesterPhone) {
    return { status: "error", message: "Please fill in all required fields." };
  }

  // The date input's `min` only guards the browser; requests can still arrive
  // with a past date, so the cutoff is enforced here too.
  const requestedDate = new Date(date);
  if (Number.isNaN(requestedDate.getTime())) {
    return { status: "error", message: "Please choose a valid date." };
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (requestedDate < today) {
    return { status: "error", message: "Please choose a date that hasn't passed yet." };
  }

  try {
    await prisma.appointment.create({
      data: {
        branchId,
        dentistId,
        serviceId,
        date: requestedDate,
        time,
        requesterName,
        requesterPhone,
        requesterEmail,
        status: "PENDING",
      },
    });
  } catch (err: unknown) {
    const isConflict =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2002";

    if (isConflict) {
      return {
        status: "error",
        message: "That time slot was just taken. Please pick another.",
      };
    }
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/book");
  return { status: "success", message: "Appointment request sent! We'll confirm by email or phone." };
}

export async function updateAppointmentStatus(formData: FormData) {
  const appointmentId = formData.get("appointmentId") as string;
  const status = formData.get("status") as
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";

  if (!appointmentId || !["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
    throw new Error("Invalid status update");
  }

  await prisma.appointment.update({ where: { id: appointmentId }, data: { status } });
  revalidatePath("/admin/appointments");
}
