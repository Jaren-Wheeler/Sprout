import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarCheck,
} from "lucide-react";

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

  const today = new Date();

  const isViewingTodayMonth =
    format(currentMonth, "yyyy-MM") === format(today, "yyyy-MM");

  const goToToday = () => {
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="sprout-surface p-5 md:p-6 xl:min-h-[720px]">

      {/* HEADER */}
      <div className="flex flex-col items-center mb-6">

        {/* Month navigation row */}
        <div className="flex items-center justify-between w-full">
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

        {/* Today button (only when useful) */}
        {!isViewingTodayMonth && (
          <button
            onClick={goToToday}
            className="flex items-center gap-1 text-sm text-orange-700 hover:text-orange-900 font-medium mt-2 transition"
          >
            <CalendarCheck size={16} />
            Today
          </button>
        )}

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
            key === format(selectedDate, "yyyy-MM-dd");

          const isToday =
            key === format(today, "yyyy-MM-dd");

          const dayEvents = eventsByDate[key] || [];

          return (
            <div
              key={key}
              onClick={() => setSelectedDate(day)}
              className={`sprout-day-cell relative ${
                isSelected ? "sprout-day-cell-selected" : ""
              } ${isToday && !isSelected ? "ring-2 ring-orange-400" : ""}`}
            >
              {/* DAY NUMBER */}
              <span
                className={`text-sm text-amber-900 ${
                  isToday ? "font-bold" : "font-medium"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* EVENT COUNT BADGE */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 right-1 flex items-center gap-1 bg-orange-100 border border-orange-300 rounded-full px-2 py-[2px] text-xs text-orange-900">
                  <CalendarDays size={12} />
                  <span>{dayEvents.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
