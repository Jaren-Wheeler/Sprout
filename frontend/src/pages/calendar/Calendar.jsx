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
    <div className="min-h-screen bg-[#F3EED9] text-amber-900">
  <div className="max-w-7xl mx-auto p-6 space-y-6">

    <header className="space-y-1">
      <h1 className="sprout-title">Calendar</h1>
      <p className="sprout-subtitle">Plan your days ahead</p>
    </header>

    <div className="flex gap-8 items-start">

      <CalendarGrid
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        eventsByDate={eventsByDate}
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