import Link from "next/link";

export const EmptyRecommendationsSection = () => {
  return (
    <div className="text-center py-20">
      <div className="text-6xl text-gray-400 mb-6">📚</div>
      <h2 className="text-3xl font-bold text-gray-300 mb-4">No recommendations yet</h2>
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        We're still learning your preferences. Explore our collection to help us understand your reading taste.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/browse" 
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gray-700/25"
        >
          Explore Collection
        </Link>
        <Link 
          href="/browse?sort=popular" 
          className="px-8 py-3 border-2 border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white font-semibold rounded-lg transition-all duration-300"
        >
          View Popular
        </Link>
      </div>
    </div>
  );
};
