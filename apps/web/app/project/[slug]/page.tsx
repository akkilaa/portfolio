import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProject, getAllProjectSlugs } from '@/services/projects'
import { extractToc } from '@/lib/markdown'
import ProjectHeader from '@/components/organisms/ProjectHeader'
import PostToc from '@/components/organisms/PostToc'
import MarkdownContent from '@/components/organisms/MarkdownContent'
import PostFooter from '@/components/organisms/PostFooter'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return { title: `${project.title} — akkila.dev`, description: project.shortDescription }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const toc = extractToc(project.descriptionMd)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-16 py-16 pb-24 max-[1040px]:grid-cols-1 max-[1040px]:gap-8 max-[1040px]:py-10">
      <div>
        <Link
          href="/#projects"
          className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] inline-flex items-center gap-1.5 mb-7 transition-colors duration-150 hover:text-[var(--accent)]"
        >
          ← cd ../#projects
        </Link>

        <ProjectHeader project={project} />
        <MarkdownContent>{project.descriptionMd}</MarkdownContent>

        <PostFooter />
      </div>

      <PostToc items={toc} />
    </div>
  )
}
