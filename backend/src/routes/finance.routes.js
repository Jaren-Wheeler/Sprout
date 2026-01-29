const express = require("express");
const router = express.Router();

const {
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

  // Analytics
  getCategoryTotals
} = require("../controllers/finance.controller");

const auth = require("../middleware/auth");


// =====================================================
// Budget Routes
// =====================================================

router.post("/budgets", auth, createBudget);
router.get("/budgets", auth, getBudgets);
router.get("/budgets/:id", auth, getBudgetById);
router.put("/budgets/:id", auth, updateBudget);
router.delete("/budgets/:id", auth, deleteBudget);


// =====================================================
// Expense Routes
// =====================================================

router.post("/expenses", auth, createExpense);
router.get("/expenses", auth, getExpenses);
router.put("/expenses/:id", auth, updateExpense);
router.delete("/expenses/:id", auth, deleteExpense);


// =====================================================
// Analytics Routes
// =====================================================

router.get("/analytics/categories", auth, getCategoryTotals);


module.exports = router;
