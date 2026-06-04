'use client'
import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import IconButton from '@/components/atoms/IconButton'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string
  node?: unknown
  priority?: boolean
}

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function LightboxImage({ node: _node, src, alt, className, priority }: Props) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEscapeKey(close, open)
  useBodyScrollLock(open)

  return (
    <>
      <Image
        src={src ?? ''}
        alt={alt ?? ''}
        width={0}
        height={0}
        sizes="100vw"
        className={className}
        priority={priority}
        onClick={() => setOpen(true)}
        style={{ width: '100%', height: 'auto', cursor: 'zoom-in' }}
      />
      {open &&
        createPortal(
          <div className="lightbox-backdrop" onClick={close} role="dialog" aria-modal="true">
            <IconButton
              icon={<XIcon />}
              label="Close image"
              onClick={close}
              className="fixed top-5 right-6 !border-white/20 !text-white/60 hover:!text-white hover:!border-white/40 !bg-transparent hover:!bg-white/10"
            />
            <Image
              src={src ?? ''}
              alt={alt ?? ''}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 90vw"
              className="lightbox-img"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: 'calc(100dvh - 48px)',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
