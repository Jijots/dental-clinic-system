import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/print-button";

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

  return (
    <div className="mx-auto max-w-2xl bg-white p-10 print:p-0">
      <div className="mb-6 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Psalm 23 Dental Care</h1>
        <p className="text-sm text-gray-600">{doc.patient.branch.name}</p>
        <p className="text-sm text-gray-600">{doc.patient.branch.address}</p>
        {doc.patient.branch.phone && <p className="text-sm text-gray-600">{doc.patient.branch.phone}</p>}
      </div>

      <h2 className="mt-10 text-center text-lg font-semibold uppercase tracking-widest text-gray-800">
        {DOCUMENT_TITLE[doc.type] ?? doc.type}
      </h2>

      <div className="mt-8 flex justify-between text-sm text-gray-700">
        <p>
          <span className="font-medium">Patient: </span>
          {doc.patient.lastName}, {doc.patient.firstName}
        </p>
        <p>
          <span className="font-medium">Date: </span>
          {doc.issuedAt.toISOString().slice(0, 10)}
        </p>
      </div>

      <p className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{doc.content}</p>

      <div className="mt-20 grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className="border-t border-gray-500 pt-1">{doc.dentist.name}</div>
          <p className="text-xs text-gray-500">Attending Dentist</p>
        </div>
        <div>
          <div className="border-t border-gray-500 pt-1">&nbsp;</div>
          <p className="text-xs text-gray-500">License No. / PTR No.</p>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        Issued by {doc.issuedBy.name} via Psalm 23 Dental Care Clinic System
      </p>
    </div>
  );
}
