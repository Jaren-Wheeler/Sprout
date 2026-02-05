//frontend/src/pages/budgeting/BudgetDetail.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SproutSection from "../../components/Sprout.jsx";

import {
  getBudgetById,
  updateBudget,
  createExpense,
  updateExpense,
  deleteExpense,
  deleteBudget,
} from "../../api/finance";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import Field from "../../components/Field.jsx";
import Modal from "../../components/Modal.jsx";

import "../../styles/layout/appPages.css";

function toMoney(n) {
  const num = Number(n ?? 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toFixed(2);
}

function toDateInputValue(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function BudgetDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [editError, setEditError] = useState("");

  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseId, setExpenseId] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseDate, setExpenseDate] = useState(toDateInputValue(new Date()));
  const [expenseError, setExpenseError] = useState("");

  // ✅ StrictMode dev guard + avoid concurrent loads
  const didLoadRef = useRef(false);
  const loadInFlightRef = useRef(false);

  // ✅ Keep modal callbacks stable so Modal's effect doesn't re-run on every keystroke
  const closeEditModal = useCallback(() => setEditOpen(false), []);
  const closeExpenseModal = useCallback(() => setExpenseOpen(false), []);

  const load = useCallback(async () => {
    if (loadInFlightRef.current) return;
    loadInFlightRef.current = true;

    setLoading(true);
    setError("");

    try {
      const data = await getBudgetById(id);
      setBudget(data ?? null);
    } catch (err) {
      console.error("BudgetDetail load failed:", err);
      setBudget(null);

      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        setError("Too many requests (429). Please wait a moment and click Refresh.");
      } else {
        setError(
          err?.message ||
            "Failed to load budget. (Are you logged in? Is the server running?)"
        );
      }
    } finally {
      setLoading(false);
      loadInFlightRef.current = false;
    }
  }, [id]);

  useEffect(() => {
    // reset guard when id changes
    didLoadRef.current = false;
  }, [id]);

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    load();
  }, [load]);

  const expenses = useMemo(() => {
    const list = Array.isArray(budget?.expenses) ? budget.expenses : [];
    return [...list].sort((a, b) => {
      const ad = new Date(a.expenseDate ?? a.createdAt ?? 0).getTime();
      const bd = new Date(b.expenseDate ?? b.createdAt ?? 0).getTime();
      return bd - ad;
    });
  }, [budget]);

  const computed = useMemo(() => {
    const limit = Number(budget?.limitAmount ?? 0);
    const spent = Number(budget?.totalSpent ?? 0);
    const remaining = Number(budget?.remaining ?? limit - spent);
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    return { limit, spent, remaining, pct };
  }, [budget]);

  const openEditBudget = () => {
    if (!budget) return;
    setEditError("");
    setEditName(String(budget.name ?? ""));
    setEditLimit(String(budget.limitAmount ?? ""));
    setEditOpen(true);
  };

  const saveBudget = async () => {
    if (!budget) return;
    setEditError("");

    const name = editName.trim();
    if (!name) {
      setEditError("Budget name is required");
      return;
    }

    const limit = Number(editLimit);
    if (Number.isNaN(limit) || limit < 0) {
      setEditError("Limit amount must be zero or greater");
      return;
    }

    try {
      await updateBudget(budget.id, { name, limitAmount: limit });
      closeEditModal();
      await load();
    } catch (err) {
      console.error("Update budget failed:", err);
      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        setEditError("Too many requests (429). Please wait and try again.");
      } else {
        setEditError(err?.message || "Failed to update budget.");
      }
    }
  };

  const onDeleteBudget = async () => {
    if (!budget) return;
    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(budget.id);
      nav("/budgets");
    } catch (err) {
      console.error("Delete budget failed:", err);
      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        alert("Too many requests (429). Please wait and try again.");
      } else {
        alert(err?.message || "Failed to delete budget.");
      }
    }
  };

  const openCreateExpense = () => {
    setExpenseError("");
    setExpenseId(null);
    setExpenseAmount("");
    setExpenseCategory("");
    setExpenseDesc("");
    setExpenseDate(toDateInputValue(new Date()));
    setExpenseOpen(true);
  };

  const openEditExpense = (e) => {
    setExpenseError("");
    setExpenseId(e.id);
    setExpenseAmount(String(e.amount ?? ""));
    setExpenseCategory(String(e.category ?? ""));
    setExpenseDesc(String(e.description ?? ""));
    setExpenseDate(toDateInputValue(e.expenseDate));
    setExpenseOpen(true);
  };

  const saveExpense = async () => {
    if (!budget) return;

    setExpenseError("");

    const amount = Number(expenseAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      setExpenseError("Amount must be greater than 0");
      return;
    }

    const category = expenseCategory.trim();
    if (!category) {
      setExpenseError("Category is required");
      return;
    }

    const payload = {
      budgetId: budget.id,
      amount,
      category,
      description: expenseDesc.trim() ? expenseDesc.trim() : null,
      expenseDate: expenseDate ? new Date(expenseDate).toISOString() : null,
    };

    try {
      if (expenseId) {
        await updateExpense(expenseId, payload);
      } else {
        await createExpense(payload);
      }

      closeExpenseModal();
      await load();
    } catch (err) {
      console.error("Save expense failed:", err);
      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        setExpenseError("Too many requests (429). Please wait and try again.");
      } else {
        setExpenseError(err?.message || "Failed to save expense.");
      }
    }
  };

  const onDeleteExpense = async (expenseIdToDelete) => {
    if (!confirm("Delete this expense?")) return;

    try {
      await deleteExpense(expenseIdToDelete);
      await load();
    } catch (err) {
      console.error("Delete expense failed:", err);
      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        alert("Too many requests (429). Please wait and try again.");
      } else {
        alert(err?.message || "Failed to delete expense.");
      }
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Budget details</h1>
            <div className="pageSubtitle">
              <Link to="/budgets" className="badge">
                ← Back to budgets
              </Link>
            </div>

            {error ? (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                }}
              >
                {error}
              </div>
            ) : null}
          </div>

          <div className="pageHeaderRight">
            {/* ✅ Removed extra Dashboard button to avoid duplicates */}
            <Button variant="ghost" onClick={load} disabled={loadInFlightRef.current}>
              Refresh
            </Button>
          </div>
        </div>

        {!budget ? (
          <div className="pageBody">
            <Card title="Not found" subtitle="This budget id doesn’t exist.">
              <div className="muted">
                Budget id: <span className="badge">{String(id)}</span>
              </div>
            </Card>
          </div>
        ) : (
          <div className="pageBody" style={{ display: "grid", gap: 16 }}>
            <div className="grid2">
              <Card title={budget.name} subtitle={`Budget ID: ${budget.id}`}>
                <div style={{ display: "grid", gap: 12 }}>
                  <div className="grid2">
                    <div>
                      <div className="muted">Limit</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        ${toMoney(computed.limit)}
                      </div>
                    </div>
                    <div>
                      <div className="muted">Spent</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        ${toMoney(computed.spent)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="row" style={{ fontSize: 12 }}>
                      <span
                        style={{
                          color:
                            computed.remaining < 0
                              ? "var(--danger)"
                              : "var(--muted)",
                          fontWeight: 700,
                        }}
                      >
                        Remaining: ${toMoney(computed.remaining)}
                      </span>
                      <span className="spacer" />
                      <span className="muted">
                        {computed.limit > 0 ? `${computed.pct.toFixed(0)}%` : "—"}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 8,
                        height: 12,
                        background: "var(--border)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${computed.pct}%`,
                          height: "100%",
                          background:
                            computed.remaining < 0
                              ? "var(--danger)"
                              : "var(--accent)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                    <Button variant="ghost" onClick={openEditBudget}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={onDeleteBudget}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>

              <Card
                title="Expenses"
                subtitle="Create, edit, and delete expenses for this budget."
              >
                <div className="row" style={{ justifyContent: "flex-end", marginBottom: 10 }}>
                  <Button onClick={openCreateExpense}>+ Add expense</Button>
                </div>

                {expenses.length === 0 ? (
                  <div className="muted">No expenses yet.</div>
                ) : (
                  <div className="tableWrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: 120 }}>Date</th>
                          <th style={{ minWidth: 160 }}>Category</th>
                          <th>Description</th>
                          <th style={{ textAlign: "right", minWidth: 120 }}>
                            Amount
                          </th>
                          <th style={{ width: 200 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((e) => (
                          <tr key={e.id}>
                            <td className="muted">
                              {toDateInputValue(e.expenseDate) || "—"}
                            </td>
                            <td>{e.category}</td>
                            <td className="muted">{e.description ?? "—"}</td>
                            <td style={{ textAlign: "right", fontWeight: 800 }}>
                              ${toMoney(e.amount)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div
                                className="row"
                                style={{
                                  justifyContent: "flex-end",
                                  gap: 8,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Button variant="ghost" onClick={() => openEditExpense(e)}>
                                  Edit
                                </Button>
                                <Button variant="ghost" onClick={() => onDeleteExpense(e.id)}>
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        <Modal
          open={editOpen}
          title="Edit budget"
          onClose={closeEditModal}
          footer={
            <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
              <Button variant="ghost" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button onClick={saveBudget}>Save</Button>
            </div>
          }
        >
          <Field label="Budget name" error={editError}>
            <input
              className="input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </Field>

          <Field label="Limit amount">
            <input
              className="input"
              type="number"
              step="0.01"
              value={editLimit}
              onChange={(e) => setEditLimit(e.target.value)}
            />
          </Field>
        </Modal>

        <Modal
          open={expenseOpen}
          title={expenseId ? "Edit expense" : "Create expense"}
          onClose={closeExpenseModal}
          footer={
            <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
              <Button variant="ghost" onClick={closeExpenseModal}>
                Cancel
              </Button>
              <Button onClick={saveExpense}>
                {expenseId ? "Save" : "Create"}
              </Button>
            </div>
          }
        >
          <Field label="Amount" error={expenseError}>
            <input
              className="input"
              type="number"
              step="0.01"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
          </Field>

          <Field label="Category">
            <input
              className="input"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              placeholder="e.g., Groceries"
            />
          </Field>

          <Field label="Description (optional)">
            <input
              className="input"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
            />
          </Field>

          <Field label="Date">
            <input
              className="input"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </Field>
        </Modal>
      </div>

      {/* ✅ Floating chatbot (does not take layout space) */}
      <SproutSection subtitle="Quick access to AI Chatbot while reviewing this budget." />
    </div>
  );
}