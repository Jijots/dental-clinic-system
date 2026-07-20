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

  const services = await Promise.all(
    [
      { name: "Oral Prophylaxis", category: "General", defaultFee: 500 },
      { name: "Tooth Filling", category: "General", defaultFee: 1000 },
      { name: "Extraction", category: "Oral Surgery", defaultFee: 800 },
      { name: "Braces Consultation", category: "Orthodontics", defaultFee: 500 },
      { name: "Teeth Whitening", category: "Cosmetic Dentistry", defaultFee: 3500 },
    ].map((s) => prisma.service.create({ data: s }))
  );

  const hmoProviders = await Promise.all(
    ["Intellicare", "Flexicare", "Maxicare", "Medicard"].map((name) =>
      prisma.hmoProvider.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const [intellicare, , maxicare] = hmoProviders;
  const [dentistMain, dentistDowntown, dentistUptown] = dentists;

  const maria = await prisma.patient.create({
    data: {
      lastName: "Santos",
      firstName: "Maria",
      gender: "Female",
      birthday: new Date("1990-04-12"),
      contactNumber: "0917 100 2001",
      homeAddress: "12 Sampaguita St., Sample City",
      allergies: "Penicillin",
      branchId: main.id,
      hmoProviderId: intellicare.id,
    },
  });
  const juan = await prisma.patient.create({
    data: {
      lastName: "Dela Cruz",
      firstName: "Juan",
      gender: "Male",
      birthday: new Date("1985-11-02"),
      contactNumber: "0917 100 2002",
      homeAddress: "45 Ilang-Ilang St., Downtown District, Sample City",
      branchId: downtown.id,
    },
  });
  const sofia = await prisma.patient.create({
    data: {
      lastName: "Reyes",
      firstName: "Sofia",
      gender: "Female",
      birthday: new Date("1998-02-20"),
      contactNumber: "0917 100 2003",
      homeAddress: "8 Kalachuchi St., Uptown District, Sample City",
      branchId: uptown.id,
      hmoProviderId: maxicare.id,
    },
  });
  await prisma.patient.create({
    data: {
      lastName: "Torres",
      firstName: "Miguel",
      gender: "Male",
      birthday: new Date("2014-06-18"),
      guardianName: "Elena Torres",
      guardianOccupation: "Teacher",
      contactNumber: "0917 100 2004",
      homeAddress: "12 Sampaguita St., Sample City",
      branchId: main.id,
    },
  });

  const mariaTreatment = await prisma.treatmentRecord.create({
    data: {
      patientId: maria.id,
      branchId: main.id,
      dentistId: dentistMain.id,
      date: new Date("2026-07-05"),
      procedure: "Oral Prophylaxis",
      diagnosis: "Mild plaque buildup",
      fee: 500,
      hmoCovered: true,
      hmoProviderId: intellicare.id,
    },
  });
  await prisma.payment.create({
    data: { treatmentRecordId: mariaTreatment.id, amount: 500, paymentType: "CASH" },
  });

  const juanTreatment = await prisma.treatmentRecord.create({
    data: {
      patientId: juan.id,
      branchId: downtown.id,
      dentistId: dentistDowntown.id,
      date: new Date("2026-07-10"),
      toothNumbers: "#26",
      procedure: "Tooth Filling",
      diagnosis: "Caries",
      fee: 1000,
    },
  });
  await prisma.payment.create({
    data: { treatmentRecordId: juanTreatment.id, amount: 500, paymentType: "GCASH" },
  });
  await prisma.odontogramEntry.create({
    data: { patientId: juan.id, toothNumber: 26, surface: "OCCLUSAL", condition: "FILLED" },
  });

  const sofiaTreatment = await prisma.treatmentRecord.create({
    data: {
      patientId: sofia.id,
      branchId: uptown.id,
      dentistId: dentistUptown.id,
      date: new Date("2026-07-15"),
      procedure: "Teeth Whitening",
      fee: 3500,
      hmoCovered: false,
    },
  });
  await prisma.payment.create({
    data: { treatmentRecordId: sofiaTreatment.id, amount: 3500, paymentType: "CARD" },
  });

  await prisma.appointment.create({
    data: {
      branchId: main.id,
      dentistId: dentistMain.id,
      serviceId: services[3].id,
      date: new Date("2026-07-28"),
      time: "10:00",
      requesterName: "Carla Mendoza",
      requesterPhone: "0917 100 2005",
      status: "PENDING",
    },
  });

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
  console.log("Seeded patients: Maria Santos, Juan Dela Cruz, Sofia Reyes, Miguel Torres");
  console.log("Admin login: admin@brightsidedental.example / brightsideadmin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
