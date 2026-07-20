"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBranch(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = (formData.get("phone") as string) || null;
  if (!name || !address) throw new Error("Missing required fields");

  await prisma.branch.create({ data: { name, address, phone } });
  revalidatePath("/admin/configurations");
}

export async function addDentist(formData: FormData) {
  const name = formData.get("name") as string;
  const branchId = (formData.get("branchId") as string) || null;
  const commissionRate = Number(formData.get("commissionRate") ?? 0);
  const licenseNumber = (formData.get("licenseNumber") as string) || null;
  const ptrNumber = (formData.get("ptrNumber") as string) || null;
  if (!name) throw new Error("Missing required fields");

  await prisma.dentist.create({
    data: { name, branchId, commissionRate, licenseNumber, ptrNumber },
  });
  revalidatePath("/admin/configurations");
}

export async function addService(formData: FormData) {
  const name = formData.get("name") as string;
  const category = (formData.get("category") as string) || null;
  const defaultFee = Number(formData.get("defaultFee") ?? 0);
  if (!name) throw new Error("Missing required fields");

  await prisma.service.create({ data: { name, category, defaultFee } });
  revalidatePath("/admin/configurations");
}

export async function addHmoProvider(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Missing required fields");

  await prisma.hmoProvider.create({ data: { name } });
  revalidatePath("/admin/configurations");
}
