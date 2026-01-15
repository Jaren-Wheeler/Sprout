require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      passwordHash: "hashed",
    },
  });

  console.log(user);
  await prisma.$disconnect();
})();
