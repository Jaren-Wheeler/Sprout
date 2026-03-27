const prisma = require('../clients/prisma.client');

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
    const err = new Error('Title is required');
    err.status = 400;
    throw err;
  }

  if (!data.startTime) {
    const err = new Error('Start time is required');
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
        connect: { id: userId },
      },
    },
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
    orderBy: { startTime: 'desc' },
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
    where: { id: eventId },
  });
};

const updateEvent = async (userId, eventId, data) => {
  if (!data.title) {
    const err = new Error('Title is required');
    err.status = 400;
    throw err;
  }

  if (!data.startTime) {
    const err = new Error('Start time is required');
    err.status = 400;
    throw err;
  }

  return prisma.calendarEvent.update({
    where: {
      id: eventId,
      userId,
    },
    data: {
      title: data.title,
      description: data.description || null,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
    },
  });
};

const MAX_PINNED = 3;

const togglePinEvent = async (userId, eventId) => {
  const event = await prisma.calendarEvent.findFirst({
    where: { id: eventId, userId },
  });

  if (!event) {
    const err = new Error('Event not found');
    err.status = 404;
    throw err;
  }

  // If already pinned → unpin
  if (event.isPinned) {
    return prisma.calendarEvent.update({
      where: { id: eventId },
      data: {
        isPinned: false,
        pinnedAt: null,
      },
    });
  }

  // Count current pinned events
  const pinnedCount = await prisma.calendarEvent.count({
    where: { userId, isPinned: true },
  });

  if (pinnedCount >= MAX_PINNED) {
    const err = new Error('Maximum of 3 pinned events allowed');
    err.status = 400;
    throw err;
  }

  // Pin event
  return prisma.calendarEvent.update({
    where: { id: eventId },
    data: {
      isPinned: true,
      pinnedAt: new Date(),
    },
  });
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
  togglePinEvent,
};
