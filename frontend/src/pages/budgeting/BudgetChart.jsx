import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../theme/ThemeContext';

export default function BudgetChart({ categoryStats }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const data = (categoryStats || [])
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: c.name,
      value: c.spent,
    }));

  const totalSpent = data.reduce((sum, d) => sum + d.value, 0);

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      colors.push(`hsl(${hue}, 55%, 60%)`);
    }
    return colors;
  };

  const COLORS = generateColors(data.length);

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
        fill={isDark ? '#f4ead0' : '#3B2F2F'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 14, fontWeight: 500 }}
      >
        {name} {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="flex h-full flex-col p-2 md:p-1">
      <h2 className="mb-6 font-semibold text-[#3B2F2F] dark:text-white">
        Spending by Category
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-[#6B5E5E] text-center py-12 dark:text-white/70">
          No expenses yet
        </p>
      ) : (
        <div className="flex justify-center flex-1">
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
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E8D9A8',
                    background: isDark ? 'rgba(26, 30, 39, 0.96)' : '#fffaf0',
                    color: isDark ? '#f4ead0' : '#3B2F2F',
                  }}
                  labelStyle={{ color: isDark ? '#f4ead0' : '#3B2F2F' }}
                  itemStyle={{ color: isDark ? '#f4ead0' : '#3B2F2F' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-3xl font-bold text-[#3B2F2F] dark:text-white">
                ${totalSpent.toFixed(0)}
              </p>
              <p className="text-sm text-[#6B5E5E] dark:text-white/70">Total Spent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
