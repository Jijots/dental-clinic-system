"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTreatmentRecord(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const branchId = formData.get("branchId") as string;
  const dentistId = formData.get("dentistId") as string;
  const date = formData.get("date") as string;
  const toothNumbers = (formData.get("toothNumbers") as string) || null;
  const procedure = formData.get("procedure") as string;
  const diagnosis = (formData.get("diagnosis") as string) || null;
  const remarks = (formData.get("remarks") as string) || null;
  const fee = Number(formData.get("fee"));
  const hmoCovered = formData.get("hmoCovered") === "on";
  const hmoProviderId = (formData.get("hmoProviderId") as string) || null;

  if (!patientId || !branchId || !dentistId || !date || !procedure || Number.isNaN(fee)) {
    throw new Error("Missing required fields");
  }

  await prisma.treatmentRecord.create({
    data: {
      patientId,
      branchId,
      dentistId,
      date: new Date(date),
      toothNumbers,
      procedure,
      diagnosis,
      remarks,
      fee,
      hmoCovered,
      hmoProviderId: hmoCovered ? hmoProviderId : null,
    },
  });

  revalidatePath(`/admin/patients/${patientId}`);
}

export async function addPayment(formData: FormData) {
  const treatmentRecordId = formData.get("treatmentRecordId") as string;
  const patientId = formData.get("patientId") as string;
  const amount = Number(formData.get("amount"));
  const paymentType = formData.get("paymentType") as
    | "CASH"
    | "GCASH"
    | "MAYA"
    | "BANK_TRANSFER"
    | "CARD"
    | "OTHER";

  if (!treatmentRecordId || !patientId || Number.isNaN(amount)) {
    throw new Error("Missing required fields");
  }

  await prisma.payment.create({
    data: { treatmentRecordId, amount, paymentType },
  });

  revalidatePath(`/admin/patients/${patientId}`);
}
