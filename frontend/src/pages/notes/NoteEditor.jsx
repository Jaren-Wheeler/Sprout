// frontend/src/pages/notes/NoteEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../../lib/api.js";
import Field from "../../components/Field.jsx";

export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title ?? "");
  const [content, setContent] = useState(note.content ?? "");
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  const lastSavedRef = useRef({
    title: note.title ?? "",
    content: note.content ?? "",
  });

  // Reset editor when note changes
  useEffect(() => {
    setTitle(note.title ?? "");
    setContent(note.content ?? "");
    setStatus("Idle");
    setError("");

    lastSavedRef.current = {
      title: note.title ?? "",
      content: note.content ?? "",
    };
  }, [note.note_id, note.title, note.content]);

  // Autosave (debounced)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const last = lastSavedRef.current;

    // If nothing changed since last successful save, stay idle
    if (title === last.title && content === last.content) {
      if (status !== "Idle") setStatus("Idle");
      return;
    }

    setStatus("Typing…");
    setError("");

    const controller = new AbortController();

    timerRef.current = setTimeout(async () => {
      try {
        setStatus("Saving…");

        await api.put(
          `/api/notes/${note.note_id}`,
          { title, content },
          { signal: controller.signal }
        );

        lastSavedRef.current = { title, content };
        setStatus("Saved");
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          setStatus("Error saving");
          const msg =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to save note.";
          setError(msg);
        }
      }
    }, 450);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      controller.abort();
    };
    // status intentionally not included to avoid effect loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, note.note_id]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row" style={{ alignItems: "center" }}>
        <span className="badge">{status}</span>
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>
          Autosave enabled
        </span>
      </div>

      {error ? (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,0,0,0.25)",
            background: "rgba(255,0,0,0.08)",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : null}

      <Field label="Title">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Content">
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            minHeight: 260,
            resize: "vertical",
          }}
        />
      </Field>
    </div>
  );
}