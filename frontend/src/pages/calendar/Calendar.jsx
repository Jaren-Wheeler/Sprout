import { useEffect, useState } from 'react';

import AppLayout from '@/components/AppLayout';
import { getEvents } from '../../api/scheduler';
import background from '../../assets/bg.png';
import { useTheme } from '../../theme/ThemeContext';
import { groupEventsByDate } from '../../utils/date';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';

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
      className="sprout-app-shell min-h-screen flex flex-col"
      style={{
        backgroundImage:
          theme === 'dark'
            ? `radial-gradient(circle at 18% 14%, rgba(212, 178, 116, 0.08), transparent 20%), radial-gradient(circle at 82% 78%, rgba(145, 114, 72, 0.06), transparent 18%), repeating-linear-gradient(-18deg, rgba(255,248,228,0.015) 0 2px, rgba(255,248,228,0) 2px 13px), linear-gradient(180deg, #040506 0%, #0a0b0d 52%, #12100d 100%)`
            : `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})`,
        backgroundRepeat:
          theme === 'dark'
            ? 'no-repeat, no-repeat, repeat, no-repeat'
            : 'no-repeat, no-repeat',
        backgroundSize:
          theme === 'dark' ? 'auto, auto, 220px 220px, cover' : 'auto, cover',
        backgroundPosition:
          theme === 'dark' ? 'center, center' : 'center, center top',
      }}
    >
      <div className="sprout-page-wrap">
        <AppLayout title="Calendar">
          <div className="flex flex-col h-full min-h-0">
            <section className="sprout-page-hero shrink-0">
              <div className="relative z-10">
                <div>
                  <span className="sprout-page-kicker">Planning board</span>
                  <h1 className="sprout-page-title">Calendar</h1>
                  <p className="sprout-page-description">
                    A calmer schedule view with clearer hierarchy, softer paper
                    tones, and a little handcrafted character.
                  </p>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr] flex-1 min-h-0">
              <CalendarGrid
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                eventsByDate={eventsByDate}
              />

              <div className="flex flex-col gap-6 h-full">
                {/* fixed height */}

                {/* scrollable area */}
                <div className="flex-1 min-h-0">
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
      </div>
    </div>
  );
}
