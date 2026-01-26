const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Log in user using credentials
 * @access Public
 */
router.post("/login", AuthController.loginUser);

/**
 * @route POST /api/auth/register
 * @desc Register user information
 * @access Public
 */
router.post("/register", AuthController.registerUser);

module.exports = router;
