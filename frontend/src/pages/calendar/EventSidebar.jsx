import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createEvent, deleteEvent, updateEvent } from '../../api/scheduler';
import { getEventColor } from '../../utils/date';

import ConfirmModal from '../../components/ui/ConfirmModal';
import SproutModal from '../../components/ui/SproutModal';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
      const payload = {
        title: data.title.trim(),
        startTime: `${key}T${data.time || '00:00'}`,
      };

      if (selectedEvent?.id) {
        await updateEvent(selectedEvent.id, payload);
      } else {
        await createEvent(payload);
      }

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
      <div className="sprout-surface p-5 h-[600px] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-orange-200 border border-orange-400 flex flex-col items-center justify-center text-orange-900 shadow-sm">
              <span className="text-base font-bold">
                {format(selectedDate, 'd')}
              </span>
            </div>

            <div className="leading-tight">
              <h3 className="text-[15px] font-semibold text-amber-900">
                {format(selectedDate, 'MMMM d')}
              </h3>
              <p className="text-xs text-amber-700">Agenda</p>
            </div>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={openCreate}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#f0b240] to-[#d4941f] text-white shadow-md hover:scale-[1.05] transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* === EMPTY STATE / EVENTS LIST === */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-amber-700 flex-1">
              <p className="font-medium text-base">No events</p>
              <p className="text-xs opacity-70 mt-1">
                Add something to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-1">
              {events.map((e) => {
                const colorClass = getEventColor(e.id);

                return (
                  <div
                    key={e.id}
                    onClick={() => openEdit(e)}
                    className={`group sprout-card px-3 py-2.5 cursor-pointer transition-all duration-150 hover:-translate-y-[1px] ${colorClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{e.title}</p>

                      <span className="text-[11px] text-amber-700 opacity-70 group-hover:opacity-100 transition">
                        {e.startTime
                          ? format(new Date(e.startTime), 'HH:mm') === '00:00'
                            ? 'All day'
                            : format(new Date(e.startTime), 'hh:mm a')
                          : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
