import DOMPurify from 'dompurify';
import { Trash2 } from 'lucide-react';

const VARIANTS = [
  { bg: 'bg-violet-200/55', rotate: -1.2 },
  { bg: 'bg-rose-200/55', rotate: 0.8 },
  { bg: 'bg-yellow-200/60', rotate: -0.4 },
];

function formatDate(value) {
  try {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function NoteCard({ note, variant = 1, onOpen, onDelete }) {
  const v = VARIANTS[(variant - 1) % VARIANTS.length];

  return (
    <article
      className={`sprout-note-card ${v.bg}`}
      style={{ transform: `rotate(${v.rotate}deg)` }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen();
      }}
    >
      <div className="h-[170px] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[20px] text-amber-900/95 line-clamp-1">
            {note.title}
          </h3>

          <div className="text-[12px] text-amber-900/60 whitespace-nowrap pt-1">
            {formatDate(note.updatedAt || note.createdAt)}
          </div>
        </div>
        <div className="text-[14px] leading-relaxed text-amber-800/95 line-clamp-4 [&>*]:m-0">
          {note.content ? (
            <div
              className="prose prose-sm !max-w-full w-full text-amber-800"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.content),
              }}
            />
          ) : (
            <span className="opacity-60">No content</span>
          )}
        </div>
        <div
          className="mt-auto pt-3 flex justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            className="sprout-icon-btn-danger "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
