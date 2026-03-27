import { useEffect, useState } from 'react';
import { getEvents } from '../../../api/scheduler';

export default function useEvents() {
  const [events, setEvents] = useState([]);

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return { events, loadEvents };
}
