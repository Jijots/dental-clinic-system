import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Healthy Smiles Start Here
        </p>
        <h1 className="mt-2 text-4xl font-bold font-serif text-brand-900">
          Founded on Faith, Guided by Compassion.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Providing trusted dental care for individuals and families across Pampanga.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/book"
            className="rounded-md bg-brand-700 px-6 py-3 font-medium text-white hover:bg-brand-800"
          >
            Book Appointment
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-brand-700 px-6 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <section className="mt-24 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-cream p-6">
          <h2 className="text-xl font-semibold font-serif text-brand-900">Orthodontics</h2>
          <p className="mt-2 text-gray-600">
            Straighten your smile with braces and clear aligners.
          </p>
        </div>
        <div className="rounded-lg bg-cream p-6">
          <h2 className="text-xl font-semibold font-serif text-brand-900">Cosmetic Dentistry</h2>
          <p className="mt-2 text-gray-600">
            Enhance your smile with whitening, veneers, and smile makeovers.
          </p>
        </div>
      </section>
    </div>
  );
}
