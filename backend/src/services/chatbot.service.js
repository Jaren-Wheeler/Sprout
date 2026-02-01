const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../prompts/chatbotPrompts.js");


async function runChatbot(messages) {
  try {

    const systemPrompt = buildSystemPrompt({
        enableBudget: true,
        enableCalendar: true
    });

    const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
        {
            role: "system",
            content: systemPrompt
        },
        ...messages
    ]
    });

    return {
      role: "assistant",
      content: response.output_text
    };
  } catch (err) {
    console.error("OpenAI error:", err);
    throw new Error("Chatbot service failed");
  }
}

module.exports = {
    runChatbot
};