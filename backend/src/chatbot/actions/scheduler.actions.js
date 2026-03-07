const schedulerService = require("../../services/scheduler.service");

// Entry point used by actionRouter.js
async function handle(ai, user) {

  switch (ai.name) {

    case "create_event":
      return createEvent(ai, user);

    case "delete_event":
      return deleteEvent(ai, user);

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

/* ================= CREATE EVENT ================= */

async function createEvent(ai, user) {

  const { title, description, startTime, endTime } = ai.params || {};

  if (!title) {
    return {
      role: "assistant",
      content: "What is the title of the event?"
    };
  }

  if (!startTime) {
    return {
      role: "assistant",
      content: "When does the event start?"
    };
  }

  await schedulerService.createEvent(user.id, {
    title,
    description,
    startTime,
    endTime
  });

  return {
    role: "assistant",
    content: `Your event "${title}" has been scheduled.`
  };
}

/* ================= DELETE EVENT ================= */

async function deleteEvent(ai, user) {

  const { title } = ai.params || {};

  if (!title) {
    return {
      role: "assistant",
      content: "Which event would you like to delete?"
    };
  }

  const events = await schedulerService.getEvents(user.id);

  const matches = events.filter(
    e => e.title?.toLowerCase() === title.toLowerCase()
  );

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn't find an event titled "${title}".`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `I found multiple events titled "${title}". Please be more specific.`
    };
  }

  await schedulerService.deleteEvent(user.id, matches[0].id);

  return {
    role: "assistant",
    content: `The event "${title}" has been deleted.`
  };
}

module.exports = {
  handle
};