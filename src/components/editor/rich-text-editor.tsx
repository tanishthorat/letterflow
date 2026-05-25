"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  Heading1,
  Heading2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
}

export function RichTextEditor({ content, onChange, readOnly = false, className, style }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }).extend({
        inclusive: false
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn('focus:outline-none w-full min-h-[40px]', className),
      },
    },
    immediatelyRender: false,
  })

  // Update editor content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly)
    }
  }, [readOnly, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full group relative" style={style}>
      {editor && !readOnly && (
        <BubbleMenu editor={editor} className="flex items-center gap-1 p-1 bg-popover text-popover-foreground border border-border shadow-md rounded-md z-50">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive('bold') && "bg-muted")}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive('italic') && "bg-muted")}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive('underline') && "bg-muted")}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive('strike') && "bg-muted")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href
              const url = window.prompt('URL', previousUrl)
              if (url === null) return
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                return
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive('link') && "bg-muted text-blue-500")}
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} className={cn("w-full outline-none", readOnly && "pointer-events-none")} />
    </div>
  )
}
