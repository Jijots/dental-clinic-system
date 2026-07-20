import { prisma } from "@/lib/prisma";

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: { branch: true, dentist: true, service: true, patient: true },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Client Appointments</h1>
      <p className="text-sm text-gray-500">Across all branches, filterable by branch and dentist.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Dentist</th>
              <th className="px-4 py-3">Patient / Requester</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Status</th>
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
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
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
