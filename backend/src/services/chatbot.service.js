const openai = require("../clients/openai.client.js");
const { buildSystemPrompt } = require("../chatbot/chatbotPrompts.js");
const { extractAiOutput } = require("../utils/extractAiOutput.js");
const actionRouter = require("../chatbot/actionRouter");

/**
 * ============================================================================
 * CHATBOT SERVICE
 * ============================================================================
 */

const conversations = new Map();
const pendingActions = new Map();
const MAX_HISTORY = 20;
const WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

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

function formatLocalDateIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDateFromClientContext(context = {}) {
  if (
    context?.clientLocalDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(context.clientLocalDate)
  ) {
    const [year, month, day] = context.clientLocalDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  if (context?.clientNowIso) {
    const parsed = new Date(context.clientNowIso);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function getNextDateForWeekdayFromBase(weekdayName, baseDate) {
  const targetDay = WEEKDAY_NAMES.indexOf(normalizeText(weekdayName));
  if (targetDay < 0) return null;

  const result = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );

  const currentDay = result.getDay();
  let delta = targetDay - currentDay;

  if (delta < 0) {
    delta += 7;
  }

  result.setDate(result.getDate() + delta);
  return result;
}

function buildIsoDateFromNaturalInput(value, context = {}) {
  if (!value || typeof value !== "string") return null;

  const lowered = value.trim().toLowerCase();
  const now = buildDateFromClientContext(context);

  if (/\btoday\b/.test(lowered)) {
    return formatLocalDateIso(now);
  }

  if (/\btomorrow\b/.test(lowered)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return formatLocalDateIso(tomorrow);
  }

  if (/\byesterday\b/.test(lowered)) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return formatLocalDateIso(yesterday);
  }

  const weekdayMatch = lowered.match(
    /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/
  );

  if (weekdayMatch?.[1]) {
    const nextWeekday = getNextDateForWeekdayFromBase(weekdayMatch[1], now);
    if (nextWeekday) {
      return formatLocalDateIso(nextWeekday);
    }
  }

  const isoMatch = lowered.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch) {
    return isoMatch[0];
  }

  const slashMatch = lowered.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  if (slashMatch) {
    const parsedSlash = new Date(slashMatch[0]);
    if (!Number.isNaN(parsedSlash.getTime())) {
      return formatLocalDateIso(parsedSlash);
    }
  }

  const monthDateMatch = String(value).match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:,\s*(\d{4}))?\b/i
  );
  if (monthDateMatch) {
    const [, monthName, dayText, explicitYear] = monthDateMatch;
    const monthIndex = WEEKDAY_NAMES.indexOf(monthName.toLowerCase());
    const fallbackYear = now.getFullYear();
    const year = explicitYear ? Number(explicitYear) : fallbackYear;

    const monthMap = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    };

    const parsedMonthDate = new Date(
      year,
      monthMap[monthName.toLowerCase()],
      Number(dayText)
    );

    if (!Number.isNaN(parsedMonthDate.getTime())) {
      return formatLocalDateIso(parsedMonthDate);
    }
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return formatLocalDateIso(parsed);
  }

  return null;
}

function getTodayIsoDate() {
  return formatLocalDateIso(new Date());
}

function userExplicitlyProvidedDate(message = "") {
  const text = String(message).trim().toLowerCase();

  if (!text) return false;

  if (
    text.includes("today") ||
    text.includes("tomorrow") ||
    text.includes("yesterday")
  ) {
    return true;
  }

  if (/\b\d{4}-\d{2}-\d{2}\b/.test(text)) {
    return true;
  }

  if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(text)) {
    return true;
  }

  if (
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/.test(
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

function stripTrailingPunctuation(value = "") {
  return String(value).trim().replace(/[.?!]+$/, "").trim();
}

function stripWrappingQuotes(value = "") {
  return String(value).trim().replace(/^['"]+|['"]+$/g, "").trim();
}

function removeTrailingSchedulerConnector(value = "") {
  return String(value).trim().replace(/\b(on|for|at)\s*$/i, "").trim();
}

function cleanSchedulerTitle(value = "") {
  return removeTrailingSchedulerConnector(
    stripWrappingQuotes(stripTrailingPunctuation(value))
      .replace(/^(called|named|titled)\s+/i, "")
      .trim()
  );
}

function extractSchedulerDateReference(message = "") {
  const text = String(message).trim();
  const lowered = text.toLowerCase();

  const relativeMatch = lowered.match(/\b(today|tomorrow|yesterday)\b/);
  if (relativeMatch?.[1]) {
    return relativeMatch[1];
  }

  const weekdayMatch = lowered.match(
    /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/
  );
  if (weekdayMatch?.[1]) {
    return weekdayMatch[1];
  }

  const isoMatch = lowered.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch?.[0]) {
    return isoMatch[0];
  }

  const slashMatch = lowered.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/);
  if (slashMatch?.[0]) {
    return slashMatch[0];
  }

  const monthMatch = text.match(
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:,\s*\d{4})?\b/i
  );
  if (monthMatch?.[0]) {
    return monthMatch[0];
  }

  return null;
}

function parseSchedulerTimeFromText(message = "") {
  const text = String(message).trim();
  const lowered = text.toLowerCase();

  if (/\bnoon\b/.test(lowered)) {
    return { raw: "noon", iso: "12:00" };
  }

  if (/\bmidnight\b/.test(lowered)) {
    return { raw: "midnight", iso: "00:00" };
  }

  const ampmMatch = lowered.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (ampmMatch) {
    let hours = Number(ampmMatch[1]);
    const minutes = ampmMatch[2] || "00";
    const meridiem = ampmMatch[3];

    if (meridiem === "pm" && hours !== 12) {
      hours += 12;
    }

    if (meridiem === "am" && hours === 12) {
      hours = 0;
    }

    return {
      raw: ampmMatch[0],
      iso: `${String(hours).padStart(2, "0")}:${minutes}`
    };
  }

  const twentyFourHourMatch = lowered.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (twentyFourHourMatch) {
    return {
      raw: twentyFourHourMatch[0],
      iso: `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${
        twentyFourHourMatch[2]
      }`
    };
  }

  return null;
}

function parseNaturalSchedulerDateTime(value = "", context = {}) {
  const dateRef = extractSchedulerDateReference(value);
  const timeInfo = parseSchedulerTimeFromText(value);

  if (!dateRef || !timeInfo?.iso) {
    return null;
  }

  const dateIso = buildIsoDateFromNaturalInput(dateRef, context);
  if (!dateIso) {
    return null;
  }

  return `${dateIso}T${timeInfo.iso}`;
}

function extractDirectCreateEvent(message = "", context = {}) {
  const text = String(message).trim();

  if (!text || /\bnote\b/i.test(text)) {
    return null;
  }

  const patterns = [
    /^create\s+(?:an?\s+)?event\s+(?:called|named|titled)\s+(.+)$/i,
    /^create\s+(?:an?\s+)?meeting\s+(?:called|named|titled)\s+(.+)$/i,
    /^create\s+(?:an?\s+)?appointment\s+(?:called|named|titled)\s+(.+)$/i,
    /^create\s+(?:an?\s+)?call\s+(?:called|named|titled)\s+(.+)$/i,
    /^create\s+(?:an?\s+)?(.+?\bappointment)\s+for\s+me\s+(.+)$/i,
    /^create\s+(?:an?\s+)?event\s+(.+)$/i,
    /^create\s+(?:an?\s+)?meeting\s+(.+)$/i,
    /^create\s+(?:an?\s+)?appointment\s+(.+)$/i,
    /^create\s+(?:an?\s+)?call\s+(.+)$/i,
    /^(?:schedule|book)\s+(.+)$/i
  ];

  let tail = null;

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1] && match?.[2] && /\bappointment\b/i.test(match[1])) {
      tail = `${match[1]} ${match[2]}`.trim();
      break;
    }

    if (match?.[1]) {
      tail = match[1].trim();
      break;
    }
  }

  if (!tail) {
    return null;
  }

  tail = tail.replace(/\bfor me\b/i, "").replace(/\s+/g, " ").trim();

  const dateRef = extractSchedulerDateReference(tail);
  if (!dateRef) {
    return null;
  }

  const dateIndex = tail.toLowerCase().indexOf(String(dateRef).toLowerCase());
  let titlePart = dateIndex >= 0 ? tail.slice(0, dateIndex).trim() : tail;

  titlePart = cleanSchedulerTitle(titlePart);

  if (!titlePart) {
    return null;
  }

  const startDateIso = buildIsoDateFromNaturalInput(dateRef, context);
  if (!startDateIso) {
    return null;
  }

  const timeInfo = parseSchedulerTimeFromText(tail);

  return {
    title: titlePart,
    startDateIso,
    startTime: timeInfo?.iso ? `${startDateIso}T${timeInfo.iso}` : null
  };
}

function extractDirectDeleteEvent(message = "") {
  const text = String(message).trim();

  if (!text || /\bnote\b/i.test(text)) {
    return null;
  }

  const patterns = [
    /^(?:delete|remove)\s+(?:my\s+)?event\s+(?:called\s+)?(.+)$/i,
    /^(?:delete|remove)\s+(?:my\s+)?(.+?\b(?:appointment|meeting|interview|class|shift|call))$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const title = cleanSchedulerTitle(match[1]);
      if (title) {
        return { title };
      }
    }
  }

  return null;
}

function parseDeleteEventChoiceFromMessage(message = "", candidates = []) {
  const rawText = String(message || "").trim();
  const text = rawText.toLowerCase();

  if (!text || !Array.isArray(candidates) || candidates.length === 0) {
    return null;
  }

  const normalizedChoices = candidates.map((candidate, index) => {
    const date = new Date(candidate.startTime);

    const display = Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });

    const candidateDate = Number.isNaN(date.getTime())
      ? null
      : formatLocalDateIso(date);

    const candidateTime = Number.isNaN(date.getTime())
      ? null
      : `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;

    return {
      ...candidate,
      choiceNumber: index + 1,
      display,
      candidateDate,
      candidateTime
    };
  });

  const exactNumberMatch = text.match(/^\s*(\d+)\s*$/);
  if (exactNumberMatch) {
    const index = Number(exactNumberMatch[1]) - 1;
    if (index >= 0 && index < normalizedChoices.length) {
      return normalizedChoices[index];
    }
  }

  const numberedDisplayMatch = text.match(/^\s*(\d+)\.\s*(.+)\s*$/);
  if (numberedDisplayMatch) {
    const index = Number(numberedDisplayMatch[1]) - 1;
    if (index >= 0 && index < normalizedChoices.length) {
      return normalizedChoices[index];
    }
  }

  const exactDisplayMatch = normalizedChoices.find(
    (candidate) => candidate.display.toLowerCase() === text
  );
  if (exactDisplayMatch) {
    return exactDisplayMatch;
  }

  const dateIso = buildIsoDateFromNaturalInput(rawText);
  const timeInfo = parseSchedulerTimeFromText(rawText);

  if (dateIso && timeInfo?.iso) {
    const combinedMatch = normalizedChoices.find(
      (candidate) =>
        candidate.candidateDate === dateIso &&
        candidate.candidateTime === timeInfo.iso
    );

    if (combinedMatch) {
      return combinedMatch;
    }
  }

  if (dateIso) {
    const dateMatches = normalizedChoices.filter(
      (candidate) => candidate.candidateDate === dateIso
    );

    if (dateMatches.length === 1) {
      return dateMatches[0];
    }
  }

  if (timeInfo?.iso) {
    const timeMatches = normalizedChoices.filter(
      (candidate) => candidate.candidateTime === timeInfo.iso
    );

    if (timeMatches.length === 1) {
      return timeMatches[0];
    }
  }

  return null;
}

function shouldTrackPendingDeleteEvent(replyContent = "") {
  const text = String(replyContent).trim();
  return /^I found multiple events titled ".+"\.\sWhich one should I delete\?/i.test(
    text
  );
}

function buildPendingDeleteEventFromActionReply(replyContent = "", userId = "") {
  const text = String(replyContent).trim();
  const titleMatch = text.match(/^I found multiple events titled "(.+?)"\./i);

  if (!titleMatch?.[1]) {
    return null;
  }

  return {
    name: "delete_event",
    params: {
      title: titleMatch[1]
    },
    missingFields: ["choice"],
    meta: {
      needsResolution: true,
      userId
    }
  };
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
        return `What description would you like to provide for the ${String(
          category
        ).toLowerCase()} expense?`;
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

function sanitizeSchedulerAction(ai, latestUserMessage = "", context = {}) {
  if (ai?.name !== "create_event" && ai?.name !== "delete_event") {
    return ai;
  }

  const params = { ...(ai.params || {}) };

  if (params.title) {
    params.title = cleanSchedulerTitle(params.title);
  }

  if (ai.name === "delete_event") {
    return {
      ...ai,
      params
    };
  }

  const directFromMessage = extractDirectCreateEvent(latestUserMessage, context);

  if (!params.title && directFromMessage?.title) {
    params.title = directFromMessage.title;
  }

  if (
    typeof params.startTime === "string" &&
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(params.startTime)
  ) {
    const normalizedStart = parseNaturalSchedulerDateTime(
      params.startTime,
      context
    );
    if (normalizedStart) {
      params.startTime = normalizedStart;
    }
  }

  if (!params.startTime && directFromMessage?.startTime) {
    params.startTime = directFromMessage.startTime;
  }

  if (
    typeof params.endTime === "string" &&
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(params.endTime)
  ) {
    const normalizedEnd = parseNaturalSchedulerDateTime(
      params.endTime,
      context
    );
    if (normalizedEnd) {
      params.endTime = normalizedEnd;
    }
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

function looksLikeFreshSchedulerStart(userMessage) {
  const text = String(userMessage || "").trim().toLowerCase();

  return (
    /\b(schedule|book|create)\b/.test(text) ||
    /\b(delete|remove)\b.*\b(event|appointment|meeting|interview|class|shift|call)\b/.test(
      text
    )
  );
}

function shouldResetPendingEvent(pending, latestUserMessage) {
  if (!pending || pending.name !== "create_event") return false;
  if (!latestUserMessage) return false;

  const nextField = pending.missingFields?.[0];

  if (nextField === "startTime" && parseSchedulerTimeFromText(latestUserMessage)) {
    return false;
  }

  if (
    nextField === "startTime" &&
    latestUserMessage.trim().split(/\s+/).length <= 4
  ) {
    return false;
  }

  return looksLikeFreshSchedulerStart(latestUserMessage);
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

  if (
    /\bearned\s+(?:extra\s+)?income\s+of\s+\$?\s*\d+(?:\.\d{1,2})?/i.test(text)
  ) {
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
 * DETERMINISTIC NOTES HELPERS
 * ============================================================================
 */

function extractDirectCreateNote(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\bcreate\s+a\s+note\s+called\s+(.+?)\s+with\s+(.+)$/i,
    /\bcreate\s+a\s+note\s+named\s+(.+?)\s+with\s+(.+)$/i,
    /\bsave\s+a\s+note\s+called\s+(.+?)\s+with\s+(.+)$/i,
    /\bmake\s+a\s+note\s+titled\s+(.+?)\s+with\s+(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      return {
        title: stripTrailingPunctuation(match[1]),
        content: stripTrailingPunctuation(match[2])
      };
    }
  }

  return null;
}

function extractDirectReplaceNoteUpdate(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\bupdate\s+my\s+note\s+(.+?)\s+and\s+change\s+the\s+content\s+to\s+(.+)$/i,
    /\bedit\s+my\s+note\s+(.+?)\s+and\s+replace\s+the\s+content\s+with\s+(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      return {
        title: stripTrailingPunctuation(match[1]),
        content: stripTrailingPunctuation(match[2]),
        mode: "replace"
      };
    }
  }

  return null;
}

function extractDirectRenameNote(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\brename\s+my\s+note\s+(.+?)\s+to\s+(.+)$/i,
    /\bchange\s+the\s+title\s+of\s+my\s+note\s+(.+?)\s+to\s+(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      return {
        title: stripTrailingPunctuation(match[1]),
        newTitle: stripTrailingPunctuation(match[2])
      };
    }
  }

  return null;
}

function extractDirectAppendNote(message = "") {
  const text = String(message).trim();

  const patterns = [
    /\badd\s+(.+?)\s+to\s+my\s+note\s+(.+)$/i,
    /\bappend\s+(.+?)\s+to\s+my\s+note\s+(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1] && match?.[2]) {
      return {
        title: stripTrailingPunctuation(match[2]),
        content: stripTrailingPunctuation(match[1]),
        mode: "append"
      };
    }
  }

  return null;
}

/**
 * ============================================================================
 * PENDING NOTES HELPERS
 * ============================================================================
 */

function getMissingNoteFields(params = {}) {
  const missing = [];

  if (!params.title || !String(params.title).trim()) {
    missing.push("title");
  }

  if (!params.content || !String(params.content).trim()) {
    missing.push("content");
  }

  return missing;
}

function getNextMissingNoteQuestion(field, title) {
  switch (field) {
    case "title":
      return "What title should I use for the note?";
    case "content":
      if (title) {
        return `What content should I save in the note "${title}"?`;
      }
      return "What content should I save in the note?";
    default:
      return "What note information is missing?";
  }
}

function fillPendingNoteField(pending, userReply) {
  const value = String(userReply || "").trim();
  if (!value) return pending;

  const nextField = pending.missingFields?.[0];
  if (!nextField) return pending;

  if (nextField === "title") {
    pending.params.title = value;
    pending.missingFields.shift();
    return pending;
  }

  if (nextField === "content") {
    pending.params.content = value;
    pending.missingFields.shift();
    return pending;
  }

  return pending;
}

function shouldTrackPendingCreateNote(replyContent = "") {
  const text = String(replyContent).trim();
  return (
    text === "What title should I use for the note?" ||
    text === "What title should I use for this note?" ||
    /^What content should I save in the note ".+"\?$/.test(text)
  );
}

function shouldTrackPendingDeleteNote(replyContent = "") {
  const text = String(replyContent).trim();
  return text === "What is the exact title of the note you want to delete?";
}

function buildPendingCreateNoteFromMessage(message = "", replyContent = "") {
  const text = String(message).trim();

  if (!text) return null;

  if (/^create\s+a\s+note[.!?]?$/i.test(text)) {
    return {
      name: "create_note",
      params: {},
      missingFields: ["title", "content"]
    };
  }

  const titleOnlyPatterns = [
    /^create\s+a\s+note\s+called\s+(.+?)[.!?]?$/i,
    /^create\s+a\s+note\s+named\s+(.+?)[.!?]?$/i,
    /^save\s+a\s+note\s+called\s+(.+?)[.!?]?$/i,
    /^make\s+a\s+note\s+titled\s+(.+?)[.!?]?$/i
  ];

  for (const pattern of titleOnlyPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return {
        name: "create_note",
        params: {
          title: stripTrailingPunctuation(match[1])
        },
        missingFields: ["content"]
      };
    }
  }

  const contentOnlyPatterns = [
    /^create\s+a\s+note\s+with\s+(.+?)[.!?]?$/i,
    /^create\s+a\s+note\s+for\s+.+?:\s*(.+)$/i,
    /^make\s+a\s+note\s+for\s+.+?:\s*(.+)$/i
  ];

  for (const pattern of contentOnlyPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return {
        name: "create_note",
        params: {
          content: stripTrailingPunctuation(match[1])
        },
        missingFields: ["title"]
      };
    }
  }

  if (/^What title should I use for this note\?$/i.test(replyContent)) {
    const colonIndex = text.indexOf(":");
    if (colonIndex >= 0) {
      const trailingContent = text.slice(colonIndex + 1).trim();
      if (trailingContent) {
        return {
          name: "create_note",
          params: {
            content: stripTrailingPunctuation(trailingContent)
          },
          missingFields: ["title"]
        };
      }
    }
  }

  return null;
}

function buildPendingDeleteNote() {
  return {
    name: "delete_note",
    params: {},
    missingFields: ["title"]
  };
}

/**
 * ============================================================================
 * PENDING SCHEDULER HELPERS
 * ============================================================================
 */

function getMissingEventFields(params = {}) {
  const missing = [];

  if (!params.title || !String(params.title).trim()) {
    missing.push("title");
  }

  if (!params.startTime || !String(params.startTime).trim()) {
    missing.push("startTime");
  }

  return missing;
}

function getNextMissingEventQuestion(field, title = "") {
  switch (field) {
    case "title":
      return "What is the title of the event?";
    case "startTime":
      if (title) {
        return `What time should I schedule "${title}"?`;
      }
      return "When does the event start?";
    default:
      return "What event information is missing?";
  }
}

function fillPendingEventField(pending, userReply, context = {}) {
  const value = String(userReply || "").trim();
  if (!value) return pending;

  const nextField = pending.missingFields?.[0];
  if (!nextField) return pending;

  if (nextField === "title") {
    pending.params.title = cleanSchedulerTitle(value);
    pending.missingFields.shift();
    return pending;
  }

  if (nextField === "startTime") {
    if (pending.meta?.startDateIso) {
      const timeInfo = parseSchedulerTimeFromText(value);

      if (timeInfo?.iso) {
        pending.params.startTime = `${pending.meta.startDateIso}T${timeInfo.iso}`;
        pending.missingFields.shift();
      }

      return pending;
    }

    const combinedStart = parseNaturalSchedulerDateTime(value, context);
    if (combinedStart) {
      pending.params.startTime = combinedStart;
      pending.missingFields.shift();
      return pending;
    }

    const dateIso = buildIsoDateFromNaturalInput(value, context);
    if (dateIso) {
      pending.meta = {
        ...(pending.meta || {}),
        startDateIso: dateIso
      };
    }

    return pending;
  }

  return pending;
}

function shouldTrackPendingCreateEvent(replyContent = "") {
  const text = String(replyContent).trim();

  return (
    text === "When does the event start?" ||
    /^What time should I schedule ".+"\?$/.test(text)
  );
}

function buildPendingCreateEventFromMessage(message = "", context = {}) {
  const directCreate = extractDirectCreateEvent(message, context);

  if (!directCreate?.title) {
    return null;
  }

  if (directCreate.startTime) {
    return null;
  }

  if (!directCreate.startDateIso) {
    return null;
  }

  return {
    name: "create_event",
    params: {
      title: directCreate.title
    },
    missingFields: ["startTime"],
    meta: {
      startDateIso: directCreate.startDateIso
    }
  };
}

async function hydratePendingDeleteEventCandidates(pending, user) {
  if (!pending?.params?.title) {
    return pending;
  }

  const events = await require("./scheduler.service").getEvents(user.id);

  const matches = events
    .filter(
      (event) =>
        event.title &&
        event.title.toLowerCase() === pending.params.title.toLowerCase()
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .map((event, index) => ({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      choiceNumber: index + 1
    }));

  return {
    ...pending,
    meta: {
      ...(pending.meta || {}),
      candidates: matches
    }
  };
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
          : `${choices.slice(0, -1).join(", ")}, or ${
              choices[choices.length - 1]
            }`;

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
 * DETERMINISTIC NOTES HANDLERS
 * ============================================================================
 */

async function tryHandleDeterministicNotes(latestUserMessage, user, history) {
  const directCreate = extractDirectCreateNote(latestUserMessage);
  if (directCreate?.title && directCreate?.content) {
    const ai = {
      type: "action",
      name: "create_note",
      params: {
        title: directCreate.title,
        content: directCreate.content
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  const directReplace = extractDirectReplaceNoteUpdate(latestUserMessage);
  if (directReplace?.title && directReplace?.content) {
    const ai = {
      type: "action",
      name: "update_note",
      params: {
        title: directReplace.title,
        content: directReplace.content,
        mode: "replace"
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  const directRename = extractDirectRenameNote(latestUserMessage);
  if (directRename?.title && directRename?.newTitle) {
    const ai = {
      type: "action",
      name: "update_note",
      params: {
        title: directRename.title,
        newTitle: directRename.newTitle
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  const directAppend = extractDirectAppendNote(latestUserMessage);
  if (directAppend?.title && directAppend?.content) {
    const ai = {
      type: "action",
      name: "update_note",
      params: {
        title: directAppend.title,
        content: directAppend.content,
        mode: "append"
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  return null;
}

async function tryHandleDeterministicScheduler(
  latestUserMessage,
  user,
  history,
  context = {}
) {
  const directCreate = extractDirectCreateEvent(latestUserMessage, context);

  if (directCreate?.title && directCreate?.startTime) {
    const ai = {
      type: "action",
      name: "create_event",
      params: {
        title: directCreate.title,
        startTime: directCreate.startTime
      }
    };

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  if (
    directCreate?.title &&
    directCreate?.startDateIso &&
    !directCreate?.startTime
  ) {
    const pending = {
      name: "create_event",
      params: {
        title: directCreate.title
      },
      missingFields: ["startTime"],
      meta: {
        startDateIso: directCreate.startDateIso
      }
    };

    pendingActions.set(user.id, pending);

    const reply = {
      role: "assistant",
      content: getNextMissingEventQuestion("startTime", directCreate.title)
    };

    history.push(reply);
    return reply;
  }

  const directDelete = extractDirectDeleteEvent(latestUserMessage);

  if (directDelete?.title) {
    const ai = {
      type: "action",
      name: "delete_event",
      params: {
        title: directDelete.title
      }
    };

    const result = await actionRouter.execute(ai, user);

    if (shouldTrackPendingDeleteEvent(result?.content)) {
      let pendingDeleteEvent = buildPendingDeleteEventFromActionReply(
        result.content,
        user.id
      );

      if (pendingDeleteEvent) {
        pendingDeleteEvent = await hydratePendingDeleteEventCandidates(
          pendingDeleteEvent,
          user
        );
        pendingActions.set(user.id, pendingDeleteEvent);
      }

      history.push(result);
      return result;
    }

    history.push(buildActionHistoryEntry(ai));
    return result;
  }

  return null;
}

/**
 * ============================================================================
 * MAIN ORCHESTRATION
 * ============================================================================
 *
 * PARSER ORDER WARNING — DO NOT REORDER WITHOUT FULL REGRESSION CHECK:
 * 1. pending ambiguity continuation
 * 2. pending expense continuation
 * 3. pending notes continuation
 * 4. pending scheduler continuation
 * 5. pending delete-event disambiguation
 * 6. deterministic income parsing
 * 7. deterministic expense parsing
 * 8. deterministic notes parsing
 * 9. deterministic scheduler parsing
 * 10. OpenAI fallback
 */

async function runChatbot(messages, user, context = {}) {
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
   * Stage 3: pending notes continuation
   */
  if (pending && pending.name === "create_note") {
    fillPendingNoteField(pending, latestUserMessage);

    if (pending.missingFields.length > 0) {
      const nextField = pending.missingFields[0];

      const reply = {
        role: "assistant",
        content: getNextMissingNoteQuestion(nextField, pending.params.title)
      };

      history.push(reply);
      pendingActions.set(user.id, pending);
      return replyCleanup(user.id, reply);
    }

    const ai = {
      type: "action",
      name: "create_note",
      params: pending.params
    };

    pendingActions.delete(user.id);

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return replyCleanup(user.id, result);
  }

  if (pending && pending.name === "delete_note") {
    const titleReply = String(latestUserMessage || "").trim();

    if (!titleReply) {
      const reply = {
        role: "assistant",
        content: "What is the exact title of the note you want to delete?"
      };

      history.push(reply);
      pendingActions.set(user.id, pending);
      return replyCleanup(user.id, reply);
    }

    const ai = {
      type: "action",
      name: "delete_note",
      params: {
        title: titleReply
      }
    };

    pendingActions.delete(user.id);

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return replyCleanup(user.id, result);
  }

  /**
   * Stage 4: pending scheduler continuation
   */
  if (shouldResetPendingEvent(pending, latestUserMessage)) {
    pendingActions.delete(user.id);
    pending = null;
  }

  if (pending && pending.name === "create_event") {
    fillPendingEventField(pending, latestUserMessage, context);

    if (pending.missingFields.length > 0) {
      const nextField = pending.missingFields[0];

      const reply = {
        role: "assistant",
        content: getNextMissingEventQuestion(nextField, pending.params.title)
      };

      history.push(reply);
      pendingActions.set(user.id, pending);
      return replyCleanup(user.id, reply);
    }

    const ai = {
      type: "action",
      name: "create_event",
      params: pending.params
    };

    pendingActions.delete(user.id);

    const result = await actionRouter.execute(ai, user);
    history.push(buildActionHistoryEntry(ai));
    return replyCleanup(user.id, result);
  }

  /**
   * Stage 5: pending delete-event disambiguation
   */
  if (pending && pending.name === "delete_event" && pending.meta?.needsResolution) {
    const candidates = pending.meta?.candidates || [];
    const resolvedCandidate = parseDeleteEventChoiceFromMessage(
      latestUserMessage,
      candidates
    );

    if (!resolvedCandidate) {
      const options = candidates
        .map((candidate, index) => {
          const date = new Date(candidate.startTime);
          const label = Number.isNaN(date.getTime())
            ? "unknown time"
            : date.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              });

          return `${index + 1}. ${label}`;
        })
        .join(" ");

      const reply = {
        role: "assistant",
        content: `I found multiple events titled "${pending.params.title}". Which one should I delete? ${options}`
      };

      history.push(reply);
      pendingActions.set(user.id, pending);
      return replyCleanup(user.id, reply);
    }

    pendingActions.delete(user.id);

    const schedulerService = require("./scheduler.service");
    await schedulerService.deleteEvent(user.id, resolvedCandidate.id);

    const reply = {
      role: "assistant",
      content: `The event "${resolvedCandidate.title}" has been deleted.`
    };

    history.push(reply);
    return replyCleanup(user.id, reply);
  }

  /**
   * Stage 6: deterministic income parsing
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
   * Stage 7: deterministic expense parsing
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
   * Stage 8: deterministic notes parsing
   */
  const deterministicNotesResult = await tryHandleDeterministicNotes(
    latestUserMessage,
    user,
    history
  );

  if (deterministicNotesResult) {
    return replyCleanup(user.id, deterministicNotesResult);
  }

  /**
   * Stage 9: deterministic scheduler parsing
   */
  const deterministicSchedulerResult = await tryHandleDeterministicScheduler(
    latestUserMessage,
    user,
    history,
    context
  );

  if (deterministicSchedulerResult) {
    return replyCleanup(user.id, deterministicSchedulerResult);
  }

  /**
   * Stage 10: OpenAI fallback
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

    if (shouldTrackPendingCreateNote(reply.content)) {
      const pendingCreate = buildPendingCreateNoteFromMessage(
        latestUserMessage,
        reply.content
      );

      if (pendingCreate) {
        pendingActions.set(user.id, pendingCreate);
      }
    }

    if (shouldTrackPendingDeleteNote(reply.content)) {
      pendingActions.set(user.id, buildPendingDeleteNote());
    }

    if (shouldTrackPendingCreateEvent(reply.content)) {
      const pendingCreateEvent = buildPendingCreateEventFromMessage(
        latestUserMessage,
        context
      );

      if (pendingCreateEvent) {
        pendingActions.set(user.id, pendingCreateEvent);
      }
    }

    if (shouldTrackPendingDeleteEvent(reply.content)) {
      let pendingDeleteEvent = buildPendingDeleteEventFromActionReply(
        reply.content,
        user.id
      );

      if (pendingDeleteEvent) {
        pendingDeleteEvent = await hydratePendingDeleteEventCandidates(
          pendingDeleteEvent,
          user
        );
        pendingActions.set(user.id, pendingDeleteEvent);
      }
    }

    history.push(reply);
    return replyCleanup(user.id, reply);
  }

  if (ai.type === "action") {
    ai = sanitizeExpenseAction(ai, latestUserMessage);
    ai = sanitizeIncomeAction(ai, latestUserMessage);
    ai = sanitizeSchedulerAction(ai, latestUserMessage, context);

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

    if (ai.name === "delete_event") {
      pendingActions.delete(user.id);

      const result = await actionRouter.execute(ai, user);

      if (shouldTrackPendingDeleteEvent(result?.content)) {
        let pendingDeleteEvent = buildPendingDeleteEventFromActionReply(
          result.content,
          user.id
        );

        if (pendingDeleteEvent) {
          pendingDeleteEvent = await hydratePendingDeleteEventCandidates(
            pendingDeleteEvent,
            user
          );
          pendingActions.set(user.id, pendingDeleteEvent);
        }

        history.push(result);
        return replyCleanup(user.id, result);
      }

      history.push(buildActionHistoryEntry(ai));
      return replyCleanup(user.id, result);
    }

    if (ai.name === "create_event") {
      pendingActions.delete(user.id);

      const params = { ...(ai.params || {}) };
      const missingFields = getMissingEventFields(params);
      const directCreate = extractDirectCreateEvent(
        latestUserMessage,
        context
      );

      if (missingFields.length > 0) {
        pendingActions.set(user.id, {
          name: "create_event",
          params,
          missingFields,
          meta: directCreate?.startDateIso
            ? { startDateIso: directCreate.startDateIso }
            : undefined
        });

        const reply = {
          role: "assistant",
          content: getNextMissingEventQuestion(missingFields[0], params.title)
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