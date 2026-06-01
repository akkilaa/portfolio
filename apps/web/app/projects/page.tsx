import { getProjects } from '@/services/projects'
import ProjectsHero from '@/components/organisms/ProjectsHero'
import ProjectsShell from '@/components/organisms/ProjectsShell'

export const revalidate = 60

export const metadata = {
  title: 'projects — akkila.dev',
  description: "A full index of things I've built — products, tools, and experiments.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <ProjectsHero count={projects.length} />
      <ProjectsShell projects={projects} />
    </>
  )
}
