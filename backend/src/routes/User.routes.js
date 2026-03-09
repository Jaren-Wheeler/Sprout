
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');

// This file should be for user profile functionality AFTER login. Login functionality handled by auth controller //

/**
 * @route GET api/user/:id
 * @desc Get logged-in user information
 * @access Private
 */
router.get("/:id", UserController.getProfile);

/**
 * @route DELETE api/scheduler/items/:id
 * @desc Delete account
 * @access Private
 */
router.delete("/:id", UserController.deleteProfile);

/**
 * @route UPDATE api/scheduler/items/:id
 * @desc Update profile information
 * @access Private
 */
router.put("/:id", UserController.editProfile);

/**
 * @route PATCH api/user/onboarding-complete
 * @desc Mark onboarding as completed
 * @access Private
 */
router.patch("/onboarding-complete", UserController.completeOnboarding);


module.exports = router;