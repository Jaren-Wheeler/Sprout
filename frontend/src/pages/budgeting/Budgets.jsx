import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getBudgets,
  createBudget,
  deleteBudget,
  getCategoryTotals
} from "../../api/finance";

import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

export default function Budgets() {

  const nav = useNavigate();

  // =====================================================
  // Data
  // =====================================================

  const [budgets, setBudgets] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // Load Data
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [budgetData, analyticsData] = await Promise.all([
        getBudgets(),
        getCategoryTotals()
      ]);

      setBudgets(budgetData);
      setAnalytics(analyticsData);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Create Modal State
  // =====================================================

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [limitAmount, setLimitAmount] = useState("");
  const [error, setError] = useState(null);

  // =====================================================
  // Create Budget
  // =====================================================

  const onCreate = async () => {

    setError(null);

    if (!name.trim()) {
      setError("Budget name is required");
      return;
    }

    if (Number(limitAmount) < 0 || isNaN(Number(limitAmount))) {
      setError("Limit amount must be zero or greater");
      return;
    }

    try {

      await createBudget({
        name: name.trim(),
        limitAmount: Number(limitAmount)
      });

      setOpen(false);
      setName("");
      setLimitAmount("");

      loadData();

    } catch (err) {
      setError(err.message);
    }
  };

  // =====================================================
  // Delete Budget
  // =====================================================

  const onDelete = async (id) => {

    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // =====================================================
  // States
  // =====================================================

  if (loading) {
    return <div className="muted">Loading…</div>;
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div style={{ display: "grid", gap: 16 }}>

      <div className="row">
        <div>
          <h1 className="h1">Budgeting</h1>
          <div className="muted">
            Create budgets and track spending progress.
          </div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpen(true)}>+ New budget</Button>
      </div>

      {/* ================= Analytics ================= */}

      <Card title="Spending by category">

        {analytics.length === 0 ? (

          <div className="muted">No expense data yet.</div>

        ) : (

          <table className="table">
            <tbody>

              {analytics.map(a => (

                <tr key={a.category}>
                  <td>{a.category}</td>
                  <td style={{ textAlign: "right" }}>
                    ${Number(a.total).toFixed(2)}
                  </td>
                </tr>

              ))}

            </tbody>
          </table>

        )}

      </Card>

      {/* ================= Budgets ================= */}

      <Card title="Your budgets">

        {budgets.length === 0 ? (

          <div className="muted">No budgets yet.</div>

        ) : (

          <table className="table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {budgets.map(b => (

                <tr key={b.id} style={{ verticalAlign: "middle" }}>

                  <td>
                    <Link to={`/budgets/${b.id}`} className="badge">
                      {b.name}
                    </Link>
                  </td>

                  <td>${Number(b.limitAmount).toFixed(2)}</td>

                  <td>${Number(b.totalSpent).toFixed(2)}</td>

                  <td>

                    <div style={{ display: "grid", gap: 4 }}>

                      <div
                        style={{
                          height: 8,
                          background: "var(--border)",
                          borderRadius: 6,
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(
                              (b.totalSpent / b.limitAmount) * 100,
                              100
                            )}%`,
                            height: "100%",
                            background:
                              b.remaining < 0
                                ? "var(--danger)"
                                : "var(--accent)"
                          }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: 12,
                          color:
                            b.remaining < 0
                              ? "var(--danger)"
                              : "var(--muted)"
                        }}
                      >
                        Remaining: ${Number(b.remaining).toFixed(2)}
                      </span>

                    </div>

                  </td>

                  <td style={{ textAlign: "right", display: "flex", gap: 6 }}>

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

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </Card>

      {/* ================= Create Budget Modal ================= */}

      <Modal
        open={open}
        title="Create budget"
        onClose={() => setOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onCreate}>Create</Button>
          </div>
        }
      >

        <Field label="Budget name" error={error}>
          <input
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Field>

        <Field label="Limit amount">
          <input
            className="input"
            type="number"
            step="0.01"
            value={limitAmount}
            onChange={e => setLimitAmount(e.target.value)}
          />
        </Field>

      </Modal>

    </div>
  );
}
