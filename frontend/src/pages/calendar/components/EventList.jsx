import EventItem from './EventItem';

export default function EventList({ events, onEventClick }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-amber-700 flex-1">
        <p className="font-medium text-base">No events</p>
        <p className="text-xs opacity-70 mt-1">Add something to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pr-1">
      {events.map((e) => (
        <EventItem key={e.id} event={e} onClick={onEventClick} />
      ))}
    </div>
  );
}
