import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function NoteEditorPanel({
  initialTitle,
  initialContent,
  mode = 'create',
  saving,
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class:
          'w-full rounded-xl border-2 border-yellow-400/70 bg-white/85 px-4 py-3 text-[16px] text-amber-900/95 min-h-[220px] focus:outline-none max-w-none',
      },
    },
  });

  function ToolbarButton({ active, onClick, children }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-3 py-1 rounded-lg text-sm border transition font-medium
        ${
          active
            ? 'bg-yellow-300 border-yellow-500 text-amber-900'
            : 'bg-white border-yellow-300 text-amber-900'
        }`}
      >
        {children}
      </button>
    );
  }

  // Sync when editing existing note
  useEffect(() => {
    setTitle(initialTitle || '');
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialTitle, initialContent, editor]);

  const submit = (e) => {
    e.preventDefault();
    const content = editor?.getHTML() || '';
    onSave({ title, content });
  };

  if (!editor) return null;

  return (
    <section className="p-6 rounded-2xl bg-[#FFF9E8] border-4 border-yellow-400 shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <form className="grid gap-4" onSubmit={submit}>
        {/* Title */}
        <input
          className="w-full rounded-xl border-2 border-yellow-400/70 bg-white/85 px-4 py-3 text-[16px] outline-none text-amber-900/95 placeholder:text-amber-900/45"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          maxLength={120}
          disabled={saving}
        />

        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap bg-yellow-50 border border-yellow-300 rounded-xl p-2 shadow-inner">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Numbered
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('heading', { level: 1 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive('heading', { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </ToolbarButton>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl border-2 border-green-700/70 bg-green-500/95 text-white text-[16px] hover:-translate-y-[1px] transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-5 py-2 rounded-xl border-2 border-zinc-300/90 bg-zinc-200/90 text-zinc-900/95 text-[16px] hover:-translate-y-[1px] transition disabled:opacity-60 disabled:hover:translate-y-0"
          >
            Cancel
          </button>

          <div className="ml-auto text-[14px] text-amber-900/60">
            {mode === 'edit' ? 'Editing existing note' : 'Creating new note'}
          </div>
        </div>
      </form>
    </section>
  );
}
