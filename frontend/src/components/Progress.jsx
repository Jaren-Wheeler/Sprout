export default function Progress({ label, value, percent }) {
        return (
            <div>
            <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-gray-500">{value}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}