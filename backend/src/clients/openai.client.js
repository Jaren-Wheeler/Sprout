// clients/openai.client.js
import OpenAI from "openai";

/*  Create object that allows for communication with OpenAI features.
    This object can be called in services anytime the chatbot is needed
*/
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openaiClient;