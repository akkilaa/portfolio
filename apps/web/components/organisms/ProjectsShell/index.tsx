'use client'

import { useMemo, useState } from 'react'
import { getAllProjectTags, type ProjectDetailResponse } from '@/lib/projects'
import ProjectRow from '@/components/organisms/ProjectRow'
import SearchToolbar from '@/components/molecules/SearchToolbar'
import EmptyState from '@/components/atoms/EmptyState'

const PAGE_SIZE = 10

const ProjectsShell = ({ projects }: { projects: ProjectDetailResponse[] }) => {
  const [activeTag, setActiveTag] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const allTags = useMemo(() => getAllProjectTags(projects), [projects])

  const filtered = useMemo(() => {
    setPage(1)
    return projects.filter((p) => {
      if (activeTag !== 'all' && !p.tags.some((t) => t.label === activeTag)) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        return (p.title + ' ' + p.shortDescription + ' ' + p.tags.map((t) => t.label).join(' '))
          .toLowerCase()
          .includes(q)
      }
      return true
    })
  }, [projects, activeTag, query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        placeholder="grep projects…"
      />

      {filtered.length === 0 && <EmptyState />}

      <div className="flex flex-col mb-14">
        {paged.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-16 font-[family-name:var(--font-mono)] text-[13px]">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-[var(--border)] rounded-md text-[var(--text-dim)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1.5 border rounded-md transition-colors duration-150 ${
                n === page
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {String(n).padStart(2, '0')}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-[var(--border)] rounded-md text-[var(--text-dim)] transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            next →
          </button>
        </div>
      )}
    </>
  )
}

export default ProjectsShell
