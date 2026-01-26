// =====================================================
// API Client Wrapper
// =====================================================
// Provides a centralized wrapper around the Fetch API
// for making HTTP requests to the backend.
// Handles base URL configuration, JSON headers,
// credential inclusion for session-based auth,
// and standardized error handling.
// =====================================================

/**
 * Base URL for backend API requests.
 * Uses environment variable when available,
 * otherwise defaults to local development server.
 */
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Wrapper function for API requests.
 *
 * @param {string} path - API endpoint path (e.g. "/api/auth/login")
 * @param {Object} options - Fetch configuration options
 * @returns {Promise<Object>} Parsed JSON response data
 * @throws {Error} When the request fails or backend returns an error
 */
export const apiFetch = async (path, options = {}) => {

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // Include cookies for session-based authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();

  // Standardized error handling for failed requests
  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? "Request failed");
  }

  return data;
};
