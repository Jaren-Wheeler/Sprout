
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User.controller');

// set up scaffolding for future development //

// Route for getting user login information
router.get("/user/login", UserController.loginUser);

// Route for creating an account
router.post("/user/register", UserController.registerUser);

module.exports = router;