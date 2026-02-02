// frontend/src/pages/budgets/BudgetDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getBudgets, deleteBudget } from "../../api/finance";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";

export default function BudgetDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBudgets();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("BudgetDetail load failed:", err);
      setBudgets([]);
      setError(
        err?.message ||
          "Failed to load budget. (Are you logged in? Is the server running?)"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const budget = useMemo(() => {
    return budgets.find((b) => String(b.id) === String(id)) || null;
  }, [budgets, id]);

  const onDelete = async () => {
    if (!budget) return;
    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(budget.id);
      nav("/budgets");
    } catch (err) {
      console.error("Delete budget failed:", err);
      alert(err?.message || "Failed to delete budget.");
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 16px 36px",
        display: "grid",
        gap: 16,
      }}
    >
      {/* Top bar */}
      <div
        className="row"
        style={{
          alignItems: "flex-start",
          gap: 12,
          padding: 14,
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1 className="h1" style={{ marginBottom: 4 }}>
            Budget details
          </h1>
          <div className="muted">
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

        <div className="spacer" />

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Button variant="ghost" onClick={load}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={() => nav("/budgets")}>
            Close
          </Button>
        </div>
      </div>

      {!budget ? (
        <Card title="Not found" subtitle="This budget id doesn’t exist.">
          <div className="muted">
            Budget id: <span className="badge">{String(id)}</span>
          </div>
        </Card>
      ) : (
        <>
          <Card
            title={budget.name}
            subtitle={`Budget ID: ${budget.id}`}
          >
            {(() => {
              const limit = Number(budget?.limitAmount ?? 0);
              const spent = Number(budget?.totalSpent ?? 0);
              const remaining = Number(budget?.remaining ?? limit - spent);
              const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

              return (
                <div style={{ display: "grid", gap: 12 }}>
                  <div className="grid2">
                    <div>
                      <div className="muted">Limit</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        ${limit.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="muted">Spent</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        ${spent.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="row" style={{ fontSize: 12 }}>
                      <span
                        style={{
                          color:
                            remaining < 0 ? "var(--danger)" : "var(--muted)",
                          fontWeight: 700,
                        }}
                      >
                        Remaining: ${remaining.toFixed(2)}
                      </span>
                      <span className="spacer" />
                      <span className="muted">
                        {limit > 0 ? `${pct.toFixed(0)}%` : "—"}
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
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            remaining < 0 ? "var(--danger)" : "var(--accent)",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="row"
                    style={{ justifyContent: "flex-end", gap: 8 }}
                  >
                    <Button variant="ghost" onClick={onDelete}>
                      Delete budget
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Card>

          <Card
            title="Next"
            subtitle="We’ll add expenses here after layouts are consistent."
          >
            <div className="muted">
              This page is now clean + consistent and ready for the next feature:
              showing expenses for this budget.
            </div>
          </Card>
        </>
      )}
    </div>
  );
}