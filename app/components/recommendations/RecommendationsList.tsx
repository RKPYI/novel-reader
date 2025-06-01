import { Novel } from "../../hooks";
import { NovelCard } from "../NovelCard";

interface RecommendationsListProps {
  recommendations: Novel[];
}

export const RecommendationsList = ({ recommendations }: RecommendationsListProps) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-300">
          Recommended <span className="text-white">For You</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mt-4">
          Based on your reading patterns, these tales are calling to you
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((novel) => (
          <NovelCard
            key={novel.slug}
            novel={novel}
            variant="featured"
          />
        ))}
      </div>
    </div>
  );
};
