// user service goes here

const prisma = require("../clients/prisma.client");

const userService = {

  async completeOnboarding(userId) {

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hasSeenOnboarding: true
      }
    });

    return updatedUser;

  }

};

module.exports = userService;