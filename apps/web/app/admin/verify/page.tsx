'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { adminVerify } from '@/services/admin'

export default function AdminVerifyPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setError('Missing token.')
      return
    }

    adminVerify(token)
      .then(() => router.replace('/admin'))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Verification failed.')
      })
  }, [params, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border border-[var(--border)] bg-[var(--surface)] rounded-xl p-10 max-w-sm w-full text-center space-y-3">
          <p className="text-red-400 font-[family-name:var(--font-mono)] text-sm">error</p>
          <p className="text-[var(--text-dim)] text-sm">{error}</p>
          <a
            href="/admin/login"
            className="inline-block mt-2 text-[var(--accent)] font-[family-name:var(--font-mono)] text-xs hover:underline"
          >
            back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-dim)]">
        verifying…
      </p>
    </div>
  )
}
