/*
  Warnings:

  - The values [Breakfast,Lunch,Dinner,Snacks] on the enum `MealType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MealType_new" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS');
ALTER TABLE "public"."DietItem" ALTER COLUMN "meal" TYPE "public"."MealType_new" USING ("meal"::text::"public"."MealType_new");
ALTER TYPE "public"."MealType" RENAME TO "MealType_old";
ALTER TYPE "public"."MealType_new" RENAME TO "MealType";
DROP TYPE "public"."MealType_old";
COMMIT;
