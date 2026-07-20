import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/patients", label: "Patient's Profile" },
  { href: "/admin/appointments", label: "Client Appointments" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/configurations", label: "Configurations" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r bg-slate-900 text-slate-100">
        <div className="border-b border-slate-800 px-6 py-5">
          <p className="text-sm font-semibold">Psalm 23 Dental Care</p>
          <p className="text-xs text-slate-400">Admin System</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-800 p-4 text-xs text-slate-400">
          <p>{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="mt-2 text-slate-300 hover:text-white">Log out</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-slate-50 p-8">{children}</main>
    </div>
  );
}
