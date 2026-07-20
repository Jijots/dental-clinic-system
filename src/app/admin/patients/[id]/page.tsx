import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Odontogram } from "./odontogram";
import { AddTreatmentForm } from "./add-treatment-form";
import { PaymentRow } from "./payment-row";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [patient, dentists, hmoProviders] = await Promise.all([
    prisma.patient.findUnique({
      where: { id },
      include: {
        branch: true,
        hmoProvider: true,
        treatmentRecords: {
          include: { dentist: true, payments: true },
          orderBy: { date: "desc" },
        },
        odontogramEntries: true,
      },
    }),
    prisma.dentist.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!patient) notFound();

  const totalFee = patient.treatmentRecords.reduce((sum, t) => sum + Number(t.fee), 0);
  const totalPaid = patient.treatmentRecords.reduce(
    (sum, t) => sum + t.payments.reduce((s, p) => s + Number(p.amount), 0),
    0
  );
  const remainingBalance = totalFee - totalPaid;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.lastName}, {patient.firstName}
          </h1>
          <Link
            href={`/admin/patients/${patient.id}/edit`}
            className="text-sm text-brand-700 hover:underline"
          >
            Edit
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          {patient.branch.name} · {patient.contactNumber ?? "No contact number"}
        </p>
        {(patient.allergies || patient.medicalConditions) && (
          <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {patient.allergies && <>Allergies: {patient.allergies}. </>}
            {patient.medicalConditions && <>Conditions: {patient.medicalConditions}.</>}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-medium uppercase text-gray-500">Total Fee</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">₱{totalFee.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-medium uppercase text-gray-500">Total Payment</p>
          <p className="mt-1 text-xl font-semibold text-brand-700">₱{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs font-medium uppercase text-gray-500">Remaining Balance</p>
          <p className="mt-1 text-xl font-semibold text-red-600">₱{remainingBalance.toLocaleString()}</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Treatment History / E-SOA</h2>
          <Link
            href={`/admin/patients/${patient.id}/soa`}
            className="rounded-md border border-brand-700 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            View / Print Statement of Account
          </Link>
        </div>

        <AddTreatmentForm
          patientId={patient.id}
          branchId={patient.branchId}
          dentists={dentists.map((d) => ({ id: d.id, name: d.name }))}
          hmoProviders={hmoProviders.map((h) => ({ id: h.id, name: h.name }))}
        />

        <div className="mt-3 overflow-x-auto rounded-lg border bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Dentist</th>
                <th className="px-4 py-3">Tooth #</th>
                <th className="px-4 py-3">Procedure</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {patient.treatmentRecords.map((t) => (
                <PaymentRow
                  key={t.id}
                  patientId={patient.id}
                  treatment={{
                    id: t.id,
                    date: t.date.toISOString().slice(0, 10),
                    dentistName: t.dentist.name,
                    toothNumbers: t.toothNumbers,
                    procedure: t.procedure,
                    fee: Number(t.fee),
                    payments: t.payments.map((p) => ({
                      id: p.id,
                      amount: Number(p.amount),
                      paymentType: p.paymentType,
                      paidAt: p.paidAt.toISOString().slice(0, 10),
                    })),
                  }}
                />
              ))}
              {patient.treatmentRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No treatment records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Odontogram</h2>
        <p className="text-sm text-gray-500">
          Click a tooth to record its condition using the clinic&apos;s legend.
        </p>
        <Odontogram patientId={patient.id} entries={patient.odontogramEntries} />
      </section>
    </div>
  );
}
