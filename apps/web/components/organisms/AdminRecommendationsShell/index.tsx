'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { RecommendationResponse, RecommendationStatus } from '@portfolio/shared'
import Button from '@/components/atoms/Button'
import {
  adminGetRecommendations,
  adminApproveRecommendation,
  adminRejectRecommendation,
  adminDeleteRecommendation,
  adminLogout,
} from '@/services/admin'
import { formatDate } from '@/utils/dateUtils'
import { initials } from '@/utils/nameUtils'

type Tab = 'PENDING' | 'APPROVED' | 'REJECTED'

const tabs: Tab[] = ['PENDING', 'APPROVED', 'REJECTED']

const AdminRecommendationsShell = () => {
  const router = useRouter()
  const [items, setItems] = useState<RecommendationResponse[]>([])
  const [tab, setTab] = useState<Tab>('PENDING')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')
  const [pending, setPending] = useState<Record<string, boolean>>({})

  const load = useCallback(
    async (status: Tab) => {
      setLoading(true)
      try {
        const data = await adminGetRecommendations(status as RecommendationStatus)
        setItems(data)
      } catch {
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  useEffect(() => {
    load(tab).catch(() => router.push('/admin/login'))
  }, [tab, load, router])

  function startAction(id: string) {
    setPending((p) => ({ ...p, [id]: true }))
    setActionError('')
  }

  function endAction(id: string) {
    setPending((p) => ({ ...p, [id]: false }))
  }

  async function handleApprove(id: string) {
    startAction(id)
    try {
      await adminApproveRecommendation(id)
      setItems((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      endAction(id)
    }
  }

  async function handleReject(id: string) {
    startAction(id)
    try {
      await adminRejectRecommendation(id)
      setItems((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      endAction(id)
    }
  }

  async function handleDelete(id: string) {
    startAction(id)
    try {
      await adminDeleteRecommendation(id)
      setItems((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed')
    } finally {
      endAction(id)
    }
  }

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-mono)] text-sm">
            <span className="text-[var(--text-faint)]">~/</span>
            <span className="text-[var(--text-bright)]">admin</span>
          </span>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin"
              className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] hover:text-[var(--accent)] px-2 py-1 rounded transition-colors"
            >
              projects
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)] px-2 py-1">
              recommendations
            </span>
          </nav>
        </div>
        <Button variant="plain" onClick={handleLogout}>
          logout
        </Button>
      </header>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-1 px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider px-3 py-1.5 rounded transition-colors cursor-pointer ${
                tab === t
                  ? 'bg-[var(--surface-2)] text-[var(--text-bright)] border border-[var(--border-strong)]'
                  : 'text-[var(--text-faint)] hover:text-[var(--text-dim)]'
              }`}
            >
              {t.toLowerCase()}
            </button>
          ))}
        </div>

        {actionError && (
          <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/20 font-[family-name:var(--font-mono)] text-[12px] text-red-400 shrink-0">
            {actionError}
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-faint)]">
              loading...
            </p>
          ) : items.length === 0 ? (
            <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-faint)]">
              no {tab.toLowerCase()} recommendations
            </p>
          ) : (
            <ul className="flex flex-col gap-4 max-w-3xl">
              {items.map((rec) => (
                <li
                  key={rec.id}
                  className="border border-[var(--border)] bg-[var(--surface)] rounded-[10px] p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {rec.author.avatarUrl ? (
                        <Image
                          src={rec.author.avatarUrl}
                          alt={rec.author.displayName}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full border border-[var(--border-strong)] object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] grid place-items-center font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] shrink-0">
                          {initials(rec.author.displayName)}
                        </div>
                      )}
                      <div>
                        <div className="font-[family-name:var(--font-mono)] text-[13px] font-medium text-[var(--text-bright)]">
                          {rec.author.displayName}
                        </div>
                        {rec.author.username && (
                          <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
                            @{rec.author.username}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] shrink-0">
                      {formatDate(rec.createdAt)}
                    </div>
                  </div>

                  <blockquote className="font-[family-name:var(--font-sans)] text-[14px] text-[var(--text)] leading-[1.65] m-0 border-l-2 border-[var(--border-strong)] pl-4">
                    &ldquo;{rec.comment}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
                      via {rec.author.provider}
                      {rec.author.profileUrl && (
                        <>
                          {' · '}
                          <Link
                            href={rec.author.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[var(--accent)] transition-colors"
                          >
                            profile ↗
                          </Link>
                        </>
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      {tab !== 'APPROVED' && (
                        <Button
                          variant="ghost"
                          disabled={!!pending[rec.id]}
                          onClick={() => handleApprove(rec.id)}
                          className="text-[var(--accent)] border-[var(--accent)]/40 hover:border-[var(--accent)]"
                        >
                          approve
                        </Button>
                      )}
                      {tab !== 'REJECTED' && (
                        <Button
                          variant="ghost"
                          disabled={!!pending[rec.id]}
                          onClick={() => handleReject(rec.id)}
                        >
                          reject
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        disabled={!!pending[rec.id]}
                        onClick={() => handleDelete(rec.id)}
                        className="text-red-400 border-red-400/30 hover:border-red-400"
                      >
                        delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminRecommendationsShell
