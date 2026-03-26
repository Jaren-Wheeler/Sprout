import { useMemo, useState } from 'react';
import background from '../../assets/bg.png';
import AppLayout from '../../components/AppLayout';
import ConfirmModal from '../../components/ui/ConfirmModal';
import NoteEditorPanel from './NoteEditorPanel';
import NotesGrid from './NotesGrid';
import NotesToolbar from './NotesToolbar';
import { useNotes } from './useNotes';
import { useTheme } from '../../theme/ThemeContext';

export default function NotesPage() {
  const { theme } = useTheme();
  const { notes, loading, error, setError, add, edit, remove } = useNotes();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

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

  const handleDelete = (id) => {
    setConfirmingId(id);
  };

  const confirmDelete = async () => {
    const id = confirmingId;
    setConfirmingId(null);
    setError('');
    try {
      await remove(id);
      if (editingNote?.id === id) closeEditor();
    } catch (e) {
      setError(e?.message || 'Failed to delete note');
    }
  };

  return (
    <div
      className="sprout-app-shell"
      style={{
        backgroundImage:
          theme === 'dark'
            ? `radial-gradient(circle at 18% 14%, rgba(212, 178, 116, 0.08), transparent 20%), radial-gradient(circle at 82% 78%, rgba(145, 114, 72, 0.06), transparent 18%), repeating-linear-gradient(-18deg, rgba(255,248,228,0.015) 0 2px, rgba(255,248,228,0) 2px 13px), linear-gradient(180deg, #040506 0%, #0a0b0d 52%, #12100d 100%)`
            : `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})`,
        backgroundRepeat: theme === 'dark' ? 'no-repeat, no-repeat, repeat, no-repeat' : 'no-repeat, no-repeat',
        backgroundSize: theme === 'dark' ? 'auto, auto, 220px 220px, cover' : 'auto, cover',
        backgroundPosition: theme === 'dark' ? 'center, center' : 'center, center top',
      }}
    >
      <div className="sprout-page-wrap">
        <AppLayout title="Notes">
          <div className="space-y-6">
            <section className="sprout-page-hero">
              <div className="relative z-10">
                <div>
                  <span className="sprout-page-kicker">Notes hub</span>
                  <h1 className="sprout-page-title">My Notes</h1>
                  <p className="sprout-page-description">
                    A cleaner workspace for quick capture, loose ideas, and drafts that still feel pinned to paper.
                  </p>
                </div>
              </div>
            </section>

            <section className="sprout-surface p-5 md:p-6">
              <NotesToolbar onAdd={openCreate} />

              {error && (
                <div className="mb-4 mt-4 rounded-2xl border border-red-400/30 bg-red-100/60 px-4 py-3 text-red-900/95">
                  {error}
                </div>
              )}

              {editorOpen && (
                <div className="sprout-modal-backdrop">
                  <div className="absolute inset-0" onClick={closeEditor} />
                  <div className="relative z-10 mx-4 w-full max-w-[560px] animate-scaleIn">
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

              <div className="mt-6">
                <NotesGrid
                  notes={notes}
                  loading={loading}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            </section>

            {confirmingId && (
              <ConfirmModal
                title="Delete Note"
                message="Are you sure you want to delete this note? This cannot be undone."
                confirmText="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmingId(null)}
              />
            )}
          </div>
        </AppLayout>
      </div>
    </div>
  );
}
