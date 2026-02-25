import { useEffect, useState } from 'react';
import { getEvents } from '../../api/scheduler';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';
import { groupEventsByDate } from '../../utils/date';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ================= LOAD EVENTS =================
  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  }

  const eventsByDate = groupEventsByDate(events);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#F3EED9] text-[#3B2F2F]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-[#6B5E5E]">Plan your days ahead!</p>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex gap-8 items-start">
          <CalendarGrid
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            eventsByDate={eventsByDate}S
          />

          <EventSidebar
            selectedDate={selectedDate}
            eventsByDate={eventsByDate}
            onEventCreated={loadEvents}
          />
        </div>
      </div>
    </div>
  );
}
