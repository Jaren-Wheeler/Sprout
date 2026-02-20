-- CreateEnum
CREATE TYPE "public"."MealType" AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snacks');

-- CreateTable
CREATE TABLE "public"."DietItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meal" "public"."MealType" NOT NULL,
    "calories" INTEGER,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "diet_id" TEXT NOT NULL,

    CONSTRAINT "DietItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DietItem" ADD CONSTRAINT "DietItem_diet_id_fkey" FOREIGN KEY ("diet_id") REFERENCES "public"."diets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
