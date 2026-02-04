const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} = require("../controllers/notes.controller");

// =====================================================
// Notes Routes
// =====================================================
// API endpoints for user notes.
// All routes are protected and require authentication.
// =====================================================

// Create a new note
router.post("/", auth, createNote);

// Retrieve all notes for user
router.get("/", auth, getNotes);

// Retrieve a single note by ID
router.get("/:id", auth, getNote);

// Update a note
router.put("/:id", auth, updateNote);

// Delete a note
router.delete("/:id", auth, deleteNote);

module.exports = router;
