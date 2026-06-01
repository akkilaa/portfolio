import type { RecommendationWithAuthor } from '@/services/recommendations'
import RecommendationCard from '@/components/organisms/RecommendationCard'
import LeaveRecommendationForm from '@/components/organisms/LeaveRecommendationForm'
import SectionHeading from '@/components/molecules/SectionHeading'
import EmptyState from '@/components/atoms/EmptyState'

interface Props {
  recommendations: RecommendationWithAuthor[]
}

const RecommendationsShell = ({ recommendations }: Props) => (
  <>
    <section className="relative pb-14" id="recommendations">
      <SectionHeading
        num="01"
        label="RECOMMENDATIONS"
        title="What others say."
        aside={
          <>
            ~/recommendations
            <br />
            <span className="text-[var(--accent)]">● {recommendations.length} verified</span>
          </>
        }
      />

      {recommendations.length === 0 ? (
        <EmptyState message="// no recommendations yet" hint="Be the first to leave one below." />
      ) : (
        <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1 mb-14">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}
    </section>

    <LeaveRecommendationForm />
  </>
)

export default RecommendationsShell
