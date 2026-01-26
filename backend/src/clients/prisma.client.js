const { PrismaClient } = require("@prisma/client");

// =====================================================
// Prisma Client
// =====================================================
// Centralized Prisma client instance used across
// the backend for all database operations.
// =====================================================

const prisma = new PrismaClient();

module.exports = prisma;
