import { apiFetch } from "./client";

export async function sendChatMessage(message, context = {}) {
  const data = await apiFetch("/api/chatbot", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      context
    })
  });

  if (data?.reply) {
    return data.reply;
  }

  throw new Error("Chat API returned no reply");
}