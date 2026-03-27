import { format } from 'date-fns';

export default function HeaderQuickEvents({ eventsByDate, onSelectDate }) {
  const today = new Date();
  const key = format(today, 'yyyy-MM-dd');
  const events = eventsByDate[key] || [];

  if (events.length === 0) {
    return (
      <div className="mt-4 text-sm text-amber-700 opacity-70">
        No events today
      </div>
    );
  }

  return events.slice(0, 6).map((e) => (
    <button
      key={e.id}
      onClick={() => onSelectDate(today)}
      className="px-3 py-2 rounded-xl border border-orange-300 bg-orange-100 text-amber-900 text-sm font-medium hover:bg-orange-200 transition"
    >
      <div className="flex flex-col items-start text-left">
        <span className="truncate max-w-[120px]">{e.title}</span>

        {e.startTime && (
          <span className="text-[11px] opacity-70">
            {format(new Date(e.startTime), 'hh:mm a')}
          </span>
        )}
      </div>
    </button>
  ));
}
