import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

export default function ScheduleDashboardCard() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/schedule/upcoming");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardCard title="Schedule" route="/schedule">

      {events.length ? (
        <ul>
          {events.slice(0,3).map(event => (
            <li key={event.id}>
              <strong>{event.title}</strong>
              <br />
              {new Date(event.startTime).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events</p>
      )}

    </DashboardCard>
  );
}