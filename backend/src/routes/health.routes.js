const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
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
  deletePresetItem
} = require("../controllers/health.controller");


// =====================================================
// Health Routes (Protected)
// =====================================================

// Fitness info
router.get("/fitness", auth, getFitnessInfo);
router.put("/fitness", auth, updateFitnessInfo);
router.get("/weight-history", auth, getWeightHistory);
// Workouts
router.post("/workouts", auth, createWorkout);
router.get("/workouts", auth, getWorkouts);
router.delete("/workouts/:id", auth, deleteWorkout);

// Diets
router.post("/diets", auth, createDiet);
router.get("/diets", auth, getDiets);
router.delete("/diets/:id", auth, deleteDiet);

// Diet Items
router.post("/diets/:id/diet-items", auth, addDietItem);
router.get("/diets/:id/diet-items", auth, getDietItems)
router.delete("/diets/:id/diet-items/:itemId", auth, deleteDietItem);

// Preset Meal Items
router.post("/diets/:id/preset-items", auth, addPresetItem);
router.get("/diets/:id/preset-items", auth, getPresetItems);
router.delete("/diets/:id/preset-items/:itemId", auth, deletePresetItem);

module.exports = router;
