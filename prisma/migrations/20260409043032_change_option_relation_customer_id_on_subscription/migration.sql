/*
  Warnings:

  - Made the column `customer_id` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "customer_id" SET NOT NULL;
