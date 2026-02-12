
export default function Stat({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
        </div>
    );
}