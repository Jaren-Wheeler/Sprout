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
      <DashboardCard title="Schedule" route="/calendar">
        Loading...
      </DashboardCard>
    );
  }

  if (!events.length) {
    return (
      <DashboardCard title="Schedule" route="/calendar">
        <DashboardEmptyState message="No upcoming events" />
      </DashboardCard>
    );
  }

  const nextEvents = events.slice(0, 3);

  const colors = [
    "bg-blue-100 border-blue-300 text-blue-900",
    "bg-green-100 border-green-300 text-green-900",
    "bg-purple-100 border-purple-300 text-purple-900"
    ];
  return (
    <DashboardCard title="Schedule" route="/calendar">

        <div className="flex flex-col justify-between h-full gap-3">

            {nextEvents.map((event, index) => {

                const date = new Date(event.startTime);

                return (
                    <div
                        key={event.id}
                        className={`flex flex-col px-3 py-2 rounded-lg border
                                    shadow-sm text-sm w-full
                                    ${colors[index % colors.length]}`}
                    >

                        <div className="font-semibold">
                            {event.title}
                        </div>

                        <div className="text-xs opacity-80">

                            {date.toLocaleDateString([], {
                                weekday: "short"
                            })}

                            {" • "}

                            {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}

                        </div>

                    </div>
                );

            })}

        </div>

    </DashboardCard>
  );
}