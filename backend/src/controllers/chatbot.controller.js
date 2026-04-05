
const { runChatbot } = require("../services/chatbot.service.js");

async function chatbotConversation(req, res) {
  try {
    const { messages, context } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const reply = await runChatbot(messages, req.user, context || {});

    res.status(200).json({
      reply: reply?.content || "No reply received.",
      featureUpdate: reply?.featureUpdate || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
}

module.exports = {
    chatbotConversation
}
