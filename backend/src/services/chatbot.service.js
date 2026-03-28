const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../chatbot/chatbotPrompts.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");
const actionRouter = require("../chatbot/actionRouter");

const conversations = new Map();
const MAX_HISTORY = 20;

function getBaseDate(context = {}) {
  const candidate = context.clientLocalDate
    ? new Date(`${context.clientLocalDate}T00:00:00`)
    : new Date();

  if (Number.isNaN(candidate.getTime())) {
    return new Date();
  }

  return candidate;
}

function toLocalDateTimeString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseNaturalDateTime(value, context = {}) {
  const text = String(value || "").trim();
  if (!text) return null;

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) {
    return text;
  }

  const direct = new Date(text);
  if (!Number.isNaN(direct.getTime())) {
    return toLocalDateTimeString(direct);
  }

  const lower = text.toLowerCase();
  const match = lower.match(/^(today|tomorrow|yesterday)(?:\s+at\s+(.+))?$/i);

  if (!match) {
    return null;
  }

  const [, dayWord, rawTime] = match;
  const date = getBaseDate(context);

  if (dayWord === "tomorrow") date.setDate(date.getDate() + 1);
  if (dayWord === "yesterday") date.setDate(date.getDate() - 1);

  let hours = 9;
  let minutes = 0;

  if (rawTime) {
    const timeMatch = rawTime.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);

    if (!timeMatch) {
      return null;
    }

    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2] || 0);
    const meridiem = (timeMatch[3] || "").toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
  }

  date.setHours(hours, minutes, 0, 0);
  return toLocalDateTimeString(date);
}

function normalizeSchedulerAction(ai, context = {}) {
  if (ai?.name !== "create_event") {
    return ai;
  }

  const params = { ...(ai.params || {}) };

  if (typeof params.startTime === "string") {
    const normalizedStart = parseNaturalDateTime(params.startTime, context);
    if (normalizedStart) {
      params.startTime = normalizedStart;
    }
  }

  if (typeof params.endTime === "string") {
    const normalizedEnd = parseNaturalDateTime(params.endTime, context);
    if (normalizedEnd) {
      params.endTime = normalizedEnd;
    }
  }

  return {
    ...ai,
    params
  };
}

function toOpenAiMessage(message) {
  return {
    role: message?.role || "user",
    content:
      typeof message?.content === "string" ? message.content : String(message?.content || "")
  };
}

function normalizeReply(reply, fallback = "I’m not sure how to help with that.") {
  return {
    role: "assistant",
    content:
      typeof reply?.content === "string" && reply.content.trim()
        ? reply.content.trim()
        : fallback,
    effects: reply?.effects && typeof reply.effects === "object" ? reply.effects : {}
  };
}

function parseAiPayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;

  const normalized = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(normalized);
  } catch {
    return null;
  }
}

function isActionError(content = "") {
  const text = String(content || "").toLowerCase();
  return (
    text.includes("couldn’t") ||
    text.includes("couldn't") ||
    text.includes("i need ") ||
    text.includes("i found multiple") ||
    text.includes("please tell me") ||
    text.includes("what ") ||
    text.includes("which ") ||
    text.includes("when ") ||
    text.includes("i don’t know") ||
    text.includes("i don't know")
  );
}

function applyFinanceEffect(reply, actionName) {
  const normalized = normalizeReply(reply);

  if (
    actionRouter.getActionDomain?.(actionName) === "finance" &&
    !isActionError(normalized.content)
  ) {
    normalized.effects = {
      ...(normalized.effects || {}),
      financeChanged: true
    };
  }

  return normalized;
}

async function executeAction(ai, user, context = {}) {
  const normalizedAction = normalizeSchedulerAction(ai, context);
  const result = await actionRouter.execute(normalizedAction, user);
  return applyFinanceEffect(result, normalizedAction?.name);
}

async function executeActionBatch(actions, user, context = {}) {
  if (!Array.isArray(actions) || actions.length === 0) {
    return normalizeReply({
      content: "I ran into trouble understanding that request. Please try again."
    });
  }

  const parts = [];
  let financeChanged = false;

  for (const action of actions) {
    const reply = await executeAction(
      {
        type: "action",
        name: action?.name,
        params: action?.params || {}
      },
      user,
      context
    );

    if (reply?.content) {
      parts.push(reply.content);
    }

    if (reply?.effects?.financeChanged) {
      financeChanged = true;
    }

    if (isActionError(reply?.content)) {
      break;
    }
  }

  return normalizeReply({
    content: parts.join(" "),
    effects: financeChanged ? { financeChanged: true } : {}
  });
}

async function runChatbot(messages, user, context = {}) {

  const systemPrompt = buildSystemPrompt({
    enableBudget: true,
    enableHealth: true,
    enableNotes: true,
    enableScheduler: true
  });

  let history = conversations.get(user.id);

  if (!history) {
    history = [];
    conversations.set(user.id, history);
  }

  history.push(...messages);

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      ...history.map(toOpenAiMessage)
    ]
  });

  const raw = extractAiOutput(response);
  const ai = parseAiPayload(raw);

  if (!ai) {
    return {
      role: "assistant",
      content: raw
    };
  }

  if (ai.type === "message") {
    const reply = {
      role: "assistant",
      content: ai.content
    };

    history.push(reply);
    return reply;
  }

  if (ai.type === "action") {
    const result = await executeAction(ai, user, context);

    history.push(result);
    return result;
  }

  if (ai.type === "action_batch") {
    const result = await executeActionBatch(ai.actions, user, context);

    history.push(result);
    return result;
  }

  return {
    role: "assistant",
    content: "I’m not sure how to help with that."
  };
}

module.exports = { runChatbot };
