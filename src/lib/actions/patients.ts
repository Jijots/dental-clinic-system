"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createPatient(formData: FormData) {
  const branchId = formData.get("branchId") as string;
  const lastName = formData.get("lastName") as string;
  const firstName = formData.get("firstName") as string;
  const middleName = (formData.get("middleName") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const birthdayRaw = formData.get("birthday") as string;
  const contactNumber = (formData.get("contactNumber") as string) || null;
  const homeAddress = (formData.get("homeAddress") as string) || null;
  const allergies = (formData.get("allergies") as string) || null;
  const medicalConditions = (formData.get("medicalConditions") as string) || null;
  const hmoProviderId = (formData.get("hmoProviderId") as string) || null;

  if (!branchId || !lastName || !firstName) {
    throw new Error("Missing required fields");
  }

  const patient = await prisma.patient.create({
    data: {
      branchId,
      lastName,
      firstName,
      middleName,
      gender,
      birthday: birthdayRaw ? new Date(birthdayRaw) : null,
      contactNumber,
      homeAddress,
      allergies,
      medicalConditions,
      hmoProviderId,
    },
  });

  redirect(`/admin/patients/${patient.id}`);
}

export async function updatePatient(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const branchId = formData.get("branchId") as string;
  const lastName = formData.get("lastName") as string;
  const firstName = formData.get("firstName") as string;
  const middleName = (formData.get("middleName") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const birthdayRaw = formData.get("birthday") as string;
  const contactNumber = (formData.get("contactNumber") as string) || null;
  const homeAddress = (formData.get("homeAddress") as string) || null;
  const allergies = (formData.get("allergies") as string) || null;
  const medicalConditions = (formData.get("medicalConditions") as string) || null;
  const hmoProviderId = (formData.get("hmoProviderId") as string) || null;

  if (!patientId || !branchId || !lastName || !firstName) {
    throw new Error("Missing required fields");
  }

  await prisma.patient.update({
    where: { id: patientId },
    data: {
      branchId,
      lastName,
      firstName,
      middleName,
      gender,
      birthday: birthdayRaw ? new Date(birthdayRaw) : null,
      contactNumber,
      homeAddress,
      allergies,
      medicalConditions,
      hmoProviderId,
    },
  });

  redirect(`/admin/patients/${patientId}`);
}
