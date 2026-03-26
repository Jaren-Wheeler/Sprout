import { useEffect, useState } from 'react';

import { getEvents } from '../../api/scheduler';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';
import { groupEventsByDate } from '../../utils/date';
import Sprout from '../../components/chatbot/Sprout';
import { sendChatMessage } from '../../api/chatbot';
import TodayAgenda from './TodayAgenda';
import background from '../../assets/bg.png';
import AppLayout from '@/components/AppLayout';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  async function sendCalendarChatMessage(message) {
    const now = new Date();

    return sendChatMessage(message, {
      clientNowIso: now.toISOString(),
      clientLocalDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      clientTimezoneOffsetMinutes: now.getTimezoneOffset()
    });
  }

  return (
    <div
      className="sprout-app-shell"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})` }}
    >
      <div className="sprout-page-wrap">
        <AppLayout title="Calendar">
          <div className="space-y-6">
            <section className="sprout-page-hero">
              <div className="relative z-10">
                <div>
                  <span className="sprout-page-kicker">Planning board</span>
                  <h1 className="sprout-page-title">Calendar</h1>
                  <p className="sprout-page-description">
                    A calmer schedule view with clearer hierarchy, softer paper tones, and a little handcrafted character.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
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
        </AppLayout>
      </div>
      <Sprout onSend={sendCalendarChatMessage} onBudgetChange={loadEvents} />
    </div>
  );
}
