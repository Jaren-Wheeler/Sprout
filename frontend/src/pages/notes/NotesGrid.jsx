import NoteCard from './NoteCard';

export default function NotesGrid({ notes, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="py-8 text-amber-900/70">
        Loading notes...
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="py-8 text-amber-900/70">
        <div className="sprout-paper max-w-[520px] p-5">
          <h3 className="mb-2 text-amber-900/95">
            Welcome!
          </h3>
          <p>Click the + button to add your first note.</p>
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
          onOpen={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}