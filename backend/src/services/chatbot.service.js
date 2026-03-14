const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../chatbot/chatbotPrompts.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");
const actionRouter = require("../chatbot/actionRouter");

/**
 * ============================================================================
 * CHATBOT SERVICE
 * ============================================================================
 *
 * READABILITY-ONLY CLEANUP PASS
 * - No intended behavior changes
 * - Do not change parser order in runChatbot()
 * - Preserve ambiguity continuation behavior
 * - Preserve `supplies` behavior
 * - Preserve income vs expense separation
 * - Preserve fallback boundaries
 */

const conversations = new Map();
const pendingActions = new Map();
const MAX_HISTORY = 20;

/**
 * ============================================================================
 * FINANCE CONSTANTS
 * ============================================================================
 */

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
    "registration",
    "car insurance",
    "auto insurance",
    "vehicle insurance"
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
    "meds",
    "medication",
    "medications",
    "therapy",
    "counseling",
    "counselling",
    "physiotherapy",
    "physio",
    "chiropractor",
    "massage therapy",
    "health insurance"
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
    "outing",
    "subscription"
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

const AMBIGUOUS_BUDGET_CHOICES = {
  insurance: ["Housing", "Transportation", "Health"],
  bill: ["Utilities", "Housing", "Transportation"],
  payment: ["Debt Payments", "Housing", "Transportation"],
  supplies: ["Family & Kids", "Personal Spending"],
  repair: ["Housing", "Transportation"],
  subscription: ["Entertainment", "Utilities"]
};

const INCOME_KEYWORDS = [
  "earned",
  "income",
  "got paid",
  "paid me",
  "received",
  "receive",
  "paycheck",
  "salary",
  "wage",
  "wages",
  "bonus",
  "refund",
  "reimbursement",
  "freelance",
  "commission",
  "deposit",
  "deposited",
  "made"
];

/**
 * ============================================================================
 * SHARED TEXT / DATE HELPERS
 * ============================================================================
 */

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

function buildIsoDateFromNaturalInput(value) {
  if (!value || typeof value !== "string") return null;

  const lowered = value.trim().toLowerCase();
  const now = new Date();

  if (/\btoday\b/.test(lowered)) {
    return now.toISOString().slice(0, 10);
  }

  if (/\byesterday\b/.test(lowered)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
  }

  const isoMatch = lowered.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch) {
    return isoMatch[0];
  }

  const slashMatch = lowered.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  if (slashMatch) {
    const parsedSlash = new Date(slashMatch[0]);
    if (!Number.isNaN(parsedSlash.getTime())) {
      return parsedSlash.toISOString().slice(0, 10);
    }
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return null;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function userExplicitlyProvidedDate(message = "") {
  const text = String(message).trim().toLowerCase();

  if (!text) return false;

  if (text.includes("today") || text.includes("yesterday")) {
    return true;
  }

  if (/\b\d{4}-\d{2}-\d{2}\b/.test(text)) {
    return true;
  }

  if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(text)) {
    return true;
  }

  if (
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

function getLatestUserMessage(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (
      messages[i]?.role === "user" &&
      typeof messages[i]?.content === "string"
    ) {
      return messages[i].content.trim();
    }
  }
  return "";
}

/**
 * ============================================================================
 * PENDING EXPENSE HELPERS
 * ============================================================================
 */

function getMissingExpenseFields(params = {}) {
  const missing = [];

  if (!Number.isFinite(params.amount) || params.amount <= 0) {
    missing.push("amount");
  }

  if (!params.category || !String(params.category).trim()) {
    missing.push("category");
  }

  if (!params.description || !String(params.description).trim()) {
    missing.push("description");
  }

  if (!params.expenseDate || !String(params.expenseDate).trim()) {
    missing.push("expenseDate");
  }

  return missing;
}

function getNextMissingExpenseQuestion(field, category) {
  switch (field) {
    case "amount":
      return "What amount did you spend?";
    case "category":
      return "Which category should this expense go into?";
    case "description":
      if (category) {
        return `What description would you like to provide for the ${String(category).toLowerCase()} expense?`;
      }
      return "What description would you like to provide for this expense?";
    case "expenseDate":
      if (category) {
        return `What date is the expense for the ${String(category).toLowerCase()}?`;
      }
      return "What date is the expense for?";
    default:
      return "What information is missing for this expense?";
  }
}

function fillPendingExpenseField(pending, userReply) {
  const value = userReply?.trim();

  if (!value) return pending;

  const nextField = pending.missingFields?.[0];
  if (!nextField) return pending;

  if (nextField === "amount") {
    const normalized = Number(String(value).replace(/[$,]/g, ""));
    if (Number.isFinite(normalized) && normalized > 0) {
      pending.params.amount = normalized;
      pending.missingFields.shift();
    }
    return pending;
  }

  if (nextField === "category") {
    pending.params.category = value;
    pending.missingFields.shift();
    return pending;
  }

  if (nextField === "description") {
    pending.params.description = value;
    pending.missingFields.shift();
    return pending;
  }

  if (nextField === "expenseDate") {
    const isoDate = buildIsoDateFromNaturalInput(value);
    if (isoDate) {
      pending.params.expenseDate = isoDate;
      pending.missingFields.shift();
    }
    return pending;
  }

  return pending;
}

/**
 * ============================================================================
 * AI ACTION SANITIZERS
 * ============================================================================
 */

function sanitizeExpenseAction(ai, latestUserMessage = "") {
  if (ai?.name !== "add_expense") return ai;

  const params = { ...(ai.params || {}) };

  if (typeof params.amount === "string") {
    const normalized = Number(params.amount.replace(/[$,]/g, ""));
    if (Number.isFinite(normalized)) {
      params.amount = normalized;
    }
  }

  const userProvidedDate = userExplicitlyProvidedDate(latestUserMessage);

  if (userProvidedDate) {
    const inferredFromUser = buildIsoDateFromNaturalInput(latestUserMessage);
    if (inferredFromUser) {
      params.expenseDate = inferredFromUser;
    } else if (typeof params.expenseDate === "string") {
      const isoDate = buildIsoDateFromNaturalInput(params.expenseDate);
      if (isoDate) {
        params.expenseDate = isoDate;
      }
    }
  } else {
    params.expenseDate = getTodayIsoDate();
  }

  return {
    ...ai,
    params
  };
}

function sanitizeIncomeAction(ai, latestUserMessage = "") {
  if (ai?.name !== "add_income") return ai;

  const params = { ...(ai.params || {}) };

  if (typeof params.amount === "string") {
    const normalized = Number(params.amount.replace(/[$,]/g, ""));
    if (Number.isFinite(normalized)) {
      params.amount = normalized;
    }
  }

  if (!params.note || !String(params.note).trim()) {
    params.note = "income";
  }

  const userProvidedDate = userExplicitlyProvidedDate(latestUserMessage);

  if (userProvidedDate) {
    const inferredFromUser = buildIsoDateFromNaturalInput(latestUserMessage);
    if (inferredFromUser) {
      params.incomeDate = inferredFromUser;
    } else if (typeof params.incomeDate === "string") {
      const isoDate = buildIsoDateFromNaturalInput(params.incomeDate);
      if (isoDate) {
        params.incomeDate = isoDate;
      }
    }
  } else {
    params.incomeDate = getTodayIsoDate();
  }

  return {
    ...ai,
    params
  };
}

/**
 * ============================================================================
 * MESSAGE SHAPE / RESET HELPERS
 * ============================================================================
 */

function looksLikeIncomeStart(userMessage) {
  if (!userMessage) return false;

  const text = normalizeText(userMessage);
  return INCOME_KEYWORDS.some((keyword) => text.includes(keyword));
}

function looksLikeFreshExpenseStart(userMessage) {
  if (!userMessage) return false;

  const text = userMessage.trim().toLowerCase();

  return (
    /\bspent\b/.test(text) ||
    /\bexpense\b/.test(text) ||
    /\blog\b/.test(text) ||
    /\badd\b/.test(text) ||
    /\$\s*\d+/.test(text) ||
    /\b\d+(\.\d+)?\b/.test(text)
  );
}

function shouldResetPendingExpense(pending, latestUserMessage) {
  if (!pending || pending.name !== "add_expense") return false;
  if (!latestUserMessage) return false;

  const text = latestUserMessage.trim();
  if (!text) return false;

  const firstMissing = pending.missingFields?.[0];

  if (
    firstMissing === "description" ||
    firstMissing === "category" ||
    firstMissing === "expenseDate" ||
    firstMissing === "amount"
  ) {
    const shortReply = text.split(/\s+/).length <= 4;
    const explicitDate = buildIsoDateFromNaturalInput(text);

    if (firstMissing === "expenseDate" && explicitDate) {
      return false;
    }

    if (!looksLikeFreshExpenseStart(text) && shortReply) {
      return false;
    }
  }

  return looksLikeFreshExpenseStart(text);
}

/**
 * ============================================================================
 * ACTION HISTORY HELPERS
 * ============================================================================
 */

function buildActionHistoryEntry(ai) {
  return {
    role: "assistant",
    content: JSON.stringify({
      type: "action_result",
      status: "completed",
      name: ai.name,
      params: ai.params || {}
    })
  };
}

/**
 * ============================================================================
 * DETERMINISTIC EXTRACTION HELPERS
 * ============================================================================
 */

function extractAmountFromMessage(message = "") {
  const cleaned = String(message).replace(/,/g, "");
  const match = cleaned.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
  if (!match) return null;

  const amount = Number(match[1]);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function extractRawSpendingTerm(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\bspent\s+\$?\s*\d+(?:\.\d{1,2})?\s+on\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\badd\s+\$?\s*\d+(?:\.\d{1,2})?\s+(?:for|on)\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\blog\s+\$?\s*\d+(?:\.\d{1,2})?\s+(?:for|on)\s+(.+?)(?:\s+(today|yesterday))?$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractRawIncomeNote(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\bearned\s+(?:extra\s+)?income\s+of\s+\$?\s*\d+(?:\.\d{1,2})?(?:\s+(today|yesterday))?$/i,
    /\bearned\s+\$?\s*\d+(?:\.\d{1,2})?\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\bgot paid\s+\$?\s*\d+(?:\.\d{1,2})?(?:\s+(today|yesterday))?$/i,
    /\breceived\s+\$?\s*\d+(?:\.\d{1,2})?\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\bmade\s+\$?\s*\d+(?:\.\d{1,2})?\s+from\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\badd income\s+\$?\s*\d+(?:\.\d{1,2})?\s+(.+?)(?:\s+(today|yesterday))?$/i,
    /\blog income\s+\$?\s*\d+(?:\.\d{1,2})?\s+(.+?)(?:\s+(today|yesterday))?$/i
  ];

  if (/\bearned\s+(?:extra\s+)?income\s+of\s+\$?\s*\d+(?:\.\d{1,2})?/i.test(text)) {
    return "extra income";
  }

  if (/\bgot paid\s+\$?\s*\d+(?:\.\d{1,2})?/i.test(text)) {
    return "paycheck";
  }

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  if (/\bbonus\b/i.test(text)) return "bonus";
  if (/\brefund\b/i.test(text)) return "refund";
  if (/\breimbursement\b/i.test(text)) return "reimbursement";
  if (/\bpaycheck\b/i.test(text)) return "paycheck";
  if (/\bsalary\b/i.test(text)) return "salary";
  if (/\bfreelance\b/i.test(text)) return "freelance";
  if (/\bcommission\b/i.test(text)) return "commission";
  if (/\bincome\b/i.test(text)) return "income";

  return "income";
}

/**
 * ============================================================================
 * CATEGORY / AMBIGUITY HELPERS
 * ============================================================================
 */

function isAmbiguousBudgetTerm(value) {
  const normalized = normalizeText(value);
  const singular = singularizeWord(value);

  return (
    AMBIGUOUS_BUDGET_TERMS.includes(normalized) ||
    AMBIGUOUS_BUDGET_TERMS.includes(singular)
  );
}

function resolveBudgetNameFromAlias(rawTerm) {
  const normalized = normalizeText(rawTerm);
  const singular = singularizeWord(rawTerm);

  if (!normalized) return null;

  for (const [budgetName, aliases] of Object.entries(BUDGET_CATEGORY_ALIASES)) {
    const matched = aliases.some((alias) => {
      const aliasNormalized = normalizeText(alias);
      return aliasNormalized === normalized || aliasNormalized === singular;
    });

    if (matched) return budgetName;
  }

  return null;
}

function getAmbiguityChoices(rawTerm) {
  const normalized = normalizeText(rawTerm);

  if (
    normalized === "car insurance" ||
    normalized === "auto insurance" ||
    normalized === "vehicle insurance"
  ) {
    return ["Transportation"];
  }

  if (normalized === "health insurance") {
    return ["Health"];
  }

  if (
    normalized === "home insurance" ||
    normalized === "renter insurance" ||
    normalized === "renters insurance" ||
    normalized === "tenant insurance"
  ) {
    return ["Housing"];
  }

  const singular = singularizeWord(rawTerm);

  return (
    AMBIGUOUS_BUDGET_CHOICES[normalized] ||
    AMBIGUOUS_BUDGET_CHOICES[singular] ||
    []
  );
}

function normalizeCategoryChoice(value = "") {
  const normalized = normalizeText(value);

  if (!normalized) return null;

  const titleMap = {
    housing: "Housing",
    transportation: "Transportation",
    health: "Health",
    utilities: "Utilities",
    food: "Food",
    entertainment: "Entertainment",
    "debt payments": "Debt Payments",
    "personal spending": "Personal Spending",
    "pet care": "Pet Care",
    "family & kids": "Family & Kids",
    "savings & investments": "Savings & Investments",
    "sinking funds": "Sinking Funds",

    debt: "Debt Payments",
    personal: "Personal Spending",
    family: "Family & Kids",
    kids: "Family & Kids",
    school: "Family & Kids",
    utility: "Utilities",
    entertainments: "Entertainment"
  };

  return titleMap[normalized] || null;
}

function tryResolveAmbiguousPendingChoice(pending, latestUserMessage) {
  if (!pending || pending.type !== "budget_ambiguity") {
    return null;
  }

  const choice = normalizeCategoryChoice(latestUserMessage);
  if (!choice) return null;

  const allowedChoices = pending.choices || [];
  if (!allowedChoices.includes(choice)) return null;

  return {
    ...pending.params,
    category: choice
  };
}

/**
 * ============================================================================
 * DETERMINISTIC FINANCE HANDLERS
 * ============================================================================
 */

async function tryHandleDeterministicIncome(latestUserMessage, user, history) {
  if (!looksLikeIncomeStart(latestUserMessage)) {
    return null;
  }

  const amount = extractAmountFromMessage(latestUserMessage);
  if (!amount) {
    return null;
  }

  const incomeDate = userExplicitlyProvidedDate(latestUserMessage)
    ? buildIsoDateFromNaturalInput(latestUserMessage) || getTodayIsoDate()
    : getTodayIsoDate();

  const note = extractRawIncomeNote(latestUserMessage);

  const ai = {
    type: "action",
    name: "add_income",
    params: {
      amount,
      note,
      incomeDate
    }
  };

  const result = await actionRouter.execute(ai, user);
  history.push(buildActionHistoryEntry(ai));
  return result;
}

async function tryHandleDeterministicBudgetExpense(
  latestUserMessage,
  user,
  history
) {
  if (!looksLikeFreshExpenseStart(latestUserMessage)) {
    return null;
  }

  const amount = extractAmountFromMessage(latestUserMessage);
  const rawTerm = extractRawSpendingTerm(latestUserMessage);

  if (!amount || !rawTerm) {
    return null;
  }

  const normalizedRawTerm = rawTerm.trim();
  const directCategory = resolveBudgetNameFromAlias(normalizedRawTerm);
  const expenseDate = userExplicitlyProvidedDate(latestUserMessage)
    ? buildIsoDateFromNaturalInput(latestUserMessage) || getTodayIsoDate()
    : getTodayIsoDate();

  if (directCategory && !isAmbiguousBudgetTerm(normalizedRawTerm)) {
    const ai = {
      type: "action",
      name: "add_expense",
      params: {
        amount,
        category: directCategory,
        description: normalizedRawTerm,
        expenseDate
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  if (isAmbiguousBudgetTerm(normalizedRawTerm)) {
    const choices = getAmbiguityChoices(normalizedRawTerm);

    if (choices.length === 1) {
      const ai = {
        type: "action",
        name: "add_expense",
        params: {
          amount,
          category: choices[0],
          description: normalizedRawTerm,
          expenseDate
        }
      };

      const result = await actionRouter.execute(ai, user);
      history.push(buildActionHistoryEntry(ai));
      return result;
    }

    if (choices.length > 1) {
      pendingActions.set(user.id, {
        type: "budget_ambiguity",
        actionName: "add_expense",
        params: {
          amount,
          description: normalizedRawTerm,
          expenseDate
        },
        choices
      });

      const formattedChoices =
        choices.length === 2
          ? `${choices[0]} or ${choices[1]}`
          : `${choices.slice(0, -1).join(", ")}, or ${choices[choices.length - 1]}`;

      const reply = {
        role: "assistant",
        content: `Should I put that under ${formattedChoices}?`
      };

      history.push(reply);
      return reply;
    }

    const reply = {
      role: "assistant",
      content: `The term "${normalizedRawTerm}" could fit more than one category. Please tell me which category to use.`
    };

    history.push(reply);
    return reply;
  }

  if (!directCategory) {
    return null;
  }

  const ai = {
    type: "action",
    name: "add_expense",
    params: {
      amount,
      category: directCategory,
      description: normalizedRawTerm,
      expenseDate
    }
  };

  const result = await actionRouter.execute(ai, user);
  history.push(buildActionHistoryEntry(ai));
  return result;
}

/**
 * ============================================================================
 * MAIN ORCHESTRATION
 * ============================================================================
 *
 * PARSER ORDER WARNING — DO NOT REORDER WITHOUT FULL REGRESSION CHECK:
 * 1. pending ambiguity continuation
 * 2. pending expense continuation
 * 3. deterministic income parsing
 * 4. deterministic expense parsing
 * 5. OpenAI fallback
 */

async function runChatbot(messages, user) {
  const systemPrompt = buildSystemPrompt({
    enableBudget: true,
    enableHealth: true,
    enableNotes: true,
    enableScheduler: true
  });

  let history = conversations.get(user.id);

  if (!history) {
    history = [];
    conversations.set(user.id, history);
  }

  history.push(...messages);

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  const latestUserMessage = getLatestUserMessage(messages);
  let pending = pendingActions.get(user.id);

  /**
   * Stage 1: pending ambiguity continuation
   * Preserve multi-turn ambiguity handling, including `supplies`.
   */
  if (pending?.type === "budget_ambiguity") {
    const resolvedParams = tryResolveAmbiguousPendingChoice(
      pending,
      latestUserMessage
    );

    if (resolvedParams) {
      pendingActions.delete(user.id);

      const ai = {
        type: "action",
        name: "add_expense",
        params: resolvedParams
      };

      const result = await actionRouter.execute(ai, user);
      history.push(buildActionHistoryEntry(ai));
      return replyCleanup(user.id, result);
    }
  }

  /**
   * Stage 2: pending expense continuation
   */
  if (shouldResetPendingExpense(pending, latestUserMessage)) {
    pendingActions.delete(user.id);
    pending = null;
  }

  if (pending && pending.name === "add_expense") {
    fillPendingExpenseField(pending, latestUserMessage);

    if (pending.missingFields.length > 0) {
      const nextField = pending.missingFields[0];

      if (nextField === "expenseDate" && latestUserMessage) {
        const attemptedDate = buildIsoDateFromNaturalInput(latestUserMessage);
        if (!attemptedDate && pending.params.description) {
          const retryReply = {
            role: "assistant",
            content:
              "I couldn’t understand that date. Please use a date like today, yesterday, or YYYY-MM-DD."
          };
          history.push(retryReply);
          pendingActions.set(user.id, pending);
          return replyCleanup(user.id, retryReply);
        }
      }

      const reply = {
        role: "assistant",
        content: getNextMissingExpenseQuestion(
          nextField,
          pending.params.category
        )
      };

      history.push(reply);
      pendingActions.set(user.id, pending);
      return replyCleanup(user.id, reply);
    }

    const ai = {
      type: "action",
      name: "add_expense",
      params: pending.params
    };

    pendingActions.delete(user.id);

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));

    return replyCleanup(user.id, result);
  }

  /**
   * Stage 3: deterministic income parsing
   * Keep income ahead of deterministic expense parsing.
   */
  const deterministicIncomeResult = await tryHandleDeterministicIncome(
    latestUserMessage,
    user,
    history
  );

  if (deterministicIncomeResult) {
    return replyCleanup(user.id, deterministicIncomeResult);
  }

  /**
   * Stage 4: deterministic expense parsing
   */
  const deterministicBudgetResult = await tryHandleDeterministicBudgetExpense(
    latestUserMessage,
    user,
    history
  );

  if (deterministicBudgetResult) {
    return replyCleanup(user.id, deterministicBudgetResult);
  }

  /**
   * Stage 5: OpenAI fallback
   * Preserve fallback boundary behavior.
   */
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [{ role: "system", content: systemPrompt }, ...history]
  });

  const raw = extractAiOutput(response);

  let ai;

  try {
    ai = JSON.parse(raw);
  } catch {
    if (
      typeof raw === "string" &&
      (raw.includes("INTERNAL_ACTION_COMPLETED") ||
        raw.includes('"type":"action_result"') ||
        raw.includes('"type": "action_result"'))
    ) {
      const reply = {
        role: "assistant",
        content: "Got it."
      };

      history.push(reply);
      return replyCleanup(user.id, reply);
    }

    const reply = {
      role: "assistant",
      content: raw
    };

    history.push(reply);
    return replyCleanup(user.id, reply);
  }

  if (ai.type === "message") {
    const reply = {
      role: "assistant",
      content: ai.content
    };

    history.push(reply);
    return replyCleanup(user.id, reply);
  }

  if (ai.type === "action") {
    ai = sanitizeExpenseAction(ai, latestUserMessage);
    ai = sanitizeIncomeAction(ai, latestUserMessage);

    if (ai.name === "add_expense") {
      pendingActions.delete(user.id);

      const params = { ...(ai.params || {}) };
      const missingFields = getMissingExpenseFields(params);

      if (missingFields.length > 0) {
        pendingActions.set(user.id, {
          name: "add_expense",
          params,
          missingFields
        });

        const reply = {
          role: "assistant",
          content: getNextMissingExpenseQuestion(
            missingFields[0],
            params.category
          )
        };

        history.push(reply);
        return replyCleanup(user.id, reply);
      }
    }

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));

    return replyCleanup(user.id, result);
  }

  const fallback = {
    role: "assistant",
    content: "I’m not sure how to help with that."
  };

  history.push(fallback);
  return replyCleanup(user.id, fallback);
}

/**
 * ============================================================================
 * REPLY CLEANUP
 * ============================================================================
 */

function replyCleanup(userId, reply) {
  if (
    reply?.role === "assistant" &&
    typeof reply?.content === "string" &&
    (reply.content.includes("I couldn’t save that expense") ||
      reply.content.includes("I couldn't find a category named"))
  ) {
    pendingActions.delete(userId);
  }

  return reply;
}

module.exports = { runChatbot };