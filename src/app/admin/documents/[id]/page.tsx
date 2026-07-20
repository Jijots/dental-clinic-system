import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/print-button";
import { PrintWatermark } from "@/components/print-watermark";
import { calcAge, securityCode } from "@/lib/document-format";

const DOCUMENT_TITLE: Record<string, string> = {
  MEDICAL_CERTIFICATE: "Medical Certificate",
  PRESCRIPTION: "Prescription",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.generatedDocument.findUnique({
    where: { id },
    include: { patient: { include: { branch: true } }, dentist: true, issuedBy: true },
  });

  if (!doc) notFound();

  const { patient, dentist } = doc;
  const dateStr = doc.issuedAt.toISOString().slice(0, 10);
  const age = calcAge(patient.birthday, doc.issuedAt);

  return (
    <div className="mx-auto max-w-2xl bg-white p-10 print:max-w-full print:w-full print:p-0 print:text-sm">
      <PrintWatermark text={`${patient.lastName}, ${patient.firstName} — ${dateStr}`} />

      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="border-b-2 border-emerald-700 pb-3 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Psalm 23 Dental Care</h1>
        <p className="text-sm text-gray-600">General &amp; Family Dentistry</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 border-b pb-3 text-xs text-gray-600">
        <div>
          <p className="font-semibold text-gray-800">{patient.branch.name}</p>
          <p>{patient.branch.address}</p>
          {patient.branch.phone && <p>{patient.branch.phone}</p>}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">{dentist.name}</p>
          <p>General Dentist</p>
          {dentist.licenseNumber && <p>PRC No. {dentist.licenseNumber}</p>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <p className="text-[11px] uppercase text-gray-500">Name</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">
            {patient.lastName}, {patient.firstName}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-gray-500">Date</p>
          <p className="border-b border-gray-300 pb-1 font-medium text-gray-900">{dateStr}</p>
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
      </div>

      <h2 className="mt-8 text-center text-base font-semibold uppercase tracking-widest text-gray-800">
        {DOCUMENT_TITLE[doc.type] ?? doc.type}
      </h2>

      <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{doc.content}</p>

      <div className="mt-20 text-sm">
        <div className="w-64 border-t border-gray-500 pt-1">
          <p className="font-semibold text-gray-900">{dentist.name}</p>
          <p className="text-xs text-gray-500">Attending Dentist</p>
          {dentist.licenseNumber && <p className="text-xs text-gray-500">PRC No.: {dentist.licenseNumber}</p>}
          {dentist.ptrNumber && <p className="text-xs text-gray-500">PTR No.: {dentist.ptrNumber}</p>}
        </div>
      </div>

      <p className="mt-10 text-center text-[10px] tracking-widest text-gray-400">
        Security Code: {securityCode(doc.id)}
      </p>
      <p className="mt-1 text-center text-[10px] text-gray-400">
        Issued by {doc.issuedBy.name} via Psalm 23 Dental Care Clinic System
      </p>
    </div>
  );
}
