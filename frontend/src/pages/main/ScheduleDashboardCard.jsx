import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import DashboardEmptyState from "./DashboardEmptyState";

import { getEvents } from "../../api/scheduler";

export default function ScheduleDashboardCard() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {

      const data = await getEvents();

      const now = new Date();

      const upcoming = (data || [])
        .filter(event => new Date(event.startTime) >= now)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      setEvents(upcoming);

    } catch (err) {
      console.error("Schedule dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardCard title="Schedule" route="/schedule">
        Loading...
      </DashboardCard>
    );
  }

  if (!events.length) {
    return (
      <DashboardCard title="Schedule" route="/schedule">
        <DashboardEmptyState message="No upcoming events" />
      </DashboardCard>
    );
  }

  const nextEvents = events.slice(0, 3);

  return (
    <DashboardCard title="Schedule" route="/schedule">

      <div className="flex flex-col gap-2 text-sm">

        {nextEvents.map(event => {

          const date = new Date(event.startTime);

          return (
            <div key={event.id} className="flex justify-between">

              <span className="text-amber-900 font-medium">
                {event.title}
              </span>

              <span className="text-amber-700 text-xs">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>

            </div>
          );

        })}

      </div>

    </DashboardCard>
  );
}