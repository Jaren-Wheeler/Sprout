const schedulerService = require("../services/scheduler.service");

// =====================================================
// Scheduler Controller
// =====================================================
// Handles HTTP requests for calendar events and
// delegates logic to Scheduler Service.
// =====================================================

/**
 * Create event
 * POST /api/scheduler
 */
const createEvent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const event = await schedulerService.createEvent(userId, req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all events
 * GET /api/scheduler
 */
const getEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const events = await schedulerService.getEvents(userId);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete event
 * DELETE /api/scheduler/:id
 */
const deleteEvent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await schedulerService.deleteEvent(userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent
};
