import { useEffect, useState } from "react";

export default function NoteEditorPanel({
  initialTitle,
  initialContent,
  mode = "create",
  saving,
  onSave,
  onCancel
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent || "");

  useEffect(() => {
    setTitle(initialTitle || "");
    setContent(initialContent || "");
  }, [initialTitle, initialContent]);

  const submit = (e) => {
    e.preventDefault();
    onSave({ title, content });
  };

  return (
    <section className="p-5 rounded-2xl bg-white/45 border-4 border-emerald-300/70 shadow-[0_18px_34px_rgba(0,0,0,0.12)]">
      <form className="grid gap-4" onSubmit={submit}>
        <input
          className="w-full rounded-xl border-2 border-yellow-400/70 bg-white/85 px-4 py-3 text-[16px] outline-none text-amber-900/95
                     placeholder:text-amber-900/45"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          maxLength={120}
          disabled={saving}
        />

        <textarea
          className="w-full rounded-xl border-2 border-yellow-400/70 bg-white/85 px-4 py-3 text-[16px] outline-none text-amber-900/95
                     resize-y min-h-[170px] placeholder:text-amber-900/45"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={7}
          disabled={saving}
        />

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl border-2 border-green-700/70 bg-green-500/95 text-white text-[16px]
                       hover:-translate-y-[1px] transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-5 py-2 rounded-xl border-2 border-zinc-300/90 bg-zinc-200/90 text-zinc-900/95 text-[16px]
                       hover:-translate-y-[1px] transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            Cancel
          </button>

          <div className="ml-auto text-[14px] text-amber-900/60">
            {mode === "edit" ? "Editing existing note" : "Creating new note"}
          </div>
        </div>
      </form>
    </section>
  );
}