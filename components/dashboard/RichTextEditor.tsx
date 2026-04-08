'use client'
import { TextStyle } from '@tiptap/extension-text-style' // Note: Used 'TextStyle' instead of 'TextStyleKit' in modern tiptap
import { useEditor, useEditorState, EditorContent, mergeAttributes } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Highlight } from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Image from "@tiptap/extension-image"
import Heading from '@tiptap/extension-heading'
import Blockquote from '@tiptap/extension-blockquote'
import { useCallback, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Highlighter,
  Link as Link2,
  Unlink,
  Image as Image2
} from 'lucide-react'


interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      Image.configure({
        HTMLAttributes: {
          class: 'w-full p-10 h-[500px] object-fit rounded-md'
        }
      }),
      Blockquote.configure({
        HTMLAttributes: {
          // Changed bg-sky-700 back to bg-gray-800 for consistency with your other dark theme elements
          class: 'border-l-4 border-slate-600 pl-4 italic bg-gray-800 text-slate-300 my-2 rounded-md p-2' 
        }
      }),
      // --- Custom Heading Configuration with Classes ---
      Heading.configure({ levels: [1, 2, 3, 4] }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          const classes = {
            1: 'text-3xl font-bold mt-4 mb-2',
            2: 'text-2xl font-semibold mt-3 mb-1.5',
            3: 'text-xl font-medium mt-2 mb-1',
            4: 'text-lg font-normal mt-1 mb-0.5',
          };
          return [
            `h${level}`, // Renders the correct h1, h2, etc. tag
            mergeAttributes(HTMLAttributes, {
              // Fixed the TypeScript key access here
              class: classes[level as keyof typeof classes] 
            }),
            0
          ];
        }
      }),
      StarterKit.configure({
        // Disable default starterkit heading and blockquote as we configured them separately
        heading: false, // Disable default heading to use custom one
        blockquote: false, // Disable default blockquote to use custom one
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          }
        },
        orderedList: {
          HTMLAttributes: {
             class: "list-decimal ml-3"
          }
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-slate-400 rounded-sm p-0.5"
        }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          class: 'text-blue-800 underline cursor-pointer font-semibold'
        }
      }),
      TextStyle // Using 'TextStyle' instead of 'TextStyleKit'
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'min-h-[150px] border border-slate-600 px-3 p-1 outline-none bg-slate-900 rounded-md text-white'
      }
    },
    onUpdate: () => {
      const html = editor?.getHTML();
      onChange(html || '');
    },
    immediatelyRender: false,
  });

  // Sync external content changes to the editor
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);


  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link')?.href;
    const url = window.prompt('URL', previousUrl);

    // Cancelled
    if(url === null) return;

    // Empty url
    if(url === ''){
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return
    }

    // Update link
    try {
      editor?.chain().focus().extendMarkRange('link').setLink({href: url}).run();
    } catch (error) {
      alert(error);
    }

  }, [editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive('link') ?? false,
      isBold: ctx.editor?.isActive('bold') ?? false,
      canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor?.isActive('italic') ?? false,
      canItalic: ctx.editor?.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor?.isActive('strike') ?? false,
      canStrike: ctx.editor?.can().chain().toggleStrike().run() ?? false,
      isHighlight: ctx.editor?.isActive('highlight') ?? false,
      canHighlight: ctx.editor?.can().chain().toggleHighlight().run() ?? false,
      isParagraph: ctx.editor?.isActive('paragraph') ?? false,
      isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
      isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
      isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
      isHeading4: ctx.editor?.isActive('heading', { level: 4 }) ?? false,
      isBulletList: ctx.editor?.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
      isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
      canUndo: ctx.editor?.can().chain().undo().run() ?? false,
      canRedo: ctx.editor?.can().chain().redo().run() ?? false,
    }),
  });

  if (!editor) return null

  return (
    <div>
      <div className="flex gap-x-1 bg-gray-800 rounded-md p-1">
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState?.canBold}
          className={editorState?.isBold ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          <Bold size={16} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState?.canItalic}
          className={editorState?.isItalic ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          <Italic size={16} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState?.canStrike}
          className={editorState?.isStrike ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          
          <Strikethrough size={16} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState?.isParagraph ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          P
        </button>

         <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState?.isHeading1 ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          H1
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState?.isHeading2 ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          H2
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState?.isHeading3 ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          H3
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editorState?.isHeading4 ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          H4
        </button>
        <button 
        type='button'
        onClick={() => editor.chain().focus().toggleHighlight().run()} 
        className={editorState?.isHighlight ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'} >
          <Highlighter size={16}/>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState?.isBulletList ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          <List size={16} />
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState?.isOrderedList ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          <ListOrdered size={16} />
        </button>
        
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState?.isBlockquote ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'}
        >
          <Quote size={16} />
        </button>

         <button 
        type='button'
        onClick={setLink} 
        className={editorState?.isLink ? 'bg-sky-800 px-1 rounded-sm' : 'px-1'} >
          <Link2 size={16} />
        </button>
        <button 
        type='button'
        onClick={() => editor?.chain().focus().unsetLink().run()}
        disabled={!editorState?.isLink}>
          <Unlink size={16} />
        </button>
         <CldUploadWidget
          uploadPreset="blog-app"
          onSuccess={(results) => {
             if(typeof results.info === "object" && "secure_url" in results.info){
                const imageUrl = results?.info?.secure_url as string;
                editor.chain().focus().setImage({src: imageUrl}).run();
             }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              className='ml-0.5'
              onClick={(e) => {
                e.preventDefault()
                open()
              }}
            >
              <Image2 size={16} />
            </button>
          )}
        </CldUploadWidget>

        <button
          type='button'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState?.canUndo}
          className={!editorState?.canUndo ? 'opacity-50 px-1 rounded-sm cursor-not-allowed' : 'px-1'}
        >
          <Undo2 size={16} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState?.canRedo}
          className={!editorState?.canRedo ? 'opacity-50 px-1 rounded-sm cursor-not-allowed' : 'px-1'}
        >
          <Redo2 size={16} />
        </button>
      </div>
      <EditorContent editor={editor} className='mt-2' />
    </div>
  )
}
