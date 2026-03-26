const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
} = require('../controllers/scheduler.controller');

// =====================================================
// Scheduler Routes
// =====================================================
// Calendar event API endpoints (protected).
// =====================================================

// Create event
router.post('/', auth, createEvent);

// Get all events
router.get('/', auth, getEvents);

// Delete event
router.delete('/:id', auth, deleteEvent);

// Edit event
router.put('/:id', auth, updateEvent);

module.exports = router;
