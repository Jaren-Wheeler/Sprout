import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useNotes } from './useNotes';
import NotesToolbar from './NotesToolbar';
import NotesGrid from './NotesGrid';
import NoteEditorPanel from './NoteEditorPanel';

export default function NotesPage() {
  const { notes, loading, error, setError, add, edit, remove } = useNotes();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => Boolean(editingNote?.id), [editingNote]);

  const openCreate = () => {
    setError('');
    setEditingNote(null);
    setEditorOpen(true);
  };

  const openEdit = (note) => {
    setError('');
    setEditingNote(note);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingNote(null);
  };

  const handleSave = async ({ title, content }) => {
    const t = title.trim();
    const c = content.trim();

    if (!t) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await edit(editingNote.id, { title: t, content: c });
      } else {
        await add({ title: t, content: c });
      }
      closeEditor();
    } catch (e) {
      setError(e?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this note?');
    if (!ok) return;

    setError('');
    try {
      await remove(id);
      if (editingNote?.id === id) closeEditor();
    } catch (e) {
      setError(e?.message || 'Failed to delete note');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EED9] px-7 py-7 pb-14">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="w-14 h-14 rounded-full grid place-items-center bg-white/60 border-2 border-yellow-400/60 text-amber-900 shadow-[0_10px_20px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition"
            aria-label="Back to dashboard"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div>
            <h1 className="m-0 text-[44px] leading-none text-amber-900/95 tracking-[0.5px]">
              My Notes
            </h1>
            <p className="m-0 text-[16px] text-orange-600/90">
              Take some notes!
            </p>
          </div>
        </div>
      </header>

      <NotesToolbar onAdd={openCreate} />

      {error ? (
        <div className="mt-3 mb-4 px-4 py-3 rounded-xl bg-red-200/50 border border-red-400/40 text-red-900/95">
          {error}
        </div>
      ) : null}

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* dark bg*/}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"
            onClick={closeEditor}
          />

          {/* notes editor */}
          <div className="relative z-10 w-full max-w-[560px] mx-4 animate-scaleIn">
            <NoteEditorPanel
              initialTitle={editingNote?.title || ''}
              initialContent={editingNote?.content || ''}
              saving={saving}
              mode={isEditing ? 'edit' : 'create'}
              onSave={handleSave}
              onCancel={closeEditor}
            />
          </div>
        </div>
      )}

      <NotesGrid
        notes={notes}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
