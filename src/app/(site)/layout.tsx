import Link from "next/link";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact Us" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-emerald-700">
            Psalm 23 Dental Care
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-emerald-700">
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
            >
              Book Appointment
            </Link>
            <Link href="/login" className="hover:text-emerald-700">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Psalm 23 Dental Care. All rights reserved.
      </footer>
    </div>
  );
}
