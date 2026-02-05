//src/pages/calendar/Calendar.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SproutSection from "../../components/Sprout.jsx";

import { getEvents, createEvent, deleteEvent } from "../../api/scheduler";

import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";

import { isPastDatetimeLocal, toDatetimeLocalValue } from "../../lib/datetime.js";

import "../../styles/layout/appPages.css";

const nowForDatetimeInput = () => new Date().toISOString().slice(0, 16);

export default function Calendar() {
  const nav = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState(nowForDatetimeInput());
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState("");

  const closeCreateModal = useCallback(() => setOpen(false), []);

  const loadEvents = async () => {
    setLoadError("");
    setLoading(true);

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Calendar load failed:", err);
      setEvents([]);
      setLoadError(err.message || "Failed to load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const sortedEvents = useMemo(() => {
    const copy = [...events];
    copy.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    return copy;
  }, [events]);

  const createNewEvent = async () => {
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
      const event = await createEvent({
        title: title.trim(),
        description: details || null,
        startTime,
        endTime: endTime || null,
      });

      setEvents((e) => [event, ...e]);

      closeCreateModal();
      setTitle("");
      setDetails("");
      setStartTime(nowForDatetimeInput());
      setEndTime("");
    } catch (err) {
      console.error("Create event failed:", err);
      setFormError(err.message || "Failed to create event.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);
      setEvents((e) => e.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete event failed:", err);
      alert(err.message || "Failed to delete event.");
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Calendar</h1>
            <div className="pageSubtitle">Create and manage scheduled events.</div>

            {loadError && (
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
            )}
          </div>

          <div className="pageHeaderRight">
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button variant="ghost" onClick={loadEvents}>
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
                      <tr key={e.id}>
                        <td className="muted">{toDatetimeLocalValue(e.startTime)}</td>
                        <td className="muted">
                          {e.endTime ? toDatetimeLocalValue(e.endTime) : "—"}
                        </td>
                        <td>{e.title}</td>
                        <td className="muted">{e.description ?? "—"}</td>
                        <td style={{ textAlign: "right" }}>
                          <Button variant="ghost" onClick={() => handleDelete(e.id)}>
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

        <Modal
          open={open}
          title="Create event"
          onClose={closeCreateModal}
          footer={
            <div
              className="row"
              style={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 10 }}
            >
              <Button variant="ghost" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button onClick={createNewEvent}>Create</Button>
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

      {/* ✅ Floating chatbot (does not take layout space) */}
      <SproutSection subtitle="Quick access to AI Chatbot while planning your schedule." />
    </div>
  );
}