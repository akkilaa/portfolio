'use client'

import { useState } from 'react'

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] transition-colors duration-150 hover:text-[var(--accent)] cursor-pointer"
    >
      {copied ? 'copied!' : 'copy'}
    </button>
  )
}
