import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Smile,
  Stethoscope,
  MapPin,
  Phone,
  ChevronUp,
  Building2,
  Calendar,
  Search,
  CalendarDays,
  ClipboardCheck,
  Quote,
  Star,
} from "lucide-react";
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

const STEPS = [
  {
    icon: Search,
    title: "Choose a Branch & Service",
    body: "Pick the location and treatment that works best for you.",
  },
  {
    icon: CalendarDays,
    title: "Pick a Date & Time",
    body: "Select an open slot — we only show times that are actually available.",
  },
  {
    icon: ClipboardCheck,
    title: "We Confirm Your Booking",
    body: "Our team reviews your request and confirms your appointment.",
  },
  {
    icon: Smile,
    title: "Visit Us",
    body: "Show up on the day and let us take care of the rest.",
  },
];

function IconBadge({ icon: Icon }: { icon: typeof Heart }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
      <Icon size={22} />
    </div>
  );
}

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function HomePage() {
  const [branches, hmoProviders, dentists] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.hmoProvider.findMany({ orderBy: { name: "asc" } }),
    prisma.dentist.findMany({
      where: { active: true },
      include: { branch: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 px-6 py-28 sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-black/50" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="max-w-xl font-serif text-5xl leading-tight text-cream">
            Healthy Smiles
            <br />
            <span className="font-normal italic text-brand-100">Start Here</span>
          </h1>
          <p className="mt-6 max-w-md text-brand-50/80">
            Providing trusted, personalized dental care for individuals and families
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded bg-brand-700 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-600"
            >
              Book Appointment
            </Link>
            <Link
              href="/contact"
              className="rounded bg-brand-700 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-600"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-10 inline-flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-lg">
            <Building2 className="text-brand-700" size={22} />
            <div>
              <p className="font-bold text-brand-900">
                {branches.length} {branches.length === 1 ? "Branch" : "Branches"}
              </p>
              <p className="text-xs uppercase tracking-wide text-gray-500">Near You</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
              Our Story &amp; Philosophy
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-brand-900">
              Modern Dental Care, <span className="italic">Personal Attention</span>
            </h2>
            <div className="mt-4 h-px w-16 bg-brand-700" />
            <p className="mt-6 text-brand-900/80">
              Every patient who walks through our doors deserves to be treated with compassion,
              honesty, and genuine care. We take the time to explain what&apos;s actually going on
              with your teeth, walk through every option in plain language, and let you decide
              what&apos;s right for you and your family.
            </p>
            <p className="mt-4 text-brand-900/80">
              From your very first visit to years of ongoing care, our goal is simple: treat you
              the way we&apos;d want our own family treated, every single time.
            </p>
          </div>

          <div className="space-y-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-lg bg-tan p-6">
                <IconBadge icon={f.icon} />
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-brand-900/70">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-lg bg-tan p-6">
                <IconBadge icon={s.icon} />
                <h3 className="mt-4 font-serif text-lg font-medium text-brand-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-brand-700 hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-3xl font-medium text-brand-900">
            How It Works
          </h2>
          <div className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-6 left-0 right-0 hidden h-px bg-brand-100 lg:block" />
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <s.icon className="mx-auto mt-4 text-brand-700" size={22} />
                <h3 className="mt-3 font-serif text-lg font-medium text-brand-900">{s.title}</h3>
                <p className="mt-1 text-sm text-brand-900/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      {dentists.length > 0 && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-serif text-3xl font-medium text-brand-900">
              Meet Our Dentists
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {dentists.map((d) => (
                <div key={d.id} className="rounded-2xl bg-tan p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-700 text-xl font-bold text-white">
                    {initials(d.name)}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-medium text-brand-900">{d.name}</h3>
                  <p className="mt-1 text-sm text-brand-900/70">
                    {d.branch?.name ?? "General Dentist"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      <section className="bg-brand-900 px-6 py-16 text-center">
        <Quote className="mx-auto text-brand-100" size={32} />
        <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl italic text-cream">
          The best dental experience I&apos;ve had — the staff explained everything clearly and
          made me feel completely at ease.
        </p>
        <div className="mt-4 flex items-center justify-center gap-1 text-brand-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <p className="mt-2 text-sm uppercase tracking-wide text-brand-100/70">Happy Patient</p>
      </section>

      {/* HMOs */}
      {hmoProviders.length > 0 && (
        <section className="bg-tan px-6 py-14 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Trusted by Leading HMOs
          </p>
          <div className="mx-auto mt-3 h-px w-16 bg-brand-700" />
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
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-3xl font-medium text-brand-900">
            Our Locations
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {branches.map((b) => (
              <div key={b.id} className="rounded-lg bg-tan p-6">
                <h3 className="flex items-start gap-2 font-serif text-lg font-medium text-brand-900">
                  <MapPin size={18} className="mt-1 shrink-0 text-brand-700" />
                  {b.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{b.address}</p>
                {b.phone && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="shrink-0 text-brand-700" />
                    {b.phone}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded bg-brand-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-brand-800"
                >
                  <ChevronUp size={14} /> Get Directions
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
      <section className="bg-brand-700 px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <Sparkles className="hidden shrink-0 text-brand-100 sm:block" size={44} strokeWidth={1} />
            <div>
              <h2 className="font-serif text-2xl font-medium text-white sm:text-3xl">
                Ready to achieve a healthier smile?
              </h2>
              <p className="mt-2 text-brand-50/80">
                Book your appointment today and let us take care of your smile.
              </p>
            </div>
          </div>
          <Link
            href="/book"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-cream px-7 py-3 text-sm font-semibold uppercase tracking-wide text-brand-900 hover:bg-white"
          >
            <Calendar size={16} /> Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
