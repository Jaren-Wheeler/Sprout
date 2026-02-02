import React, { useEffect, useRef, useState } from "react";
import Field from "../../components/Field.jsx";
import { useStore } from "../../state/store.jsx";

export default function NoteEditor({ note }) {
  const { dispatch } = useStore();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const [status, setStatus] = useState("Idle");
  const timerRef = useRef(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setStatus("Idle");
  }, [note.note_id]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    setStatus("Typing…");
    timerRef.current = setTimeout(() => {
      dispatch({ type: "notes/update", payload: { note_id: note.note_id, patch: { title, content } } });
      setStatus("Saved");
    }, 450);

    return () => clearTimeout(timerRef.current);
  }, [title, content, note.note_id, dispatch]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge">{status}</span>
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>Autosave enabled</span>
      </div>

      <Field label="Title">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <Field label="Content">
        <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
      </Field>
    </div>
  );
}
