import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, Smile, Stethoscope, MapPin, Phone, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

const FEATURES = [
  {
    icon: Heart,
    title: "Patient Comfort",
    body: "From your very first visit to your last checkup, we want you to feel welcomed, at ease, and genuinely cared for.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity in Care",
    body: "Honest recommendations and clear treatment options, always — your best interest comes first, every time.",
  },
  {
    icon: Sparkles,
    title: "Complete Smile Care",
    body: "From routine checkups to specialized treatments, comprehensive dental care for every stage of your smile.",
  },
];

const SERVICES = [
  {
    icon: Smile,
    title: "Orthodontics",
    body: "Straighten your smile with braces and clear aligners.",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    body: "Enhance your smile with whitening, veneers, and smile makeovers.",
  },
  {
    icon: Stethoscope,
    title: "Oral Surgery",
    body: "Expert surgical care including wisdom tooth removal and more.",
  },
];

export default async function HomePage() {
  const [branches, hmoProviders] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-100 to-cream px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">
          Healthy Smiles Start Here
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-medium text-brand-900 sm:text-5xl">
          Providing trusted care for individuals and families across Pampanga
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="rounded bg-brand-700 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-cream hover:bg-brand-800"
          >
            Book Appointment
          </Link>
          <Link
            href="/contact"
            className="rounded border border-brand-700 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-brand-700 hover:bg-brand-50"
          >
            Contact Us
          </Link>
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-700">
          {branches.length} Branches Across Pampanga
        </p>
      </section>

      {/* Story & Philosophy */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Our Story &amp; Philosophy
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-brand-900">
            Founded on Faith, Guided by Compassion. Committed to Patient Care.
          </h2>
          <p className="mt-6 text-brand-900/80">
            Every patient who walks through our doors deserves to be treated with compassion,
            honesty, and genuine care. We take Psalm 23:1 to heart — &ldquo;The Lord is my
            shepherd, I lack nothing&rdquo; — and try to build a practice where that same sense of
            peace and trust carries into every visit.
          </p>
          <p className="mt-4 text-brand-900/80">
            Dentistry is only part of what we hope to give back. Through the trust our patients
            place in us, we&apos;re able to support our church and community — every smile we
            care for becomes part of something a little bigger than the two of us in the chair.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg bg-brand-100/60 p-6 text-center">
              <f.icon className="mx-auto text-brand-700" size={28} />
              <h3 className="mt-4 font-serif text-lg font-medium text-brand-900">{f.title}</h3>
              <p className="mt-2 text-sm text-brand-900/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-lg border border-brand-100 p-6">
                <s.icon className="text-brand-700" size={26} />
                <h3 className="mt-4 font-serif text-lg font-medium text-brand-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
                >
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HMOs */}
      {hmoProviders.length > 0 && (
        <section className="bg-brand-100/40 px-6 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Trusted by Leading HMOs
          </p>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-3">
            {hmoProviders.map((h) => (
              <span key={h.id} className="font-serif text-lg text-brand-900/70">
                {h.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Locations */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-3xl font-medium text-brand-900">
            Our Locations
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {branches.map((b) => (
              <div key={b.id} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-medium text-brand-900">{b.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-brand-700" />
                  {b.address}
                </p>
                {b.phone && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} className="shrink-0 text-brand-700" />
                    {b.phone}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
                >
                  Get Directions <ArrowRight size={14} />
                </a>
              </div>
            ))}
            {branches.length === 0 && (
              <p className="text-center text-gray-400">No branches configured yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 px-6 py-16 text-center">
        <h2 className="font-serif text-3xl font-medium text-cream">
          Ready to achieve a healthier smile?
        </h2>
        <p className="mt-3 text-brand-50/80">
          Book your appointment today and let us take care of your smile.
        </p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded bg-cream px-8 py-3 text-sm font-semibold uppercase tracking-wide text-brand-900 hover:bg-white"
        >
          Book an Appointment
        </Link>
      </section>
    </div>
  );
}
