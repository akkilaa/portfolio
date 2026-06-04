import type { PrepareSendMessagesRequest, UIMessage } from 'ai'
import { isTextUIPart } from 'ai'

export const prepareAskRequest: PrepareSendMessagesRequest<UIMessage> = ({ id, messages }) => ({
  body: {
    id,
    messages: messages
      .filter((m) => m.role !== 'system')
      .map((m) => {
        const text = m.parts
          .filter(isTextUIPart)
          .map((p) => p.text)
          .join('')
        return {
          role: m.role,
          // keep empty assistant turns as a placeholder so role alternation is preserved
          content: text || (m.role === 'assistant' ? '…' : ''),
        }
      })
      .filter((m) => m.content.length > 0),
  },
})
