import React, { useRef, useState } from "react";
import { updateNote } from "../../api/notes";
import Field from "../../components/Field.jsx";

export default function NoteEditor({ note }) {
  const [title, setTitle] = useState(note.title ?? "");
  const [content, setContent] = useState(note.content ?? "");
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  const lastSavedRef = useRef({
    title: note.title ?? "",
    content: note.content ?? ""
  });

  const scheduleSave = (nextTitle, nextContent) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const last = lastSavedRef.current;

    // Nothing changed, do nothing
    if (nextTitle === last.title && nextContent === last.content) {
      return;
    }

    // Status updates happen from user action, not inside effects
    setStatus("Typing…");
    setError("");

    timerRef.current = setTimeout(async () => {
      try {
        setStatus("Saving…");

        await updateNote(note.id, { title: nextTitle, content: nextContent });

        lastSavedRef.current = { title: nextTitle, content: nextContent };
        setStatus("Saved");
      } catch (err) {
        setStatus("Error saving");
        setError(err.message || "Failed to save note.");
      }
    }, 450);
  };

  const onTitleChange = (e) => {
    const next = e.target.value;
    setTitle(next);
    scheduleSave(next, content);
  };

  const onContentChange = (e) => {
    const next = e.target.value;
    setContent(next);
    scheduleSave(title, next);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row" style={{ alignItems: "center" }}>
        <span className="badge">{status}</span>
        <div className="spacer" />
        <span className="muted" style={{ fontSize: 13 }}>
          Autosave enabled
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,0,0,0.25)",
            background: "rgba(255,0,0,0.08)",
            fontSize: 13
          }}
        >
          {error}
        </div>
      )}

      <Field label="Title">
        <input className="input" value={title} onChange={onTitleChange} />
      </Field>

      <Field label="Content">
        <textarea
          className="textarea"
          value={content}
          onChange={onContentChange}
          style={{ minHeight: 260, resize: "vertical" }}
        />
      </Field>
    </div>
  );
}
