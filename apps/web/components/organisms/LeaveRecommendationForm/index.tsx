'use client'

import { useState, useEffect } from 'react'
import type { RecommendationMeResponse } from '@/lib/recommendations'
import { getRecommendationAuthor, submitRecommendation } from '@/lib/recommendations'
import Button from '@/components/atoms/Button'
import Input from '@/components/molecules/Input'
import SectionHeading from '@/components/molecules/SectionHeading'
import GithubIcon from '@/components/atoms/GithubIcon'
import LinkedinIcon from '@/components/atoms/LinkedinIcon'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

const ERROR_MESSAGES: Record<string, string> = {
  rate_limited: 'too many attempts — wait a moment and try again',
  already_submitted: 'you already left a recommendation — only one per account',
  unauthorized: 'session expired — please sign in again',
  validation: 'message must be 10–1000 characters',
  server: 'something went wrong — try again',
}

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; me: RecommendationMeResponse }

type Author = RecommendationMeResponse['author']

type RecommendationStatus = 'APPROVED' | 'REJECTED' | 'PENDING'

const STATUS_MESSAGES: Record<'sent' | RecommendationStatus, { icon: string; text: string }> = {
  sent: { icon: '●', text: 'recommendation submitted — thanks! it will appear once reviewed.' },
  APPROVED: { icon: '●', text: 'your recommendation is live — thank you!' },
  REJECTED: { icon: '✕', text: 'your recommendation was not approved' },
  PENDING: { icon: '●', text: 'recommendation submitted — pending review' },
}

const cardCls = 'border border-[var(--border)] bg-[var(--surface)] rounded-[14px] p-6'

const oauthLinkCls =
  'relative font-[family-name:var(--font-mono)] text-[13px] tracking-[-0.005em] rounded-lg whitespace-nowrap transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px inline-flex items-center gap-2.5 py-3 px-[18px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)]'

const AuthorBadge = ({ author }: { author: Author }) => (
  <div className="flex items-center gap-3">
    {author.avatarUrl && (
      <img src={author.avatarUrl} alt={author.displayName} className="w-8 h-8 rounded-full" />
    )}
    <div>
      <p className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)]">
        {author.displayName}
      </p>
      {author.username && (
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
          @{author.username}
        </p>
      )}
    </div>
  </div>
)

// — Sub-components —

const Loading = () => (
  <div className={cardCls}>
    <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] animate-pulse">
      checking session…
    </p>
  </div>
)

const Unauthenticated = () => (
  <div className={`${cardCls} flex flex-col gap-5`}>
    <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)]">
      sign in to verify your identity
    </p>
    <div className="flex flex-col gap-3">
      <Link href={`${API_URL}/auth/github`} className={oauthLinkCls}>
        <GithubIcon />
        continue with github
      </Link>
      <Link href={`${API_URL}/auth/linkedin`} className={oauthLinkCls}>
        <LinkedinIcon />
        continue with linkedin
      </Link>
    </div>
  </div>
)

type SubmittedProps = {
  author: Author
  sent: boolean
  status?: string | null
}

const Submitted = ({ author, sent, status }: SubmittedProps) => {
  const key = sent ? 'sent' : ((status as RecommendationStatus) ?? 'PENDING')
  const { icon, text } = STATUS_MESSAGES[key] ?? STATUS_MESSAGES.PENDING

  return (
    <div className={`${cardCls} flex flex-col gap-4`}>
      <AuthorBadge author={author} />
      <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)] flex items-center gap-1.5">
        {icon} {text}
      </p>
    </div>
  )
}

type FormProps = {
  me: RecommendationMeResponse
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
  error: string | null
}

const Form = ({ me, onSubmit, loading, error }: FormProps) => (
  <form className={cardCls} onSubmit={onSubmit}>
    <div className="flex items-center gap-3 mb-5">
      {me.author.avatarUrl && (
        <img
          src={me.author.avatarUrl}
          alt={me.author.displayName}
          className="w-8 h-8 rounded-full"
        />
      )}
      <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)] flex items-center gap-1.5">
        ● signed in as {me.author.displayName}
      </p>
    </div>

    <Input.Field>
      <Input.Label htmlFor="comment" required>
        RECOMMENDATION
      </Input.Label>
      <Input.Textarea
        id="comment"
        name="comment"
        required
        minLength={10}
        maxLength={1000}
        placeholder="Aleksa is a thoughtful engineer who…"
        disabled={loading}
      />
    </Input.Field>

    {me.author.provider === 'linkedin' && (
      <Input.Field>
        <Input.Label htmlFor="linkedinUrl">LINKEDIN PROFILE URL</Input.Label>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] mb-2">
          LinkedIn doesn&apos;t give me your profile URL through the API — please paste it here
          (optional)
        </p>
        <Input.Text
          id="linkedinUrl"
          name="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/your-profile"
          disabled={loading}
        />
      </Input.Field>
    )}

    <div className="flex items-center justify-between pt-1.5">
      <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
        10–1000 chars · reviewed before publishing
      </span>
      <Button as="button" type="submit" variant="primary" disabled={loading}>
        {loading ? 'submitting…' : 'submit'}
      </Button>
    </div>

    {error && (
      <p className="font-[family-name:var(--font-mono)] text-[12px] text-red-400 mt-3 flex items-center gap-1.5">
        ✕ {error}
      </p>
    )}
  </form>
)

// — Main component —

const LeaveRecommendationForm = () => {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRecommendationAuthor().then((me) => {
      setAuth(me ? { status: 'authenticated', me } : { status: 'unauthenticated' })
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value
    const linkedinUrlEl = form.elements.namedItem('linkedinUrl') as HTMLInputElement | null
    const linkedinUrl = linkedinUrlEl?.value.trim() || undefined
    try {
      await submitRecommendation(comment, linkedinUrl)
      setSent(true)
    } catch (err) {
      const key = err instanceof Error ? err.message : 'server'
      setError(ERROR_MESSAGES[key] ?? ERROR_MESSAGES.server)
    } finally {
      setLoading(false)
    }
  }

  const isSessionLoading = auth.status === 'loading'
  const isUnauthenticated = auth.status === 'unauthenticated'
  const me = auth.status === 'authenticated' ? auth.me : null
  const hasSubmittedRecommendation = !!me && (sent || !!me.recommendation)
  const canSubmitRecommendation = !!me && !sent && !me.recommendation

  return (
    <section className="relative py-20 border-t border-[var(--border)]" id="leave-recommendation">
      <SectionHeading
        num="02"
        label="LEAVE A RECOMMENDATION"
        title="Vouch for me."
        aside={
          <>
            ~/recommendations/new
            <br />
            <span className="text-[var(--accent)]">● reviewed before publishing</span>
          </>
        }
      />

      <div className="grid grid-cols-[1fr_1.1fr] gap-8 max-[940px]:grid-cols-1">
        <div className="flex flex-col gap-5">
          <p className="font-[family-name:var(--font-sans)] text-[15px] text-[var(--text)] leading-[1.65] max-w-[40ch]">
            Worked with me? I&apos;d love a reference. Sign in with GitHub or LinkedIn to verify
            your identity, then leave a short recommendation.
          </p>
          <div className="flex flex-col gap-2">
            {[
              'One recommendation per account',
              'Reviewed before publishing',
              'Profile link always shown',
            ].map((item) => (
              <div
                key={item}
                className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex items-center gap-2"
              >
                <span className="text-[var(--accent)]">→</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          {isSessionLoading && <LeaveRecommendationForm.Loading />}

          {isUnauthenticated && <LeaveRecommendationForm.Unauthenticated />}

          {me && hasSubmittedRecommendation && (
            <LeaveRecommendationForm.Submitted
              author={me.author}
              sent={sent}
              status={me.recommendation?.status}
            />
          )}

          {me && canSubmitRecommendation && (
            <LeaveRecommendationForm.Form
              me={me}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </section>
  )
}

LeaveRecommendationForm.Loading = Loading
LeaveRecommendationForm.Unauthenticated = Unauthenticated
LeaveRecommendationForm.Submitted = Submitted
LeaveRecommendationForm.Form = Form

export default LeaveRecommendationForm
