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
        name: "Main Branch",
        address: "123 Rizal Street, Poblacion, Sample City",
        phone: "0900 111 2222",
      },
      {
        name: "Downtown Branch",
        address: "456 Mabini Avenue, Downtown District, Sample City",
        phone: "0900 333 4444",
      },
      {
        name: "Uptown Branch",
        address: "789 Luna Road, Uptown District, Sample City",
        phone: "0900 555 6666",
      },
    ].map((b) =>
      prisma.branch.upsert({ where: { name: b.name }, update: {}, create: b })
    )
  );

  const [main, downtown, uptown] = branches;

  const dentists = await Promise.all([
    prisma.dentist.create({
      data: {
        name: "Dr. Ana Reyes",
        branchId: main.id,
        commissionRate: 12,
        licenseNumber: "100001",
        ptrNumber: "9000001",
      },
    }),
    prisma.dentist.create({
      data: {
        name: "Dr. Mark Santos",
        branchId: downtown.id,
        commissionRate: 12,
        licenseNumber: "100002",
        ptrNumber: "9000002",
      },
    }),
    prisma.dentist.create({
      data: {
        name: "Dr. Liza Cruz",
        branchId: uptown.id,
        commissionRate: 15,
        licenseNumber: "100003",
        ptrNumber: "9000003",
      },
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

  const passwordHash = await bcrypt.hash("brightsideadmin", 10);
  await prisma.staffUser.upsert({
    where: { email: "admin@brightsidedental.example" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@brightsidedental.example",
      passwordHash,
      role: "ADMIN",
      branchId: main.id,
    },
  });

  console.log("Seeded branches:", branches.map((b) => b.name));
  console.log("Seeded dentists:", dentists.map((d) => d.name));
  console.log("Admin login: admin@brightsidedental.example / brightsideadmin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
