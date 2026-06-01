import { SYSTEM_PROMPT } from '@api/constants/ai'

type Message = { role: 'user' | 'assistant'; content: string }

export function dropConsecutiveDuplicateRolesStartingWithUser(messages: Message[]): Message[] {
  return messages.reduce<Message[]>((acc, msg) => {
    if (acc.length === 0) return msg.role === 'user' ? [msg] : acc
    return msg.role !== acc[acc.length - 1].role ? [...acc, msg] : acc
  }, [])
}

export function keepLastNMessagesStartingWithUser(messages: Message[], n = 4): Message[] {
  const sliced = messages.length > n ? messages.slice(-n) : messages
  const firstUserIdx = sliced.findIndex((m) => m.role === 'user')
  return firstUserIdx > 0 ? sliced.slice(firstUserIdx) : sliced
}

export function appendConcisenessReminderToLastUserMessage(messages: Message[]): Message[] {
  return messages.map((msg, i) =>
    i === messages.length - 1 && msg.role === 'user'
      ? {
          ...msg,
          content: msg.content + '\n\n(Respond concisely in plain prose, under 150 words.)',
        }
      : msg,
  )
}

export function injectSystemPromptIntoFirstUserMessage(messages: Message[]): Message[] {
  if (messages[0]?.role !== 'user') return messages
  return [
    { ...messages[0], content: `${SYSTEM_PROMPT.trim()}\n\n${messages[0].content}` },
    ...messages.slice(1),
  ]
}
