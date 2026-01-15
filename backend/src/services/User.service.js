const prisma = require("../db/prisma");

async function createUser({ email, passwordHash }) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};