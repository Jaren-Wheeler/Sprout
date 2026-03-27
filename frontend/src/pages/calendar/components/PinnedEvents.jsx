import { format } from 'date-fns';
import { Pin } from 'lucide-react';

export default function PinnedEvents({ events, onSelectDate }) {
  const visibleEvents = (events || []).slice(0, 3);

  if (visibleEvents.length === 0) {
    return (
      <div className="text-sm text-amber-700 dark:text-amber-300 opacity-70 text-center">
        No pinned events
      </div>
    );
  }

  return (
    <div className="w-[300px]">
      {/* HEADER */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Pin size={14} className="text-orange-600 dark:text-orange-300" />
        <p className="text-xs font-semibold tracking-wide text-orange-700 dark:text-orange-300 uppercase">
          Pinned ({events.length}/3)
        </p>
      </div>

      {/* EVENTS */}
      <div className="flex flex-col gap-2">
        {visibleEvents.map((e, i) => {
          const baseClasses =
            'w-full px-4 py-2.5 rounded-lg border transition flex items-center justify-between gap-3';

          const primaryClasses =
            'bg-orange-200 border-orange-400 text-orange-900 ' +
            'dark:bg-orange-900/40 dark:border-orange-500/40 dark:text-orange-200';

          const secondaryClasses =
            'bg-orange-100 border-orange-300 text-amber-900 hover:bg-orange-200 ' +
            'dark:bg-white/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10';

          return (
            <button
              key={e.id}
              onClick={() => onSelectDate(new Date(e.startTime))}
              className={`${baseClasses} ${
                i === 0 ? primaryClasses : secondaryClasses
              }`}
            >
              {/* TITLE */}
              <span className="font-medium text-sm truncate min-w-0 max-w-[160px]">
                {e.title}
              </span>

              {/* TIME */}
              <span className="text-[11px] opacity-70 whitespace-nowrap">
                {e.startTime ? format(new Date(e.startTime), 'hh:mm a') : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
