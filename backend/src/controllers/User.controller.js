const userService = require("../services/user.service");

const UserController = {

  async getProfile(req, res, next) {
   
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