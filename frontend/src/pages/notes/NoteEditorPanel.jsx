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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema } from '../../validation/notesSchemas';

function isHtmlEffectivelyEmpty(html) {
  const textOnly = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?p[^>]*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();

  return textOnly.length === 0;
}

export default function NoteEditorPanel({
  initialTitle,
  initialContent,
  mode = 'create',
  saving,
  onSave,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(noteSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: initialTitle || '',
      content: initialContent || '',
    },
  });

  const title = watch('title');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class:
          `sprout-input min-h-[220px] max-h-[400px] overflow-y-auto break-all whitespace-pre-wrap ` +
          `${errors.content ? 'sprout-input-error' : ''}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML() || '';
      setValue('content', html, { shouldValidate: true, shouldDirty: true });

      if (isHtmlEffectivelyEmpty(html)) {
        setError('content', {
          type: 'manual',
          message: 'Note cannot be empty',
        });
      } else {
        clearErrors('content');
      }
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
        className={`sprout-toolbar-btn ${
          active ? 'sprout-toolbar-btn-active' : ''
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {children}
      </button>
    );
  }

  useEffect(() => {
    setValue('title', initialTitle || '', { shouldDirty: false });
    setValue('content', initialContent || '', { shouldDirty: false });

    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent || '');
    }
  }, [initialTitle, initialContent, editor, setValue]);

  const onSubmit = (data) => {
    if (isHtmlEffectivelyEmpty(data.content || '')) {
      setError('content', { type: 'manual', message: 'Note cannot be empty' });
      return;
    }

    onSave({
      title: data.title.trim(),
      content: data.content || '',
    });
  };

  if (!editor) return null;

  return (
    <section className="sprout-paper p-6 rounded-2xl">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Title */}
        <div>
          <input
            className={`sprout-input text-[16px] text-amber-900/95 placeholder:text-amber-900/45 ${
              errors.title ? 'sprout-input-error' : ''
            }`}
            placeholder="Note title..."
            maxLength={120}
            disabled={saving || isSubmitting}
            {...register('title')}
          />
          <p className="sprout-error-text min-h-[18px]">
            {errors.title?.message || ''}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex max-w-fit flex-wrap items-center justify-center gap-3 mx-auto rounded-2xl border-2 border-yellow-300 bg-gradient-to-b from-yellow-100 to-yellow-50 p-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] dark:border-white/10 dark:from-[rgba(45,37,22,0.96)] dark:to-[rgba(30,25,15,0.92)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.28)]">
          <div className="flex gap-2 rounded-xl border border-yellow-200 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-white/5">
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

          <div className="h-7 w-px bg-yellow-300/80 dark:bg-white/10" />

          <div className="flex gap-2 rounded-xl border border-yellow-200 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-white/5">
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

          <div className="h-7 w-px bg-yellow-300/80 dark:bg-white/10" />

          <div className="flex gap-2 rounded-xl border border-yellow-200 bg-white/60 px-2 py-1 dark:border-white/10 dark:bg-white/5">
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
        <div>
          <EditorContent editor={editor} />
          <p className="sprout-error-text min-h-[18px]">
            {errors.content?.message || ''}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={saving || isSubmitting}
            className="sprout-btn-success px-5 py-2 text-[16px]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving || isSubmitting}
            className="sprout-btn-muted px-5 py-2 text-[16px]"
          >
            Cancel
          </button>

          <div className="ml-auto text-[14px] text-amber-900/60 dark:text-[#efe4c7]/60">
            {mode === 'edit' ? 'Editing existing note' : 'Creating new note'}
          </div>
        </div>
      </form>
    </section>
  );
}
