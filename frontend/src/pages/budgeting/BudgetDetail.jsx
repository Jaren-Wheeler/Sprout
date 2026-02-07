export default function BudgetDetail() {
  return (
    <div className="rounded-xl bg-yellow-200/90 text-black p-6 border border-black/10">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">Monthly Groceries</h2>
        <span className="text-2xl font-bold">$343.20</span>
      </div>

      <div className="mt-4">
        <div className="h-3 bg-black/20 rounded">
          <div className="h-full bg-black rounded w-[57%]" />
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span>Spent: $256.80</span>
          <span>Total: $600.00</span>
        </div>
      </div>
    </div>
  );
}
