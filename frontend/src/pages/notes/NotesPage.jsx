import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import SproutModal from '@/components/ui/SproutModal';
import { sendChatMessage } from '../../api/chatbot';
import sproutLogo from '../../assets/Logo.png';
import Sprout from '../../components/chatbot/Sprout';
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
    <div className="min-h-screen bg-[#F3EED9] text-[#3B2F2F]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Link to="/dashboard">
              <img src={sproutLogo} className="h-20" alt="Sprout logo" />
            </Link>
            My Notes
          </h1>

          <p className="text-[#6B5E5E]">Take some notes!</p>
        </header>

        <NotesToolbar onAdd={openCreate} />

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-200/50 border border-red-400/40 text-red-900/95">
            {error}
          </div>
        )}

        {/* EDITOR MODAL */}
        {editorOpen && (
          <SproutModal onClose={closeEditor} maxWidth="max-w-[560px]">
            <NoteEditorPanel
              initialTitle={editingNote?.title || ''}
              initialContent={editingNote?.content || ''}
              saving={saving}
              mode={isEditing ? 'edit' : 'create'}
              onSave={handleSave}
              onCancel={closeEditor}
            />
          </SproutModal>
        )}

        <NotesGrid
          notes={notes}
          loading={loading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />

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

        <Sprout onSend={sendChatMessage} />
      </div>
    </div>
  );
}
