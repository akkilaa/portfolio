'use client'

import { type SubmitEvent, useState } from 'react'
import { adminLogin } from '@/services/admin'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(email, password)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-10 max-w-sm w-full text-center space-y-3">
          <p className="text-[var(--accent)] font-[family-name:var(--font-mono)] text-sm">
            $ magic link sent
          </p>
          <p className="text-[var(--text-dim)] text-sm">
            Check your email and click the link to log in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-10 max-w-sm w-full space-y-5"
      >
        <div className="space-y-1">
          <h1 className="font-[family-name:var(--font-mono)] text-[var(--text-bright)] text-base">
            <span className="text-[var(--text-faint)]">~/</span>admin
          </h1>
          <p className="text-[var(--text-dim)] text-sm">Sign in to manage content.</p>
        </div>

        {error && (
          <p className="text-red-400 text-xs font-[family-name:var(--font-mono)] bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-[var(--text-dim)] text-xs font-[family-name:var(--font-mono)]">
              email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[var(--text-dim)] text-xs font-[family-name:var(--font-mono)]">
              password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              placeholder="••••••••"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-[var(--accent)] text-[var(--on-accent)] font-[family-name:var(--font-mono)] text-sm font-semibold hover:bg-transparent hover:text-[var(--accent)] border border-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'sending…' : 'send magic link'}
        </button>
      </form>
    </div>
  )
}
