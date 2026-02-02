// frontend/src/pages/notes/Notes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api.js";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import NoteEditor from "./NoteEditor.jsx";

// ✅ Shared app-page layout styles (panel + header + responsiveness)
import "../../styles/layout/appPages.css";

export default function Notes() {
  const nav = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await api.get("/api/notes");
      const data = Array.isArray(res.data) ? res.data : [];
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load notes. (Are you logged in?)";
      setLoadError(msg);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const myNotes = useMemo(() => {
    return [...notes].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
  }, [notes]);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (myNotes.length > 0 && selectedId == null) {
      setSelectedId(myNotes[0].note_id);
    }
  }, [myNotes, selectedId]);

  const selected = myNotes.find((n) => n.note_id === selectedId) || null;

  const createNote = async () => {
    const title = prompt("New note title:");
    if (!title) return;

    try {
      const res = await api.post("/api/notes", { title, content: "" });
      setNotes((n) => [res.data, ...n]);
      setSelectedId(res.data.note_id);
      setLoadError("");
    } catch (err) {
      console.error("Failed to create note:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create note.";
      setLoadError(msg);
    }
  };

  const deleteNote = async (note_id) => {
    if (!confirm("Delete this note?")) return;

    try {
      await api.delete(`/api/notes/${note_id}`);
      setNotes((n) => n.filter((x) => x.note_id !== note_id));

      if (selectedId === note_id) setSelectedId(null);
      setLoadError("");
    } catch (err) {
      console.error("Failed to delete note:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete note.";
      setLoadError(msg);
    }
  };

  if (loading) return <div className="muted">Loading…</div>;

  return (
    <div className="page">
      <div className="panel">
        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Notes</h1>
            <div className="pageSubtitle">
              Create, edit, delete notes. Autosave is enabled in the editor.
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

            <Button variant="ghost" onClick={loadNotes}>
              Refresh
            </Button>
            <Button onClick={createNote}>+ New note</Button>
          </div>
        </div>

        <div className="pageBody">
          <div className="notesGrid">
            <Card title="Your notes" subtitle="Select a note to edit.">
              {myNotes.length === 0 ? (
                <div className="muted">No notes yet.</div>
              ) : (
                <div className="notesList">
                  {myNotes.map((n) => (
                    <button
                      key={n.note_id}
                      type="button"
                      className={`notesRow ${
                        selectedId === n.note_id ? "isActive" : ""
                      }`}
                      onClick={() => setSelectedId(n.note_id)}
                    >
                      <div className="notesRowMain">
                        <div className="notesTitle">{n.title}</div>
                        <div className="muted notesMeta">
                          Updated: {String(n.updated_at).slice(0, 16)}
                        </div>
                      </div>

                      <div className="notesRowActions">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNote(n.note_id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </button>
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
      </div>

      <style>{`
        .notesGrid{
          display:grid;
          gap:16px;
          grid-template-columns: 420px minmax(0, 1fr);
          align-items:start;
        }
        .notesList{ display:grid; gap:10px; }
        .notesRow{
          width:100%;
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:14px;
          border:1px solid var(--border);
          background: transparent;
          cursor:pointer;
          text-align:left;
          transition: transform .12s ease, background-color .12s ease, border-color .12s ease;
        }
        .notesRow:hover{ background: rgba(255,255,255,0.06); transform: translateY(-1px); }
        body.light .notesRow:hover{ background: rgba(0,0,0,0.04); }
        .notesRow.isActive{ background: rgba(122,162,255,0.12); border-color: rgba(122,162,255,0.35); }
        body.light .notesRow.isActive{ background: rgba(122,162,255,0.16); border-color: rgba(80,120,255,0.35); }
        .notesRowMain{ min-width:0; flex:1; }
        .notesTitle{ font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .notesMeta{ font-size:12px; margin-top:4px; }
        .notesRowActions{ flex:0 0 auto; display:flex; justify-content:flex-end; }
        @media (max-width: 900px){ .notesGrid{ grid-template-columns: 1fr; } }
        @media (max-width: 420px){ .notesRow{ padding:10px; border-radius:12px; } }
      `}</style>
    </div>
  );
}