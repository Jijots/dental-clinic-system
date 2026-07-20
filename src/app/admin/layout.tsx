import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminSidebar } from "./admin-sidebar";
import { HelpButton } from "@/components/help-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={session.user.email ?? ""} signOutAction={signOutAction} />
      <main className="flex-1 bg-slate-50 p-8 print:bg-white print:p-0">{children}</main>
      <HelpButton />
    </div>
  );
}
