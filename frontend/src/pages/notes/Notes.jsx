//src/pages/notes/Notes.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getNotes, createNote, deleteNote } from "../../api/notes";

import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import NoteEditor from "./NoteEditor.jsx";
import SproutSection from "../../components/SproutSection.jsx";

import "../../styles/layout/appPages.css";

export default function Notes() {
  const nav = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  // =====================================================
  // Load Notes
  // =====================================================

  const loadNotes = async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(err.message || "Failed to load notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // =====================================================
  // Sort Notes (most recently updated first)
  // =====================================================

  const myNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [notes]);

  // =====================================================
  // Auto select first note
  // =====================================================

  useEffect(() => {
    if (myNotes.length > 0 && selectedId == null) {
      setSelectedId(myNotes[0].id);
    }
  }, [myNotes, selectedId]);

  const selected = myNotes.find((n) => n.id === selectedId) || null;

  // =====================================================
  // Create Note
  // =====================================================

  const createNewNote = async () => {
    const title = prompt("New note title:");
    if (!title) return;

    try {
      const note = await createNote({ title, content: "" });
      setNotes((n) => [note, ...n]);
      setSelectedId(note.id);
    } catch (err) {
      setLoadError(err.message || "Failed to create note.");
    }
  };

  // =====================================================
  // Delete Note
  // =====================================================

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;

    try {
      await deleteNote(id);
      setNotes((n) => n.filter((x) => x.id !== id));

      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err) {
      setLoadError(err.message || "Failed to delete note.");
    }
  };

  // =====================================================
  // Loading State
  // =====================================================

  if (loading) return <div className="muted">Loading…</div>;

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="page">
      <div className="panel">
        {/* ================= Page Header ================= */}

        <div className="pageHeader">
          <div className="pageHeaderText">
            <h1 className="pageTitle">Notes</h1>
            <div className="pageSubtitle">
              Create, edit, and delete notes. Autosave is enabled in the editor.
            </div>

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
            {/* ✅ Only ONE Dashboard button on this page (header only) */}
            <Button variant="ghost" onClick={() => nav("/dashboard")}>
              Dashboard
            </Button>

            <Button variant="ghost" onClick={loadNotes}>
              Refresh
            </Button>

            <Button onClick={createNewNote}>+ New note</Button>
          </div>
        </div>

        {/* ================= Page Body ================= */}

        <div className="pageBody">
          <div className="notesGrid">
            {/* -------- Notes List -------- */}
            <Card title="Your notes" subtitle="Select a note to edit.">
              {myNotes.length === 0 ? (
                <div className="muted">No notes yet.</div>
              ) : (
                <div className="notesList">
                  {myNotes.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`notesRow ${
                        selectedId === n.id ? "isActive" : ""
                      }`}
                      onClick={() => setSelectedId(n.id)}
                    >
                      <div className="notesRowMain">
                        <div className="notesTitle">{n.title}</div>
                        <div className="muted notesMeta">
                          Updated: {String(n.updatedAt).slice(0, 16)}
                        </div>
                      </div>

                      <div className="notesRowActions">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(n.id);
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

            {/* -------- Editor -------- */}
            <Card title="Editor" subtitle="Autosaves when you type.">
              {selected ? (
                <NoteEditor key={selected.id} note={selected} />
              ) : (
                <div className="muted">Select a note to edit.</div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ Floating AI Chatbot (bottom-left). Rendered outside the panel so it doesn't take page space. */}
      <SproutSection subtitle="Quick access to AI Chatbot while writing notes." />

      {/* ================= Styles ================= */}
      <style>{`
        .notesGrid{
          display:grid;
          gap:16px;
          grid-template-columns: 420px minmax(0, 1fr);
          align-items:start;
        }

        .notesList{
          display:grid;
          gap:10px;
        }

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

        .notesRow:hover{
          background: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }

        body.light .notesRow:hover{
          background: rgba(0,0,0,0.04);
        }

        .notesRow.isActive{
          background: rgba(122,162,255,0.12);
          border-color: rgba(122,162,255,0.35);
        }

        body.light .notesRow.isActive{
          background: rgba(122,162,255,0.16);
          border-color: rgba(80,120,255,0.35);
        }

        .notesRowMain{
          min-width:0;
          flex:1;
        }

        .notesTitle{
          font-weight:900;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }

        .notesMeta{
          font-size:12px;
          margin-top:4px;
        }

        .notesRowActions{
          flex:0 0 auto;
          display:flex;
          justify-content:flex-end;
        }

        @media (max-width: 900px){
          .notesGrid{
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 420px){
          .notesRow{
            padding:10px;
            border-radius:12px;
          }
        }
      `}</style>
    </div>
  );
}