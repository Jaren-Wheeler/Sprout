const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  createEvent,
  getEvents,
  deleteEvent
} = require("../controllers/scheduler.controller");

// =====================================================
// Scheduler Routes
// =====================================================
// Calendar event API endpoints (protected).
// =====================================================

// Create event
router.post("/", auth, createEvent);

// Get all events
router.get("/", auth, getEvents);

// Delete event
router.delete("/:id", auth, deleteEvent);

module.exports = router;
