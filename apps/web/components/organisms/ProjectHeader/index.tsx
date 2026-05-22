import Tag from '@/components/atoms/Tag'
import { formatProjectDate, type ProjectDetailResponse } from '@/lib/projects'

const ProjectHeader = ({ project }: { project: ProjectDetailResponse }) => {
  const start = formatProjectDate(project.startedAt)
  const end = project.endedAt ? formatProjectDate(project.endedAt) : 'ongoing'
  const dateRange = start ? `${start} – ${end}` : null

  return (
    <header className="pb-8 mb-10 border-b border-[var(--border)]">
      <div className="flex gap-1.5 flex-wrap mb-[18px]">
        {project.tags.map((t, i) => (
          <Tag key={t.id} label={`#${t.label}`} highlighted={i === 0} />
        ))}
      </div>

      <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(32px,4.6vw,52px)] leading-[1.08] tracking-[-0.035em] text-[var(--text-bright)] m-0 mb-[18px] text-balance">
        {project.title}
      </h1>

      <div className="flex gap-3.5 flex-wrap items-center font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text-dim)]">
        {project.role && <span>{project.role}</span>}
        {project.role && dateRange && <span className="text-[var(--text-faint)]">·</span>}
        {dateRange && <span>{dateRange}</span>}
        {(project.liveUrl || project.repoUrl) && (
          <span className="text-[var(--text-faint)]">·</span>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[var(--accent)]"
          >
            ↗ live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[var(--accent)]"
          >
            ↗ repo
          </a>
        )}
      </div>
    </header>
  )
}

export default ProjectHeader
