import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

export default function NotesDashboardCard() {

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await fetch("/api/notes/recent");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardCard title="Notes" route="/notes">

      {notes.length ? (
        <ul>
          {notes.slice(0,3).map(note => (
            <li key={note.id}>{note.title}</li>
          ))}
        </ul>
      ) : (
        <p>No notes yet</p>
      )}

    </DashboardCard>
  );
}