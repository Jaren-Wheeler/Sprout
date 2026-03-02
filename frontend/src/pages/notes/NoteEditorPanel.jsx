import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from 'lucide-react';

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
          'w-full rounded-xl border-2 border-yellow-400/70 bg-white/85 px-4 py-3 text-[16px] text-amber-900/95 min-h-[220px] max-h-[400px] overflow-y-auto break-all whitespace-pre-wrap focus:outline-none',
      },
    },
  });

  const [, setEditorState] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setEditorState((s) => s + 1);

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  function ToolbarButton({ active, onClick, disabled, children }) {
    return (
      <button
        type="button"
        disabled={disabled}
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`
        relative px-3 py-2 rounded-xl text-[14px] font-semibold
        border-2 transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-yellow-400/60
        active:translate-y-[1px]
        ${
          active
            ? `
              bg-yellow-400
              border-yellow-500
              text-amber-950
              shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]
            `
            : `
              bg-white
              border-yellow-300
              text-amber-900
              hover:bg-yellow-100
              hover:border-yellow-400
              hover:-translate-y-[1px]
              shadow-sm
            `
        }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
      >
        {children}
      </button>
    );
  }

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
        <div
          className="
  flex flex-wrap justify-center items-center gap-3
  max-w-fit mx-auto
  bg-gradient-to-b from-yellow-100 to-yellow-50
  border-2 border-yellow-300
  rounded-2xl
  p-3
  shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)]
"
        >
          {/* TEXT FORMATTING GROUP */}
          <div className="flex gap-2 px-2 py-1 bg-white/60 rounded-xl border border-yellow-200">
            <ToolbarButton
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </ToolbarButton>
          </div>

          {/* DIVIDER */}
          <div className="w-px h-7 bg-yellow-300/80" />

          {/* LIST GROUP */}
          <div className="flex gap-2 px-2 py-1 bg-white/60 rounded-xl border border-yellow-200">
            <ToolbarButton
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={16} />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={16} />
            </ToolbarButton>
          </div>

          {/* DIVIDER */}
          <div className="w-px h-7 bg-yellow-300/80" />

          {/* HEADINGS GROUP */}
          <div className="flex gap-2 px-2 py-1 bg-white/60 rounded-xl border border-yellow-200">
            <ToolbarButton
              active={editor.isActive('heading', { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 size={16} />
            </ToolbarButton>

            <ToolbarButton
              active={editor.isActive('heading', { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={16} />
            </ToolbarButton>
          </div>
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
