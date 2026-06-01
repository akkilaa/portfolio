'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { TextStreamChatTransport } from 'ai'
import CornerDecorations from '@/components/atoms/CornerDecorations'
import ChatHeader from '@/components/molecules/ChatHeader'
import ChatBody from '@/components/molecules/ChatBody'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Input from '@/components/molecules/Input'
import { prepareAskRequest } from './utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

const SUGGESTIONS = [
  'what is your stack?',
  'are you available for hire?',
  'tell me about a recent project',
  'how do you self-host?',
]

const SEED_MESSAGES = [
  {
    id: 'seed',
    role: 'system' as const,
    parts: [{ type: 'text' as const, text: 'connected to akkila.dev — ask anything.' }],
  },
]

const ChatPanel = () => {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: `${API_URL}/ask`,
      prepareSendMessagesRequest: prepareAskRequest,
    }),
    messages: SEED_MESSAGES,
  })
  const [input, setInput] = useState('')
  const busy = status === 'submitted' || status === 'streaming'

  const submit = () => {
    const q = input.trim()
    if (!q || busy) return
    setInput('')
    sendMessage({ text: q })
  }

  return (
    <div
      className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[18px] flex flex-col min-h-[460px] shadow-[var(--shadow-card)]"
      id="chat"
    >
      <CornerDecorations />

      <ChatHeader />

      <ChatBody messages={messages} busy={busy} />

      <div className="flex flex-wrap gap-1.5 pt-2.5 pb-3 border-t border-dashed border-[var(--border)]">
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            as={Chip}
            variant="bare"
            label={s}
            onClick={() => {
              if (!busy) sendMessage({ text: s })
            }}
            disabled={busy}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Input.Text
          variant="chat"
          left={
            <span
              className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]"
              aria-hidden="true"
            >
              ›
            </span>
          }
          right={
            <Button type="submit" variant="ghost" disabled={busy || !input.trim()}>
              send ↵
            </Button>
          }
          aria-label="Ask about akkila"
          placeholder="ask anything about akkila…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
      </form>
    </div>
  )
}

export default ChatPanel
