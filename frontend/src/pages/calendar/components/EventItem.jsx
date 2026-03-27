import { format } from 'date-fns';
import { getEventColor } from '../../../utils/date';

export default function EventItem({ event, onClick }) {
  const colorClass = getEventColor(event.id);

  return (
    <div
      onClick={() => onClick(event)}
      className={`group sprout-card px-3 py-2.5 cursor-pointer transition-all duration-150 hover:-translate-y-[1px] ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm truncate">{event.title}</p>

        <span className="text-[11px] text-amber-700 opacity-70 group-hover:opacity-100 transition">
          {event.startTime
            ? format(new Date(event.startTime), 'HH:mm') === '00:00'
              ? 'All day'
              : format(new Date(event.startTime), 'hh:mm a')
            : ''}
        </span>
      </div>
    </div>
  );
}
