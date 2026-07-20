import { prisma } from "@/lib/prisma";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfNextMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = startOfNextMonth(now);

  const [patientCount, monthlyTreatments, monthlyExpenses] = await Promise.all([
    prisma.patient.count(),
    prisma.treatmentRecord.findMany({
      where: { date: { gte: monthStart, lt: monthEnd } },
      select: { fee: true },
    }),
    prisma.expense.findMany({
      where: { date: { gte: monthStart, lt: monthEnd } },
      select: { amount: true },
    }),
  ]);

  const grossIncome = monthlyTreatments.reduce((sum, t) => sum + Number(t.fee), 0);
  const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netIncome = grossIncome - totalExpenses;

  const cards = [
    { label: "Number of Patients", value: patientCount.toString() },
    { label: "Monthly Gross Income", value: `₱${grossIncome.toLocaleString()}` },
    { label: "Monthly Expenses", value: `₱${totalExpenses.toLocaleString()}` },
    { label: "Monthly Net Income", value: `₱${netIncome.toLocaleString()}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
