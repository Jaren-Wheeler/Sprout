import { useCallback, useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../../api/notes";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (payload) => {
    setError("");
    const created = await createNote(payload);
    setNotes((prev) => [created, ...prev]);
    return created;
  }, []);

  const edit = useCallback(async (id, payload) => {
    setError("");
    const updated = await updateNote(id, payload);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    setError("");
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notes, loading, error, setError, reload: load, add, edit, remove };
}