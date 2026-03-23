import Sprout from '@/components/chatbot/Sprout';
import { useMemo, useState } from 'react';
import { sendChatMessage } from '../../api/chatbot';
import background from '../../assets/bg.png';
import notepadBg from '../../assets/notepad.png';
import AppLayout from '../../components/AppLayout';
import ConfirmModal from '../../components/ui/ConfirmModal';
import NoteEditorPanel from './NoteEditorPanel';
import NotesGrid from './NotesGrid';
import NotesToolbar from './NotesToolbar';
import { useNotes } from './useNotes';

export default function NotesPage() {
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
    5;

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
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <AppLayout>
        <div
          className="min-h-screen p-10 bg-cover bg-center flex justify-center"
          style={{
            backgroundImage: `url(${notepadBg})`,
            // If you want to force specific stretching:
            backgroundSize: '100% 100%',
          }}
        >
          {/* The "Page" Area Wrapper */}
          <div className="w-full max-w-3xl h-auto p-12 mt-10 rounded-r-lg shadow-sm">
            {/* Your content goes here */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-amber-900">My Notes</h2>
              <p className="text-amber-800/60">Take some notes!</p>
            </div>

            <NotesToolbar onAdd={openCreate} />

            {error && (
              <div className="mt-3 mb-4 px-4 py-3 rounded-xl bg-red-200/50 border border-red-400/40 text-red-900/95">
                {error}
              </div>
            )}

            {/* EDITOR MODAL */}
            {editorOpen && (
              <div className="sprout-modal-backdrop">
                <div className="absolute inset-0" onClick={closeEditor} />
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
          {/* CONFIRM DELETE MODAL */}
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

      <Sprout onSend={sendChatMessage} />
    </div>
  );
}
