import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { isTextUIPart } from 'ai'
import ChatMessage, { TypingMessage, type Message } from '@/components/molecules/ChatMessage'

const ROLE_MAP: Record<string, Message['who']> = {
  user: 'user',
  system: 'system',
  assistant: 'assistant',
}

type Props = {
  messages: UIMessage[]
  busy: boolean
}

const ChatBody = ({ messages, busy }: Props) => {
  const threadRef = useRef<HTMLDivElement>(null)

  // Scroll bottom to see new messages
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages, busy])

  return (
    <div
      className="overflow-y-auto flex flex-col gap-3.5 pt-1 px-1 pb-3 h-[340px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[var(--border-strong)] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
      ref={threadRef}
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => {
        const text = message.parts
          .filter(isTextUIPart)
          .map((part) => part.text)
          .join('')
        const display: Message = {
          who: ROLE_MAP[message.role] ?? 'assistant',
          body: text,
        }
        return <ChatMessage key={message.id} message={display} />
      })}
      {busy && <TypingMessage />}
    </div>
  )
}

export default ChatBody
