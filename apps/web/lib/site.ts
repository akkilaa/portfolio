export const SITE_URL = process.env.NEXT_PUBLIC_API_URL_ORIGIN

export const SITE_AUTHOR = {
  name: 'Aleksa Janjic',
  url: SITE_URL,
  jobTitle: 'Full-Stack Developer & AI Engineer',
  github: 'https://github.com/akkilaa',
  linkedin: 'https://linkedin.com/in/aleksa-janjic',
  email: 'hello@akkila.dev',
}

export const SITE_META = {
  title: 'akkila.dev — Full-Stack Developer & AI Engineer',
  description: 'Full-stack portfolio. Next.js, Postgres, AI engineering.',
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_AUTHOR.name,
  url: SITE_AUTHOR.url,
  jobTitle: SITE_AUTHOR.jobTitle,
  sameAs: [SITE_AUTHOR.github, SITE_AUTHOR.linkedin],
}
