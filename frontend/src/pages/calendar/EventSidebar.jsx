import { useState } from 'react';
import { format } from 'date-fns';
import { createEvent } from '../../api/scheduler';
import { getEventColor } from '../../utils/date';

export default function EventSidebar({
  selectedDate,
  eventsByDate,
  onEventCreated,
}) {
  const key = format(selectedDate, 'yyyy-MM-dd');
  const events = eventsByDate[key] || [];

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  async function handleSave() {
    if (!title) return;

    try {
      await createEvent({
        title,
        startTime: `${key}T${time || '00:00'}`,
      });

      setTitle('');
      setTime('');
      setShowForm(false);

      onEventCreated();
    } catch (err) {
      alert('Failed to create event');
    }
  }

  return (
    <div className="bg-[#FAF6E8] rounded-3xl shadow-md p-6 w-[350px] border-2 border-purple-200">
      {/* DATE HEADER */}
      <h3 className="text-lg font-semibold mb-6">
        {format(selectedDate, 'MMMM d, yyyy')}
      </h3>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-purple-600 text-white rounded-xl py-3 mb-6 shadow"
      >
        + Add Event
      </button>

      {/* FORM */}
      {showForm && (
        <div className="border-2 border-purple-200 rounded-xl p-4 mb-6 space-y-3 bg-white">
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sprout-input"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="sprout-input"
          />

          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white rounded-lg py-2"
          >
            Save Event
          </button>
        </div>
      )}

      {/* EVENT LIST */}
      {events.length === 0 ? (
        <p className="text-[#6B5E5E] text-center">No events scheduled</p>
      ) : (
        <div className="space-y-3">
          {events.map((e) => {
            const colorClass = getEventColor(e.id);

            return (
              <div
                key={e.id}
                className={`rounded-lg p-3 shadow-sm border ${colorClass}`}
              >
                <p className="font-semibold">{e.title}</p>

                {e.startTime && (
                  <p className="text-sm text-gray-700">
                    {format(new Date(e.startTime), 'hh:mm a')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
