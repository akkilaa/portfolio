'use client'

import { useMemo, useState } from 'react'
import type { PostListItemResponse } from '@/services/posts'
import { getAllTags } from '@/services/posts'
import FeaturedPost from '@/components/organisms/FeaturedPost'
import PostRow from '@/components/organisms/PostRow'
import SearchToolbar from '@/components/molecules/SearchToolbar'
import EmptyState from '@/components/atoms/EmptyState'
import Rss from '@/components/organisms/Rss'

const BlogShell = ({ posts }: { posts: PostListItemResponse[] }) => {
  const [activeTag, setActiveTag] = useState('all')
  const [query, setQuery] = useState('')

  const allTags = useMemo(() => getAllTags(posts), [posts])

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
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        placeholder="grep posts…"
      />

      {filtered.length === 0 && <EmptyState />}

      {featured && <FeaturedPost post={featured} />}

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
