import { apiFetch } from "./client";

// =====================================================
// Scheduler API Module
// =====================================================
// Frontend functions for calendar event endpoints
// =====================================================

/**
 * Fetch all events for logged in user
 */
export const getEvents = () => {
  return apiFetch("/api/scheduler");
};

/**
 * Create a new event
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.description
 * @param {string} data.startTime
 * @param {string} data.endTime
 */
export const createEvent = (data) => {
  return apiFetch("/api/scheduler", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Delete an event
 * @param {string} id
 */
export const deleteEvent = (id) => {
  return apiFetch(`/api/scheduler/${id}`, {
    method: "DELETE"
  });
};
