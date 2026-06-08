type Message = { role: 'user' | 'assistant'; content: string }

export function dropConsecutiveDuplicateRolesStartingWithUser(messages: Message[]): Message[] {
  return messages.reduce<Message[]>((acc, msg) => {
    if (acc.length === 0) return msg.role === 'user' ? [msg] : acc
    if (msg.role !== acc[acc.length - 1].role) return [...acc, msg]
    return [...acc.slice(0, -1), msg]
  }, [])
}

export function keepLastNMessagesStartingWithUser(messages: Message[], n = 4): Message[] {
  const sliced = messages.length > n ? messages.slice(-n) : messages
  const firstUserIdx = sliced.findIndex((m) => m.role === 'user')
  const trimmed = firstUserIdx > 0 ? sliced.slice(firstUserIdx) : sliced
  // Gemma requires the sequence to end on a user turn
  const lastUserIdx = [...trimmed]
    .map((m, i) => (m.role === 'user' ? i : -1))
    .filter((i) => i !== -1)
    .pop()
  return lastUserIdx !== undefined ? trimmed.slice(0, lastUserIdx + 1) : trimmed
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
