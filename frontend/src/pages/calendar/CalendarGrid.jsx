import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";

export default function CalendarGrid({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  eventsByDate,
}) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startOffset = getDay(monthStart);
  const blanks = Array.from({ length: startOffset });

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );

  return (
    <div className="bg-[#FAF6E8] border-4 border-[#E8D89B] rounded-3xl shadow-md p-6 w-[700px]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="bg-orange-500 text-white rounded-xl px-4 py-2 shadow hover:scale-105 transition"
        >
          ←
        </button>

        <h2 className="text-2xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={nextMonth}
          className="bg-orange-500 text-white rounded-xl px-4 py-2 shadow hover:scale-105 transition"
        >
          →
        </button>
      </div>

      {/* WEEK LABELS */}
      <div className="grid grid-cols-7 text-center font-medium mb-3">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-3">

        {blanks.map((_, i) => (
          <div key={i} />
        ))}

        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const isSelected =
            format(day, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd");

          const dayEvents = eventsByDate[key] || [];

          return (
            <div
              key={key}
              onClick={() => setSelectedDate(day)}
              className={`
                h-20 rounded-xl border flex flex-col p-2 cursor-pointer transition
                ${isSelected
                  ? "bg-[#F4E4A3] border-orange-400"
                  : "bg-white border-[#E6DCC5] hover:bg-[#F9F2D8]"
                }
              `}
            >
              <span className="text-sm font-medium">
                {format(day, "d")}
              </span>

              {/* EVENT BADGES */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className="text-xs bg-purple-200 rounded px-1 truncate"
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}