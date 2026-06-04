'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Button from '@/components/atoms/Button'
import { shareOnTwitter, shareOnLinkedIn, copyLink } from '@/utils/shareUtils'

interface PostFooterProps {
  title?: string
}

const PostFooter = ({ title = '' }: PostFooterProps) => {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : pathname

  const handleCopy = async () => {
    const success = await copyLink(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-between gap-6 flex-wrap">
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex gap-3.5 items-center flex-wrap">
        <span className="text-[var(--text-faint)]">share:</span>
        <Button variant="plain" onClick={() => shareOnTwitter(url, title)}>
          twitter
        </Button>
        <Button variant="plain" onClick={() => shareOnLinkedIn(url)}>
          linkedin
        </Button>
        <Button variant="plain" onClick={handleCopy}>
          {copied ? 'copied!' : 'copy link'}
        </Button>
      </div>
    </div>
  )
}

export default PostFooter
