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

  const colors = [
    "bg-[rgba(255,243,191,0.9)] border-[rgba(224,190,78,0.62)]",
    "bg-[rgba(252,239,199,0.88)] border-[rgba(214,177,98,0.52)]",
    "bg-[rgba(251,236,209,0.88)] border-[rgba(209,163,110,0.48)]",
    "bg-[rgba(255,245,205,0.92)] border-[rgba(226,192,86,0.56)]"
  ];

  return (
    <DashboardCard title="Notes" route="/notes">
      <div className="grid grid-cols-2 gap-3 h-full">
        {previewNotes.map((note, index) => (
          <div
            key={note.id}
            className={`flex min-h-[86px] items-center justify-center rounded-xl border px-3 py-2 text-center text-sm font-medium text-[#6a3914] shadow-[0_10px_18px_rgba(90,48,18,0.08)] ${colors[index % colors.length]}`}
          >
            <span className="line-clamp-2">{note.title || "Untitled"}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
