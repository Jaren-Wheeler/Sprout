const prisma = require("../clients/prisma.client");
const { MealType } = require("@prisma/client");

// =====================================================
// Health Service
// =====================================================
// Handles fitness info, workout templates, and diet
// templates using Prisma ORM.
// =====================================================

/* ================= FITNESS INFO ================= */

/**
 * Get fitness info for user
 */
const getFitnessInfo = async (userId) => {
  return prisma.fitnessInfo.findUnique({
    where: { userId }
  });
};

/**
 * Create or update fitness info
 */
const updateFitnessInfo = async (userId, data) => {

  const existing = await prisma.fitnessInfo.findUnique({
    where: { userId }
  });

  if (existing) {
    return prisma.fitnessInfo.update({
      where: { userId },
      data: {
        currentWeight: data.currentWeight,
        goalWeight: data.goalWeight,
        calorieGoal: data.calorieGoal,
        age: data.age,
        heightFt: data.heightFt,
      }
    });
  }

  return prisma.fitnessInfo.create({
    data: {
      currentWeight: data.currentWeight,
      goalWeight: data.goalWeight,
      calorieGoal: data.calorieGoal,
      age: data.age,
      heightFt: data.heightFt,
      user: {
        connect: { id: userId }
      }
    }
  });
};



/* ================= WORKOUTS ================= */

/**
 * Create workout template
 */
const createWorkout = async (userId, name, notes) => {

  if (!name) {
    const err = new Error("Workout name is required");
    err.status = 400;
    throw err;
  }

  return prisma.workout.create({
    data: {
      name,
      notes: notes || null,
      user: {
        connect: { id: userId }
      }
    }
  });
};

/**
 * Get workouts
 */
const getWorkouts = async (userId) => {
  return prisma.workout.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

/**
 * Delete workout
 */
const deleteWorkout = async (id) => {
  return prisma.workout.delete({
    where: { id }
  });
};


/* ================= DIETS ================= */

/**
 * Create diet template
 */
const createDiet = async (userId, name, description) => {

  if (!name) {
    const err = new Error("Diet name is required");
    err.status = 400;
    throw err;
  }

  return prisma.diet.create({
    data: {
      name,
      description: description || null,
      user: {
        connect: { id: userId }
      }
    }
  });
};

/**
 * Get diets
 */
const getDiets = async (userId) => {
  return prisma.diet.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

/**
 * Delete diet
 */
const deleteDiet = async (id) => {
  return prisma.diet.delete({
    where: { id }
  });
};

/**
 * Add a diet item to the system
 */
const addDietItem = async (dietId, name, meal, presetMeal, calories, protein, carbs, fat, sugar) => {

  if (!name || !meal || calories === undefined || calories === null) {
    const err = Error("Missing required inputs for diet item.");
    err.status = 400;
    throw err;
  }
  

  if (!Object.values(MealType).includes(meal)) {
    const err = Error("Invalid meal type.");
    err.status = 400;
    throw err;
  }
  return prisma.dietItem.create({
    data: {
      name,
      meal,
      presetMeal: presetMeal ?? false,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      diet: {
        connect: {id: dietId}
      }
    }
  })
};

const getDietItems = async (dietId) => {
  return prisma.dietItem.findMany({
    where: { dietId },
    orderBy: { createdAt: "desc" }
  });
}
module.exports = {
  getFitnessInfo,
  updateFitnessInfo,
  createWorkout,
  getWorkouts,
  deleteWorkout,
  createDiet,
  getDiets,
  deleteDiet,
  addDietItem,
  getDietItems
};
