import NoteCard from "./NoteCard";

export default function NotesGrid({ notes, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="py-8 text-amber-900/70">Loading notes...</div>;
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="py-8 text-amber-900/70">
        <div className="max-w-[520px] p-5 rounded-xl border-2 border-yellow-400/70 bg-yellow-100/60 shadow-[0_14px_24px_rgba(0,0,0,0.10)]">
          <h3 className="m-0 mb-2 text-amber-900/95">Welcome!</h3>
          <p className="m-0">
            Click the + button to add your first note. Gecko is here to help you stay organized!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(360px,1fr))] items-start">
      {notes.map((note, idx) => (
        <NoteCard
          key={note.id}
          note={note}
          variant={(idx % 3) + 1}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}