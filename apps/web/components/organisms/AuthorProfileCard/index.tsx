import GithubIcon from '@/components/atoms/GithubIcon'
import LinkedinIcon from '@/components/atoms/LinkedinIcon'
import { initials } from '@/utils/nameUtils'
import Link from 'next/link'
import Image from 'next/image'

type AuthorProfileCardProps = {
  displayName: string
  avatarUrl: string | null
  profileUrl: string | null
  username: string | null
  provider: string
}

const AuthorProfileCard = ({
  displayName,
  avatarUrl,
  profileUrl,
  username,
  provider,
}: AuthorProfileCardProps) => {
  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border border-[var(--border-strong)] object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] grid place-items-center font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] shrink-0">
          {initials(displayName)}
        </div>
      )}
      <div>
        {profileUrl ? (
          <Link
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] font-medium text-[14px] text-[var(--text-bright)] transition-colors duration-150 hover:text-[var(--accent)] flex items-center gap-1.5"
          >
            {displayName}
            {provider === 'github' ? (
              <GithubIcon className="opacity-50" />
            ) : (
              <LinkedinIcon className="opacity-50" />
            )}
          </Link>
        ) : (
          <span className="font-[family-name:var(--font-mono)] font-medium text-[14px] text-[var(--text-bright)] flex items-center gap-1.5">
            {displayName}
            <LinkedinIcon className="opacity-50" />
          </span>
        )}
        {username && (
          <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
            @{username}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthorProfileCard
