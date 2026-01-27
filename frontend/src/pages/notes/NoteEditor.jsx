import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Field from "../../components/Field.jsx";

export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState("Idle");

  const timerRef = useRef(null);

  // Reset editor when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setStatus("Idle");
  }, [note.note_id]);

  // Autosave (debounced)
  useEffect(() => {
    clearTimeout(timerRef.current);

    // Don’t autosave immediately on mount
    if (title === note.title && content === note.content) {
      return;
    }

    setStatus("Typing…");

    timerRef.current = setTimeout(async () => {
      try {
        await axios.put(`/api/notes/${note.note_id}`, {
          title,
          content,
        });
        setStatus("Saved");
      } catch {
        setStatus("Error saving");
      }
    }, 450);

    return () => clearTimeout(timerRef.current);
  }, [title, content, note.note_id, note.title, note.content]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge">{status}</span>
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>
          Autosave enabled
        </span>
      </div>

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
        />
      </Field>
    </div>
  );
}
