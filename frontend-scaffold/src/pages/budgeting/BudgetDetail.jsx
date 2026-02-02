import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import { useStore } from "../../state/store.jsx";
import { fromDatetimeLocalValue, toDatetimeLocalValue } from "../../lib/datetime.js";
import { numberNonNegative } from "../../lib/validators.js";

export default function BudgetDetail() {
  const { budgetId } = useParams();
  const id = Number(budgetId);
  const { state, dispatch, currentUser, nowForDatetimeInput } = useStore();
  const user = currentUser();

  const budget = state.budgets.find((b) => b.budget_id === id && b.user_id === user?.user_id) || null;

  const expenses = useMemo(
    () => state.expenses.filter((e) => e.budget_id === id),
    [state.expenses, id]
  );

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const remaining = budget ? Number(budget.limit_amount) - total : 0;

  const [openAdd, setOpenAdd] = useState(false);
  const [amount, setAmount] = useState("0");
  const [occurredAt, setOccurredAt] = useState(nowForDatetimeInput());
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  const onAddExpense = () => {
    setError(null);
    if (!budget) return;

    const errAmount = numberNonNegative("Amount", amount);
    if (errAmount) return setError(errAmount);

    dispatch({
      type: "expenses/create",
      payload: {
        budget_id: budget.budget_id,
        amount: Number(amount),
        occurred_at: fromDatetimeLocalValue(occurredAt),
        description: description || null,
        category: category || null,
      },
    });

    setOpenAdd(false);
    setAmount("0");
    setOccurredAt(nowForDatetimeInput());
    setDescription("");
    setCategory("");
  };

  const onDeleteExpense = (expense_id) => {
    dispatch({ type: "expenses/delete", payload: { expense_id } });
  };

  if (!budget) {
    return (
      <Card title="Budget not found" subtitle="This budget may not exist or may not belong to your account.">
        <Link to="/budgets" className="badge">Back to budgets</Link>
      </Card>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">{budget.name}</h1>
          <div className="muted">Totals are calculated automatically from expenses.</div>
        </div>
        <div className="spacer" />
        <Link to="/budgets"><Button variant="ghost">← Back</Button></Link>
        <Button onClick={() => setOpenAdd(true)}>+ Add expense</Button>
      </div>

      <div className="grid2">
        <Card title="Summary">
          <div className="row">
            <span className="badge">Limit: {Number(budget.limit_amount).toFixed(2)}</span>
            <span className="badge">Total expenses: {total.toFixed(2)}</span>
            <span className="badge" style={{ borderColor: remaining < 0 ? "var(--danger)" : "var(--border)" }}>
              Remaining: {remaining.toFixed(2)}
            </span>
          </div>
        </Card>

        <Card title="Records" subtitle="Historical records are represented by the expenses list in this prototype.">
          <div className="muted" style={{ fontSize: 13 }}>
            Future enhancement (not implemented here): financial_history aggregation.
          </div>
        </Card>
      </div>

      <Card title="Expenses" subtitle="Add, edit (not implemented), delete.">
        {expenses.length === 0 ? (
          <div className="muted">No expenses yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Occurred</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.expense_id}>
                  <td className="muted">{toDatetimeLocalValue(e.occurred_at)}</td>
                  <td>{Number(e.amount).toFixed(2)}</td>
                  <td>{e.description ?? <span className="muted">—</span>}</td>
                  <td>{e.category ?? <span className="muted">—</span>}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" onClick={() => onDeleteExpense(e.expense_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={openAdd}
        title="Add expense"
        onClose={() => setOpenAdd(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button onClick={onAddExpense}>Add</Button>
          </div>
        }
      >
        <Field label="Amount" error={error}>
          <input className="input" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>

        <Field label="Occurred at">
          <input className="input" type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        </Field>

        <Field label="Description (optional)">
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <Field label="Category (optional)">
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
