const financeActions = require("./actions/finance.actions");

async function execute(ai, user) {

  switch (ai.name) {

    case "create_category":
    case "delete_category":
    case "add_expense":
    case "delete_expense":
      return financeActions.handle(ai, user);

    default:
      return {
        role: "assistant",
        content: "I don’t know how to do that yet."
      };
  }
}

module.exports = { execute };