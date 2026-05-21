import TypingDots from '@/components/atoms/TypingDots'

export type MessageRole = 'assistant' | 'user' | 'system'

export interface Message {
  who: MessageRole
  body: string
}

const WHO_LABELS: Record<MessageRole, string> = {
  assistant: '› akkila-bot',
  user: '› you',
  system: '// system',
}

const WHO_COLOR: Record<MessageRole, string> = {
  assistant: 'text-[var(--accent)]',
  user: 'text-[var(--text-bright)]',
  system: 'text-[var(--text-dim)]',
}

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.who === 'user'
  return (
    <div
      className={`text-[14px] leading-[1.55] ${isUser ? 'self-end text-right max-w-[80%]' : 'max-w-[92%]'}`}
    >
      <div
        className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] mb-1 ${WHO_COLOR[message.who]}`}
      >
        {WHO_LABELS[message.who]}
      </div>
      <div
        className={`whitespace-pre-wrap text-pretty ${
          isUser
            ? 'inline-block py-2 px-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px_10px_2px_10px] text-left'
            : 'text-[var(--text)]'
        }`}
      >
        {message.body}
      </div>
    </div>
  )
}

export const TypingMessage = () => (
  <div className="text-[14px] leading-[1.55] max-w-[92%]">
    <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] mb-1 text-[var(--accent)]">
      › akkila-bot
    </div>
    <div className="whitespace-pre-wrap text-pretty text-[var(--text)]">
      <TypingDots />
    </div>
  </div>
)

export default ChatMessage
