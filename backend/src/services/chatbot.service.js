const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../prompts/chatbotPrompts.js");
const financeService  = require("../services/finance.service.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");

async function runChatbot(messages, user) {
  try {
    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      enableBudget: true,
      enableCalendar: true
    });

    // Call OpenAI
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    });

    // 3Extract raw AI output
    const raw = extractAiOutput(response);

    // Attempt to parse JSON
    let ai;
    try {
      ai = JSON.parse(raw);
    } catch {
      // Normal chat response (no action)
      return {
        role: "assistant",
        content: raw
      };
    }

  
    if (ai.type === "message") {
        return {
            role: "assistant",
            content: ai.content
        };
    }
      // Handle actions   
    if (ai.type === "action") {
      return await executeAction(ai, user);
    }

    // Fallback (should rarely happen)
    return {
      role: "assistant",
      content: "I’m not sure how to help with that."
    };

  } catch (err) {
    console.error("Chatbot error:", err);
    throw new Error("Chatbot service failed");
  }
}

// -----------------------------
// Action Router 
// -----------------------------
async function executeAction(ai, user) {
  switch (ai.name) {

    case "create_budget": {
      const { name, limitAmount } = ai.params || {};

      if (!name || typeof limitAmount !== "number" || limitAmount <= 0) {
        return {
          role: "assistant",
          content: "I need a valid budget name and amount."
        };
      }

      // REAL EXECUTION
      await financeService.createBudget(user.id, {
        name,
        limitAmount
      });

      return {
        role: "assistant",
        content: `Got it. I’ve created a "${name}" budget with a limit of $${limitAmount}.`
      };
    }

    case "delete_budget": {
      await financeService.deleteBudget(ai.params.budgetId);

      return {
        role: "assistant",
        content: "The budget has been deleted."
      };
    }

    case "list_budgets": {
      const budgets = await financeService.getBudgets(user.id);

      if (!budgets.length) {
        return {
          role: "assistant",
          content: "You don’t have any budgets yet."
        };
      }

      return {
        role: "assistant",
        content: budgets
          .map(
            b =>
              `• ${b.name}: $${b.totalSpent} spent of $${b.limitAmount} (remaining $${b.remaining})`
          )
          .join("\n")
      };
    }

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

module.exports = {
  runChatbot
}