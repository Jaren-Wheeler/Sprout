import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

export default function Budgets() {
  const nav = useNavigate();

  /* ------------------ DATA ------------------ */
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    const load = async () => {
      const [bRes, eRes] = await Promise.all([
        axios.get("/api/budgets"),
        axios.get("/api/expenses"),
      ]);
      setBudgets(bRes.data);
      setExpenses(eRes.data);
      setLoading(false);
    };
    load();
  }, []);

  /* ------------------ DERIVED DATA ------------------ */
  const totalsForBudget = (budget_id) => {
    const list = expenses.filter((e) => e.budget_id === budget_id);
    return list.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  };

  /* ------------------ CREATE MODAL ------------------ */
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [limitAmount, setLimitAmount] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

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

    const res = await axios.post("/api/budgets", {
      name: name.trim(),
      limit_amount: Number(limitAmount),
      start_date: startDate || null,
      end_date: endDate || null,
    });

    setBudgets((b) => [...b, res.data]);
    setOpen(false);
    setName("");
    setLimitAmount("0");
    setStartDate("");
    setEndDate("");
  };

  const onDelete = async (budget_id) => {
    if (
      !confirm(
        "Delete this budget? (Expenses under it will also be removed.)"
      )
    )
      return;

    await axios.delete(`/api/budgets/${budget_id}`);
    setBudgets((b) => b.filter((x) => x.budget_id !== budget_id));
    setExpenses((e) => e.filter((x) => x.budget_id !== budget_id));
  };

  /* ------------------ STATES ------------------ */
  if (loading) {
    return <div className="muted">Loading…</div>;
  }

  /* ------------------ RENDER ------------------ */
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Budgeting</h1>
          <div className="muted">
            Create budgets, add expenses, and track remaining balance.
          </div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpen(true)}>+ New budget</Button>
      </div>

      <Card title="Your budgets" subtitle="Click a budget to manage expenses.">
        {budgets.length === 0 ? (
          <div className="muted">No budgets yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Limit</th>
                <th>Total expenses</th>
                <th>Remaining</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => {
                const total = totalsForBudget(b.budget_id);
                const remaining = Number(b.limit_amount) - total;

                return (
                  <tr key={b.budget_id}>
                    <td>
                      <Link
                        to={`/budgets/${b.budget_id}`}
                        className="badge"
                      >
                        {b.name}
                      </Link>
                    </td>
                    <td>{Number(b.limit_amount).toFixed(2)}</td>
                    <td>{total.toFixed(2)}</td>
                    <td
                      style={{
                        color:
                          remaining < 0
                            ? "var(--danger)"
                            : "var(--text)",
                      }}
                    >
                      {remaining.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          nav(`/budgets/${b.budget_id}`)
                        }
                      >
                        Open
                      </Button>{" "}
                      <Button
                        variant="ghost"
                        onClick={() =>
                          onDelete(b.budget_id)
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* -------- CREATE BUDGET MODAL -------- */}
      <Modal
        open={open}
        title="Create budget"
        onClose={() => setOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
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
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <div className="grid2">
          <Field label="Limit amount">
            <input
              className="input"
              type="number"
              step="0.01"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
            />
          </Field>

          <div />

          <Field label="Start date (optional)">
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Field>

          <Field label="End date (optional)">
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
