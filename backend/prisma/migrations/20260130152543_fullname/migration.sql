/*
  Warnings:

  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_budget_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "full_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
