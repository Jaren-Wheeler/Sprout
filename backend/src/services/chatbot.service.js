const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../prompts/chatbotPrompts.js");
const financeService  = require("../services/finance.service.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");

const conversations = new Map();
const MAX_HISTORY = 20;

async function runChatbot(messages, user) {
  try {
    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      enableBudget: true,
      enableCalendar: true
    });

    // Load existing conversation
    let history = conversations.get(user.id);

    if (!history) {
      history = [];
      conversations.set(user.id, history);
    }

    // Add new user messages to history
    history.push(...messages);

    // Trim history
    if (history.length > MAX_HISTORY) {
      history.splice(0, history.length - MAX_HISTORY);
    }
    
    // Call OpenAI
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: systemPrompt },
        ...history
      ]
    });

    // Extract raw AI output
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
        const reply = {
            role: "assistant",
            content: ai.content
        };

        history.push(reply);
        return reply;
    }
      // Handle actions   
    if (ai.type === "action") {
      const result = await executeAction(ai, user);

      history.push(result);
      return result;
    }

    // Fallback (should rarely happen)
    const fallback = {
      role: "assistant",
      content: "I’m not sure how to help with that."
    };

    history.push(fallback);
    return fallback;

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

    case "create_category": {
      const { name, limitAmount } = ai.params || {};

      if (!name || !Number.isFinite(limitAmount) || limitAmount <= 0) {
        return {
          role: "assistant",
          content: "I need a valid category name and amount."
        };
      }

      // REAL EXECUTION
      await financeService.createBudget(user.id, {
        name,
        limitAmount
      });

      return {
        role: "assistant",
        content: `Got it. I’ve created a "${name}" category with a limit of $${limitAmount}.`
      };
    }

   case "delete_category": {
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
                content: `I couldn’t find a category named "${name}".`
            };
            }

            // Multiple matches
            if (matches.length > 1) {
            return {
                role: "assistant",
                content: `I found multiple categories named "${name}". Please rename them or be more specific.`
            };
            }

            // Exactly one match
            idToDelete = matches[0].id;
        }

        // Still no ID? Ask user
        if (!idToDelete) {
            return {
            role: "assistant",
            content: "Which category would you like to delete?"
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
            content: "That category no longer exists or was already deleted."
            };
        }

        return {
            role: "assistant",
            content: `The category "${deleted.name}" has been deleted.`
        };
    
    }

    case "add_expense": {
        const {amount , category, description, expenseDate} = ai.params || {};

        if (!category) {
            return {
            role: "assistant",
            content: "Which category should this expense go into?"
            };
        }

        if (!description || !Number.isFinite(amount) || !expenseDate) {
            console.log(description, amount, category, expenseDate);
            return {
                role: "assistant",
                content: "I need a valid expense name, amount and date."
            };
        }

        const budgets = await financeService.getBudgets(user.id); // grab the budget object
        const budget = budgets.find(
            b => b.name.toLowerCase() === category.toLowerCase()
        );

        if (!budget) {
            return {
                role: "assistant",
                content: `I couldn't find a category named ${category}.`
            }
        }
        await financeService.createExpense(user.id, {
            amount,
            category,
            description,
            expenseDate,
            budgetId: budget.id,
        });

        return {
            role: "assistant",
            content: `Got it. I’ve added the expense "${description}" of ${amount} to the budget ${budget.name}.`
        };
     }

    case "delete_expense":
      const {id, description, category} = ai.params || {};
      
      let idToDelete = id;

      // Resolve by name if ID not provided
      if (!idToDelete && description) {
          const expenses = await financeService.getExpenses(user.id);

          const matches = expenses.filter(
          b => b.description?.toLowerCase() === description.toLowerCase()
          );

          // No match
          if (matches.length === 0) {
          return {
              role: "assistant",
              content: `I couldn’t find an expense named "${description}".`
          };
          }

          // Multiple matches
          if (matches.length > 1) {
          return {
              role: "assistant",
              content: `I found multiple expenses named "${description}". Please rename them or be more specific.`
          };
          }

          // Exactly one match
          idToDelete = matches[0].id;
      }

      // Still no ID? Ask user
      if (!idToDelete) {
          return {
          role: "assistant",
          content: "Which expense would you like to delete?"
          };
      }

      // Safe delete (scoped to user)
      const deleted = await financeService.deleteExpense(
          idToDelete,
          user.id
      );

      if (!deleted) {
          return {
          role: "assistant",
          content: "That expense no longer exists or was already deleted."
          };
      }

      return {
          role: "assistant",
          content: `The expense "${deleted.description ?? "expense"}" has been deleted.`
      };

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