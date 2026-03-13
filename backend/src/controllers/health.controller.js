const healthService = require('../services/health.service');

// =====================================================
// Health Controller
// =====================================================
// Handles HTTP requests for health module and
// delegates logic to Health Service.
// =====================================================

/* ================= FITNESS INFO ================= */

const getFitnessInfo = async (req, res, next) => {
  try {
    const info = await healthService.getFitnessInfo(req.user.id);
    res.json(info);
  } catch (err) {
    next(err);
  }
};

const updateFitnessInfo = async (req, res, next) => {
  try {
    const info = await healthService.updateFitnessInfo(req.user.id, req.body);
    res.json(info);
  } catch (err) {
    next(err);
  }
};

const getWeightHistory = async (req, res, next) => {
  try {
    const weights = await healthService.getWeightHistory(req.user.id);
    res.json(weights);
  } catch (err) {
    next(err);
  }
};

/* ================= WORKOUTS ================= */

const createWorkout = async (req, res, next) => {
  try {
    const workout = await healthService.createWorkout(
      req.user.id,
      req.body.name,
      req.body.notes
    );
    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
};

const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await healthService.getWorkouts(req.user.id);
    res.json(workouts);
  } catch (err) {
    next(err);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    await healthService.deleteWorkout(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/* ================= DIETS ================= */

const createDiet = async (req, res, next) => {
  try {
    const diet = await healthService.createDiet(
      req.user.id,
      req.body.name,
      req.body.description
    );
    res.status(201).json(diet);
  } catch (err) {
    next(err);
  }
};

const getDiets = async (req, res, next) => {
  try {
    const diets = await healthService.getDiets(req.user.id);
    res.json(diets);
  } catch (err) {
    next(err);
  }
};

const deleteDiet = async (req, res, next) => {
  try {
    await healthService.deleteDiet(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const addDietItem = async (req, res, next) => {
  try {
    const item = await healthService.addDietItem(req.params.id, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const getDietItems = async (req, res, next) => {
  try {
    const items = await healthService.getDietItems(req.params.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const deleteDietItem = async (req, res, next) => {
  try {
    const { id: dietId, itemId } = req.params;

    await healthService.deleteDietItem(dietId, itemId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getPresetItems = async (req, res, next) => {
  try {
    const items = await healthService.getPresetItems(req.params.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const addPresetItem = async (req, res, next) => {
  try {
    const { name, meal, calories, protein, carbs, fat, sugar, quantity, unit } =
      req.body;
    const item = await healthService.addPresetItem(
      req.params.id,
      name,
      meal,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      quantity,
      unit
    );
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const deletePresetItem = async (req, res, next) => {
  try {
    await healthService.deletePresetItem(req.params.itemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const usdaService = require('../services/usda.service');

/* ================= FOOD SEARCH ================= */

const searchFoods = async (req, res, next) => {
  try {
    const { q } = req.query;
    const foods = await usdaService.searchFoods(q);
    res.json(foods);
  } catch (err) {
    next(err);
  }
};

const getFoodDetails = async (req, res, next) => {
  try {
    const fdcId = Number(req.params.fdcId);

    const food = await usdaService.getFoodDetails(fdcId);

    res.json(food);
  } catch (err) {
    next(err);
  }
};

const getRecentFoods = async (userId) => {
  const items = await prisma.dietItem.findMany({
    where: {
      diet: {
        userId,
      },
    },
    orderBy: {
      loggedAt: 'desc',
    },
    take: 50,
  });

  const seen = new Set();
  const unique = [];

  for (const item of items) {
    const key = item.name.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }

    if (unique.length === 10) break;
  }

  return unique;
};

module.exports = {
  getFitnessInfo,
  updateFitnessInfo,
  getWeightHistory,

  createWorkout,
  getWorkouts,
  deleteWorkout,

  createDiet,
  getDiets,
  deleteDiet,

  addDietItem,
  deleteDietItem,
  getDietItems,

  getPresetItems,
  addPresetItem,
  deletePresetItem,

  searchFoods,
  getFoodDetails,
  getRecentFoods,
};
