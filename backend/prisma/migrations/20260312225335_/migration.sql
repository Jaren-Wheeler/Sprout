/*
  Warnings:

  - You are about to drop the column `brand_name` on the `DietItem` table. All the data in the column will be lost.
  - You are about to drop the column `fdc_id` on the `DietItem` table. All the data in the column will be lost.
  - You are about to drop the column `serving_size` on the `DietItem` table. All the data in the column will be lost.
  - You are about to drop the column `serving_unit` on the `DietItem` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `DietItem` table. All the data in the column will be lost.
  - You are about to drop the column `brandName` on the `food_cache` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DietItem" DROP COLUMN "brand_name",
DROP COLUMN "fdc_id",
DROP COLUMN "serving_size",
DROP COLUMN "serving_unit",
DROP COLUMN "source",
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."PresetMealItems" ADD COLUMN     "quantity" DOUBLE PRECISION,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "public"."food_cache" DROP COLUMN "brandName",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "dataType" TEXT,
ALTER COLUMN "calories" DROP NOT NULL,
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION;
