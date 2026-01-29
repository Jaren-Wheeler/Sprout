import Card from "../Card.jsx";

export default function BudgetSummary({ limit, totalSpent, remaining }) {

  return (
    <Card title="Summary">

      <div className="row">

        <span className="badge">
          Limit: {Number(limit).toFixed(2)}
        </span>

        <span className="badge">
          Total spent: {Number(totalSpent).toFixed(2)}
        </span>

        <span
          className="badge"
          style={{
            borderColor:
              remaining < 0
                ? "var(--danger)"
                : "var(--border)"
          }}
        >
          Remaining: {Number(remaining).toFixed(2)}
        </span>

      </div>

    </Card>
  );
}
