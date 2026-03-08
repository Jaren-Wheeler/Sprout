import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getEvents } from '../../api/scheduler';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';
import { groupEventsByDate } from '../../utils/date';
import Sprout from '../../components/chatbot/Sprout';
import sproutLogo from '../../assets/Logo.png';
import { sendChatMessage } from '../../api/chatbot';
import TodayAgenda from './TodayAgenda';

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
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link to="/dashboard">
              <img src={sproutLogo} className="h-20" alt="Sprout logo" />
            </Link>
            Calendar
          </h1>
          <p className="text-[#6B5E5E]">Plan your days ahead</p>
        </header>

        <div className="flex gap-8 items-start">
          <CalendarGrid
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            eventsByDate={eventsByDate}
          />

          <div className="flex flex-col gap-6">
            <TodayAgenda eventsByDate={eventsByDate} />

            <EventSidebar
              selectedDate={selectedDate}
              eventsByDate={eventsByDate}
              onEventCreated={loadEvents}
            />
          </div>
        </div>
      </div>

      <Sprout onSend={sendChatMessage} />
    </div>
  );
}