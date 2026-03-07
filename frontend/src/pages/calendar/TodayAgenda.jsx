import { format } from "date-fns";
import { getEventColor } from "../../utils/date";

export default function TodayAgenda({ eventsByDate }) {
  const today = new Date();
  const key = format(today, "yyyy-MM-dd");

  const events = eventsByDate[key] || [];

  return (
    <div className="sprout-paper p-6 w-[350px]">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        {/* Today badge */}
        <div className="w-12 h-12 rounded-xl bg-green-200 border border-green-400 flex flex-col items-center justify-center text-green-900">
          <span className="text-lg font-bold">
            {format(today, "d")}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-amber-900 leading-tight">
            Today’s Agenda
          </h3>
          <p className="text-sm text-amber-700">
            {format(today, "MMMM d, yyyy")}
          </p>
        </div>

      </div>

      {/* EMPTY STATE */}
      {events.length === 0 ? (
        <div className="text-center text-amber-700 space-y-2 mt-6">
          <p className="font-medium text-lg">
            You’re free today 
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