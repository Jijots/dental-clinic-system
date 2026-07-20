import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const branches = await Promise.all(
    [
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
    ].map((b) =>
      prisma.branch.upsert({ where: { name: b.name }, update: {}, create: b })
    )
  );

  const [sanFernando, magalang1, , angeles] = branches;

  const dentists = await Promise.all([
    prisma.dentist.create({
      data: { name: "Dr. Jao Briones", branchId: sanFernando.id, commissionRate: 12 },
    }),
    prisma.dentist.create({
      data: { name: "Dr. Caryl Catangui Torres", branchId: magalang1.id, commissionRate: 12 },
    }),
    prisma.dentist.create({
      data: { name: "Dr. Maria Regina Valencia", branchId: angeles.id, commissionRate: 15 },
    }),
  ]);

  await Promise.all(
    [
      { name: "Oral Prophylaxis", category: "General", defaultFee: 500 },
      { name: "Tooth Filling", category: "General", defaultFee: 1000 },
      { name: "Extraction", category: "Oral Surgery", defaultFee: 800 },
      { name: "Braces Consultation", category: "Orthodontics", defaultFee: 500 },
      { name: "Teeth Whitening", category: "Cosmetic Dentistry", defaultFee: 3500 },
    ].map((s) => prisma.service.create({ data: s }))
  );

  await Promise.all(
    ["Intellicare", "Flexicare", "Maxicare", "Medicard"].map((name) =>
      prisma.hmoProvider.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const passwordHash = await bcrypt.hash("psalm23admin", 10);
  await prisma.staffUser.upsert({
    where: { email: "admin@psalm23dentalcare.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@psalm23dentalcare.com",
      passwordHash,
      role: "ADMIN",
      branchId: sanFernando.id,
    },
  });

  console.log("Seeded branches:", branches.map((b) => b.name));
  console.log("Seeded dentists:", dentists.map((d) => d.name));
  console.log("Admin login: admin@psalm23dentalcare.com / psalm23admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
