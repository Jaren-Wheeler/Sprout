import { useEffect, useState } from 'react';

import { getEvents } from '../../api/scheduler';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';
import { groupEventsByDate } from '../../utils/date';
import TodayAgenda from './TodayAgenda';
import background from '../../assets/bg.png';
import AppLayout from '@/components/AppLayout';
import { useTheme } from '../../theme/ThemeContext';

export default function CalendarPage() {
  const { theme } = useTheme();
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
  return (
    <div
      className="sprout-app-shell"
      style={{
        backgroundImage:
          theme === 'dark'
            ? `radial-gradient(circle at 18% 14%, rgba(212, 178, 116, 0.11), transparent 20%), radial-gradient(circle at 82% 78%, rgba(145, 114, 72, 0.1), transparent 18%), repeating-linear-gradient(-18deg, rgba(255,248,228,0.02) 0 2px, rgba(255,248,228,0) 2px 13px), linear-gradient(180deg, #181410 0%, #241c15 52%, #31251b 100%)`
            : `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})`,
        backgroundRepeat: theme === 'dark' ? 'no-repeat, no-repeat, repeat, no-repeat' : 'no-repeat, no-repeat',
        backgroundSize: theme === 'dark' ? 'auto, auto, 220px 220px, cover' : 'auto, cover',
        backgroundPosition: theme === 'dark' ? 'center, center' : 'center, center top',
      }}
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
    </div>
  );
}
