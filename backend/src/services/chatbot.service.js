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
        const { budgetId, name } = ai.params || {};

        let idToDelete = budgetId;

        // Resolve by name if ID not provided
        if (!idToDelete && name) {
            const budgets = await financeService.getBudgets(user.id);

            const matches = budgets.filter(
            b => b.name.toLowerCase() === name.toLowerCase()
            );

            // No match
            if (matches.length === 0) {
            return {
                role: "assistant",
                content: `I couldn’t find a budget named "${name}".`
            };
            }

            // Multiple matches
            if (matches.length > 1) {
            return {
                role: "assistant",
                content: `I found multiple budgets named "${name}". Please rename them or be more specific.`
            };
            }

            // Exactly one match
            idToDelete = matches[0].id;
        }

        // Still no ID? Ask user
        if (!idToDelete) {
            return {
            role: "assistant",
            content: "Which budget would you like to delete?"
            };
        }

        // Safe delete (scoped to user)
        const deleted = await financeService.deleteBudget(
            idToDelete,
            user.id
        );

        if (!deleted) {
            return {
            role: "assistant",
            content: "That budget no longer exists or was already deleted."
            };
        }

        return {
            role: "assistant",
            content: `The budget "${deleted.name}" has been deleted.`
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