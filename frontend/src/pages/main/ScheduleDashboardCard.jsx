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
        .filter((event) => new Date(event.startTime) >= now)
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
    "bg-[rgba(232,240,249,0.88)] border-[rgba(135,168,206,0.44)] text-[#395a7a]",
    "bg-[rgba(235,243,231,0.88)] border-[rgba(132,172,120,0.42)] text-[#44663b]",
    "bg-[rgba(243,235,246,0.88)] border-[rgba(173,149,191,0.42)] text-[#6a4f7a]",
  ];

  return (
    <DashboardCard title="Schedule" route="/calendar">
      <div className="flex h-full flex-col justify-between gap-3">
        {nextEvents.map((event, index) => {
          const date = new Date(event.startTime);

          return (
            <div
              key={event.id}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm ${colors[index % colors.length]}`}
            >
              <div className="font-semibold">
                {event.title}
              </div>

              <div className="text-xs opacity-80">
                {date.toLocaleDateString([], { weekday: "short" })}
                {" - "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
