import Link from "next/link";
import { CLINIC_NAME } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact Us" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg font-semibold text-white">
            {CLINIC_NAME}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="rounded-md bg-brand-700 px-4 py-2 text-white hover:bg-brand-800"
            >
              Book Appointment
            </Link>
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
