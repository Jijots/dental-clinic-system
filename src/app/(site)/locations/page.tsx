const BRANCHES = [
  {
    name: "San Fernando Branch",
    address: "Fortune Royale Phase 5 Commercial 7, Panipuan, City of San Fernando, Pampanga",
    phone: "0998 429 6160",
  },
  {
    name: "Magalang 1st Floor Branch",
    address: "Paras Commercial Center Magalang, Cor. Lacson St., San Pedro I, Magalang, Pampanga",
    phone: "0928 406 7278",
  },
  {
    name: "Magalang 2nd Floor Branch",
    address: "Paras Commercial Center Magalang, Cor. Lacson St., San Pedro I, Magalang, Pampanga",
    phone: "0928 406 7278",
  },
  {
    name: "Angeles Branch",
    address: "11C Unit E Rivera Blvd., Marisol Plaza, Brgy. Ninoy Aquino, Angeles City",
    phone: "0962 359 7957",
  },
];

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Our Locations</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {BRANCHES.map((branch) => (
          <div key={branch.name} className="rounded-lg border p-6">
            <h2 className="font-semibold text-gray-900">{branch.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{branch.address}</p>
            <p className="mt-1 text-sm text-gray-600">📞 {branch.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
