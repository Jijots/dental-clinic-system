import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/print-button";
import { PrintWatermark } from "@/components/print-watermark";
import { calcAge, securityCode } from "@/lib/document-format";

const PAYMENT_LABEL: Record<string, string> = {
  CASH: "Cash",
  GCASH: "GCash",
  MAYA: "Maya",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  OTHER: "Other",
};

export default async function StatementOfAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      branch: true,
      hmoProvider: true,
      treatmentRecords: {
        include: { dentist: true, payments: true, hmoProvider: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!patient) notFound();

  const totalFee = patient.treatmentRecords.reduce((sum, t) => sum + Number(t.fee), 0);
  const payments = patient.treatmentRecords.flatMap((t) =>
    t.payments.map((p) => ({ ...p, treatment: t.procedure, treatmentDate: t.date }))
  );
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = totalFee - totalPaid;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const age = calcAge(patient.birthday, today);

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 print:w-full print:max-w-full print:p-0 print:text-xs">
      <PrintWatermark text={`${patient.lastName}, ${patient.firstName} — ${todayStr}`} />

      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton label="Print Statement of Account" />
      </div>

      <div className="border-b-2 border-emerald-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Psalm 23 Dental Care</h1>
        <p className="text-sm text-gray-600">{patient.branch.name}</p>
        <p className="text-sm text-gray-600">{patient.branch.address}</p>
        {patient.branch.phone && <p className="text-sm text-gray-600">{patient.branch.phone}</p>}
      </div>

      <h2 className="mt-6 text-center text-lg font-semibold uppercase tracking-wide text-gray-800">
        Electronic Statement of Account
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
        <div>
          <p className="text-[11px] uppercase text-gray-500">Name</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.lastName}, {patient.firstName}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">Date Issued</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">{todayStr}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] uppercase text-gray-500">Address</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.homeAddress ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">Age</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {age !== null ? `${age} years` : "-"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">Sex</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.gender ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">Contact Number</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.contactNumber ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">HMO Accredited</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.hmoProvider?.name ?? "None"}
          </p>
        </div>
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left">
            <th className="py-2 pr-2 print:py-1 print:pr-1">Date</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">Dentist</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">Treatment</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">Diagnosis</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1 text-right">Fee</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">HMO</th>
          </tr>
        </thead>
        <tbody>
          {patient.treatmentRecords.map((t) => (
            <tr key={t.id} className="border-b border-gray-200">
              <td className="py-2 pr-2 print:py-1 print:pr-1">{t.date.toISOString().slice(0, 10)}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{t.dentist.name}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{t.procedure}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{t.diagnosis ?? "-"}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1 text-right">₱{Number(t.fee).toLocaleString()}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{t.hmoCovered ? t.hmoProvider?.name ?? "Yes" : "-"}</td>
            </tr>
          ))}
          {patient.treatmentRecords.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-400">
                No treatment records yet.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-800 font-semibold">
            <td colSpan={4} className="py-2 pr-2 print:py-1 print:pr-1 text-right">
              Total
            </td>
            <td className="py-2 pr-2 print:py-1 print:pr-1 text-right">₱{totalFee.toLocaleString()}</td>
            <td />
          </tr>
        </tfoot>
      </table>

      <h3 className="mt-8 text-sm font-semibold uppercase text-gray-700">Payment History</h3>
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left">
            <th className="py-2 pr-2 print:py-1 print:pr-1">Date</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">For Treatment</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1">Payment Type</th>
            <th className="py-2 pr-2 print:py-1 print:pr-1 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-gray-200">
              <td className="py-2 pr-2 print:py-1 print:pr-1">{p.paidAt.toISOString().slice(0, 10)}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{p.treatment}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1">{PAYMENT_LABEL[p.paymentType] ?? p.paymentType}</td>
              <td className="py-2 pr-2 print:py-1 print:pr-1 text-right">₱{Number(p.amount).toLocaleString()}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400">
                No payments recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end gap-8 text-sm">
        <p>
          <span className="font-medium text-gray-700">Total Paid: </span>₱{totalPaid.toLocaleString()}
        </p>
        <p className="font-semibold">
          <span className="font-medium text-gray-700">Remaining Balance: </span>₱
          {balance.toLocaleString()}
        </p>
      </div>

      <div className="mt-10 border-t pt-4 text-xs leading-relaxed text-gray-600">
        <p className="font-semibold text-gray-700">Patient Consent and Acknowledgment</p>
        <p className="mt-1">
          I hereby acknowledge that the dentist has explained to me the nature of the dental
          procedure(s), including the potential risks, benefits, and alternative treatment
          options, and that all my concerns have been addressed to my satisfaction. By signing
          below, I voluntarily consent to the proposed treatment and authorize Psalm 23 Dental
          Care to proceed accordingly.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className="border-t border-gray-500 pt-1">Patient / Guardian Signature</div>
        </div>
        <div>
          <div className="border-t border-gray-500 pt-1">Date Signed</div>
        </div>
      </div>

      <p className="mt-10 text-center text-[10px] tracking-widest text-gray-400">
        Security Code: {securityCode(patient.id + todayStr)}
      </p>
    </div>
  );
}
