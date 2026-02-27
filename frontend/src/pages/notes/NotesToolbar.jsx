export default function NotesToolbar({ onAdd }) {
  return (
    <div className="mt-2 mb-5">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-3 px-7 py-4 rounded-xl border-2 border-green-700/70 bg-green-500/95 text-white text-[18px]
                   shadow-[0_14px_24px_rgba(0,0,0,0.14)] hover:-translate-y-[1px] transition"
      >
        <span className="text-[22px] leading-none">+</span>
        <span>Add New Note</span>
      </button>
    </div>
  );
}