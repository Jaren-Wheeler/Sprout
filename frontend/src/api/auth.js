import { apiFetch } from "./client";

// =====================================================
// Authentication API Module
// =====================================================
// Contains frontend functions for interacting with
// authentication-related backend endpoints.
// =====================================================

/**
 * Registers a new user account.
 *
 * @param {string} email - User email address
 * @param {string} password - User password 
 * @param {string} fullName - user full name
 * @returns {Promise<Object>} Newly created user data
 */
export const registerUser = (fullName, email, password) => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName,
      email,
      password
    })
  });
};


/**
 * Authenticates an existing user.
 *
 * @param {string} email - User email address
 * @param {string} password - User password 
 * @returns {Promise<Object>} Authenticated user data
 */
export const loginUser = (email, password) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
};
