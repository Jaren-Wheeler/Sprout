const authService = require("../services/auth.service");

// =====================================================
// Authentication Controller
// =====================================================
// Handles HTTP requests for authentication routes.
// Delegates business logic to the auth service layer.
// Manages session creation for web authentication.
// =====================================================

const AuthController = {
  async registerUser(req, res, next) {
    try {
      const { fullName, email, password } = req.body;

      const user = await authService.registerUser(fullName, email, password);

      req.session.userId = user.id;

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await authService.loginUser(email, password);

      req.session.userId = user.id;

      res.json(user);
      console.log("SESSION AFTER LOGIN:", req.session);

    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
