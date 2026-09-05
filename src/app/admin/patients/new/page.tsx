import { prisma } from "@/lib/prisma";
import { createPatient } from "@/lib/actions/patients";

export default async function NewPatientPage() {
  const [branches, hmoProviders] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink">Add Patient</h1>

      <form action={createPatient} className="mt-6 space-y-4 rounded-lg border bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-ink-muted">Last Name</label>
            <input name="lastName" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted">First Name</label>
            <input name="firstName" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted">Middle Name</label>
            <input name="middleName" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-ink-muted">Gender</label>
            <select name="gender" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted">Birthday</label>
            <input type="date" name="birthday" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-muted">Branch</label>
            <select name="branchId" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">Contact Number</label>
          <input name="contactNumber" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted">Home Address</label>
          <input name="homeAddress" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">HMO Provider</label>
          <select name="hmoProviderId" className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
            <option value="">None</option>
            {hmoProviders.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-muted">Allergies</label>
          <input name="allergies" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted">Other Medical Conditions</label>
          <textarea name="medicalConditions" rows={3} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>

        <button
          type="submit"
          className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Save Patient
        </button>
      </form>
    </div>
  );
}
