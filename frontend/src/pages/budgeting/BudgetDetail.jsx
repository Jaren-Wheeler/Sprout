import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getBudgetById } from "../../api/finance";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

import BudgetSummary from "../../components/budgeting/BudgetSummary.jsx";
import AddExpenseForm from "../../components/budgeting/AddExpenseForm.jsx";
import ExpenseTable from "../../components/budgeting/ExpenseTable.jsx";

export default function BudgetDetail() {

  const { id } = useParams();

  // =====================================================
  // State
  // =====================================================

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // Load Budget
  // =====================================================

  useEffect(() => {
    loadBudget();
  }, [id]);

  const loadBudget = async () => {
    try {
      const data = await getBudgetById(id);
      setBudget(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // States
  // =====================================================

  if (loading) {
    return <div className="muted">Loading…</div>;
  }

  if (error || !budget) {
    return (
      <Card
        title="Budget not found"
        subtitle="This budget may not exist or may not belong to your account."
      >
        <Link to="/budgets" className="badge">
          Back to budgets
        </Link>
      </Card>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div style={{ display: "grid", gap: 12 }}>

      <div className="row">
        <div>
          <h1 className="h1">{budget.name}</h1>
          <div className="muted">
            Totals are calculated automatically from expenses.
          </div>
        </div>

        <div className="spacer" />

        <Link to="/budgets">
          <Button variant="ghost">← Back</Button>
        </Link>
      </div>

      {/* -------- SUMMARY -------- */}

      <BudgetSummary
        limit={budget.limitAmount}
        totalSpent={budget.totalSpent}
        remaining={budget.remaining}
      />

      {/* -------- ADD EXPENSE -------- */}

      <AddExpenseForm
        budgetId={budget.id}
        onAdded={loadBudget}
      />

      {/* -------- EXPENSES -------- */}

      <ExpenseTable
        expenses={budget.expenses}
      />

    </div>
  );
}
