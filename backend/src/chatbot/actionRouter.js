const financeActions = require("./actions/finance.actions");
const healthActions = require("./actions/health.actions");

async function execute(ai, user) {

  switch (ai.name) {

    /* ================= FINANCE ================= */

    case "create_category":
    case "delete_category":
    case "add_expense":
    case "delete_expense":
      return financeActions.handle(ai, user);


    /* ================= HEALTH ================= */

    case "add_info":
    case "change_info":
    case "create_diet":
    case "delete_diet":
    case "log_food":
        return healthActions.handle(ai, user);
    case "delete_food":
    case "create_preset_meal":
      return healthActions.handle(ai, user);


    /* ================= DEFAULT ================= */

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

module.exports = { execute };