const BASE_URL = process.env.NEXT_PUBLIC_API_URL!
const DEFAULT_TIMEOUT_MS = 5000

export class Api {
  constructor(
    private readonly baseUrl: string = BASE_URL,
    private readonly defaults: RequestInit = {},
  ) {}

  get(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      ...this.defaults,
      ...init,
    })
  }

  post(path: string, body: unknown, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...this.defaults,
      ...init,
    })
  }

  patch(path: string, body: unknown, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'fetch' },
      body: JSON.stringify(body),
      ...this.defaults,
      ...init,
    })
  }

  del(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      ...this.defaults,
      ...init,
    })
  }
}

export { BASE_URL }
