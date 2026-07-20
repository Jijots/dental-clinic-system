import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  const [patients, dentists] = await Promise.all([
    prisma.patient.findMany({
      include: { treatmentRecords: { orderBy: { date: "desc" }, take: 1 } },
    }),
    prisma.dentist.findMany({
      include: { treatments: { include: { payments: true } } },
    }),
  ]);

  const recallList = patients.filter((p) => {
    const last = p.treatmentRecords[0];
    return !last || last.date < fiveMonthsAgo;
  });

  const payroll = dentists.map((d) => {
    const totalCollected = d.treatments.reduce(
      (sum, t) => sum + t.payments.reduce((s, p) => s + Number(p.amount), 0),
      0
    );
    const commission = (totalCollected * Number(d.commissionRate)) / 100;
    return { dentist: d, totalCollected, commission };
  });

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Patient Recall Report — No visit in the last 5 months
        </h2>
        <div className="mt-3 overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Last Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recallList.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    {p.lastName}, {p.firstName}
                  </td>
                  <td className="px-4 py-3">
                    {p.treatmentRecords[0]?.date.toISOString().slice(0, 10) ?? "No visit yet"}
                  </td>
                </tr>
              ))}
              {recallList.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                    No patients due for recall.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Dentist Payroll / Commission Report</h2>
        <div className="mt-3 overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Dentist</th>
                <th className="px-4 py-3">Commission Rate</th>
                <th className="px-4 py-3">Total Collected</th>
                <th className="px-4 py-3">Commission Due</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payroll.map(({ dentist, totalCollected, commission }) => (
                <tr key={dentist.id}>
                  <td className="px-4 py-3">{dentist.name}</td>
                  <td className="px-4 py-3">{Number(dentist.commissionRate)}%</td>
                  <td className="px-4 py-3">₱{totalCollected.toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">₱{commission.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
