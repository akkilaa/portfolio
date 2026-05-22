const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

export type ContactPayload = {
  name: string
  email: string
  message: string
}

export async function submitContact(data: ContactPayload): Promise<void> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limited')
    if (res.status === 400) throw new Error('validation')
    throw new Error('server')
  }
}
