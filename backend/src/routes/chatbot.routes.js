const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const chatbotController = require("../controllers/chatbot.controller");
const { chatRateLimiter } = require("../middleware/rateLimits");

/**
 * @route POST api/chat
 * @desc Write chats to call the OpenAI API. Limited by chatRateLimiter to 20 calls per minute.
 * @access Private
 */
router.post("/", auth, chatRateLimiter, chatbotController.chatbotConversation);

module.exports = router;