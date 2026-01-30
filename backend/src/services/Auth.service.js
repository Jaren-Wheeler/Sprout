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

  // Checks if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Hash password before storing
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user record
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash
    }
  });

  // Return user data
  return {
    id: user.id,
    email: user.email,
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

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare provided password with stored hash
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
};

module.exports = {
  registerUser,
  loginUser
};
