const prisma = require("../clients/prisma.client");


// =====================================================
// Budget Services
// =====================================================
// Handles creation, retrieval, updates, and deletion
// of user budgets. Also calculates totals and remaining
// balances for each budget.
// =====================================================

/**
 * Creates a new budget for a user.
 * @param {string} userId
 * @param {Object} data
 * @param {string} data.name
 * @param {number} data.limitAmount
 * @returns {Object} Created budget
 */
async function createBudget(userId, data) {
  return prisma.budget.create({
    data: {
      name: data.name,
      limitAmount: data.limitAmount,
      userId
    }
  });
}

/**
 * Retrieves all budgets for a user and calculates
 * total spending and remaining balance for each.
 * @param {string} userId
 * @returns {Array<Object>} Budgets with totals
 */
async function getBudgets(userId) {
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      expenses: true
    }
  });

  return budgets.map(b => {
    const totalSpent = b.expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    return {
      id: b.id,
      name: b.name,
      limitAmount: b.limitAmount,
      totalSpent,
      remaining: Number(b.limitAmount) - totalSpent
    };
  });
}

/**
 * Updates an existing budget.
 * @param {string} budgetId
 * @param {Object} data
 * @param {string} data.name
 * @param {number} data.limitAmount
 * @returns {Object} Updated budget
 */
async function updateBudget(budgetId, data) {
  return prisma.budget.update({
    where: { id: budgetId },
    data: {
      name: data.name,
      limitAmount: data.limitAmount
    }
  });
}

/**
 * Deletes a budget by ID.
 * @param {string} budgetId
 * @returns {Object} Deleted budget
 */
async function deleteBudget(budgetId) {
  return prisma.budget.delete({
    where: { id: budgetId }
  });
}

/**
 * Retrieves a single budget by ID for a user and calculates
 * total spending and remaining balance.
 * @param {string} budgetId
 * @param {string} userId
 * @returns {Object|null} Budget with totals or null if not found
 */
async function getBudgetById(budgetId, userId) {

  const budget = await prisma.budget.findFirst({
    where: {
      id: budgetId,
      userId
    },
    include: {
      expenses: true
    }
  });

  if (!budget) return null;

  const totalSpent = budget.expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return {
    id: budget.id,
    name: budget.name,
    limitAmount: budget.limitAmount,
    totalSpent,
    remaining: Number(budget.limitAmount) - totalSpent,
    expenses: budget.expenses
  };
}


// =====================================================
// Expense Services
// =====================================================
// Manages individual financial transactions including
// creation, updates, deletion, and filtering by date
// or budget.
// =====================================================

/**
 * Creates a new expense entry for a user.
 * @param {string} userId
 * @param {Object} data
 * @param {number} data.amount
 * @param {string} data.category
 * @param {string} data.description
 * @param {string} data.expenseDate
 * @param {string} data.budgetId
 * @returns {Object} Created expense
 */
async function createExpense(userId, data) {
  return prisma.expense.create({
    data: {
      amount: data.amount,
      category: data.category,
      description: data.description,
      expenseDate: new Date(data.expenseDate),
      user: {
        connect: {id: userId}
      },
      budget: {
        connect: {id: data.budgetId}
      }
    }
  });
}

/**
 * Retrieves expenses for a user with optional filters.
 * @param {string} userId
 * @param {Object} filters
 * @param {string} [filters.budgetId]
 * @param {string} [filters.from]
 * @param {string} [filters.to]
 * @returns {Array<Object>} Filtered expenses
 */
async function getExpenses(userId, filters = {}) {

  const where = { userId };

  if (filters.budgetId) {
    where.budgetId = filters.budgetId;
  }

  if (filters.from && filters.to) {
    where.expenseDate = {
      gte: new Date(filters.from),
      lte: new Date(filters.to)
    };
  }

  return prisma.expense.findMany({
    where,
    orderBy: {
      expenseDate: "desc"
    }
  });
}

/**
 * Updates an existing expense entry.
 * @param {string} expenseId
 * @param {Object} data
 * @returns {Object} Updated expense
 */
async function updateExpense(expenseId, data) {
  return prisma.expense.update({
    where: { id: expenseId },
    data: {
      amount: data.amount,
      category: data.category,
      description: data.description,
      expenseDate: new Date(data.expenseDate)
    }
  });
}

/**
 * Deletes an expense entry by ID.
 * @param {string} expenseId
 * @returns {Object} Deleted expense
 */
async function deleteExpense(expenseId) {
  return prisma.expense.delete({
    where: { id: expenseId }
  });
}


// =====================================================
// Analytics Services
// =====================================================
// Provides aggregated financial data for visualizations
// such as category breakdowns.
// =====================================================

/**
 * Calculates total spending per category for a user.
 * Used to power budgeting graphs.
 * @param {string} userId
 * @returns {Array<Object>} Category totals
 */
async function getExpenseTotalsByCategory(userId) {

  const expenses = await prisma.expense.findMany({
    where: { userId }
  });

  const totals = {};

  expenses.forEach(e => {
    const category = e.category;
    totals[category] = (totals[category] || 0) + Number(e.amount);
  });

  return Object.entries(totals).map(([category, total]) => ({
    category,
    total
  }));
}

// =====================================================
// Income Services
// =====================================================
// Handles tracking of real income deposits and the
// user's expected monthly income baseline.
// =====================================================

/**
 * Updates the user's expected monthly income.
 */
async function updateExpectedIncome(userId, amount) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      expectedIncome: amount
    }
  });
}


/**
 * Creates a new income entry.
 */
async function createIncomeEntry(userId, data) {
  return prisma.incomeEntry.create({
    data: {
      amount: data.amount,
      note: data.note,
      incomeDate: data.incomeDate
        ? new Date(data.incomeDate)
        : new Date(),
      user: {
        connect: { id: userId }
      }
    }
  });
}


/**
 * Retrieves income entries for a user.
 * Supports optional date filtering.
 */
async function getIncomeEntries(userId, filters = {}) {

  const where = { userId };

  if (filters.from && filters.to) {
    where.incomeDate = {
      gte: new Date(filters.from),
      lte: new Date(filters.to)
    };
  }

  return prisma.incomeEntry.findMany({
    where,
    orderBy: {
      incomeDate: "desc"
    }
  });
}

/**
 * Retrieves the user's expected monthly income baseline.
 */
async function getExpectedIncome(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { expectedIncome: true }
  });

  return {
    amount: user?.expectedIncome || 0
  };
}

// =====================================================
// Exports
// =====================================================

module.exports = {
  // Budgets
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,

  // Expenses
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,

  // Income
  updateExpectedIncome,
  createIncomeEntry,
  getIncomeEntries,
  getExpectedIncome,

  // Analytics
  getExpenseTotalsByCategory
};
