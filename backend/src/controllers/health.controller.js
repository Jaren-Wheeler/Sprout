const healthService = require("../services/health.service");

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
    const info = await healthService.upsertFitnessInfo(req.user.id, req.body);
    res.json(info);
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

module.exports = {
  getFitnessInfo,
  updateFitnessInfo,
  createWorkout,
  getWorkouts,
  deleteWorkout,
  createDiet,
  getDiets,
  deleteDiet
};
