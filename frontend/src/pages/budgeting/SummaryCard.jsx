export default function SummaryCard({ title, value, color }) {
  const styles = {
    income: "bg-[#DFF5E1] border-[#A5E0AE] text-green-700",
    expense: "bg-[#F8DCDC] border-[#F0A3A3] text-red-600",
    balance: "bg-[#DCE6F7] border-[#A7C0E8] text-blue-600",
  };

  const style = styles[color];

  return (
    <div className={`border-2 rounded-xl p-5 shadow-sm ${style}`}>
      <p className="text-sm font-medium opacity-70">{title}</p>
      <h3 className="text-3xl font-semibold mt-2">
        ${Number(value || 0).toFixed(2)}
      </h3>
    </div>
  );
}
