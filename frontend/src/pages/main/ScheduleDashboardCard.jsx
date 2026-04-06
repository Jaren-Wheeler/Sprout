import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

import useEvents from '../calendar/hooks/useEvents';

import { format } from 'date-fns';

export default function ScheduleDashboardCard() {
  const { events } = useEvents();

  const pinned = (events || [])
    .filter((e) => e.isPinned)
    .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt))
    .slice(0, 3);

  if (!events) {
    return (
      <DashboardCard title="Schedule" route="/calendar">
        Loading...
      </DashboardCard>
    );
  }

  if (pinned.length === 0) {
    return (
      <DashboardCard title="Schedule" route="/calendar">
        <DashboardEmptyState message="No pinned events" />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Schedule" route="/calendar">
      <div className="flex flex-col gap-2">
        {pinned.map((e, i) => {
          const date = new Date(e.startTime);

          return (
            <div
              key={e.id}
              className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg border ${
                i === 0
                  ? 'bg-orange-200 border-orange-400 text-orange-900'
                  : 'bg-[rgba(232,240,249,0.88)] border-[rgba(135,168,206,0.44)] text-[#395a7a]'
              }`}
            >
              {/* TITLE */}
              <span className="truncate font-medium">{e.title}</span>

              {/* TIME */}
              <span className="text-xs opacity-70 whitespace-nowrap">
                {format(date, 'hh:mm a')}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
