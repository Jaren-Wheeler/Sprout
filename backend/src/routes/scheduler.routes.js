const express = require('express');
const SchedulerController = require('../controllers/scheduler.controller');
const router = express.Router();

/**
 * @route GET api/scheduler/items/:id
 * @desc Get an item from the schedule by ID
 * @access Private
 */
router.get("/scheduler/items/:id",SchedulerController.getScheduleItem);

/**
 * @route POST api/scheduler/items/
 * @desc Create an item and input in the schedule
 * @access Private
 */
router.post("/scheduler/items", SchedulerController.createScheduleItem);

/**
 * @route DELETE api/scheduler/items/:id
 * @desc Delete an item from the schedule by ID
 * @access Private
 */
router.delete("/scheduler/items/:id", SchedulerController.deleteScheduleItem);

/**
 * @route PUT api/scheduler/items/:id
 * @desc Edit an existing item from the schedule by ID
 * @access Private
 */
router.put("/scheduler/items/:id", SchedulerController.editScheduleItem);

module.exports = router;