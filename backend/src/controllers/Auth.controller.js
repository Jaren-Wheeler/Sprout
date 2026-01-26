const authService = require("../services/auth.service");

// =====================================================
// Authentication Controller
// =====================================================
// Handles HTTP requests for authentication routes.
// Delegates business logic to the auth service layer.
// Manages session creation for web authentication.
// =====================================================

const AuthController = {

  async registerUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await authService.registerUser(email, password);

      // Create session for web authentication
      req.session.userId = user.id;

      res.status(201).json(user);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await authService.loginUser(email, password);

      // Create session for web authentication
      req.session.userId = user.id;

      res.json(user);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = AuthController;
