const prisma = require("../clients/prisma.client");

// =====================================================
// Notes Service
// =====================================================
// Contains the business logic for managing user notes
// (journal entries). Handles creation, retrieval,
// updates, and deletion using Prisma ORM.
// =====================================================

/**
 * Creates a new note for a user.
 * @param {string} userId
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.content
 * @returns {Object} Created note
 */
const createNote = async (userId, data) => {

  if (!data.title || !data.title.trim()) {
    const err = new Error("Title is required");
    err.status = 400;
    throw err;
  }

  const note = await prisma.note.create({
    data: {
      title: data.title.trim(),
      content: data.content ? data.content.trim() : "",
      userId
    }
  });

  return note;
};

/**
 * Retrieves all notes for a user.
 * @param {string} userId
 * @returns {Array} List of notes
 */
const getNotes = async (userId) => {

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });

  return notes;
};

/**
 * Retrieves a single note by ID.
 * @param {string} userId
 * @param {string} noteId
 * @returns {Object|null} Note
 */
const getNoteById = async (userId, noteId) => {

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId
    }
  });

  return note;
};

/**
 * Updates an existing note.
 * @param {string} userId
 * @param {string} noteId
 * @param {Object} data
 * @returns {Object} Updated note
 */
const updateNote = async (userId, noteId, data) => {

  if (!data.title || !data.title.trim()) {
    const err = new Error("Title is required");
    err.status = 400;
    throw err;
  }

  // Ensure note belongs to this user
  const existing = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId
    }
  });

  if (!existing) {
    const err = new Error("Note not found");
    err.status = 404;
    throw err;
  }

  const updatedNote = await prisma.note.update({
    where: { id: noteId },
    data: {
      title: data.title.trim(),
      content: data.content ? data.content.trim() : ""
    }
  });

  return updatedNote;
};

/**
 * Deletes a note.
 * @param {string} userId
 * @param {string} noteId
 * @returns {void}
 */
const deleteNote = async (userId, noteId) => {

  // Ensure note belongs to this user
  const existing = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId
    }
  });

  if (!existing) {
    const err = new Error("Note not found");
    err.status = 404;
    throw err;
  }

  await prisma.note.delete({
    where: { id: noteId }
  });
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};