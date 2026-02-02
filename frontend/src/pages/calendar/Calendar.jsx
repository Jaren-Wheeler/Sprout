// frontend/src/pages/calendar/Calendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import {
  fromDatetimeLocalValue,
  isPastDatetimeLocal,
  toDatetimeLocalValue,
} from "../../lib/datetime.js";

// ✅ Shared app-page layout styles (panel + header + responsiveness)
import "../../styles/layout/appPages.css";

/* Replacement for nowForDatetimeInput */
const nowForDatetimeInput = () => new Date().toISOString().slice(0, 16);

export default function Calendar() {
  const nav = useNavigate();

  /* ------------------ DATA ------------------ */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  /* ------------------ LOAD EVENTS ------------------ */
  const loadEvents = async (signal) => {
    setLoadError("");
    setLoading(true);

    try {
      const res = await api.get("/api/calendar", { signal });
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
        console.error("Calendar load failed:", err);
        setEvents([]);
        setLoadError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load calendar events."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadEvents(controller.signal);
    return () => controller.abort();
  }, []);

  /* ------------------ SORTED EVENTS ------------------ */
  const sortedEvents = useMemo(() => {
    const copy = [...events];
    copy.sort((a, b) => {
      if (a.start_time === b.start_time) return 0;
      // newest first
      return a.start_time < b.start_time ? 1 : -1;
    });
    return copy;
  }, [events]);

  /* ------------------ CREATE MODAL ------------------ */
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState(nowForDatetimeInput());
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState("");

  const createEvent = async () => {
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (isPastDatetimeLocal(startTime)) {
      setFormError("Start time cannot be in the past.");
      return;
    }

    if (endTime && endTime <= startTime) {
      setFormError("End time must be after the start time.");
      return;
    }

    try {
      const res = await api.post("/api/calendar", {
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
    } catch (err) {
      console.error("Create event failed:", err);
      setFormError("Failed to create event. Please try again.");
    }
  };

  const deleteEvent = async (calendar_event_id) => {
    if (!confirm("Delete this event?")) return;

    try {
      await api.delete(`/api/calendar/${calendar_event_id}`);
      setEvents((e) =>
        e.filter((x) => x.calendar_event_id !== calendar_event_id)
      );
    } catch (err) {
      console.error("Delete event failed:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  /* ------------------ STATES ------------------ */
  if (loading) return <div className="muted">Loading…</div>;

  /* ------------------ RENDER ------------------ */
  return (
    <div className="page">
      <div className="panel">
        {/* ✅ Consistent header */}
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Calendar</h1>
            <div className="pageSubtitle">
              Create, edit, delete events (basic validation included).
            </div>

            {loadError ? (
              <div
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.08)",
                }}
              >
                {loadError}
              </div>
            ) : null}
          </div>

          <div className="pageHeaderRight">
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                const controller = new AbortController();
                loadEvents(controller.signal);
              }}
            >
              Refresh
            </Button>

            <Button onClick={() => setOpen(true)}>+ New event</Button>
          </div>
        </div>

        <div className="pageBody" style={{ display: "grid", gap: 16 }}>
          <Card title="Events" subtitle="Date/time, title, and optional details.">
            {sortedEvents.length === 0 ? (
              <div className="muted">No events yet.</div>
            ) : (
              <div className="tableWrap">
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
                          {e.end_time ? toDatetimeLocalValue(e.end_time) : "—"}
                        </td>
                        <td>{e.title}</td>
                        <td className="muted">{e.details ?? "—"}</td>
                        <td style={{ textAlign: "right" }}>
                          <Button
                            variant="ghost"
                            onClick={() => deleteEvent(e.calendar_event_id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* -------- CREATE EVENT MODAL -------- */}
        <Modal
          open={open}
          title="Create event"
          onClose={() => setOpen(false)}
          footer={
            <div
              className="row"
              style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}
            >
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createEvent}>Create</Button>
            </div>
          }
        >
          <Field label="Title" error={formError}>
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

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
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
    </div>
  );
}