import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateDocument } from "@/lib/actions/documents";

export default async function DocumentsPage() {
  const [patients, dentists, documents] = await Promise.all([
    prisma.patient.findMany({ orderBy: { lastName: "asc" } }),
    prisma.dentist.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.generatedDocument.findMany({
      include: { patient: true, dentist: true },
      orderBy: { issuedAt: "desc" },
      take: 30,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      <p className="text-sm text-gray-500">Generate medical certificates and prescriptions.</p>

      <form action={generateDocument} className="mt-6 space-y-3 rounded-lg border bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <select name="patientId" required className="rounded-md border px-3 py-2 text-sm">
            <option value="">Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.lastName}, {p.firstName}
              </option>
            ))}
          </select>
          <select name="dentistId" required className="rounded-md border px-3 py-2 text-sm">
            <option value="">Dentist</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select name="type" required className="rounded-md border px-3 py-2 text-sm">
            <option value="">Document Type</option>
            <option value="MEDICAL_CERTIFICATE">Medical Certificate</option>
            <option value="PRESCRIPTION">Prescription</option>
          </select>
        </div>
        <textarea
          name="content"
          required
          rows={4}
          placeholder="Certificate / prescription content..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Generate Document
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Dentist</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {documents.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3">{d.issuedAt.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-3">
                  {d.patient.lastName}, {d.patient.firstName}
                </td>
                <td className="px-4 py-3">{d.dentist.name}</td>
                <td className="px-4 py-3">{d.type.replace("_", " ")}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/documents/${d.id}`} className="text-brand-700 hover:underline">
                    View / Print →
                  </Link>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No documents generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
