
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');

// This file should be for user profile functionality AFTER login. Login functionality handled by auth controller //

/**
 * @route GET api/user/:id
 * @desc Get logged-in user information
 * @access Private
 */
router.get("/users/:id", UserController.getUser);

/**
 * @route GET api/scheduler/items/:id
 * @desc Get an item from the schedule by ID
 * @access Private
 */
router.post("/users/register", UserController.registerUser);

module.exports = router;