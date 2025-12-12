'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'

// Dynamically import to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="w-full">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragBar={false}
        height={400}
        textareaProps={{
          placeholder: placeholder || 'Write your content here... Use the toolbar buttons above to format your text, or use markdown syntax like **bold** and *italic*.',
        }}
      />
      <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
        <p className="mb-1.5 font-semibold">Formatting Tips:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Click toolbar buttons for formatting (Bold, Italic, Headings, Lists, etc.)</li>
          <li>Or use markdown: <code className="bg-white px-1 rounded">**bold**</code>, <code className="bg-white px-1 rounded">*italic*</code>, <code className="bg-white px-1 rounded"># Heading</code></li>
          <li>Press Enter twice to create a new paragraph</li>
        </ul>
      </div>
    </div>
  )
}

