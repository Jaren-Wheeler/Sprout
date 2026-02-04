// frontend/src/pages/budgets/Budgets.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getBudgets,
  createBudget,
  deleteBudget,
  getCategoryTotals,
} from "../../api/finance";

import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

// ✅ Shared app-page layout styles (panel + header + responsiveness)
import "../../styles/layout/appPages.css";

export default function Budgets() {
  const nav = useNavigate();

  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [createError, setCreateError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const [budgetData, analyticsData] = await Promise.all([
        getBudgets(),
        getCategoryTotals(),
      ]);

      setBudgets(Array.isArray(budgetData) ? budgetData : []);
      setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
    } catch (err) {
      console.error("Budgets load failed:", err);
      setBudgets([]);
      setAnalytics([]);
      setLoadError(
        err?.message ||
          "Failed to load budgets. (Are you logged in? Is the server running?)"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const totalLimit = budgets.reduce(
      (sum, b) => sum + Number(b?.limitAmount ?? 0),
      0
    );
    const totalSpent = budgets.reduce(
      (sum, b) => sum + Number(b?.totalSpent ?? 0),
      0
    );
    const remaining = totalLimit - totalSpent;
    return { totalLimit, totalSpent, remaining };
  }, [budgets]);

  const onCreate = async () => {
    setCreateError("");

    if (!name.trim()) {
      setCreateError("Budget name is required");
      return;
    }

    const num = Number(limitAmount);

    if (Number.isNaN(num) || num < 0) {
      setCreateError("Limit amount must be zero or greater");
      return;
    }

    try {
      await createBudget({
        name: name.trim(),
        limitAmount: num,
      });

      setOpen(false);
      setName("");
      setLimitAmount("");
      await loadData();
    } catch (err) {
      console.error("Create budget failed:", err);
      setCreateError(err?.message || "Failed to create budget.");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      await loadData();
    } catch (err) {
      console.error("Delete budget failed:", err);
      alert(err?.message || "Failed to delete budget.");
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Budgeting</h1>
            <div className="pageSubtitle">
              Create budgets and track spending progress.
            </div>

            {loadError ? (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                }}
              >
                {loadError}
              </div>
            ) : null}
          </div>

          <div className="pageHeaderRight">
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button variant="ghost" onClick={loadData}>
              Refresh
            </Button>

            <Button onClick={() => setOpen(true)}>+ New budget</Button>
          </div>
        </div>

        <div className="pageBody" style={{ display: "grid", gap: 16 }}>
          <div className="grid2">
            <Card title="Overview" subtitle="Totals across all budgets.">
              <div style={{ display: "grid", gap: 10 }}>
                <div className="row">
                  <div className="muted">Total limit</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 800 }}>
                    ${totals.totalLimit.toFixed(2)}
                  </div>
                </div>

                <div className="row">
                  <div className="muted">Total spent</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 800 }}>
                    ${totals.totalSpent.toFixed(2)}
                  </div>
                </div>

                <div className="row">
                  <div className="muted">Remaining</div>
                  <div className="spacer" />
                  <div
                    style={{
                      fontWeight: 800,
                      color:
                        totals.remaining < 0 ? "var(--danger)" : "var(--muted)",
                    }}
                  >
                    ${totals.remaining.toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Spending by category" subtitle="Based on logged expenses.">
              {analytics.length === 0 ? (
                <div className="muted">No expense data yet.</div>
              ) : (
                <div className="tableWrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th style={{ textAlign: "right" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map((a) => (
                        <tr key={a.category}>
                          <td>{a.category}</td>
                          <td style={{ textAlign: "right" }}>
                            ${Number(a.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <Card title="Your budgets" subtitle="Open one to manage details.">
            {budgets.length === 0 ? (
              <div className="muted">No budgets yet.</div>
            ) : (
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 220 }}>Name</th>
                      <th>Limit</th>
                      <th>Spent</th>
                      <th style={{ minWidth: 260 }}>Progress</th>
                      <th style={{ width: 180 }}></th>
                    </tr>
                  </thead>

                  <tbody>
                    {budgets.map((b) => {
                      const limit = Number(b?.limitAmount ?? 0);
                      const spent = Number(b?.totalSpent ?? 0);
                      const remaining = Number(b?.remaining ?? limit - spent);

                      const pct =
                        limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

                      return (
                        <tr key={b.id} style={{ verticalAlign: "middle" }}>
                          <td>
                            <Link
                              to={`/budgets/${b.id}`}
                              className="badge"
                              style={{
                                display: "inline-flex",
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {b.name}
                            </Link>
                          </td>

                          <td>${limit.toFixed(2)}</td>
                          <td>${spent.toFixed(2)}</td>

                          <td>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div
                                style={{
                                  height: 10,
                                  background: "var(--border)",
                                  borderRadius: 999,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${pct}%`,
                                    height: "100%",
                                    background:
                                      remaining < 0
                                        ? "var(--danger)"
                                        : "var(--accent)",
                                  }}
                                />
                              </div>

                              <div className="row" style={{ fontSize: 12 }}>
                                <span
                                  style={{
                                    color:
                                      remaining < 0
                                        ? "var(--danger)"
                                        : "var(--muted)",
                                  }}
                                >
                                  Remaining: ${remaining.toFixed(2)}
                                </span>
                                <span className="spacer" />
                                <span className="muted">
                                  {limit > 0 ? `${pct.toFixed(0)}%` : "—"}
                                </span>
                              </div>
                            </div>
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
                              <Button
                                variant="ghost"
                                onClick={() => nav(`/budgets/${b.id}`)}
                              >
                                Open
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => onDelete(b.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Modal
          open={open}
          title="Create budget"
          onClose={() => setOpen(false)}
          footer={
            <div
              className="row"
              style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}
            >
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreate}>Create</Button>
            </div>
          }
        >
          <Field label="Budget name" error={createError}>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label="Limit amount">
            <input
              className="input"
              type="number"
              step="0.01"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
            />
          </Field>
        </Modal>
      </div>
    </div>
  );
}