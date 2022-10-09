-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TECHNICIAN', 'RECEPTION', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "fullName" TEXT,
    "password" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TECHNICIAN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "product_model" TEXT NOT NULL,
    "product_brand" TEXT,
    "product_type" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "observations" TEXT,
    "contact" TEXT,
    "phone_number" TEXT,
    "status" TEXT,
    "type" TEXT,
    "wilaya" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" UUID NOT NULL,
    "entry_id" TEXT NOT NULL,
    "observations" TEXT,
    "entry_date" TEXT,
    "entry_time" TEXT,
    "warranty" TEXT,
    "global" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" UUID NOT NULL,
    "job_id" INTEGER NOT NULL,
    "entryId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "prestation_id" TEXT,
    "awaiting_intervention" TEXT,
    "warranty" TEXT,
    "repaired_date" TEXT,
    "exit_date" TEXT,
    "designation" TEXT,
    "diagnostic" TEXT,
    "status" TEXT,
    "serial_number" TEXT,
    "new_serial_number" TEXT,
    "localisation" TEXT,
    "technician" TEXT,
    "entry_subid" TEXT,
    "product_same_model" TEXT,
    "used_parts" TEXT,
    "spare_parts" TEXT,
    "rma_asus" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" UUID NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "delivery_date" TEXT,
    "clientId" TEXT NOT NULL,
    "entry_id" TEXT,
    "sage_exit_id" TEXT,
    "delivery_date_1" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "order_id" TEXT NOT NULL,
    "order_content" TEXT,
    "observations" TEXT,
    "order_date" TEXT,
    "receipt_date" TEXT,
    "sage_entry_id" TEXT,
    "quantity" TEXT,
    "payment" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestation" (
    "id" UUID NOT NULL,
    "prestation_id" TEXT NOT NULL,
    "prestation_date" TEXT,
    "clientId" TEXT NOT NULL,
    "observations" TEXT,
    "is_paid" TEXT,
    "to_bill" TEXT,
    "recovery_date" TEXT,
    "payment_date" TEXT,
    "total_amount" TEXT,
    "invoice" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Prestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrestationDetails" (
    "id" UUID NOT NULL,
    "prestationId" TEXT NOT NULL,
    "is_paid" TEXT,
    "to_bill" TEXT,
    "payment_date" TEXT,
    "payment_method" TEXT,
    "invoice" TEXT,
    "prestation_date" TEXT,
    "designation" TEXT,
    "price_ht" TEXT,
    "price_ttc" TEXT,
    "quantity" TEXT,
    "subtotal" TEXT,
    "total_amount" TEXT,
    "observations" TEXT,

    CONSTRAINT "PrestationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" UUID NOT NULL,
    "current_entries_id" TEXT NOT NULL,
    "current_deliveries_id" TEXT NOT NULL,
    "current_jobs_id" INTEGER NOT NULL,
    "current_orders_id" TEXT NOT NULL,
    "current_prestations_id" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_model_key" ON "Product"("product_model");

-- CreateIndex
CREATE INDEX "Product_product_model_idx" ON "Product"("product_model");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_entry_id_key" ON "Entry"("entry_id");

-- CreateIndex
CREATE INDEX "Entry_entry_id_entry_date_idx" ON "Entry"("entry_id", "entry_date");

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_id_key" ON "Job"("job_id");

-- CreateIndex
CREATE INDEX "Job_job_id_idx" ON "Job"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_delivery_id_key" ON "Delivery"("delivery_id");

-- CreateIndex
CREATE INDEX "Delivery_delivery_id_idx" ON "Delivery"("delivery_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_id_key" ON "Order"("order_id");

-- CreateIndex
CREATE INDEX "Order_order_id_idx" ON "Order"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Prestation_prestation_id_key" ON "Prestation"("prestation_id");

-- CreateIndex
CREATE INDEX "Prestation_prestation_id_idx" ON "Prestation"("prestation_id");
