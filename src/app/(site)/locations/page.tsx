import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function LocationsPage() {
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold font-serif text-brand-900">Our Locations</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-lg border p-6">
            <h2 className="font-semibold font-serif text-brand-900">{branch.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{branch.address}</p>
            {branch.phone && <p className="mt-1 text-sm text-gray-600">📞 {branch.phone}</p>}
          </div>
        ))}
        {branches.length === 0 && (
          <p className="text-gray-400">No branches configured yet.</p>
        )}
      </div>
    </div>
  );
}
