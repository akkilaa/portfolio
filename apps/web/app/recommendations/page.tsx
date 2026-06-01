import { getRecommendations } from '@/services/recommendations'
import RecommendationsHero from '@/components/organisms/RecommendationsHero'
import RecommendationsShell from '@/components/organisms/RecommendationsShell'

export const revalidate = 60

export const metadata = {
  title: 'recommendations — akkila.dev',
  description: 'What developers and collaborators say about working with me.',
}

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations()

  return (
    <>
      <RecommendationsHero count={recommendations.length} />
      <RecommendationsShell recommendations={recommendations} />
    </>
  )
}
