-- AlterTable: orders - Add shipping_cost and vat_amount columns
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_cost" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "vat_amount" INTEGER NOT NULL DEFAULT 0;
