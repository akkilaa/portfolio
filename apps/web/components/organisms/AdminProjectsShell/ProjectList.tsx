import type { ProjectResponse } from '@portfolio/shared'
import StatusBadge from './StatusBadge'

interface ProjectListProps {
  projects: ProjectResponse[]
  selectedId: string | null
  onSelect: (project: ProjectResponse) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

const ProjectList = ({
  projects,
  selectedId,
  onSelect,
  onMoveUp,
  onMoveDown,
}: ProjectListProps) => (
  <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden">
    <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] uppercase tracking-wider">
        projects ({projects.length})
      </p>
    </div>
    <ul className="overflow-y-auto flex-1">
      {projects.map((p, i) => (
        <li key={p.id} className="relative group">
          <button
            onClick={() => onSelect(p)}
            className={`w-full text-left px-4 py-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] pr-10 ${
              selectedId === p.id
                ? 'bg-[var(--surface-2)] border-l-2 border-l-[var(--accent)] pl-[14px]'
                : ''
            }`}
          >
            <p className="text-sm text-[var(--text-bright)] truncate">{p.title}</p>
            <div className="mt-1">
              <StatusBadge published={p.published} featured={p.featured} />
            </div>
          </button>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp(p.id)
              }}
              disabled={i === 0}
              className="p-0.5 text-[var(--text-faint)] hover:text-[var(--text-bright)] disabled:opacity-20 disabled:cursor-not-allowed"
              title="Move up"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown(p.id)
              }}
              disabled={i === projects.length - 1}
              className="p-0.5 text-[var(--text-faint)] hover:text-[var(--text-bright)] disabled:opacity-20 disabled:cursor-not-allowed"
              title="Move down"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 10L2 4H10L6 10Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  </aside>
)

export default ProjectList
