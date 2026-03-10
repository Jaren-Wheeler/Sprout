const financeService = require("../../services/finance.service");

// Entry point used by actionRouter.js
async function handle(ai, user) {
  switch (ai.name) {
    case "create_category":
      return createCategory(ai, user);

    case "delete_category":
      return deleteCategory(ai, user);

    case "add_expense":
      return addExpense(ai, user);

    case "delete_expense":
      return deleteExpense(ai, user);

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

// -----------------------------
// create_category
// -----------------------------
async function createCategory(ai, user) {
  const { name, limitAmount } = ai.params || {};

  if (!name || !Number.isFinite(limitAmount) || limitAmount <= 0) {
    return {
      role: "assistant",
      content: "I need a valid category name and amount."
    };
  }

  await financeService.createBudget(user.id, { name, limitAmount });

  return {
    role: "assistant",
    content: `Got it. I’ve created a "${name}" category with a limit of $${limitAmount}.`
  };
}

// -----------------------------
// delete_category (by name)
// -----------------------------
async function deleteCategory(ai, user) {
  const { name, budgetId } = ai.params || {};

  // Even though your prompt says "never request IDs", keep this as a safe fallback
  // in case older clients send budgetId.
  let idToDelete = budgetId;

  if (!idToDelete && name) {
    const budgets = await financeService.getBudgets(user.id);

    const matches = budgets.filter(
      b => b.name?.toLowerCase() === name.toLowerCase()
    );

    if (matches.length === 0) {
      return {
        role: "assistant",
        content: `I couldn’t find a category named "${name}".`
      };
    }

    if (matches.length > 1) {
      return {
        role: "assistant",
        content: `I found multiple categories named "${name}". Please rename them or be more specific.`
      };
    }

    idToDelete = matches[0].id;
  }

  if (!idToDelete) {
    return {
      role: "assistant",
      content: "Which category would you like to delete?"
    };
  }

  const deleted = await financeService.deleteBudget(idToDelete, user.id);

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

// -----------------------------
// add_expense
// -----------------------------
async function addExpense(ai, user) {
  const { amount, category, description, expenseDate } = ai.params || {};

  if (!category) {
    return {
      role: "assistant",
      content: "Which category should this expense go into?"
    };
  }

  if (!description || !Number.isFinite(amount) || !expenseDate) {
    return {
      role: "assistant",
      content: "I need a valid expense name, amount and date."
    };
  }

  // Resolve budgetId by category name
  const budgets = await financeService.getBudgets(user.id);
  const budget = budgets.find(
    b => b.name?.toLowerCase() === category.toLowerCase()
  );

  if (!budget) {
    return {
      role: "assistant",
      content: `I couldn't find a category named "${category}".`
    };
  }

  await financeService.createExpense(user.id, {
    amount,
    category,
    description,
    expenseDate,
    budgetId: budget.id
  });

  return {
    role: "assistant",
    content: `Got it. I’ve added the expense "${description}" of ${amount} to the budget "${budget.name}".`
  };
}

// -----------------------------
// delete_expense (by description)
// -----------------------------
async function deleteExpense(ai, user) {
  const { id, description } = ai.params || {};

  let idToDelete = id;

  // Resolve by description if ID not provided
  if (!idToDelete && description) {
    const expenses = await financeService.getExpenses(user.id);

    const matches = expenses.filter(
      e => e.description?.toLowerCase() === description.toLowerCase()
    );

    if (matches.length === 0) {
      return {
        role: "assistant",
        content: `I couldn’t find an expense named "${description}".`
      };
    }

    if (matches.length > 1) {
      return {
        role: "assistant",
        content: `I found multiple expenses named "${description}". Please be more specific (or include the amount/date in the name).`
      };
    }

    idToDelete = matches[0].id;
  }

  if (!idToDelete) {
    return {
      role: "assistant",
      content: "Which expense would you like to delete?"
    };
  }

  const deleted = await financeService.deleteExpense(idToDelete, user.id);

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
}

module.exports = { handle };