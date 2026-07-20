import { prisma } from "@/lib/prisma";
import { addBranch, addDentist, addService, addHmoProvider } from "@/lib/actions/configurations";

export default async function ConfigurationsPage() {
  const [branches, dentists, services, hmoProviders] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.dentist.findMany({ include: { branch: true }, orderBy: { name: "asc" } }),
    prisma.service.findMany({ orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">Configurations</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Branches</h2>
        <form action={addBranch} className="mt-3 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-4">
          <input name="name" placeholder="Branch name" required className="rounded-md border px-3 py-2 text-sm" />
          <input name="address" placeholder="Address" required className="rounded-md border px-3 py-2 text-sm sm:col-span-2" />
          <input name="phone" placeholder="Phone" className="rounded-md border px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white sm:col-span-4 sm:w-fit">
            Add Branch
          </button>
        </form>
        <ul className="mt-3 divide-y rounded-lg border bg-white text-sm">
          {branches.map((b) => (
            <li key={b.id} className="px-4 py-2">
              <span className="font-medium">{b.name}</span> — {b.address}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Dentists</h2>
        <form action={addDentist} className="mt-3 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-4">
          <input name="name" placeholder="Dentist name" required className="rounded-md border px-3 py-2 text-sm" />
          <select name="branchId" className="rounded-md border px-3 py-2 text-sm">
            <option value="">Primary branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            name="commissionRate"
            type="number"
            step="0.01"
            placeholder="Commission %"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white">Add Dentist</button>
        </form>
        <ul className="mt-3 divide-y rounded-lg border bg-white text-sm">
          {dentists.map((d) => (
            <li key={d.id} className="px-4 py-2">
              <span className="font-medium">{d.name}</span> — {d.branch?.name ?? "No branch"} ·{" "}
              {Number(d.commissionRate)}% commission
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <form action={addService} className="mt-3 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-4">
          <input name="name" placeholder="Service name" required className="rounded-md border px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" className="rounded-md border px-3 py-2 text-sm" />
          <input
            name="defaultFee"
            type="number"
            step="0.01"
            placeholder="Default fee"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white">Add Service</button>
        </form>
        <ul className="mt-3 divide-y rounded-lg border bg-white text-sm">
          {services.map((s) => (
            <li key={s.id} className="px-4 py-2">
              <span className="font-medium">{s.name}</span> {s.category && `— ${s.category}`}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">HMO Providers</h2>
        <form action={addHmoProvider} className="mt-3 flex gap-3 rounded-lg border bg-white p-4">
          <input name="name" placeholder="HMO provider name" required className="flex-1 rounded-md border px-3 py-2 text-sm" />
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white">Add</button>
        </form>
        <ul className="mt-3 divide-y rounded-lg border bg-white text-sm">
          {hmoProviders.map((h) => (
            <li key={h.id} className="px-4 py-2">
              {h.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
