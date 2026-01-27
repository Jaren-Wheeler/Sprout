import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import NoteEditor from "./NoteEditor.jsx";

export default function Notes() {
  /* ------------------ DATA ------------------ */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ LOAD NOTES ------------------ */
  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/notes");
      setNotes(res.data);
      setLoading(false);
    };
    load();
  }, []);

  /* ------------------ SORTED NOTES ------------------ */
  const myNotes = useMemo(
    () =>
      [...notes].sort((a, b) =>
        a.updated_at < b.updated_at ? 1 : -1
      ),
    [notes]
  );

  /* ------------------ SELECTION ------------------ */
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (myNotes.length > 0 && selectedId == null) {
      setSelectedId(myNotes[0].note_id);
    }
  }, [myNotes, selectedId]);

  const selected =
    myNotes.find((n) => n.note_id === selectedId) || null;

  /* ------------------ CREATE NOTE ------------------ */
  const createNote = async () => {
    const title = prompt("New note title:");
    if (!title) return;

    const res = await axios.post("/api/notes", {
      title,
      content: "",
    });

    setNotes((n) => [res.data, ...n]);
    setSelectedId(res.data.note_id);
  };

  /* ------------------ DELETE NOTE ------------------ */
  const deleteNote = async (note_id) => {
    if (!confirm("Delete this note?")) return;

    await axios.delete(`/api/notes/${note_id}`);
    setNotes((n) => n.filter((x) => x.note_id !== note_id));

    if (selectedId === note_id) {
      setSelectedId(null);
    }
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
          <h1 className="h1">Notes</h1>
          <div className="muted">
            Create, edit, delete notes. Autosave is enabled in the editor.
          </div>
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
                    background:
                      selectedId === n.note_id
                        ? "rgba(122,162,255,0.10)"
                        : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedId(n.note_id)}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {n.title}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Updated: {String(n.updated_at).slice(0, 16)}
                    </div>
                  </div>
                  <div className="spacer" />
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(n.note_id);
                    }}
                  >
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
