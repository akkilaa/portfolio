import Link from 'next/link'
import Tag from '@/components/atoms/Tag'
import Button from '@/components/atoms/Button'

export interface ProjectData {
  num: string
  slug: string
  title: string
  year: string
  role: string
  desc: string
  tags: string[]
  links: { label: string; href: string }[]
  litTags: number[]
}

const ProjectCard = ({ project }: { project: ProjectData }) => (
  <article className="relative flex flex-col border border-[var(--border)] rounded-xl bg-[var(--surface)] p-[22px] min-h-[320px] overflow-hidden cursor-pointer transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_100%_0%,var(--accent-dim),transparent_60%)] after:opacity-0 after:transition-opacity after:duration-[250ms] after:pointer-events-none hover:after:opacity-100">
    <Link
      href={`/project/${project.slug}`}
      className="absolute inset-0 z-0"
      aria-label={project.title}
    />
    <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent)] tracking-[0.08em]">
      [{project.num}]
    </div>
    <h3 className="font-[family-name:var(--font-mono)] text-[22px] tracking-[-0.02em] text-[var(--text-bright)] mt-3.5 mb-1.5 font-medium">
      {project.title}
    </h3>
    <div className="font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--text-dim)] mb-3.5 flex items-center gap-2">
      <span>{project.year}</span>
      <span className="text-[var(--text-faint)]">·</span>
      <span>{project.role}</span>
    </div>
    <p className="text-[14px] text-[var(--text)] leading-[1.55] mb-[18px] text-pretty">
      {project.desc}
    </p>
    <div className="flex flex-wrap gap-1.5 mt-auto mb-3.5">
      {project.tags.map((t, i) => (
        <Tag key={t} label={t} highlighted={project.litTags.includes(i)} />
      ))}
    </div>
    <div className="flex gap-3.5 pt-3.5 border-t border-dashed border-[var(--border)]">
      {project.links.map((l) => (
        <Button key={l.label} as={Link} href={l.href} variant="plain" className="relative z-[1]">
          ↗ {l.label}
        </Button>
      ))}
    </div>
  </article>
)

export default ProjectCard
