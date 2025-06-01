import { useNovels } from "../hooks";
import { 
  LoadingSpinner,
  ErrorMessage,
  HeroSection,
  FeaturedNovels,
  PopularNovels,
  LatestNovels,
  NoDataState
} from "./";

export const HomePage = () => {
  const { 
    popularNovels, 
    latestNovels, 
    featuredNovels, 
    isLoading, 
    error 
  } = useNovels();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const hasData = popularNovels.length > 0 || latestNovels.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      <FeaturedNovels novels={featuredNovels} />
      <PopularNovels novels={popularNovels} />
      <LatestNovels novels={latestNovels} />
      {!hasData && <NoDataState />}
    </div>
  );
};
