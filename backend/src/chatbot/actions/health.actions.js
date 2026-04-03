const healthService = require("../../services/health.service");

// Entry point used by actionRouter.js
async function handle(ai, user) {
  console.log("Health action received:", ai.name);
  switch (ai.name) {
    case "add_info":
      return addInfo(ai, user);

    case "change_info":
      return changeInfo(ai, user);

    case "create_diet":
      return createDiet(ai, user);

    case "delete_diet":
      return deleteDiet(ai, user);
    
    case "log_food":
      return logFood(ai, user);

    case "update_food":
      return updateFood(ai, user);

    case "delete_food":
      return deleteFood(ai, user);

    case "create_preset_meal":
      return createPresetMeal(ai, user);

    case "delete_preset_meal":
      return deletePresetMeal(ai, user);

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

/* ================= FITNESS INFO ================= */

async function addInfo(ai, user) {
  const {
    currentWeight,
    goalWeight,
    calorieGoal,
    age,
    heightFt
  } = ai.params || {};

  if (!currentWeight || !goalWeight || !calorieGoal) {
    return {
      role: "assistant",
      content: "I need your current weight, goal weight, and calorie goal."
    };
  }

  await healthService.updateFitnessInfo(user.id, {
    currentWeight,
    goalWeight,
    calorieGoal,
    age,
    heightFt
  });

  return {
    role: "assistant",
    content: "Your fitness information has been saved."
  };
}

async function changeInfo(ai, user) {
  const params = ai.params || {};

  if (!Object.keys(params).length) {
    return {
      role: "assistant",
      content: "What information would you like to change?"
    };
  }

  await healthService.updateFitnessInfo(user.id, params);

  return {
    role: "assistant",
    content: "Your fitness information has been updated."
  };
}

/* ================= DIETS ================= */

async function createDiet(ai, user) {
  const { name, description } = ai.params || {};

  if (!name) {
    return {
      role: "assistant",
      content: "What would you like to name the diet?"
    };
  }

  try {
    await healthService.createDiet(user.id, name, description);

    return {
      role: "assistant",
      content: `Diet "${name}" has been created.`
    };
  } catch (err) {
    if (err?.status === 409) {
      return {
        role: "assistant",
        content: `A diet named "${name}" already exists.`
      };
    }

    throw err;
  }
}

async function deleteDiet(ai, user) {
  const { name } = ai.params || {};

  if (!name) {
    return {
      role: "assistant",
      content: "Which diet would you like to delete?"
    };
  }

  const diets = await healthService.getDiets(user.id);

  const matches = diets.filter(
    (d) => d.name?.toLowerCase() === name.toLowerCase()
  );

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn’t find a diet named "${name}".`
    };
  }

  if (matches.length > 1) {
    const numberedOptions = matches
      .map((diet, index) => {
        const createdAtLabel = diet.createdAt
          ? new Date(diet.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            })
          : "unknown time";

        return `${index + 1}. ${diet.name} — created ${createdAtLabel}`;
      })
      .join(" ");

    return {
      role: "assistant",
      content: `I found multiple diets named "${name}". Which one would you like to delete? ${numberedOptions}`
    };
  }

  await healthService.deleteDiet(matches[0].id);

  return {
    role: "assistant",
    content: `The diet "${name}" has been deleted.`
  };
}

/* ================= FOOD LOGGING ================= */

async function logFood(ai, user) {
  const {
    dietName,
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar
  } = ai.params || {};

  if (!dietName) {
    return {
      role: "assistant",
      content: "Which diet should this food be logged to?"
    };
  }

  if (!name || !meal || calories === undefined) {
    return {
      role: "assistant",
      content: "I need the food name, meal type, and calories."
    };
  }

  const diets = await healthService.getDiets(user.id);

  const diet = diets.find(
    (d) => d.name?.toLowerCase() === dietName.toLowerCase()
  );

  if (!diet) {
    return {
      role: "assistant",
      content: `I couldn't find a diet named "${dietName}".`
    };
  }

  await healthService.addDietItem(diet.id, {
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar
  });

  return {
    role: "assistant",
    content: `"${name}" has been added to your ${String(meal).toLowerCase()} for the "${dietName}" diet.`
  };
}

async function updateFood(ai, user) {
  const {
    dietName,
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar
  } = ai.params || {};

  if (!dietName || !name) {
    return {
      role: "assistant",
      content: "I need the diet name and food name."
    };
  }

  const diets = await healthService.getDiets(user.id);

  const diet = diets.find(
    (d) => d.name?.toLowerCase() === dietName.toLowerCase()
  );

  if (!diet) {
    return {
      role: "assistant",
      content: `I couldn't find a diet named "${dietName}".`
    };
  }

  const items = await healthService.getDietItems(diet.id);

  let matches = items.filter(
    (i) => i.name?.toLowerCase() === name.toLowerCase()
  );

  if (meal) {
    matches = matches.filter(
      (i) => String(i.meal).toLowerCase() === String(meal).toLowerCase()
    );
  }

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn’t find "${name}" in the "${dietName}" diet.`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `I found multiple items named "${name}" in the "${dietName}" diet. Please specify the meal.`
    };
  }

  const existingItem = matches[0];

  await healthService.updateDietItem(diet.id, existingItem.id, {
    name: existingItem.name,
    meal: meal || existingItem.meal,
    calories: calories !== undefined ? calories : existingItem.calories,
    protein: protein !== undefined ? protein : existingItem.protein,
    carbs: carbs !== undefined ? carbs : existingItem.carbs,
    fat: fat !== undefined ? fat : existingItem.fat,
    sugar: sugar !== undefined ? sugar : existingItem.sugar
  });

  return {
    role: "assistant",
    content: `"${existingItem.name}" has been updated in the "${dietName}" diet.`
  };
}

async function deleteFood(ai, user) {
  const { dietName, name } = ai.params || {};

  if (!dietName || !name) {
    return {
      role: "assistant",
      content: "I need the diet name and food name."
    };
  }

  const diets = await healthService.getDiets(user.id);

  const diet = diets.find(
    (d) => d.name?.toLowerCase() === dietName.toLowerCase()
  );

  if (!diet) {
    return {
      role: "assistant",
      content: `I couldn't find a diet named "${dietName}".`
    };
  }

  const items = await healthService.getDietItems(diet.id);

  const matches = items.filter(
    (i) => i.name?.toLowerCase() === name.toLowerCase()
  );

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn’t find "${name}" in the "${dietName}" diet.`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `There are multiple items named "${name}". Please be more specific.`
    };
  }

  await healthService.deleteDietItem(diet.id, matches[0].id);

  return {
    role: "assistant",
    content: `"${name}" has been removed from the diet.`
  };
}

/* ================= PRESET MEALS ================= */

async function createPresetMeal(ai, user) {
  const {
    dietName,
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar
  } = ai.params || {};

  if (!dietName || !name || !meal) {
    return {
      role: "assistant",
      content: "I need the diet name, meal name, and meal type."
    };
  }

  const diets = await healthService.getDiets(user.id);

  const diet = diets.find(
    (d) => d.name?.toLowerCase() === dietName.toLowerCase()
  );

  if (!diet) {
    return {
      role: "assistant",
      content: `I couldn't find a diet named "${dietName}".`
    };
  }

  await healthService.addPresetItem(
    diet.id,
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar
  );

  return {
    role: "assistant",
    content: `Preset meal "${name}" has been created for the "${dietName}" diet.`
  };
}

async function deletePresetMeal(ai, user) {
  const { dietName, name } = ai.params || {};

  if (!dietName || !name) {
    return {
      role: "assistant",
      content: "I need the diet name and preset meal name."
    };
  }

  const diets = await healthService.getDiets(user.id);

  const diet = diets.find(
    (d) => d.name?.toLowerCase() === dietName.toLowerCase()
  );

  if (!diet) {
    return {
      role: "assistant",
      content: `I couldn't find a diet named "${dietName}".`
    };
  }

  const presets = await healthService.getPresetItems(diet.id);

  const matches = presets.filter(
    (p) => p.name?.toLowerCase() === name.toLowerCase()
  );

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn’t find a preset meal named "${name}".`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `I found multiple preset meals named "${name}". Please be more specific.`
    };
  }

  await healthService.deletePresetItem(matches[0].id);

  return {
    role: "assistant",
    content: `The preset meal "${name}" has been deleted.`
  };
}

module.exports = {
  handle
};