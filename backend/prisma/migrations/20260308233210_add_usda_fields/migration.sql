-- AlterTable
ALTER TABLE "public"."DietItem" ADD COLUMN     "brand_name" TEXT,
ADD COLUMN     "fdc_id" INTEGER,
ADD COLUMN     "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" DOUBLE PRECISION DEFAULT 1,
ADD COLUMN     "serving_size" DOUBLE PRECISION,
ADD COLUMN     "serving_unit" TEXT,
ADD COLUMN     "source" TEXT DEFAULT 'manual';
