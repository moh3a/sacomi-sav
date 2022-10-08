/*
  Warnings:

  - You are about to drop the column `current_delivery_id` on the `config` table. All the data in the column will be lost.
  - You are about to drop the column `current_entry_id` on the `config` table. All the data in the column will be lost.
  - You are about to drop the column `current_job_id` on the `config` table. All the data in the column will be lost.
  - You are about to drop the column `current_order_id` on the `config` table. All the data in the column will be lost.
  - You are about to drop the column `current_prestation_id` on the `config` table. All the data in the column will be lost.
  - Added the required column `current_deliveries_id` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_entries_id` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_jobs_id` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_orders_id` to the `Config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_prestations_id` to the `Config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `config` DROP COLUMN `current_delivery_id`,
    DROP COLUMN `current_entry_id`,
    DROP COLUMN `current_job_id`,
    DROP COLUMN `current_order_id`,
    DROP COLUMN `current_prestation_id`,
    ADD COLUMN `current_deliveries_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `current_entries_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `current_jobs_id` INTEGER NOT NULL,
    ADD COLUMN `current_orders_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `current_prestations_id` VARCHAR(191) NOT NULL;
