function normalizeUsdaFood(food) {
  const nutrients = food.foodNutrients || [];

  function getNutrient(name) {
    const nutrient = nutrients.find(
      (n) => n.nutrient?.name === name || n.nutrientName === name
    );

    return nutrient?.amount ?? nutrient?.value ?? null;
  }

  return {
    fdcId: food.fdcId,
    name: food.description,
    brandName: food.brandOwner || food.brandName || null,

    servingSize: food.servingSize || 100,
    servingUnit: food.servingSizeUnit || 'g',

    calories: Math.round(getNutrient('Energy') || 0),
    protein: getNutrient('Protein'),
    carbs: getNutrient('Carbohydrate, by difference'),
    fat: getNutrient('Total lipid (fat)'),
    sugar: getNutrient('Sugars, total including NLEA'),
  };
}

module.exports = normalizeUsdaFood;
