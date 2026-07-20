"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ToothConditionCode } from "@/lib/tooth-conditions";

export async function setToothCondition(
  patientId: string,
  toothNumber: number,
  surface: "WHOLE" | "MESIAL" | "DISTAL" | "OCCLUSAL" | "BUCCAL" | "LINGUAL",
  condition: ToothConditionCode
) {
  await prisma.odontogramEntry.upsert({
    where: { patientId_toothNumber_surface: { patientId, toothNumber, surface } },
    update: { condition },
    create: { patientId, toothNumber, surface, condition },
  });
  revalidatePath(`/admin/patients/${patientId}`);
}

export async function clearToothCondition(
  patientId: string,
  toothNumber: number,
  surface: "WHOLE" | "MESIAL" | "DISTAL" | "OCCLUSAL" | "BUCCAL" | "LINGUAL"
) {
  await prisma.odontogramEntry
    .delete({
      where: { patientId_toothNumber_surface: { patientId, toothNumber, surface } },
    })
    .catch(() => {});
  revalidatePath(`/admin/patients/${patientId}`);
}
