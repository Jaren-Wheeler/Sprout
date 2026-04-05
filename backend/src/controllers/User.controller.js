const userService = require("../services/user.service");

const UserController = {

  async getProfile(req, res, next) {
    try {
      const userId = req.params.id ?? req.session.userId;
      const user = await userService.getProfile(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async deleteProfile(req, res, next) {
    
  },

  async editProfile(req, res, next) {
    
  },

  async completeOnboarding(req, res, next) {
    try {
      const userId = req.session.userId;

      const user = await userService.completeOnboarding(userId);

      res.json({
        message: "Onboarding completed",
        user
      });

    } catch (error) {
      next(error);
    }
  }

};

module.exports = UserController;
