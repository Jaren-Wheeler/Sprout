  const prisma = require("../clients/prisma.client");

// =====================================================
// Scheduler Service
// =====================================================
// Contains business logic for calendar events.
// Handles creation, retrieval, and deletion of event.
// =====================================================

/**
 * Creates a new calendar event.
 * @param {string} userId
 * @param {Object} data
 * @returns {Object} Created event
 */
const createEvent = async (userId, data) => {

  if (!data.title) {
    const err = new Error("Title is required");
    err.status = 400;
    throw err;
  }

  if (!data.startTime) {
    const err = new Error("Start time is required");
    err.status = 400;
    throw err;
  }

  const event = await prisma.calendarEvent.create({
  data: {
    title: data.title,
    description: data.description || null,
    startTime: new Date(data.startTime),
    endTime: data.endTime ? new Date(data.endTime) : null,

    user: {
      connect: { id: userId }
    }
  }
});


  return event;
};

/**
 * Retrieves all calendar events for a user.
 * @param {string} userId
 * @returns {Array} Events
 */
const getEvents = async (userId) => {

  const events = await prisma.calendarEvent.findMany({
    where: { userId },
    orderBy: { startTime: "desc" }
  });

  return events;
};

/**
 * Deletes a calendar event.
 * @param {string} userId
 * @param {string} eventId
 */
const deleteEvent = async (userId, eventId) => {

  await prisma.calendarEvent.delete({
    where: { id: eventId }
  });
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent
};
