'use client'

import { useEffect, useRef, useState } from 'react'

interface RichTextEditorProps {
  initialValue?: string
  onChange?: (content: string) => void
  placeholder?: string
}

declare global {
  interface Window {
    Editor: any
    StarterKit: any
    Image: any
    Link: any
    TextAlign: any
    Underline: any
  }
}

export default function RichTextEditor({
  initialValue = '',
  onChange,
  placeholder = 'Write something amazing...'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const editorInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Load Tiptap from CDN
    const loadTiptap = async () => {
      // Add Tiptap CSS
      const styleLink = document.createElement('link')
      styleLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css'
      styleLink.rel = 'stylesheet'
      document.head.appendChild(styleLink)

      // Add dependencies
      const dependencies = [
        'https://cdn.jsdelivr.net/npm/@tiptap/core@2.1.13/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@tiptap/starter-kit@2.1.13/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@tiptap/extension-image@2.1.13/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@tiptap/extension-link@2.1.13/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@tiptap/extension-text-align@2.1.13/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@tiptap/extension-underline@2.1.13/dist/index.js',
      ]

      for (const src of dependencies) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = src
          script.async = true
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }

      // Initialize Tiptap
      if (editorRef.current && !editorInstanceRef.current) {
        const editor = new window.Editor({
          element: editorRef.current,
          extensions: [
            window.StarterKit,
            window.Image.configure({
              HTMLAttributes: {
                class: 'max-w-full h-auto rounded-lg',
              },
            }),
            window.Link.configure({
              openOnClick: false,
              HTMLAttributes: {
                class: 'text-purple-600 underline hover:text-purple-800',
              },
            }),
            window.TextAlign.configure({
              types: ['heading', 'paragraph'],
            }),
            window.Underline,
          ],
          content: initialValue,
          onUpdate: ({ editor }: { editor: any }) => {
            const content = editor.getHTML()
            onChange?.(content)
          },
          editorProps: {
            attributes: {
              class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
            },
          },
        })

        editorInstanceRef.current = editor
        setIsLoaded(true)
      }
    }

    loadTiptap()

    // Cleanup
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
        editorInstanceRef.current = null
      }
    }
  }, [initialValue, onChange])

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Toolbar will be rendered by Tiptap */}
      </div>
      <div ref={editorRef} className="bg-white" />
      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          padding: 1rem;
          outline: none;
        }
        .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding: 0 1rem;
        }
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          line-height: 1.1;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          color: #616161;
          padding: 0.2em;
          border-radius: 3px;
        }
        .ProseMirror pre {
          background: #0D0D0D;
          color: #FFF;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
        .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .ProseMirror blockquote {
          padding-left: 1rem;
          border-left: 2px solid rgba(13, 13, 13, 0.1);
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid rgba(13, 13, 13, 0.1);
          margin: 2rem 0;
        }
      `}</style>
    </div>
  )
} 