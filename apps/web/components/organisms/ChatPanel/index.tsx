'use client'

import './styles.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import Blip from '@/components/atoms/Blip'
import Chip from '@/components/atoms/Chip'
import ChatMessage, { TypingMessage, type Message } from '@/components/molecules/ChatMessage'

const SUGGESTIONS = [
  'what is your stack?',
  'are you available for hire?',
  'tell me about a recent project',
  'how do you self-host?',
]

const SEED: Message[] = [{ who: 'system', body: 'connected to akkila.dev — ask anything.' }]

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>(SEED)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages, busy])

  const send = useCallback(
    async (text?: string) => {
      const q = (text ?? input).trim()
      if (!q || busy) return
      setInput('')
      const next: Message[] = [...messages, { who: 'user', body: q }]
      setMessages(next)
      setBusy(true)

      let answer = ''
      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q, history: next }),
        })
        if (res.ok) {
          const data = (await res.json()) as { answer: string }
          answer = data.answer?.trim() ?? ''
        }
      } catch {
        answer = ''
      }

      if (!answer) {
        answer =
          "I'm offline right now — drop a note via the contact form below and akkila will get back fast."
      }

      setMessages((m) => [...m, { who: 'assistant', body: answer }])
      setBusy(false)
    },
    [input, busy, messages],
  )

  return (
    <div
      className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] flex flex-col min-h-[460px] shadow-[var(--shadow-card)]"
      id="chat"
    >
      {/* corner decorations */}
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 top-[-1px] left-[-1px] border-r-0 border-b-0" />
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 top-[-1px] right-[-1px] border-l-0 border-b-0" />
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 bottom-[-1px] left-[-1px] border-r-0 border-t-0" />
      <span className="absolute w-[10px] h-[10px] border border-[var(--accent)] opacity-50 bottom-[-1px] right-[-1px] border-l-0 border-t-0" />

      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-3.5">
        <div className="flex gap-1.5">
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
        </div>
        <span className="tracking-[0.04em] whitespace-nowrap">~/ask-me.sh</span>
        <span className="flex items-center gap-1.5">
          <Blip size={6} />
          ready
        </span>
      </div>

      <div
        className="chat-thread flex-1 overflow-y-auto flex flex-col gap-3.5 pt-1 px-1 pb-3 min-h-[240px] max-h-[340px]"
        ref={threadRef}
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {busy && <TypingMessage />}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-2.5 pb-3 border-t border-dashed border-[var(--border)]">
        {SUGGESTIONS.map((s) => (
          <Chip key={s} label={s} onClick={() => send(s)} disabled={busy} />
        ))}
      </div>

      <form
        className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] py-2.5 px-3 transition-[border-color] duration-150 focus-within:border-[var(--accent)]"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <span
          className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]"
          aria-hidden="true"
        >
          ›
        </span>
        <input
          className="flex-1 font-[family-name:var(--font-mono)] text-[13.5px] w-full text-[var(--text-bright)] bg-transparent border-none outline-none placeholder:text-[var(--text-faint)]"
          aria-label="Ask about akkila"
          placeholder="ask anything about akkila…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] py-1.5 px-2.5 border border-[var(--border-strong)] rounded-[6px] text-[var(--text-dim)] whitespace-nowrap shrink-0 transition-[color,border-color] duration-150 hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={busy || !input.trim()}
        >
          send ↵
        </button>
      </form>
    </div>
  )
}

export default ChatPanel
