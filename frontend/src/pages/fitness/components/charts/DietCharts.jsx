import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export default function DietCharts({ dietItems, weightHistory }) {
  // =========================
  // DAILY MACRO PIE
  // =========================

  const today = new Date().toDateString();

  const todaysItems = (dietItems || []).filter(
    (item) =>
      item.createdAt && new Date(item.createdAt).toDateString() === today
  );

  const totals = todaysItems.reduce(
    (acc, item) => {
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const pieData = [
    { name: 'Protein', value: totals.protein },
    { name: 'Carbs', value: totals.carbs },
    { name: 'Fat', value: totals.fat },
  ].filter((d) => d.value > 0);

  // =========================
  // WEIGHT HISTORY LINE CHART
  // =========================

  const weightData = (weightHistory || [])
    .map((entry) => ({
      rawDate: new Date(entry.createdAt),
      date: new Date(entry.createdAt).toLocaleDateString(),
      weight: Number(entry.weight),
    }))
    .sort((a, b) => a.rawDate - b.rawDate);

  return (
    <div className="sprout-paper p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MACRO PIE */}
        <div>
          <h2 className="font-semibold text-amber-900 mb-4">
            Today's Macro Breakdown
          </h2>

          {pieData.length === 0 ? (
            <div className="sprout-panel p-4 text-amber-900/70">
              No food logged today.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* WEIGHT LINE CHART */}
        <div>
          <h2 className="font-semibold text-amber-900 mb-4">
            Weight Over Time
          </h2>

          {weightData.length === 0 ? (
            <div className="sprout-panel p-4 text-amber-900/70">
              No weight data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
