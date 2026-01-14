const express = require("express");
const HealthController = require("../controllers/health.controller");
const router = express.Router();

//----------------------- WORKOUT ROUTES -----------------------------//
/**
 * @route GET api/workouts/:workoutId
 * @desc Get existing workouts by ID
 * @access Private
 */
router.get("/health/workouts/:workoutId", HealthController.getWorkout);

/**
 * @route POST api/workouts/
 * @desc Create new workout
 * @access Private
 */
router.post("/health/workouts", HealthController.createWorkout);

/**
 * @route DELETE api/workouts/:workoutId
 * @desc Delete existing workouts by ID
 * @access Private
 */
router.delete("/health/workouts/:workoutId", HealthController.deleteWorkout);

/**
 * @route UPDATE api/workouts/:workoutId
 * @desc Edit existing workouts by ID
 * @access Private
 */
router.put("/health/workouts/:workoutId", HealthController.editWorkout);



/**
 * @route GET api/health/workouts/:workoutId/items/:itemId
 * @desc  Get existing workouts by ID
 * @access Private
 */
router.get("/health/workouts/:workoutId/items/:itemId", HealthController.getWorkoutItem);

/**
 * @route POST api/health/workouts/:workoutId/items
 * @desc Create new workout item
 * @access Private
 */
router.post("/health/workouts/:workoutId/items", HealthController.createWorkoutItem);

/**
 * @route DELETE /health/workouts/:workoutId/items/:itemId
 * @desc Delete existing workout item by ID
 * @access Private
 */
router.delete("/health/workouts/:workoutId/items/:itemId", HealthController.deleteWorkoutItem);

/**
 * @route UPDATE api/health/workouts/:workoutId/items/:itemId
 * @desc Edit existing workout item by ID
 * @access Private
 */
router.put("/health/workouts/:workoutId/items/:itemId", HealthController.editWorkoutItem);


//----------------------- DIET ROUTES -----------------------------//
/**
 * @route GET api/health/diets/:dietId
 * @desc Get existing diets by ID
 * @access Private
 */
router.get("/health/diets/:dietId", HealthController.getDiet);

/**
 * @route POST api/health/diets
 * @desc Create new diets
 * @access Private
 */
router.post("/health/diets", HealthController.createDiet);

/**
 * @route DELETE api/health/diets/:dietId
 * @desc Delete existing diets by ID
 * @access Private
 */
router.delete("/health/diets/:dietId", HealthController.deleteDiet);

/**
 * @route UPDATE api/health/diets/:dietId
 * @desc Edit existing diets by ID
 * @access Private
 */
router.put("/health/diets/:dietId", HealthController.editDiet);


/**
 * @route GET api/health/diets/:dietId/items/:itemId
 * @desc Get existing diet items by ID
 * @access Private
 */
router.get("/health/diets/:dietId/items/:itemId", HealthController.getDietItem);

/**
 * @route POST api/health/diets/:dietId/items
 * @desc Create new diet items
 * @access Private
 */
router.post("/health/diets/:dietId/items", HealthController.createDietItem);

/**
 * @route DELETE api/health/diets/:dietId/items/:itemId
 * @desc Delete existing notes by ID
 * @access Private
 */
router.delete("/health/diets/:dietId/items/:itemId", HealthController.deleteDietItem);

/**
 * @route UPDATE api/health/diets/:dietId/items/:itemId
 * @desc Edit existing notes by ID
 * @access Private
 */
router.put("/health/diets/:dietId/items/:itemId", HealthController.editDietItem);

module.exports = router;
