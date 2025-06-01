"use client";
import { useRecommendations } from "../hooks";
import {
  LoadingSection,
  ErrorSection,
  HeroSection,
  EmptyRecommendationsSection,
  RecommendationsList,
  MoreRecommendationsSection,
  BackToHomeSection,
} from "../components/recommendations";

export default function RecommendationsPage() {
  const { recommendations, isLoading, error, refetch } = useRecommendations();

  if (isLoading) {
    return <LoadingSection />;
  }

  if (error) {
    return <ErrorSection error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />

      <section className="py-16">
        <div className="container mx-auto px-6">
          {recommendations.length === 0 ? (
            <EmptyRecommendationsSection />
          ) : (
            <>
              <RecommendationsList recommendations={recommendations} />
              <MoreRecommendationsSection />
            </>
          )}
        </div>
      </section>

      <BackToHomeSection />
    </div>
  );
}
