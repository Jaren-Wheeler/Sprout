import { useEffect, useState } from 'react';

import AppLayout from '@/components/AppLayout';
import background from '../../assets/bg.png';
import { useTheme } from '../../theme/ThemeContext';
import { groupEventsByDate } from '../../utils/date';
import CalendarGrid from './components/CalendarGrid';
import EventSidebar from './components/EventSidebar';
import PinnedEvents from './components/PinnedEvents';
import useEvents from './hooks/useEvents';

export default function CalendarPage() {
  const { theme } = useTheme();
  const { events, loadEvents } = useEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleEventsUpdated(event) {
      const focusDate = event?.detail?.focusDate
        ? new Date(event.detail.focusDate)
        : null;

      if (focusDate && !Number.isNaN(focusDate.getTime())) {
        setSelectedDate(focusDate);
        setCurrentMonth(focusDate);
      }

      loadEvents();
    }

    window.addEventListener('eventsUpdated', handleEventsUpdated);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdated);
    };
  }, []);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(null), 2000);
    return () => clearTimeout(timer);
  }, [error]);

  const pinnedEvents = events
    .filter((e) => e.isPinned)
    .sort((a, b) => new Date(b.pinnedAt) - new Date(a.pinnedAt))
    .slice(0, 3);

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
            <section className="sprout-page-hero shrink-0 mb-6 relative min-h-[225px]">
              <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* LEFT SIDE */}
                <div className="max-w-xl">
                  <span className="sprout-page-kicker">Planning board</span>
                  <h1 className="sprout-page-title">Calendar</h1>
                  <p className="sprout-page-description">
                    Plan your days with clarity. No clutter. Just what matters.
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="hidden md:block absolute top-0 right-0 w-[300px]">
                  <PinnedEvents
                    events={pinnedEvents}
                    onSelectDate={setSelectedDate}
                  />
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

              {/* scrollable area */}
              <div className="flex-1 min-h-0">
                <EventSidebar
                  selectedDate={selectedDate}
                  eventsByDate={eventsByDate}
                  onEventCreated={loadEvents}
                  setError={setError}
                />
              </div>
            </div>
          </div>
        </AppLayout>
      </div>
      {error && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 
                   bg-red-500 text-white text-sm px-4 py-2 
                   rounded-lg shadow-lg z-50"
        >
          {error}
        </div>
      )}
    </div>
  );
}
