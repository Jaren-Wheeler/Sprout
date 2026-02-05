// frontend/src/pages/budgeting/Budgets.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SproutSection from "../../components/Sprout.jsx";

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

  const didLoadRef = useRef(false);
  const loadInFlightRef = useRef(false);

  const openCreateModal = useCallback(() => setOpen(true), []);
  const closeCreateModal = useCallback(() => setOpen(false), []);

  const loadData = useCallback(async () => {
    if (loadInFlightRef.current) return;

    loadInFlightRef.current = true;
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

      const status = err?.response?.status ?? err?.status;

      setBudgets([]);
      setAnalytics([]);

      if (status === 429) {
        setLoadError("Too many requests (429). Please wait a moment and click Refresh.");
      } else {
        setLoadError(
          err?.message ||
            "Failed to load budgets. (Are you logged in? Is the server running?)"
        );
      }
    } finally {
      setLoading(false);
      loadInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    loadData();
  }, [loadData]);

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

  // Chart data (sorted biggest spend first)
  const chartRows = useMemo(() => {
    const rows = (analytics || [])
      .map((a) => ({
        category: String(a.category ?? "Uncategorized"),
        total: Number(a.total ?? 0),
      }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total);

    const max = rows.reduce((m, r) => Math.max(m, r.total), 0);
    return { rows, max };
  }, [analytics]);

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

      closeCreateModal();
      setName("");
      setLimitAmount("");
      await loadData();
    } catch (err) {
      console.error("Create budget failed:", err);
      const status = err?.response?.status ?? err?.status;

      if (status === 429) {
        setCreateError("Too many requests (429). Please wait and try again.");
      } else {
        setCreateError(err?.message || "Failed to create budget.");
      }
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      await loadData();
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

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page" style={{ position: "relative" }}>
      <div className="panel" style={{ position: "relative" , zIndex: 0}}>
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

            <Button
              variant="ghost"
              onClick={loadData}
              disabled={loadInFlightRef.current}
            >
              Refresh
            </Button>

            <Button onClick={openCreateModal} disabled={loadInFlightRef.current}>
              + New budget
            </Button>
          </div>
        </div>

        <div className="pageBody" style={{ display: "grid", gap: 16 }}>
          <div className="grid2">
            <Card title="Overview" subtitle="Totals across all budgets.">
              <div style={{ display: "grid", gap: 10 }}>
                <div className="row">
                  <div className="muted">Total limit</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 800 }}>${totals.totalLimit.toFixed(2)}</div>
                </div>

                <div className="row">
                  <div className="muted">Total spent</div>
                  <div className="spacer" />
                  <div style={{ fontWeight: 800 }}>${totals.totalSpent.toFixed(2)}</div>
                </div>

                <div className="row">
                  <div className="muted">Remaining</div>
                  <div className="spacer" />
                  <div
                    style={{
                      fontWeight: 800,
                      color: totals.remaining < 0 ? "var(--danger)" : "var(--muted)",
                    }}
                  >
                    ${totals.remaining.toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Spending by category" subtitle="Based on logged expenses.">
              {chartRows.rows.length === 0 ? (
                <div className="muted">No expense data yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {/* ✅ Simple bar chart */}
                  <div style={{ display: "grid", gap: 10 }}>
                    {chartRows.rows.map((r) => {
                      const pct = chartRows.max > 0 ? (r.total / chartRows.max) * 100 : 0;

                      return (
                        <div
                          key={r.category}
                          style={{
                            display: "grid",
                            gap: 6,
                          }}
                        >
                          <div className="row" style={{ fontSize: 13 }}>
                            <div style={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.category}
                            </div>
                            <div className="spacer" />
                            <div style={{ fontWeight: 800 }}>${r.total.toFixed(2)}</div>
                          </div>

                          <div
                            style={{
                              height: 10,
                              borderRadius: 999,
                              background: "var(--border)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: "var(--accent)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Keep the table too (nice for exact numbers) */}
                  <div className="tableWrap" style={{ marginTop: 6 }}>
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

                      const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

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
                                    background: remaining < 0 ? "var(--danger)" : "var(--accent)",
                                  }}
                                />
                              </div>

                              <div className="row" style={{ fontSize: 12 }}>
                                <span
                                  style={{
                                    color: remaining < 0 ? "var(--danger)" : "var(--muted)",
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
                              <Button variant="ghost" onClick={() => nav(`/budgets/${b.id}`)}>
                                Open
                              </Button>
                              <Button variant="ghost" onClick={() => onDelete(b.id)}>
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
          onClose={closeCreateModal}
          footer={
            <div className="row" style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}>
              <Button variant="ghost" onClick={closeCreateModal}>
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
      
      <div
        style={{
              position: "absolute",
              bottom: "-50px",
              right: "-20px",
              transform: "scale(0.8)",
              zIndex: 0
            }}>
        {/* Chatbot */}
        <SproutSection 
          subtitle="Quick access to AI Chatbot while budgeting and tracking expenses." 
          />
      </div>
   
    </div>
  );
}