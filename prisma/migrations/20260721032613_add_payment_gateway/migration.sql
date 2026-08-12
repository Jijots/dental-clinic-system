-- CreateEnum
CREATE TYPE "PaymentGatewayProvider" AS ENUM ('PAYMONGO', 'MAYA');

-- CreateEnum
CREATE TYPE "PaymentGatewayStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "PaymentGatewayTransaction" (
    "id" TEXT NOT NULL,
    "treatmentRecordId" TEXT NOT NULL,
    "provider" "PaymentGatewayProvider" NOT NULL,
    "status" "PaymentGatewayStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(10,2) NOT NULL,
    "externalId" TEXT NOT NULL,
    "checkoutUrl" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentGatewayTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentGatewayTransaction_paymentId_key" ON "PaymentGatewayTransaction"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_treatmentRecordId_idx" ON "PaymentGatewayTransaction"("treatmentRecordId");

-- CreateIndex
CREATE INDEX "PaymentGatewayTransaction_externalId_idx" ON "PaymentGatewayTransaction"("externalId");

-- AddForeignKey
ALTER TABLE "PaymentGatewayTransaction" ADD CONSTRAINT "PaymentGatewayTransaction_treatmentRecordId_fkey" FOREIGN KEY ("treatmentRecordId") REFERENCES "TreatmentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentGatewayTransaction" ADD CONSTRAINT "PaymentGatewayTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
