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
import background from '../../assets/bg.png';
import AppLayout from '@/components/AppLayout';

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

  return (
  <div
    className="min-h-screen w-full bg-cover bg-center bg-fixed "
    style={{ backgroundImage: `url(${background})` }}
  >
    <AppLayout>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6 p-6">

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
      </div>
    </AppLayout>

    <Sprout onSend={sendChatMessage} />
  </div>
);
}