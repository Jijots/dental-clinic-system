"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function generateDocument(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const patientId = formData.get("patientId") as string;
  const dentistId = formData.get("dentistId") as string;
  const type = formData.get("type") as "MEDICAL_CERTIFICATE" | "PRESCRIPTION";
  const content = formData.get("content") as string;

  if (!patientId || !dentistId || !type || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.generatedDocument.create({
    data: { patientId, dentistId, type, content, issuedById: session.user.id },
  });

  revalidatePath("/admin/documents");
}
