export default function scaleNutrition(food, grams) {
  if (!food) return null;

  // Manual foods already contain final values
  if (!food.servingSize) {
    return {
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      sugar: food.sugar || 0,
    };
  }

  const servingSize = food.servingSize || 100;
  const factor = grams / servingSize;

  return {
    calories: Math.round((food.calories || 0) * factor),
    protein: Number(((food.protein || 0) * factor).toFixed(1)),
    carbs: Number(((food.carbs || 0) * factor).toFixed(1)),
    fat: Number(((food.fat || 0) * factor).toFixed(1)),
    sugar: Number(((food.sugar || 0) * factor).toFixed(1)),
  };
}
