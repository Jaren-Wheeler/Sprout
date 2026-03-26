import { useState } from 'react';
import { format } from 'date-fns';
import { createEvent, deleteEvent } from '../../api/scheduler';
import { getEventColor } from '../../utils/date';
import { Trash2 } from 'lucide-react';

import SproutModal from '../../components/ui/SproutModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../../validation/calendarSchemas';

export default function EventSidebar({
  selectedDate,
  eventsByDate,
  onEventCreated,
}) {
  const key = format(selectedDate, 'yyyy-MM-dd');
  const events = eventsByDate[key] || [];

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isNew = !selectedEvent;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      time: '',
    },
  });

  // ================= OPEN MODAL =================

  function openCreate() {
    setSelectedEvent(null);
    reset({ title: '', time: '' });
    setShowModal(true);
  }

function openEdit(event) {
  setSelectedEvent(event);

  const localTime = event.startTime
    ? format(new Date(event.startTime), 'HH:mm')
    : '';

  reset({
    title: event.title || '',
    time: localTime,
  });

  setShowModal(true);
}

  function closeModal() {
    setShowModal(false);
  }

  // ================= SAVE =================

  async function onSubmit(data) {
    setLoading(true);

    try {
      await createEvent({
        id: selectedEvent?.id,
        title: data.title.trim(),
        startTime: `${key}T${data.time || '00:00'}`,
      });

      closeModal();
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
      <div className="sprout-surface p-6">
        {/* === AGENDA HEADER === */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-200 border border-orange-400 flex flex-col items-center justify-center text-orange-900">
            <span className="text-lg font-bold">
              {format(selectedDate, 'd')}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-amber-900 leading-tight">
              Agenda for {format(selectedDate, 'MMMM d')}
            </h3>
            <p className="text-sm text-amber-700">Your plans for this day</p>
          </div>
        </div>

        {/* ADD EVENT BUTTON */}
        <button onClick={openCreate} className="sprout-btn-primary w-full mb-6">
          + Add Event
        </button>

        {/* === EMPTY STATE / EVENTS LIST === */}
        {events.length === 0 ? (
          <div className="text-center text-amber-700 space-y-2 mt-10">
            <p className="font-medium text-lg">Nothing planned yet</p>
            <p className="text-sm">Start by adding an event for this day.</p>
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
                      {format(new Date(e.startTime), 'HH:mm') === '00:00'
                        ? 'All day'
                        : format(new Date(e.startTime), 'hh:mm a')}
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
        <SproutModal onClose={closeModal}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="sprout-panel p-6 w-full max-w-md space-y-5 shadow-lg"
          >
            <h2 className="text-xl font-semibold">
              {isNew ? 'Add Event' : 'Edit Event'}
            </h2>

            {/* Title */}
            <div>
              <input
                className={`sprout-input ${errors.title ? 'sprout-input-error' : ''}`}
                placeholder="Event title"
                disabled={loading || isSubmitting}
                {...register('title')}
              />
              <p className="sprout-error-text min-h-[18px]">
                {errors.title?.message || ''}
              </p>
            </div>

            {/* Time */}
            <div>
              <input
                type="time"
                className={`sprout-input ${errors.time ? 'sprout-input-error' : ''}`}
                disabled={loading || isSubmitting}
                {...register('time')}
              />
              <p className="sprout-error-text min-h-[18px]">
                {errors.time?.message || ''}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3">
              {!isNew && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="sprout-icon-btn-danger"
                  title="Delete event"
                >
                  <Trash2 size={18} />
                </button>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="sprout-btn-muted px-4 py-2"
                  disabled={loading || isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="sprout-btn-primary px-5 py-2 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
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
