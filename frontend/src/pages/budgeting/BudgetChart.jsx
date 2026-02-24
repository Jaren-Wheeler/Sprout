import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function BudgetChart({ categoryStats }) {
  const data = (categoryStats || [])
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: c.name,
      value: c.spent,
    }));

  const totalSpent = data.reduce((sum, d) => sum + d.value, 0);

  const COLORS = ['#F4B400', '#6BA292', '#D98E8E', '#9C7C5D', '#C8A96A'];

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.01) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#3B2F2F"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 14, fontWeight: 500 }}
      >
        {name} {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E8D9A8]">
      <h2 className="font-semibold mb-6 text-[#3B2F2F]">
        Spending by Category
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-[#6B5E5E] text-center py-12">
          No expenses yet
        </p>
      ) : (
        <div className="flex justify-center">
          {/* ================= PIE CHART ================= */}
          <div className="relative w-full max-w-[500px] h-[420px] outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
                style={{ outline: 'none' }}
              >
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={90}
                  outerRadius={130}
                  label={renderLabel}
                  labelLine={false}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E8D9A8',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* ================= CENTER TEXT ================= */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-bold text-[#3B2F2F]">
                ${totalSpent.toFixed(0)}
              </p>
              <p className="text-sm text-[#6B5E5E]">Total Spent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
