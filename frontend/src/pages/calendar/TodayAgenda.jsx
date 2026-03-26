import { format } from "date-fns";
import { getEventColor } from "../../utils/date";

export default function TodayAgenda({ eventsByDate }) {
  const today = new Date();
  const key = format(today, "yyyy-MM-dd");

  const events = eventsByDate[key] || [];

  return (
    <div className="sprout-surface p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-green-300 bg-green-100 text-green-900">
          <span className="text-lg font-bold">
            {format(today, "d")}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-tight text-amber-900">
            Today&apos;s Agenda
          </h3>
          <p className="text-sm text-amber-700">
            {format(today, "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 space-y-2 text-center text-amber-700">
          <p className="text-lg font-medium">
            You&apos;re free today
          </p>
          <p className="text-sm">
            Enjoy the day or plan something.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const colorClass = getEventColor(e.id);

            return (
              <div
                key={e.id}
                className={`sprout-card p-3 ${colorClass}`}
              >
                <p className="font-semibold">{e.title}</p>

                {e.startTime && (
                  <p className="text-sm text-amber-800">
                    {format(new Date(e.startTime), "hh:mm a")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
