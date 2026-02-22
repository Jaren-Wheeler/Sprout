const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getFitnessInfo,
  updateFitnessInfo,
  createWorkout,
  getWorkouts,
  deleteWorkout,
  createDiet,
  getDiets,
  deleteDiet,
  addDietItem,
  deleteDietItem,
  getDietItems
} = require("../controllers/health.controller");

// =====================================================
// Health Routes (Protected)
// =====================================================

// Fitness info
router.get("/fitness", auth, getFitnessInfo);
router.put("/fitness", auth, updateFitnessInfo);

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
router.delete("/diets/:id/diet_items/:itemId", auth, deleteDietItem);

module.exports = router;
