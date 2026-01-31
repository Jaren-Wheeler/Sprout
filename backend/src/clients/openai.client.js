// clients/openai.client.js
const OpenAI = require("openai");

/*  Create object that allows for communication with OpenAI features.
    This object can be called in services anytime the chatbot is needed
*/
let openaiClient = null;

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.warn(" OPenAI client disalbed (missing OPEN_API_KEY)");
}

export default openaiClient;