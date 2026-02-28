/*
  Warnings:

  - You are about to drop the column `presetMeal` on the `DietItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DietItem" DROP COLUMN "presetMeal";

-- CreateTable
CREATE TABLE "public"."PresetMealItems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meal" "public"."MealType" NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "diet_id" TEXT NOT NULL,

    CONSTRAINT "PresetMealItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PresetMealItems" ADD CONSTRAINT "PresetMealItems_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
