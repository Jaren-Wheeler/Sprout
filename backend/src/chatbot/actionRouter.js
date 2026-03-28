const financeActions = require("./actions/finance.actions");
const healthActions = require("./actions/health.actions");
const notesActions = require("./actions/notes.actions");
const schedulerActions = require("./actions/scheduler.actions");

const ACTION_DOMAINS = {
  create_category: "finance",
  delete_category: "finance",
  add_expense: "finance",
  delete_expense: "finance",
  add_income: "finance",
  add_info: "health",
  change_info: "health",
  create_diet: "health",
  delete_diet: "health",
  log_food: "health",
  delete_food: "health",
  create_preset_meal: "health",
  delete_preset_meal: "health",
  create_note: "notes",
  update_note: "notes",
  delete_note: "notes",
  create_event: "scheduler",
  delete_event: "scheduler"
};

function isSupportedAction(name) {
  return Boolean(ACTION_DOMAINS[name]);
}

function getActionDomain(name) {
  return ACTION_DOMAINS[name] || null;
}

async function execute(ai, user) {
  switch (ai.name) {
    /* ================= FINANCE ================= */

    case "create_category":
    case "delete_category":
    case "add_expense":
    case "delete_expense":
    case "add_income":
      return financeActions.handle(ai, user);

    /* ================= HEALTH ================= */

    case "add_info":
    case "change_info":
    case "create_diet":
    case "delete_diet":
    case "log_food":
    case "delete_food":
    case "create_preset_meal":
    case "delete_preset_meal":
      return healthActions.handle(ai, user);

    /* ================= NOTES ================= */

    case "create_note":
    case "update_note":
    case "delete_note":
      return notesActions.handle(ai, user);

    /* ================= SCHEDULER ================= */

    case "create_event":
    case "delete_event":
      return schedulerActions.handle(ai, user);

    /* ================= DEFAULT ================= */

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

module.exports = {
  execute,
  isSupportedAction,
  getActionDomain
};
