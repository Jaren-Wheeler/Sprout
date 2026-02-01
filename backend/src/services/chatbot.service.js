import openai from "../clients/openai.client.js";

export async function chatbotConversation(messages) {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: messages
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
