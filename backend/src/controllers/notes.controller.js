const notesService = require("../services/notes.service");

// =====================================================
// Notes Controller
// =====================================================
// Handles HTTP requests related to user notes (journal
// entries). Validates request flow and delegates
// business logic to the Notes Service.
// =====================================================

/**
 * Creates a new note.
 * POST /api/notes
 */
const createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const note = await notesService.createNote(userId, req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves all notes for the authenticated user.
 * GET /api/notes
 */
const getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notes = await notesService.getNotes(userId);
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a single note by ID.
 * GET /api/notes/:id
 */
const getNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const note = await notesService.getNoteById(userId, noteId);

    if (!note) {
      const err = new Error("Note not found");
      err.status = 404;
      throw err;
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

/**
 * Updates an existing note.
 * PUT /api/notes/:id
 */
const updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    const updatedNote = await notesService.updateNote(
      userId,
      noteId,
      req.body
    );

    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a note.
 * DELETE /api/notes/:id
 */
const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    await notesService.deleteNote(userId, noteId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
};
