/*
  Warnings:

  - Made the column `calories` on table `DietItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."DietItem" ALTER COLUMN "calories" SET NOT NULL;
