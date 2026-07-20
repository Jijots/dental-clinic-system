import { prisma } from "@/lib/prisma";
import { addExpense } from "@/lib/actions/expenses";

export default async function ExpensesPage() {
  const [expenses, branches] = await Promise.all([
    prisma.expense.findMany({
      include: { branch: true },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>

      <form action={addExpense} className="mt-6 grid gap-3 rounded-lg border bg-white p-5 sm:grid-cols-5">
        <select name="branchId" required className="rounded-md border px-3 py-2 text-sm sm:col-span-1">
          <option value="">Branch</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input type="date" name="date" required className="rounded-md border px-3 py-2 text-sm sm:col-span-1" />
        <input
          name="particulars"
          placeholder="Particulars"
          required
          className="rounded-md border px-3 py-2 text-sm sm:col-span-1"
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          required
          className="rounded-md border px-3 py-2 text-sm sm:col-span-1"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 sm:col-span-1"
        >
          Add Expense
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Particulars</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">{e.date.toISOString().slice(0, 10)}</td>
                <td className="px-4 py-3">{e.branch.name}</td>
                <td className="px-4 py-3">{e.particulars}</td>
                <td className="px-4 py-3">₱{Number(e.amount).toLocaleString()}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No expenses logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
