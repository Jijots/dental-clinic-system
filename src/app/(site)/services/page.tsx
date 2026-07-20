const SERVICES = [
  { name: "Orthodontics", description: "Braces and clear aligners." },
  { name: "Cosmetic Dentistry", description: "Whitening, veneers, and smile makeovers." },
  { name: "Oral Surgery", description: "Wisdom tooth removal and more." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Services</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {SERVICES.map((service) => (
          <div key={service.name} className="rounded-lg border p-6">
            <h2 className="font-semibold text-gray-900">{service.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
