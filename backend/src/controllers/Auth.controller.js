const UserService = require("../services/User.service");

const AuthController = {
  async registerUser(req, res) {
    try {
      const { email, password } = req.body;

      // hashing will come later
      const passwordHash = password;

      const user = await UserService.createUser({
        email,
        passwordHash,
      });

      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  async loginUser(req, res) {
    try {
      const { email } = req.body;

      const user = await UserService.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  },
};

module.exports = AuthController;
