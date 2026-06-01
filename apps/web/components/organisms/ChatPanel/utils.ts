import type { PrepareSendMessagesRequest, UIMessage } from 'ai'
import { isTextUIPart } from 'ai'

export const prepareAskRequest: PrepareSendMessagesRequest<UIMessage> = ({ id, messages }) => ({
  body: {
    id,
    messages: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role,
        content: m.parts
          .filter(isTextUIPart)
          .map((p) => p.text)
          .join(''),
      }))
      .filter((m) => m.content.length > 0),
  },
})
