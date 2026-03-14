const financeService = require("../../services/finance.service");

const BUDGET_CATEGORY_ALIASES = {
  Housing: [
    "rent",
    "mortgage",
    "property tax",
    "property taxes",
    "home insurance",
    "renter insurance",
    "renters insurance",
    "tenant insurance",
    "condo fee",
    "strata",
    "hoa",
    "maintenance",
    "home maintenance",
    "repair",
    "repairs",
    "home repair",
    "home repairs",
    "furniture",
    "appliance",
    "appliances"
  ],

  Utilities: [
    "electricity",
    "hydro",
    "power",
    "water",
    "gas bill",
    "natural gas",
    "heating",
    "heat",
    "trash",
    "garbage",
    "internet",
    "wifi",
    "phone bill",
    "cell phone",
    "mobile bill",
    "cable"
  ],

  Food: [
    "groceries",
    "grocery",
    "supermarket",
    "food",
    "snacks",
    "snack",
    "meal prep",
    "mealprep",
    "coffee",
    "latte",
    "espresso",
    "cappuccino",
    "iced coffee",
    "starbucks",
    "tim hortons",
    "cafe",
    "restaurant",
    "takeout",
    "delivery",
    "doordash",
    "ubereats",
    "skip",
    "breakfast",
    "lunch",
    "dinner",
    "pizza",
    "burger",
    "fast food",
    "milk",
    "eggs",
    "bread",
    "fruit",
    "fruits",
    "vegetables",
    "produce"
  ],

  Transportation: [
    "gas",
    "fuel",
    "gasoline",
    "diesel",
    "car payment",
    "transit",
    "public transit",
    "bus",
    "train",
    "subway",
    "uber",
    "taxi",
    "rideshare",
    "parking",
    "toll",
    "commute",
    "oil change",
    "tires",
    "car repair",
    "car repairs",
    "auto repair",
    "vehicle maintenance",
    "registration"
  ],

  "Savings & Investments": [
    "savings",
    "savings deposit",
    "savings transfer",
    "emergency fund",
    "retirement",
    "retirement savings",
    "investing",
    "investment",
    "tfsa",
    "rrsp",
    "high-yield savings",
    "sinking fund transfer"
  ],

  Health: [
    "medical",
    "doctor",
    "clinic",
    "dentist",
    "dental",
    "vision",
    "glasses",
    "prescription",
    "prescriptions",
    "pharmacy",
    "medicine",
    "therapy",
    "counseling",
    "counselling",
    "physiotherapy",
    "physio",
    "chiropractor",
    "massage therapy"
  ],

  "Family & Kids": [
    "daycare",
    "child care",
    "childcare",
    "school supplies",
    "school",
    "uniform",
    "kids clothes",
    "baby supplies",
    "diapers",
    "toys",
    "activities",
    "lessons",
    "sports fee",
    "kid activity"
  ],

  "Debt Payments": [
    "credit card",
    "credit card payment",
    "loan",
    "loan payment",
    "student loan",
    "line of credit",
    "debt payment",
    "personal loan",
    "medical debt"
  ],

  "Personal Spending": [
    "haircut",
    "haircuts",
    "barber",
    "salon",
    "beauty",
    "beauty products",
    "makeup",
    "skincare",
    "self care",
    "self-care",
    "gym",
    "gym membership",
    "clothing",
    "clothes",
    "shoes",
    "shopping",
    "amazon",
    "toiletries",
    "personal care",
    "accessories"
  ],

  Entertainment: [
    "netflix",
    "spotify",
    "disney plus",
    "disney+",
    "streaming",
    "subscription",
    "subscriptions",
    "movie",
    "movies",
    "concert",
    "game",
    "games",
    "gaming",
    "hobby",
    "hobbies",
    "travel",
    "vacation fun",
    "amusement",
    "outing"
  ],

  "Pet Care": [
    "pet food",
    "dog food",
    "cat food",
    "vet",
    "vet visit",
    "pet insurance",
    "pet toys",
    "grooming",
    "litter",
    "kennel",
    "boarding"
  ],

  "Sinking Funds": [
    "christmas",
    "birthdays",
    "birthday",
    "back to school",
    "back-to-school",
    "vacation fund",
    "gifts",
    "annual subscription",
    "annual subscriptions",
    "car repair fund",
    "home repair fund",
    "medical fund"
  ]
};

const AMBIGUOUS_BUDGET_TERMS = [
  "payment",
  "bill",
  "supplies",
  "repair",
  "subscription",
  "insurance"
];

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function singularizeWord(value) {
  const text = normalizeText(value);
  if (!text) return text;
  if (text.endsWith("ies")) return `${text.slice(0, -3)}y`;
  if (text.endsWith("s") && !text.endsWith("ss")) return text.slice(0, -1);
  return text;
}

function isAmbiguousBudgetTerm(value) {
  const normalized = normalizeText(value);
  const singular = singularizeWord(value);

  return (
    AMBIGUOUS_BUDGET_TERMS.includes(normalized) ||
    AMBIGUOUS_BUDGET_TERMS.includes(singular)
  );
}

function resolveBudgetCategoryFromAlias(rawTerm, budgets) {
  const normalized = normalizeText(rawTerm);
  const singular = singularizeWord(rawTerm);

  if (!normalized) return null;

  const exactBudget = budgets.find(
    (b) =>
      normalizeText(b.name) === normalized ||
      normalizeText(b.name) === singular
  );

  if (exactBudget) {
    return exactBudget;
  }

  for (const [categoryName, aliases] of Object.entries(BUDGET_CATEGORY_ALIASES)) {
    const hasAlias = aliases.some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return normalizedAlias === normalized || normalizedAlias === singular;
    });

    if (!hasAlias) continue;

    const mappedBudget = budgets.find(
      (b) => normalizeText(b.name) === normalizeText(categoryName)
    );

    if (mappedBudget) {
      return mappedBudget;
    }
  }

  return null;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

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

    case "add_income":
      return addIncome(ai, user);

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

  let idToDelete = budgetId;

  if (!idToDelete && name) {
    const budgets = await financeService.getBudgets(user.id);

    const matches = budgets.filter(
      (b) => b.name?.toLowerCase() === name.toLowerCase()
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

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      role: "assistant",
      content: "What amount did you spend?"
    };
  }

  if (!category) {
    return {
      role: "assistant",
      content: "Which category should this expense go into?"
    };
  }

  if (!expenseDate) {
    return {
      role: "assistant",
      content: "What date should I log this expense for?"
    };
  }

  const rawCategory = String(category).trim();
  const loweredCategory = normalizeText(rawCategory);

  if (isAmbiguousBudgetTerm(rawCategory)) {
    return {
      role: "assistant",
      content: `The term "${rawCategory}" could fit more than one category. Please tell me which category to use.`
    };
  }

  const normalizedDescription = description?.trim() || rawCategory;
  const loweredDescription = normalizeText(normalizedDescription);

  if (
    loweredDescription === `${loweredCategory} expense` ||
    loweredDescription === `expense for ${loweredCategory}` ||
    loweredDescription === "food expense" ||
    loweredDescription === "gas expense" ||
    loweredDescription === "groceries purchase"
  ) {
    return {
      role: "assistant",
      content: "Please give a real description for this expense."
    };
  }

  try {
    const budgets = await financeService.getBudgets(user.id);
    const budget = resolveBudgetCategoryFromAlias(rawCategory, budgets);

    if (!budget) {
      return {
        role: "assistant",
        content: `I couldn't find a matching category for "${rawCategory}". You can create a new category or use an existing one.`
      };
    }

    await financeService.createExpense(user.id, {
      amount,
      category: budget.name,
      description: normalizedDescription,
      expenseDate,
      budgetId: budget.id
    });

    return {
      role: "assistant",
      content: `Got it. I’ve added the expense "${normalizedDescription}" of ${amount} to the budget "${budget.name}".`
    };
  } catch (err) {
    console.error("addExpense failed:", err);

    return {
      role: "assistant",
      content: "I couldn’t save that expense. Please check the date and try again."
    };
  }
}

// -----------------------------
// add_income
// -----------------------------
async function addIncome(ai, user) {
  const { amount, note, incomeDate } = ai.params || {};

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      role: "assistant",
      content: "What amount did you earn?"
    };
  }

  const normalizedNote = String(note || "income").trim() || "income";
  const normalizedIncomeDate = incomeDate || getTodayIsoDate();

  try {
    await financeService.createIncomeEntry(user.id, {
      amount,
      note: normalizedNote,
      incomeDate: normalizedIncomeDate
    });

    return {
      role: "assistant",
      content: `Got it. I’ve added the income "${normalizedNote}" of ${amount}.`
    };
  } catch (err) {
    console.error("addIncome failed:", err);

    return {
      role: "assistant",
      content: "I couldn’t save that income. Please check the amount and date and try again."
    };
  }
}

// -----------------------------
// delete_expense (by description)
// -----------------------------
async function deleteExpense(ai, user) {
  const { id, description } = ai.params || {};

  let idToDelete = id;

  if (!idToDelete && description) {
    const expenses = await financeService.getExpenses(user.id);

    const matches = expenses.filter(
      (e) => e.description?.toLowerCase() === description.toLowerCase()
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