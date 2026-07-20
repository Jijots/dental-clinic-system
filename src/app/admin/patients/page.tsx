import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const patients = await prisma.patient.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { branch: true },
    orderBy: { lastName: "asc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patient&apos;s Profile</h1>
        <Link
          href="/admin/patients/new"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          + Add Patient
        </Link>
      </div>

      <form className="mt-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search patient by name..."
          className="w-full max-w-sm rounded-md border px-3 py-2 text-sm"
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">HMO</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.lastName}, {p.firstName}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.branch.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.contactNumber ?? "-"}</td>
                <td className="px-4 py-3 text-gray-600">{p.hmoProviderId ? "Yes" : "-"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/patients/${p.id}`} className="text-brand-700 hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No patients yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
