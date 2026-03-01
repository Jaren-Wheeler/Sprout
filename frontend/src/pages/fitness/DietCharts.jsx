import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

export default function DietCharts({ diet, dietItems }) {

    const todayString = new Date().toDateString();

    // Filter items to only today's entries
    const todaysItems = (dietItems || []).filter(item =>
        item.createdAt &&
        new Date(item.createdAt).toDateString() === todayString
    );

    // Calculate today's macro totals
    const totals = todaysItems.reduce(
        (acc, item) => {
            acc.protein += item.protein || 0;
            acc.carbs += item.carbs || 0;
            acc.fat += item.fat || 0;
            return acc;
        },
        { protein: 0, carbs: 0, fat: 0 }
    );

    const data = [
        { name: 'Protein', value: totals.protein },
        { name: 'Carbs', value: totals.carbs },
        { name: 'Fat', value: totals.fat }
    ].filter(d => d.value > 0);

    return (
        <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Macro Breakdown</h2>

            {data.length === 0 ? (
                <p className="text-gray-400">No food logged today.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="value"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}