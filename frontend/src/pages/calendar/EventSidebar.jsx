import { useState } from "react";
import { format } from "date-fns";
import { createEvent, deleteEvent } from "../../api/scheduler";
import { getEventColor } from "../../utils/date";
import { Trash2 } from "lucide-react";

import SproutModal from "../../components/ui/SproutModal";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function EventSidebar({
  selectedDate,
  eventsByDate,
  onEventCreated,
}) {
  const key = format(selectedDate, "yyyy-MM-dd");
  const events = eventsByDate[key] || [];

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const isNew = !selectedEvent;

  // ================= OPEN MODAL =================

  function openCreate() {
    setSelectedEvent(null);
    setTitle("");
    setTime("");
    setShowModal(true);
  }

  function openEdit(event) {
    setSelectedEvent(event);
    setTitle(event.title);
    setTime(event.startTime?.slice(11, 16) || "");
    setShowModal(true);
  }

  // ================= SAVE =================

  async function handleSave() {
    if (!title) return;

    setLoading(true);

    try {
      await createEvent({
        id: selectedEvent?.id,
        title,
        startTime: `${key}T${time || "00:00"}`,
      });

      setShowModal(false);
      onEventCreated();
    } finally {
      setLoading(false);
    }
  }

  // ================= DELETE =================

  async function confirmDelete() {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id);
      setConfirmDeleteOpen(false);
      setShowModal(false);
      onEventCreated();
    } catch (err) {
      console.error(err);
    }
  }

  // ================= UI =================

  return (
    <>
      <div className="sprout-paper p-6 w-[350px]">

        {/* === AGENDA HEADER === */}
        <div className="flex items-center gap-4 mb-6">

          {/* Date badge */}
          <div className="w-12 h-12 rounded-xl bg-orange-200 border border-orange-400 flex flex-col items-center justify-center text-orange-900">
            <span className="text-lg font-bold">
              {format(selectedDate, "d")}
            </span>
          </div>

          {/* Context text */}
          <div>
            <h3 className="text-lg font-semibold text-amber-900 leading-tight">
              Agenda for {format(selectedDate, "MMMM yyyy")}
            </h3>
            <p className="text-sm text-amber-700">
              Your plans for this day
            </p>
          </div>

        </div>

        {/* ADD EVENT BUTTON */}
        <button
          onClick={openCreate}
          className="sprout-btn-primary w-full mb-6"
        >
          + Add Event
        </button>

        {/* === EMPTY STATE === */}
        {events.length === 0 ? (
          <div className="text-center text-amber-700 space-y-2 mt-10">
            <p className="font-medium text-lg">
              Nothing planned yet 
            </p>
            <p className="text-sm">
              Start by adding an event for this day.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((e) => {
              const colorClass = getEventColor(e.id);

              return (
                <div
                  key={e.id}
                  onClick={() => openEdit(e)}
                  className={`sprout-card p-3 cursor-pointer ${colorClass}`}
                >
                  <p className="font-semibold">{e.title}</p>

                  {e.startTime && (
                    <p className="text-sm text-amber-800">
                      {format(new Date(e.startTime), "hh:mm a")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MAIN MODAL ================= */}

      {showModal && (
        <SproutModal onClose={() => setShowModal(false)}>
          <div className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg">

            <h2 className="text-xl font-semibold">
              {isNew ? "Add Event" : "Edit Event"}
            </h2>

            <input
              className="sprout-input"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="time"
              className="sprout-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />

            <div className="flex justify-between items-center pt-3">
              {!isNew && (
                <button
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="sprout-icon-btn-danger"
                  title="Delete event"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="sprout-btn-muted px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={handleSave}
                  className="sprout-btn-primary px-5 py-2 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

          </div>
        </SproutModal>
      )}

      {/* ================= DELETE CONFIRM ================= */}

      {confirmDeleteOpen && (
        <ConfirmModal
          title="Delete Event"
          message="Are you sure you want to delete this event?"
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </>
  );
}