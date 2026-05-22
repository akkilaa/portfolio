'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import type { PostListItemResponse } from '@/lib/posts'
import { getAllTags } from '@/lib/posts'
import FeaturedPost from '@/components/organisms/FeaturedPost'
import PostRow from '@/components/organisms/PostRow'
import Input from '@/components/molecules/Input'
import Kbd from '@/components/atoms/Kbd'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import EmptyState from '@/components/atoms/EmptyState'
import Rss from '@/components/organisms/Rss'

const BlogShell = ({ posts }: { posts: PostListItemResponse[] }) => {
  const [activeTag, setActiveTag] = useState('all')
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const allTags = useMemo(() => getAllTags(posts), [posts])

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

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeTag !== 'all' && !p.tags.some((t) => t.label === activeTag)) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        return (p.title + ' ' + p.excerpt + ' ' + p.tags.map((t) => t.label).join(' '))
          .toLowerCase()
          .includes(q)
      }
      return true
    })
  }, [posts, activeTag, query])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-4 py-4 mb-8 border-t border-b border-[var(--border)] flex-wrap">
        <div className="flex-1 min-w-[240px]">
          <Input.Text
            ref={searchRef}
            left={
              <span className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]">
                ›
              </span>
            }
            right={<Kbd>⌘K</Kbd>}
            placeholder="grep posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="search posts"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {allTags.map(([tag, count]) => (
            <Button
              key={tag}
              as={Chip}
              variant="bare"
              label={tag}
              count={count}
              highlighted={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 && <EmptyState />}

      {/* Featured */}
      {featured && <FeaturedPost post={featured} />}

      {/* Post rows */}
      <div className="flex flex-col mb-14">
        {rest.map((p) => (
          <PostRow key={p.slug} post={p} />
        ))}
      </div>

      <Rss />
    </>
  )
}

export default BlogShell
