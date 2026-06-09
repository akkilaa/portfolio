'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const MarkdownEditor = ({
  value,
  onChange,
  label = 'description (markdown)',
}: MarkdownEditorProps) => {
  const [preview, setPreview] = useState(false)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    onChange(el.value.slice(0, start) + '  ' + el.value.slice(end))
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2
    })
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] uppercase tracking-wider">
          {label}
        </span>
        <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
          {(['edit', 'preview'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPreview(mode === 'preview')}
              className={`px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] transition-colors ${
                (mode === 'preview') === preview
                  ? 'bg-[var(--accent)] text-[var(--on-accent)]'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {preview ? (
        <div className="min-h-96 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-5 prose prose-invert prose-sm max-w-none text-[var(--text)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '_nothing yet_'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="w-full min-h-96 bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[var(--text-bright)] leading-relaxed resize-y transition-[border-color] duration-150 focus:outline-none focus:border-[var(--accent)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      )}
    </div>
  )
}

export default MarkdownEditor
