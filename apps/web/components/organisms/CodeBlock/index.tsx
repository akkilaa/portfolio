'use client'

import { useState } from 'react'

interface CodeBlockProps {
  lang: string
  file?: string
  code: string
}

const CodeBlock = ({ lang, file, code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="relative bg-[#050505] border border-[var(--border)] rounded-[10px] my-[1.6em] overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[color-mix(in_oklab,#050505_80%,var(--accent)_4%)] border-b border-[var(--border)]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#888] tracking-[0.04em]">
          <span className="text-[var(--accent)]">●</span> {lang}
          {file && <> · {file}</>}
        </span>
        <button
          onClick={copy}
          className="font-[family-name:var(--font-mono)] text-[11px] text-[#888] px-2 py-1 border border-[#2a2a2a] rounded-[4px] transition-[color,border-color] duration-150 hover:text-[var(--accent)] hover:border-[var(--accent)]"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre className="m-0 px-[18px] py-4 overflow-x-auto font-[family-name:var(--font-mono)] text-[13.5px] leading-[1.65] text-[#e8e8e8]">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  )
}

export default CodeBlock
