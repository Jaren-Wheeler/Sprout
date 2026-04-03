import { useCallback, useEffect, useState } from 'react';
import { createNote, deleteNote, getNotes, updateNote } from '../../api/notes';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotes = useCallback(async (options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      setLoading(true);
    }

    setError('');

    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || 'Failed to load notes');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const add = useCallback(async (payload) => {
    setError('');
    const created = await createNote(payload);
    setNotes((prev) => [created, ...prev]);
    return created;
  }, []);

  const edit = useCallback(async (id, payload) => {
    setError('');
    const updated = await updateNote(id, payload);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    setError('');
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notes,
    loading,
    error,
    setError,
    add,
    edit,
    remove,
    loadNotes,
  };
}
