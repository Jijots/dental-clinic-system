"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Receipt,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CLINIC_NAME } from "@/lib/site-config";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/patients", label: "Patient's Profile", icon: Users },
  { href: "/admin/appointments", label: "Client Appointments", icon: CalendarCheck },
  { href: "/admin/expenses", label: "Expenses", icon: Receipt },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/configurations", label: "Configurations", icon: Settings },
];

export function AdminSidebar({
  userEmail,
  signOutAction,
}: {
  userEmail: string;
  signOutAction: () => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-white/10 bg-brand-700 text-white transition-[width] duration-200 print:hidden ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        {expanded && (
          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-semibold">{CLINIC_NAME}</p>
            <p className="text-xs text-white/50">Admin System</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 text-sm">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                active ? "bg-cream text-brand-900" : "text-white/80 hover:bg-white/10 hover:text-white"
              } ${expanded ? "" : "justify-center"}`}
            >
              <Icon size={18} className="shrink-0" />
              {expanded && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 text-xs text-white/50">
        {expanded && <p className="truncate px-1 pb-2">{userEmail}</p>}
        <form action={signOutAction}>
          <button
            type="submit"
            title="Log out"
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white ${
              expanded ? "" : "justify-center"
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {expanded && <span>Log out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
