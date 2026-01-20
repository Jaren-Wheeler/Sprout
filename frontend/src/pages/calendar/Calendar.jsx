import React, { useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Field from "../../components/Field.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import { useStore } from "../../state/store.jsx";
import { endAfterStart, requiredText } from "../../lib/validators.js";
import { fromDatetimeLocalValue, isPastDatetimeLocal, toDatetimeLocalValue } from "../../lib/datetime.js";

export default function Calendar() {
  const { state, dispatch, currentUser, nowForDatetimeInput } = useStore();
  const user = currentUser();

  const events = useMemo(
    () => state.calendar_events.filter((e) => e.user_id === user?.user_id).sort((a, b) => (a.start_time < b.start_time ? 1 : -1)),
    [state.calendar_events, user]
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState(nowForDatetimeInput());
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);

  const createEvent = () => {
    setError(null);

    const err1 = requiredText("Title", title);
    if (err1) return setError(err1);

    if (isPastDatetimeLocal(startTime)) return setError("Start time cannot be in the past.");

    const err2 = endAfterStart("End time", startTime, endTime);
    if (err2) return setError(err2);

    dispatch({
      type: "calendar/create",
      payload: {
        user_id: user.user_id,
        title: title.trim(),
        details: details || null,
        start_time: fromDatetimeLocalValue(startTime),
        end_time: endTime ? fromDatetimeLocalValue(endTime) : null,
      },
    });

    setOpen(false);
    setTitle("");
    setDetails("");
    setStartTime(nowForDatetimeInput());
    setEndTime("");
  };

  const deleteEvent = (calendar_event_id) => {
    if (!confirm("Delete this event?")) return;
    dispatch({ type: "calendar/delete", payload: { calendar_event_id } });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Calendar</h1>
          <div className="muted">Create, edit, delete events (prototype includes basic validation).</div>
        </div>
        <div className="spacer" />
        <Button onClick={() => setOpen(true)}>+ New event</Button>
      </div>

      <Card title="Events" subtitle="Events include date/time, title, and optional details.">
        {events.length === 0 ? (
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
              {events.map((e) => (
                <tr key={e.calendar_event_id}>
                  <td className="muted">{toDatetimeLocalValue(e.start_time)}</td>
                  <td className="muted">{e.end_time ? toDatetimeLocalValue(e.end_time) : "—"}</td>
                  <td>{e.title}</td>
                  <td className="muted">{e.details ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="ghost" onClick={() => deleteEvent(e.calendar_event_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={open}
        title="Create event"
        onClose={() => setOpen(false)}
        footer={
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={createEvent}>Create</Button>
          </div>
        }
      >
        <Field label="Title" error={error}>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <Field label="Details (optional)">
          <textarea className="textarea" value={details} onChange={(e) => setDetails(e.target.value)} />
        </Field>

        <div className="grid2">
          <Field label="Start time">
            <input className="input" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Field>
          <Field label="End time (optional)">
            <input className="input" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
