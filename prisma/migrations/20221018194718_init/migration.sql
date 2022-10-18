-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE', 'CHEQUE');

-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "current_balance" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "TransactionType" NOT NULL,
    "title" TEXT,
    "prestationId" TEXT,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
