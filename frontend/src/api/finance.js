import { apiFetch } from "./client";

// =====================================================
// Finance API Module
// =====================================================
// Frontend functions for budgeting & expenses endpoints
// =====================================================

/**
 * Fetch all budgets for the logged in user
 */
export const getBudgets = () => {
  return apiFetch("/api/finance/budgets");
};

/**
 * Create a new budget
 * @param {Object} data
 * @param {string} data.name
 * @param {number} data.limitAmount
 */
export const createBudget = (data) => {
  return apiFetch("/api/finance/budgets", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Fetch single budget by id
 */
export const getBudgetById = (id) => {
  return apiFetch(`/api/finance/budgets/${id}`);
};

/**
 * Create a new expense
 */
export const createExpense = (data) => {
  return apiFetch("/api/finance/expenses", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

/**
 * Fetch expenses 
 */
export const getExpenses = (query = "") => {
  return apiFetch(`/api/finance/expenses${query}`);
};

/**
 * Delete a budget
 */
export const deleteBudget = (id) => {
  return apiFetch(`/api/finance/budgets/${id}`, {
    method: "DELETE"
  });
};

/**
 * Fetch total spending grouped by category
 * @returns {Promise<Array<{ category: string, total: number }>}
 */
export const getCategoryTotals = () => {
  return apiFetch("/api/finance/analytics/categories");
};
