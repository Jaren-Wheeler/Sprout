import React, { useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import NoteEditor from "./NoteEditor.jsx";
import { useStore } from "../../state/store.jsx";

export default function Notes() {
  const { state, dispatch, currentUser } = useStore();
  const user = currentUser();

  const myNotes = useMemo(
    () => state.notes.filter((n) => n.user_id === user?.user_id).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)),
    [state.notes, user]
  );

  const [selectedId, setSelectedId] = useState(myNotes[0]?.note_id ?? null);

  const selected = myNotes.find((n) => n.note_id === selectedId) || null;

  const createNote = () => {
    const title = prompt("New note title:");
    if (!title) return;
    dispatch({ type: "notes/create", payload: { user_id: user.user_id, title, content: "" } });
    setTimeout(() => {
      const newest = [...state.notes].sort((a, b) => b.note_id - a.note_id)[0];
      if (newest) setSelectedId(newest.note_id);
    }, 0);
  };

  const deleteNote = (note_id) => {
    if (!confirm("Delete this note?")) return;
    dispatch({ type: "notes/delete", payload: { note_id } });
    if (selectedId === note_id) setSelectedId(null);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="row">
        <div>
          <h1 className="h1">Notes</h1>
          <div className="muted">Create, edit, delete notes. Autosave is enabled in the editor.</div>
        </div>
        <div className="spacer" />
        <Button onClick={createNote}>+ New note</Button>
      </div>

      <div className="grid2">
        <Card title="Your notes" subtitle="Select a note to edit.">
          {myNotes.length === 0 ? (
            <div className="muted">No notes yet.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {myNotes.map((n) => (
                <div
                  key={n.note_id}
                  className="row"
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: selectedId === n.note_id ? "rgba(122,162,255,0.10)" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedId(n.note_id)}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {n.title}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Updated: {String(n.updated_at).slice(0, 16)}
                    </div>
                  </div>
                  <div className="spacer" />
                  <Button variant="ghost" onClick={(e) => { e.stopPropagation(); deleteNote(n.note_id); }}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Editor" subtitle="Autosaves when you type.">
          {selected ? (
            <NoteEditor note={selected} />
          ) : (
            <div className="muted">Select a note to edit.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
