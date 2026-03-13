function normalizeUsdaFood(food) {
  const nutrients = food.foodNutrients || [];

  function getNutrient(names) {
    if (!Array.isArray(names)) names = [names];

    const nutrient = nutrients.find((n) => {
      const name = (n.nutrient?.name || n.nutrientName || '').toLowerCase();
      return names.some((target) => name.includes(target.toLowerCase()));
    });

    return nutrient?.amount ?? nutrient?.value ?? 0;
  }
  const servingSizeOriginal = food.servingSize || null;
  const servingUnitOriginal = food.servingSizeUnit || null;

  const servingSize = food.servingSize || 100;

  const calories = getNutrient(['energy']);
  const protein = getNutrient(['protein']);
  const carbs = getNutrient(['carbohydrate']);
  const fat = getNutrient(['lipid', 'fat']);
  const sugar = getNutrient(['sugars']);

  const scale = servingSize !== 100 ? 100 / servingSize : 1;

  return {
    fdcId: food.fdcId,
    name: food.description,
    brand: food.brandOwner || food.brand || null,

    servingSizeOriginal,
    servingUnitOriginal,

    servingSize: 100,
    servingUnit: 'g',

    calories: Math.round(calories * scale),
    protein: protein * scale,
    carbs: carbs * scale,
    fat: fat * scale,
    sugar: sugar * scale,
  };
}

module.exports = normalizeUsdaFood;
