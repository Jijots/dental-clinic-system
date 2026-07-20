"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function addExpense(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const branchId = formData.get("branchId") as string;
  const date = formData.get("date") as string;
  const particulars = formData.get("particulars") as string;
  const description = (formData.get("description") as string) || null;
  const amount = Number(formData.get("amount"));

  if (!branchId || !date || !particulars || Number.isNaN(amount)) {
    throw new Error("Missing required fields");
  }

  await prisma.expense.create({
    data: {
      branchId,
      date: new Date(date),
      particulars,
      description,
      amount,
      recordedById: session.user.id,
    },
  });

  revalidatePath("/admin/expenses");
  revalidatePath("/admin");
}
