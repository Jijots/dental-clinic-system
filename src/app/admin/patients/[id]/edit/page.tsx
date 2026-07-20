import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePatient } from "@/lib/actions/patients";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [patient, branches, hmoProviders] = await Promise.all([
    prisma.patient.findUnique({ where: { id } }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!patient) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Edit Patient — {patient.lastName}, {patient.firstName}
      </h1>

      <form action={updatePatient} className="mt-6 space-y-4 rounded-lg border bg-white p-6">
        <input type="hidden" name="patientId" value={patient.id} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Last Name</label>
            <input
              name="lastName"
              required
              defaultValue={patient.lastName}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">First Name</label>
            <input
              name="firstName"
              required
              defaultValue={patient.firstName}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Middle Name</label>
            <input
              name="middleName"
              defaultValue={patient.middleName ?? ""}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              defaultValue={patient.gender ?? ""}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Birthday</label>
            <input
              type="date"
              name="birthday"
              defaultValue={patient.birthday ? patient.birthday.toISOString().slice(0, 10) : ""}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Branch</label>
            <select
              name="branchId"
              required
              defaultValue={patient.branchId}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
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
          <label className="block text-xs font-medium text-gray-700">Contact Number</label>
          <input
            name="contactNumber"
            defaultValue={patient.contactNumber ?? ""}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Home Address</label>
          <input
            name="homeAddress"
            defaultValue={patient.homeAddress ?? ""}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">HMO Provider</label>
          <select
            name="hmoProviderId"
            defaultValue={patient.hmoProviderId ?? ""}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {hmoProviders.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Allergies</label>
          <input
            name="allergies"
            defaultValue={patient.allergies ?? ""}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Other Medical Conditions</label>
          <textarea
            name="medicalConditions"
            rows={3}
            defaultValue={patient.medicalConditions ?? ""}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            Save Changes
          </button>
          <a href={`/admin/patients/${patient.id}`} className="text-sm text-gray-500 hover:underline">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
