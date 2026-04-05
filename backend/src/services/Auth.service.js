const bcrypt = require("bcrypt");
const prisma = require("../clients/prisma.client");

// =====================================================
// Authentication Service
// =====================================================
// Contains the business logic for user registration
// and authentication. Handles password hashing and
// credential validation using Prisma ORM.
// =====================================================

/**
 * Registers a new user account.
 * @param {string} email
 * @param {string} password
 * @returns {Object} Safe user data
 */
const registerUser = async (fullName, email, password) => {

  // Basic validation
  if (!fullName) {
    const err = new Error("Full name is required");
    err.status = 400;
    throw err;
  }

  if (!email) {
    const err = new Error("Email is required");
    err.status = 400;
    throw err;
  }

  if (!password) {
    const err = new Error("Password is required");
    err.status = 400;
    throw err;
  }

  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash
    }
  });

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    hasSeenOnboarding: user.hasSeenOnboarding,
    createdAt: user.createdAt
  };
};

/**
 * Authenticates an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Object} Safe user data
 */
const loginUser = async (email, password) => {

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    const err = new Error("Invalid email or password");
    err.status = 401;
    throw err;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    hasSeenOnboarding: user.hasSeenOnboarding,
    createdAt: user.createdAt
  };
};

module.exports = {
  registerUser,
  loginUser
};
