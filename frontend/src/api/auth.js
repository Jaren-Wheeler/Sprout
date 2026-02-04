import { apiFetch } from "./client";

// =====================================================
// Authentication API Module
// =====================================================

/**
 * Registers a new user account.
 *
 * @param {string} fullName - user's full name
 * @param {string} email - user's email address
 * @param {string} password - user's password
 * @returns {Promise<Object>} Newly created user data
 */
export const registerUser = (fullName, email, password) => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: (fullName ?? "").trim(),
      email: (email ?? "").trim(),
      password
    })
  });
};

/**
 * Authenticates an existing user.
 *
 * @param {string} email - user's email address
 * @param {string} password - user's password
 * @returns {Promise<Object>} Authenticated user data
 */
export const loginUser = (email, password) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: (email ?? "").trim(),
      password
    })
  });
};