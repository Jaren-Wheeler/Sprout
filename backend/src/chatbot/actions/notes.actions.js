const notesService = require("../../services/notes.service");

// =====================================================
// Notes Action Helpers
// =====================================================

function findExactTitleMatches(notes, title) {
  const normalizedTitle = String(title || "").trim().toLowerCase();

  return notes.filter(
    (note) => note.title?.trim().toLowerCase() === normalizedTitle
  );
}

function buildUpdatedContent(existingContent, incomingContent, mode) {
  if (incomingContent === undefined) {
    return existingContent;
  }

  const current = String(existingContent || "").trim();
  const next = String(incomingContent || "").trim();

  if (mode === "append") {
    if (!current) return next;
    if (!next) return current;
    return `${current}\n${next}`;
  }

  return next;
}

// Entry point used by actionRouter.js
async function handle(ai, user) {
  switch (ai.name) {
    case "create_note":
      return createNote(ai, user);

    case "update_note":
      return updateNote(ai, user);

    case "delete_note":
      return deleteNote(ai, user);

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

/* ================= CREATE NOTE ================= */

async function createNote(ai, user) {
  const { title, content } = ai.params || {};

  if (!title) {
    return {
      role: "assistant",
      content: "What would you like to title the note?"
    };
  }

  await notesService.createNote(user.id, {
    title,
    content
  });

  return {
    role: "assistant",
    content: `Your note "${title}" has been created.`
  };
}

/* ================= UPDATE NOTE ================= */

async function updateNote(ai, user) {
  const { title, newTitle, content, mode } = ai.params || {};

  if (!title) {
    return {
      role: "assistant",
      content: "Which note would you like to update?"
    };
  }

  const notes = await notesService.getNotes(user.id);
  const matches = findExactTitleMatches(notes, title);

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn't find a note titled "${title}".`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `I found multiple notes titled "${title}". Please rename them or be more specific.`
    };
  }

  const note = matches[0];
  const resolvedTitle = newTitle || note.title;
  const resolvedMode = mode === "append" ? "append" : "replace";
  const resolvedContent = buildUpdatedContent(
    note.content,
    content,
    resolvedMode
  );

  await notesService.updateNote(user.id, note.id, {
    title: resolvedTitle,
    content: resolvedContent
  });

  return {
    role: "assistant",
    content: `Your note "${note.title}" has been updated.`
  };
}

/* ================= DELETE NOTE ================= */

async function deleteNote(ai, user) {
  const { title } = ai.params || {};

  if (!title) {
    return {
      role: "assistant",
      content: "Which note would you like to delete?"
    };
  }

  const notes = await notesService.getNotes(user.id);
  const matches = findExactTitleMatches(notes, title);

  if (matches.length === 0) {
    return {
      role: "assistant",
      content: `I couldn't find a note titled "${title}".`
    };
  }

  if (matches.length > 1) {
    return {
      role: "assistant",
      content: `I found multiple notes titled "${title}". Please rename them or be more specific.`
    };
  }

  await notesService.deleteNote(user.id, matches[0].id);

  return {
    role: "assistant",
    content: `The note "${title}" has been deleted.`
  };
}

module.exports = {
  handle
};