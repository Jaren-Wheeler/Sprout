import { useState } from "react";
import Card from "../Card.jsx";
import Button from "../Button.jsx";

import { createExpense } from "../../api/finance";

export default function AddExpenseForm({ budgetId, onAdded }) {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleAdd = async () => {

    setError(null);

    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      setError("Amount must be greater than 0");
      return;
    }

    try {

      await createExpense({
        amount: Number(amount),
        category,
        description,
        expenseDate: new Date().toISOString(),
        budgetId
      });

      setAmount("");
      setCategory("");
      setDescription("");

      onAdded(); // tell parent to reload budget

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card title="Add Expense">

      <div style={{ display: "grid", gap: 8 }}>

        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <input
          className="input"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          className="input"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Button onClick={handleAdd}>
          Add Expense
        </Button>

        {error && <div className="muted">{error}</div>}

      </div>

    </Card>
  );
}
