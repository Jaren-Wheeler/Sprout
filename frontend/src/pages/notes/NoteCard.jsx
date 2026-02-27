const VARIANTS = [
  { bg: "bg-violet-200/55", rotate: -1.2 },
  { bg: "bg-rose-200/55", rotate: 0.8 },
  { bg: "bg-yellow-200/60", rotate: -0.4 }
];

function formatDate(value) {
  try {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function NoteCard({ note, variant = 1, onOpen, onDelete }) {
  const v = VARIANTS[(variant - 1) % VARIANTS.length];

  return (
    <article
      className={`relative rounded-xl border-2 border-yellow-400/90 p-5
                  shadow-[0_18px_30px_rgba(0,0,0,0.12)] cursor-pointer overflow-hidden
                  hover:-translate-y-[2px] transition ${v.bg}`}
      style={{ transform: `rotate(${v.rotate}deg)` }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
    >


      {/* Fixed card height layout */}
      <div className="h-[170px] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="m-0 text-[20px] text-amber-900/95 line-clamp-1">
            {note.title}
          </h3>

          <div className="text-[12px] text-amber-900/60 whitespace-nowrap pt-1">
            {formatDate(note.updatedAt || note.createdAt)}
          </div>
        </div>

        <div className="text-[14px] leading-relaxed text-amber-800/95 line-clamp-4">
          {note.content ? note.content : <span className="opacity-60">No content</span>}
        </div>

        {/* Footer pinned to bottom */}
        <div className="mt-auto pt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            className="px-3 py-2 rounded-xl border border-red-700/30 bg-white/50 text-red-800/90 text-[13px]
                       hover:bg-white/75 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}