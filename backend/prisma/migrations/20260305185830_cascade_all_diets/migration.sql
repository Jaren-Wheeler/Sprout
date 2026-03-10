-- DropForeignKey
ALTER TABLE "public"."PresetMealItems" DROP CONSTRAINT "PresetMealItems_diet_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."PresetMealItems" ADD CONSTRAINT "PresetMealItems_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
