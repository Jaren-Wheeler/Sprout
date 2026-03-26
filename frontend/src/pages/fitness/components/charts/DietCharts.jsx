import {
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MACRO_COLORS = {
  Protein: 'blue', // blue
  Carbs: 'green', // yellow
  Fat: 'orange', // orange
};

export default function DietCharts({ dietItems, weightHistory }) {
  // =========================
  // DAILY MACRO PIE
  // =========================

  const today = new Date().toDateString();

  const todaysItems = dietItems || [];

  const totals = todaysItems.reduce(
    (acc, item) => {
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const totalMacros = totals.protein + totals.carbs + totals.fat;

  const caloriesToday = Math.round(
    todaysItems.reduce((sum, item) => sum + (item.calories || 0), 0)
  );

  const pieData = [
    { name: 'Protein', value: Number(totals.protein.toFixed(1)) },
    { name: 'Carbs', value: Number(totals.carbs.toFixed(1)) },
    { name: 'Fat', value: Number(totals.fat.toFixed(1)) },
  ]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

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
    <div className="flex w-full justify-center">
      <div className="sprout-paper w-full p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* MACRO PIE */}
          <div>
            <h2 className="font-semibold text-amber-900 mb-4">
              Today's Macro Breakdown
            </h2>

            {pieData.length === 0 ? (
              <div className="sprout-panel flex min-h-[300px] items-center justify-center p-4 text-center text-amber-900/70">
                No food logged today.
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      dataKey="value"
                      label={({ value }) =>
                        totalMacros > 0
                          ? `${Math.round((value / totalMacros) * 100)}%`
                          : ''
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={MACRO_COLORS[entry.name]} />
                      ))}

                      <Label
                        value={`${caloriesToday} kcal`}
                        position="center"
                        className="fill-amber-900 font-semibold text-lg"
                      />
                    </Pie>
                    <Tooltip
                      formatter={(value) => {
                        const percent =
                          totalMacros > 0
                            ? Math.round((value / totalMacros) * 100)
                            : 0;

                        return [`${percent}% (${value} g)`];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* WEIGHT LINE CHART */}
          <div>
            <h2 className="font-semibold text-amber-900 mb-4">
              Weight Over Time
            </h2>

            {weightData.length === 0 ? (
              <div className="sprout-panel flex min-h-[300px] items-center justify-center p-4 text-center text-amber-900/70">
                No weight data yet.
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
