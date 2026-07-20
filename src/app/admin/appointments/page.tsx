import { prisma } from "@/lib/prisma";
import { updateAppointmentStatus } from "@/lib/actions/appointments";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-200 text-gray-600",
};

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string; dentistId?: string }>;
}) {
  const { branchId, dentistId } = await searchParams;

  const [appointments, branches, dentists] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        branchId: branchId || undefined,
        dentistId: dentistId || undefined,
      },
      include: { branch: true, dentist: true, service: true, patient: true },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 100,
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.dentist.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Client Appointments</h1>
      <p className="text-sm text-gray-500">Across all branches, filterable by branch and dentist.</p>

      <form className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500">Branch</label>
          <select
            name="branchId"
            defaultValue={branchId ?? ""}
            className="mt-1 rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Dentist</label>
          <select
            name="dentistId"
            defaultValue={dentistId ?? ""}
            className="mt-1 rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All dentists</option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Filter
        </button>
        {(branchId || dentistId) && (
          <a href="/admin/appointments" className="text-sm text-gray-500 hover:underline">
            Clear filters
          </a>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Dentist</th>
              <th className="px-4 py-3">Patient / Requester</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">{a.date.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-3">{a.time}</td>
                <td className="px-4 py-3">{a.branch.name}</td>
                <td className="px-4 py-3">{a.dentist.name}</td>
                <td className="px-4 py-3">
                  {a.patient ? `${a.patient.lastName}, ${a.patient.firstName}` : a.requesterName}
                </td>
                <td className="px-4 py-3">{a.service?.name ?? "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLE[a.status]}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={updateAppointmentStatus} className="flex justify-end gap-2">
                    <input type="hidden" name="appointmentId" value={a.id} />
                    {a.status === "PENDING" && (
                      <>
                        <button
                          name="status"
                          value="CONFIRMED"
                          className="rounded-md border border-emerald-700 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                          Confirm
                        </button>
                        <button
                          name="status"
                          value="CANCELLED"
                          className="rounded-md border border-red-600 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {a.status === "CONFIRMED" && (
                      <>
                        <button
                          name="status"
                          value="COMPLETED"
                          className="rounded-md border border-emerald-700 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                          Mark Completed
                        </button>
                        <button
                          name="status"
                          value="CANCELLED"
                          className="rounded-md border border-red-600 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </form>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No appointments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
