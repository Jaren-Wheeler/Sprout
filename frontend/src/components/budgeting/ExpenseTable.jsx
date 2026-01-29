import Card from "../Card.jsx";

export default function ExpenseTable({ expenses }) {

  return (
    <Card title="Expenses">

      {expenses.length === 0 ? (

        <div className="muted">No expenses yet.</div>

      ) : (

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>

            {expenses.map(e => (

              <tr key={e.id}>
                <td className="muted">
                  {new Date(e.expenseDate).toLocaleDateString()}
                </td>
                <td>{Number(e.amount).toFixed(2)}</td>
                <td>{e.description || "—"}</td>
                <td>{e.category || "—"}</td>
              </tr>

            ))}

          </tbody>
        </table>

      )}

    </Card>
  );
}
