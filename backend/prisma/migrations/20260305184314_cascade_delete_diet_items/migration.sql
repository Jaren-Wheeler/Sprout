/*
  Warnings:

  - Made the column `description` on table `expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."DietItem" DROP CONSTRAINT "DietItem_diet_id_fkey";

-- AlterTable
ALTER TABLE "public"."expenses" ALTER COLUMN "description" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."DietItem" ADD CONSTRAINT "DietItem_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
