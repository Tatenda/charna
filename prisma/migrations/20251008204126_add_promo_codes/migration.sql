-- CreateTable: promo_codes
CREATE TABLE "promo_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" TEXT NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "max_uses_per_user" INTEGER DEFAULT 1,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "minimum_order_value" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: promo_code_usage
CREATE TABLE "promo_code_usage" (
    "id" SERIAL NOT NULL,
    "promo_code_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "customer_email" TEXT NOT NULL,
    "discount_applied" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");

-- AddForeignKey
ALTER TABLE "promo_code_usage" ADD CONSTRAINT "promo_code_usage_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: orders - Add new columns for promo codes
-- Add columns one by one to avoid losing data
ALTER TABLE "orders" ADD COLUMN "subtotal" INTEGER;
ALTER TABLE "orders" ADD COLUMN "discount_amount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "orders" ADD COLUMN "promo_code_id" INTEGER;
ALTER TABLE "orders" ADD COLUMN "promo_code_used" TEXT;
ALTER TABLE "orders" ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Migrate existing data: set subtotal to totalAmount for existing orders
UPDATE "orders" SET "subtotal" = "total_amount" WHERE "subtotal" IS NULL;

-- Make subtotal NOT NULL after data migration
ALTER TABLE "orders" ALTER COLUMN "subtotal" SET NOT NULL;

-- AddForeignKey for orders -> promo_codes
ALTER TABLE "orders" ADD CONSTRAINT "orders_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

