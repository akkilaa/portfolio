import { getProjects } from '@/services/projects'
import { getPosts } from '@/services/posts'
import { SITE_URL } from '@/lib/site'

function url(path: string, priority: string, changefreq: string): string {
  return `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])

  const staticUrls = [
    url('/', '1.0', 'monthly'),
    url('/projects', '0.8', 'weekly'),
    url('/blog', '0.8', 'weekly'),
    url('/recommendations', '0.6', 'monthly'),
  ].join('')

  const projectUrls = projects.map((p) => url(`/project/${p.slug}`, '0.7', 'weekly')).join('')
  const postUrls = posts.map((p) => url(`/blog/${p.slug}`, '0.6', 'monthly')).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}${projectUrls}${postUrls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
