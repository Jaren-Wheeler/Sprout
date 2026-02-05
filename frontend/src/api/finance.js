//frontend/src/api/finance.js
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
 * Fetch single budget by id (includes expenses)
 */
export const getBudgetById = (id) => {
  return apiFetch(`/api/finance/budgets/${id}`);
};

/**
 * Update an existing budget
 * @param {string|number} id
 * @param {{ name?: string, limitAmount?: number }} data
 */
export const updateBudget = (id, data) => {
  return apiFetch(`/api/finance/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
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
 * Fetch expenses (optional query string)
 * Example: getExpenses("?budgetId=123")
 */
export const getExpenses = (query = "") => {
  return apiFetch(`/api/finance/expenses${query}`);
};

/**
 * Update an expense
 * @param {string|number} id
 * @param {Object} data
 */
export const updateExpense = (id, data) => {
  return apiFetch(`/api/finance/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

/**
 * Delete an expense
 * @param {string|number} id
 */
export const deleteExpense = (id) => {
  return apiFetch(`/api/finance/expenses/${id}`, {
    method: "DELETE"
  });
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