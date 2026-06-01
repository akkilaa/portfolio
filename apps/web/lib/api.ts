const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

export class Api {
  constructor(private readonly baseUrl: string = BASE_URL) {}

  get(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, init)
  }

  post(path: string, body: unknown, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...init,
    })
  }
}
