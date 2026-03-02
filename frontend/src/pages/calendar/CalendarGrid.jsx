import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="sprout-paper p-6 w-[700px]">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="sprout-icon-btn">
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-2xl font-semibold text-amber-900 tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button onClick={nextMonth} className="sprout-icon-btn">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* WEEK LABELS */}
      <div className="grid grid-cols-7 text-center font-medium mb-3 text-amber-800">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
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
              className={`sprout-day-cell ${
                isSelected ? "sprout-day-cell-selected" : ""
              }`}
            >
              <span className="text-sm font-medium text-amber-900">
                {format(day, "d")}
              </span>

              <div className="mt-1 space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className="text-xs bg-purple-100 border border-purple-300 rounded px-2 py-[2px] truncate"
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