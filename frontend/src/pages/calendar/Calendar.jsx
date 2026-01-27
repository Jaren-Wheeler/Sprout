import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import {
  fromDatetimeLocalValue,
  isPastDatetimeLocal,
  toDatetimeLocalValue,
} from "../../lib/datetime.js";

/* Replacement for nowForDatetimeInput */
const nowForDatetimeInput = () =>
  new Date().toISOString().slice(0, 16);

export default function Calendar() {
  /* ------------------ DATA ------------------ */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ LOAD EVENTS ------------------ */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/calendar");
        setEvents(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ------------------ SORTED EVENTS ------------------ */
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) =>
        a.start_time < b.start_time ? 1 : -1
      ),
    [events]
  );

  /* ------------------ CREATE MODAL ------------------ */
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState(nowForDatetimeInput());
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);

  const createEvent = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (isPastDatetimeLocal(startTime)) {
      setError("Start time cannot be in the past.");
      return;
    }

    if (endTime && endTime <= startTime) {
      setError("End time must be after the start time.");
      return;
    }

    const res = await axios.post("/api/calendar", {
      title: title.trim(),
      details: details || null,
      start_time: fromDatetimeLocalValue(startTime),
      end_time: endTime ? fromDatetimeLocalValue(endTime) : null,
    });

    setEvents((e) => [res.data, ...e]);
    setOpen(false);
    setTitle("");
    setDetails("");
    setStartTime(nowForDatetimeInput());
    setEndTime("");
  };

  const deleteEvent = async (calendar_event_id) => {
    if (!confirm("Delete this event?")) return;
    await axios.delete(`/api/calendar/${calendar_event_id}`);
    setEvents((e) =>
      e.filter((x) => x.calendar_event_id !== calendar_event_id)
    );
  };

  /* ------------------ STATES ------------------ */
  if (loading) {
    return <div className="muted">Loading…</div>;
  }

  /* ------------------ RENDER ------------------ */
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Calendar</h1>
          <div className="muted">
            Create, edit, delete events (basic validation included).
          </div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpen(true)}>+ New event</Button>
      </div>

      <Card title="Events" subtitle="Date/time, title, and optional details.">
        {sortedEvents.length === 0 ? (
          <div className="muted">No events yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Title</th>
                <th>Details</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((e) => (
                <tr key={e.calendar_event_id}>
                  <td className="muted">
                    {toDatetimeLocalValue(e.start_time)}
                  </td>
                  <td className="muted">
                    {e.end_time
                      ? toDatetimeLocalValue(e.end_time)
                      : "—"}
                  </td>
                  <td>{e.title}</td>
                  <td className="muted">{e.details ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        deleteEvent(e.calendar_event_id)
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* -------- CREATE EVENT MODAL -------- */}
      <Modal
        open={open}
        title="Create event"
        onClose={() => setOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={createEvent}>Create</Button>
          </div>
        }
      >
        <Field label="Title" error={error}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Details (optional)">
          <textarea
            className="textarea"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Field>

        <div className="grid2">
          <Field label="Start time">
            <input
              className="input"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Field>

          <Field label="End time (optional)">
            <input
              className="input"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
