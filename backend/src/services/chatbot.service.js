const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../chatbot/chatbotPrompts.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");
const actionRouter = require("../chatbot/actionRouter");

const conversations = new Map();
const MAX_HISTORY = 20;

async function runChatbot(messages, user) {

  const systemPrompt = buildSystemPrompt({
    enableBudget: true,
    enableCalendar: true
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
      ...history
    ]
  });

  const raw = extractAiOutput(response);

  let ai;

  try {
    ai = JSON.parse(raw);
  } catch {
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
    const result = await actionRouter.execute(ai, user);

    history.push(result);
    return result;
  }

  return {
    role: "assistant",
    content: "I’m not sure how to help with that."
  };
}

module.exports = { runChatbot };