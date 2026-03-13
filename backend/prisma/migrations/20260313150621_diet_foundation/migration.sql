/*
  Warnings:

  - You are about to drop the column `servingSize` on the `food_cache` table. All the data in the column will be lost.
  - You are about to drop the column `servingUnit` on the `food_cache` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."fitness_info" ADD COLUMN     "carbs_goal" INTEGER,
ADD COLUMN     "fat_goal" INTEGER,
ADD COLUMN     "protein_goal" INTEGER;

-- AlterTable
ALTER TABLE "public"."food_cache" DROP COLUMN "servingSize",
DROP COLUMN "servingUnit",
ADD COLUMN     "serving_size" DOUBLE PRECISION,
ADD COLUMN     "serving_size_original" DOUBLE PRECISION,
ADD COLUMN     "serving_unit" TEXT,
ADD COLUMN     "serving_unit_original" TEXT;
