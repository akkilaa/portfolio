'use client'

import { useRef, useEffect } from 'react'
import Input from '@/components/molecules/Input'
import Kbd from '@/components/atoms/Kbd'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'

interface SearchToolbarProps {
  query: string
  onQueryChange: (q: string) => void
  tags: [string, number][]
  activeTag: string
  onTagChange: (tag: string) => void
  placeholder?: string
}

const SearchToolbar = ({
  query,
  onQueryChange,
  tags,
  activeTag,
  onTagChange,
  placeholder = 'grep…',
}: SearchToolbarProps) => {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex items-center gap-4 py-4 mb-8 border-t border-b border-[var(--border)] flex-wrap">
      <div className="flex-1 min-w-[240px]">
        <Input.Text
          ref={searchRef}
          prompt
          right={<Kbd>⌘K</Kbd>}
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label={placeholder}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(([tag, count]) => (
          <Button
            key={tag}
            as={Chip}
            variant="bare"
            label={tag}
            count={count}
            highlighted={activeTag === tag}
            onClick={() => onTagChange(tag)}
          />
        ))}
      </div>
    </div>
  )
}

export default SearchToolbar
