import type { CreateProjectInput } from '@portfolio/shared'

export const draftProjectInput: CreateProjectInput = {
  slug: 'draft-project',
  title: 'Draft Project',
  descriptionMd: '# Draft',
  shortDescription: 'A draft project',
}

export const publishedProjectInput: CreateProjectInput = {
  slug: 'published-project',
  title: 'Published Project',
  descriptionMd: '# Published',
  shortDescription: 'A published project',
}

export const deletedProjectInput: CreateProjectInput = {
  slug: 'deleted-project',
  title: 'Deleted Project',
  descriptionMd: '# Deleted',
  shortDescription: 'A deleted project',
}

export const featuredProjectInput: CreateProjectInput = {
  slug: 'featured-project',
  title: 'Featured Project',
  descriptionMd: '# Featured',
  shortDescription: 'A featured project',
  featured: true,
}
