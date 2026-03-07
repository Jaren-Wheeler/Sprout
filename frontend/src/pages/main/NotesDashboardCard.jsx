import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import DashboardEmptyState from "./DashboardEmptyState";

import { getNotes } from "../../api/notes";

export default function NotesDashboardCard() {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {

      const data = await getNotes();

      // newest first
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotes(sorted);

    } catch (err) {
      console.error("Notes dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardCard title="Notes" route="/notes">
        Loading...
      </DashboardCard>
    );
  }

  if (!notes.length) {
    return (
      <DashboardCard title="Notes" route="/notes">
        <DashboardEmptyState message="No notes yet" />
      </DashboardCard>
    );
  }

  const previewNotes = notes.slice(0, 4);

  const rotations = [
    "rotate-[-1deg]",
    "rotate-[1deg]",
    "rotate-[0.5deg]",
    "rotate-[-0.5deg]"
  ];

  const colors = [
    "bg-yellow-100 border-yellow-300",
    "bg-amber-100 border-amber-300",
    "bg-orange-100 border-orange-300",
    "bg-yellow-200 border-yellow-400"
  ];

  return (
    <DashboardCard title="Notes" route="/notes">

      <div className="grid grid-cols-2 gap-3 h-full">

        {previewNotes.map((note, index) => (

          <div
            key={note.id}
            className={`
              flex items-center justify-center
              text-center text-sm font-medium
              p-2 rounded-lg border shadow-sm
              ${colors[index % colors.length]}
              ${rotations[index % rotations.length]}
              truncate
            `}
          >
            {note.title || "Untitled"}
          </div>

        ))}

      </div>

    </DashboardCard>
  );
}