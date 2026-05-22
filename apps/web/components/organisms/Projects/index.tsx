import Link from 'next/link'
import ProjectCard, { type ProjectData } from '@/components/organisms/ProjectCard'
import SectionHeading from '@/components/molecules/SectionHeading'
import Button from '@/components/atoms/Button'
import { getFeaturedProjects, type ProjectDetailResponse } from '@/lib/projects'

function toProjectData(project: ProjectDetailResponse, index: number): ProjectData {
  const year = project.startedAt
    ? new Date(project.startedAt).getFullYear().toString()
    : new Date(project.createdAt).getFullYear().toString()

  const links: { label: string; href: string }[] = []
  if (project.liveUrl) links.push({ label: 'live', href: project.liveUrl })
  if (project.repoUrl) links.push({ label: 'repo', href: project.repoUrl })

  return {
    num: String(index + 1).padStart(2, '0'),
    slug: project.slug,
    title: project.title,
    year,
    role: project.role ?? '',
    desc: project.shortDescription,
    tags: project.tags.map((t) => t.label),
    links,
    litTags: [0],
  }
}

const Projects = async () => {
  const featured = await getFeaturedProjects()

  return (
    <section className="relative py-20" id="projects">
      <SectionHeading
        num="02"
        label="FEATURED WORK"
        title="Selected projects"
        aside={
          <>
            ~/projects/featured
            <br />
            <span style={{ color: 'var(--text-faint)' }}>{featured.length} of 12 visible</span>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-[18px] max-[940px]:grid-cols-1">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={toProjectData(p, i)} />
        ))}
      </div>

      <div className="mt-10 pt-7 border-t border-dashed border-[var(--border)] flex items-center justify-between gap-6 flex-wrap">
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)]">
          <span className="text-[var(--text-faint)]">$ </span>ls -al /projects
          <span className="text-[var(--text-faint)] ml-3 text-[11.5px]">// list all projects</span>
        </span>
        <Button as={Link} href="/projects">
          view all
        </Button>
      </div>
    </section>
  )
}

export default Projects
