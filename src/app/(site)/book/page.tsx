import { prisma } from "@/lib/prisma";
import { BookingForm } from "./booking-form";

export default async function BookPage() {
  const [branches, dentists, services] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.dentist.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
      <p className="mt-2 text-gray-600">
        Pick a branch, dentist, and preferred time. We&apos;ll confirm your slot shortly.
      </p>
      <BookingForm
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
        dentists={dentists.map((d) => ({ id: d.id, name: d.name, branchId: d.branchId }))}
        services={services.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
