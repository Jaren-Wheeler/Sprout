import { format } from 'date-fns';
import { Pin } from 'lucide-react';
import { getEventColor } from '../../../utils/date';

export default function EventItem({ event, onClick, setError }) {
  const colorClass = getEventColor(event.id);

  async function handleDelete(t, refreshData) {
    try {
      if (t.type === 'income') {
        await deleteIncome(t.id);
      } else {
        await deleteExpense(t.id);
      }

      await refreshData();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  }

  return (
    <div
      onClick={() => onClick(event)}
      className={`group sprout-card px-3 py-2.5 cursor-pointer transition-all duration-150 hover:-translate-y-[1px] ${colorClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-sm truncate">{event.title}</p>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-black-700 opacity-70 group-hover:opacity-100 transition">
            {event.startTime
              ? format(new Date(event.startTime), 'HH:mm') === '00:00'
                ? 'All day'
                : format(new Date(event.startTime), 'hh:mm a')
              : ''}
          </span>

          <button
            onClick={handlePin}
            className={`p-1 rounded-md transition ${
              event.isPinned
                ? 'text-orange-600'
                : 'text-black-600 opacity-70 hover:opacity-100'
            }`}
          >
            <Pin size={14} fill={event.isPinned ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
