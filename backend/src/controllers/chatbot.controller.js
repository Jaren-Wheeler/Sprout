
const { runChatbot } = require("../services/chatbot.service.js");

async function chatbotConversation(req, res) {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const reply = await runChatbot(messages);

    res.status(200).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
}

module.exports = {
    chatbotConversation
}
