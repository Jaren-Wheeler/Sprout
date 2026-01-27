const financeService = require("../services/finance.service");


// =====================================================
// Finance Controller
// =====================================================
// Handles HTTP requests for budgeting and expense
// management. Delegates business logic to the
// finance service layer and manages responses.
// =====================================================


// =====================================================
// Budget Controllers
// =====================================================

/**
 * Creates a new budget for the authenticated user.
 * @route POST /api/finance/budgets
 * @access Protected
 */
async function createBudget(req, res) {
  try {
    const userId = req.user.id;
    const { name, limitAmount } = req.body;

    const budget = await financeService.createBudget(userId, {
      name,
      limitAmount
    });

    res.status(201).json(budget);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Retrieves all budgets for the authenticated user
 * including totals and remaining balances.
 * @route GET /api/finance/budgets
 * @access Protected
 */
async function getBudgets(req, res) {
  try {
    const userId = req.user.id;

    const budgets = await financeService.getBudgets(userId);

    res.json(budgets);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Updates an existing budget.
 * @route PUT /api/finance/budgets/:id
 * @access Protected
 */
async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const { name, limitAmount } = req.body;

    const updated = await financeService.updateBudget(id, {
      name,
      limitAmount
    });

    res.json(updated);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Deletes a budget by ID.
 * @route DELETE /api/finance/budgets/:id
 * @access Protected
 */
async function deleteBudget(req, res) {
  try {
    const { id } = req.params;

    const deleted = await financeService.deleteBudget(id);

    res.json(deleted);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// =====================================================
// Expense Controllers
// =====================================================

/**
 * Creates a new expense for the authenticated user.
 * @route POST /api/finance/expenses
 * @access Protected
 */
async function createExpense(req, res) {
  try {
    const userId = req.user.id;

    const expense = await financeService.createExpense(userId, req.body);

    res.status(201).json(expense);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Retrieves expenses for the authenticated user
 * with optional filtering by budget or date range.
 * @route GET /api/finance/expenses
 * @access Protected
 */
async function getExpenses(req, res) {
  try {
    const userId = req.user.id;

    const expenses = await financeService.getExpenses(userId, req.query);

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Updates an existing expense entry.
 * @route PUT /api/finance/expenses/:id
 * @access Protected
 */
async function updateExpense(req, res) {
  try {
    const { id } = req.params;

    const updated = await financeService.updateExpense(id, req.body);

    res.json(updated);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Deletes an expense entry by ID.
 * @route DELETE /api/finance/expenses/:id
 * @access Protected
 */
async function deleteExpense(req, res) {
  try {
    const { id } = req.params;

    const deleted = await financeService.deleteExpense(id);

    res.json(deleted);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// =====================================================
// Analytics Controllers
// =====================================================

/**
 * Retrieves total spending per category for graphs.
 * @route GET /api/finance/analytics/categories
 * @access Protected
 */
async function getCategoryTotals(req, res) {
  try {
    const userId = req.user.id;

    const totals = await financeService.getExpenseTotalsByCategory(userId);

    res.json(totals);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// =====================================================
// Exports
// =====================================================

module.exports = {
  // Budgets
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,

  // Expenses
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,

  // Analytics
  getCategoryTotals
};
