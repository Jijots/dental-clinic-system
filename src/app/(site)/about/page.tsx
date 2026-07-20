import { CLINIC_NAME } from "@/lib/site-config";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold font-serif text-brand-900">About Us</h1>
      <p className="mt-4 text-gray-600">
        At {CLINIC_NAME}, we believe every patient deserves to be treated with compassion,
        integrity, and genuine care.
      </p>
    </div>
  );
}
