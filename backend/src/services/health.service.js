const prisma = require('../clients/prisma.client');
const { MealType } = require('@prisma/client');

// =====================================================
// Health Service
// =====================================================
// Handles fitness info and diet templates using Prisma ORM.
// =====================================================

/* ================= FITNESS INFO ================= */

/**
 * Get fitness info for user
 */
const getFitnessInfo = async (userId) => {
  return prisma.fitnessInfo.findUnique({
    where: { userId },
  });
};

/**
 * Create or update fitness info
 */
const updateFitnessInfo = async (userId, data) => {
  const existing = await prisma.fitnessInfo.findUnique({
    where: { userId },
  });

  // ----------------------------
  // CASE 1: PROFILE EXISTS
  // ----------------------------
  if (existing) {
    const updated = await prisma.fitnessInfo.update({
      where: { userId },
      data: {
        currentWeight: data.currentWeight,
        goalWeight: data.goalWeight,
        calorieGoal: data.calorieGoal,
        age: data.age,
        heightFt: data.heightFt,
      },
    });

    // Log weight history only if changed
    if (
      data.currentWeight &&
      existing.currentWeight?.toString() !== data.currentWeight.toString()
    ) {
      await prisma.weightEntry.create({
        data: {
          weight: data.currentWeight,
          userId,
        },
      });
    }

    return updated;
  }

  // ----------------------------
  // CASE 2: PROFILE DOESN'T EXIST
  // ----------------------------
  const created = await prisma.fitnessInfo.create({
    data: {
      currentWeight: data.currentWeight,
      goalWeight: data.goalWeight,
      calorieGoal: data.calorieGoal,
      age: data.age,
      heightFt: data.heightFt,
      user: {
        connect: { id: userId },
      },
    },
  });

  // Log initial weight
  if (data.currentWeight) {
    await prisma.weightEntry.create({
      data: {
        weight: data.currentWeight,
        userId,
      },
    });
  }

  return created;
};

/**
 * Get the weight history of the user
 */
const getWeightHistory = async (userId) => {
  return prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
};

/* ================= DIETS ================= */

/**
 * Create diet template
 */
const createDiet = async (userId, name, description) => {
  if (!name) {
    const err = new Error('Diet name is required');
    err.status = 400;
    throw err;
  }

  return prisma.diet.create({
    data: {
      name,
      description: description || null,
      user: {
        connect: { id: userId },
      },
    },
  });
};

/**
 * Get diets
 */
const getDiets = async (userId) => {
  return prisma.diet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Delete diet
 */
const deleteDiet = async (id) => {
  await prisma.dietItem.deleteMany({
    where: { dietId: id },
  });

  return prisma.diet.delete({
    where: { id },
  });
};

/**
 * Add a diet item to the system
 */
const addDietItem = async (dietId, data) => {
  const {
    name,
    meal,
    calories,
    protein,
    carbs,
    fat,
    sugar,
    quantity,
    unit,
    loggedAt,
  } = data;

  if (!name || !meal || calories === undefined || calories === null) {
    const err = new Error('Missing required inputs for diet item.');
    err.status = 400;
    throw err;
  }

  if (!Object.values(MealType).includes(meal)) {
    const err = new Error('Invalid meal type.');
    err.status = 400;
    throw err;
  }

  return prisma.dietItem.create({
    data: {
      name,
      meal,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      quantity: quantity ?? 1,
      unit: unit ?? 'g',
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      diet: {
        connect: { id: dietId },
      },
    },
  });
};

const getRecentFoods = async (userId) => {
  return prisma.dietItem.findMany({
    where: {
      diet: {
        userId,
      },
    },
    orderBy: {
      loggedAt: 'desc',
    },
    take: 10,
  });
};

const getDietItems = async (dietId) => {
  return prisma.dietItem.findMany({
    where: { dietId },
    orderBy: { loggedAt: 'desc' },
  });
};

const deleteDietItem = async (dietId, itemId) => {
  const item = await prisma.dietItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.dietId !== dietId) {
    const err = new Error('Diet item not found');
    err.status = 404;
    throw err;
  }

  return prisma.dietItem.delete({
    where: { id: itemId },
  });
};

const getPresetItems = async (dietId) => {
  return prisma.presetMealItems.findMany({
    where: { dietId },
  });
};

const addPresetItem = async (
  dietId,
  name,
  meal,
  calories,
  protein,
  carbs,
  fat,
  sugar
) => {
  return prisma.presetMealItems.create({
    data: {
      name,
      meal,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      diet: {
        connect: { id: dietId },
      },
    },
  });
};

const deletePresetItem = async (itemId) => {
  return prisma.presetMealItems.delete({
    where: {
      id: itemId,
    },
  });
};

module.exports = {
  getFitnessInfo,
  updateFitnessInfo,
  getWeightHistory,
  createDiet,
  getDiets,
  deleteDiet,
  addDietItem,
  getDietItems,
  deleteDietItem,
  getPresetItems,
  addPresetItem,
  deletePresetItem,
  getRecentFoods,
};
