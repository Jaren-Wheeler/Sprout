import { apiFetch } from "./client";

// =====================================================
// Notes API Module
// =====================================================
// Frontend functions for journal / notes endpoints
// =====================================================

/**
 * Fetch all notes for the logged in user
 */
export const getNotes = () => {
  return apiFetch("/api/notes");
};

/**
 * Fetch a single note by id
 * @param {string} id
 */
export const getNoteById = (id) => {
  return apiFetch(`/api/notes/${id}`);
};

/**
 * Create a new note
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.content
 */
export const createNote = (data) => {
  return apiFetch("/api/notes", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Update an existing note
 * @param {string} id
 * @param {Object} data
 */
export const updateNote = (id, data) => {
  return apiFetch(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

/**
 * Delete a note
 * @param {string} id
 */
export const deleteNote = (id) => {
  return apiFetch(`/api/notes/${id}`, {
    method: "DELETE"
  });
};
