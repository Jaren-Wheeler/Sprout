// user service goes here

const prisma = require("../clients/prisma.client");

const userService = {
  async getProfile(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        hasSeenOnboarding: true,
        createdAt: true,
      },
    });
  },

  async completeOnboarding(userId) {

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hasSeenOnboarding: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        hasSeenOnboarding: true,
        createdAt: true,
      }
    });

    return updatedUser;

  }

};

module.exports = userService;
