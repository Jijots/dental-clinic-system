/**
 * Wipes all data and reseeds the demo dataset.
 *
 * Intended for the sales/portfolio demo deployment only, so the demo can be
 * returned to a known-good state before a call. It is deliberately awkward to
 * run: it requires ALLOW_DEMO_RESET=true, prints the database host it is about
 * to destroy, and refuses outright if the database looks like a real clinic.
 *
 *   ALLOW_DEMO_RESET=true npm run db:reset
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { seedDemoData } from "./seed";

const DEMO_ADMIN_EMAIL = "admin@brightsidedental.example";

function databaseHost(url: string | undefined): string {
  if (!url) return "unknown";
  return url.match(/@([^/?]+)/)?.[1] ?? "unknown";
}

async function main() {
  if (process.env.ALLOW_DEMO_RESET !== "true") {
    console.error(
      "Refusing to run: this deletes every row in the database.\n" +
        "Re-run with ALLOW_DEMO_RESET=true if that is really what you want."
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Refusing to run: DATABASE_URL is not set.");
    process.exit(1);
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(`Target database: ${databaseHost(process.env.DATABASE_URL)}`);

    // Guard: a real deployment has staff accounts that aren't the demo admin.
    const realStaff = await prisma.staffUser.findMany({
      where: { email: { not: DEMO_ADMIN_EMAIL } },
      select: { email: true },
    });
    if (realStaff.length > 0) {
      console.error(
        `Refusing to run: found ${realStaff.length} non-demo staff account(s).\n` +
          "This looks like a real clinic's database, not the demo. Aborting."
      );
      process.exit(1);
    }

    // Children first, so foreign keys never block a delete.
    console.log("Clearing existing data...");
    await prisma.paymentGatewayTransaction.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.odontogramEntry.deleteMany();
    await prisma.generatedDocument.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.treatmentRecord.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.dentist.deleteMany();
    await prisma.staffUser.deleteMany();
    await prisma.service.deleteMany();
    await prisma.hmoProvider.deleteMany();
    await prisma.branch.deleteMany();

    console.log("Reseeding demo data...");
    const result = await seedDemoData(prisma);

    console.log("\nDemo reset complete.");
    console.log(`  Branches:  ${result.branches.join(", ")}`);
    console.log(`  Dentists:  ${result.dentists.join(", ")}`);
    console.log(`  Patients:  ${result.patients.join(", ")}`);
    console.log(
      `  Pending:   ${result.pendingAppointment.date} ${result.pendingAppointment.time} (Carla Mendoza)`
    );
    console.log(`  Admin:     ${result.adminEmail} / <DEMO_ADMIN_PASSWORD>`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
