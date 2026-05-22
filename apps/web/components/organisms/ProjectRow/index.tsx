import Link from 'next/link'
import Tag from '@/components/atoms/Tag'
import { formatProjectDate, type ProjectDetailResponse } from '@/lib/projects'

const ProjectRow = ({ project }: { project: ProjectDetailResponse }) => {
  const year = project.startedAt
    ? new Date(project.startedAt).getFullYear()
    : new Date(project.createdAt).getFullYear()
  const endLabel = project.endedAt ? formatProjectDate(project.endedAt) : 'ongoing'

  return (
    <Link
      href={`/project/${project.slug}`}
      className="group relative grid grid-cols-[120px_1fr_auto] gap-7 items-baseline py-[22px] border-b border-[var(--border)] first:border-t transition-[padding-left] duration-[220ms] hover:pl-3 max-[760px]:grid-cols-1 max-[760px]:gap-2"
    >
      <span className="absolute left-[-22px] top-[26px] font-[family-name:var(--font-mono)] text-[var(--accent)] opacity-0 -translate-x-1.5 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0 max-[760px]:hidden">
        →
      </span>

      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.02em] whitespace-nowrap">
        {year}
      </div>

      <div className="min-w-0">
        <h3 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(18px,2vw,22px)] tracking-[-0.02em] text-[var(--text-bright)] m-0 mb-1.5 transition-colors duration-200 group-hover:text-[var(--accent)]">
          {project.title}
        </h3>
        <p className="text-[14px] text-[var(--text)] m-0 mb-3 leading-[1.55] max-w-[70ch] text-pretty">
          {project.shortDescription}
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          {project.tags.map((t) => (
            <Tag key={t.id} label={`#${t.label}`} />
          ))}
        </div>
      </div>

      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] whitespace-nowrap text-right self-center max-[760px]:text-left">
        {project.role && <span className="text-[var(--accent)] block">{project.role}</span>}
        <span>{endLabel}</span>
      </div>
    </Link>
  )
}

export default ProjectRow
