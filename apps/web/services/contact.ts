import { Api } from '@/lib/api'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

const api = new Api()

export async function submitContact(data: ContactPayload): Promise<void> {
  const res = await api.post('/contact', data)
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limited')
    if (res.status === 400) throw new Error('validation')
    throw new Error('server')
  }
}
