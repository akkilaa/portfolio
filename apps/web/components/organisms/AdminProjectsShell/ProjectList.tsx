import type { ProjectResponse } from '@portfolio/shared'
import StatusBadge from './StatusBadge'

interface ProjectListProps {
  projects: ProjectResponse[]
  selectedId: string | null
  onSelect: (project: ProjectResponse) => void
}

const ProjectList = ({ projects, selectedId, onSelect }: ProjectListProps) => (
  <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden">
    <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] uppercase tracking-wider">
        projects ({projects.length})
      </p>
    </div>
    <ul className="overflow-y-auto flex-1">
      {projects.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => onSelect(p)}
            className={`w-full text-left px-4 py-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] ${
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
        </li>
      ))}
    </ul>
  </aside>
)

export default ProjectList
