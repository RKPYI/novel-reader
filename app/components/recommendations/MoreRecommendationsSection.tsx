import Link from "next/link";

export const MoreRecommendationsSection = () => {
  return (
    <div className="text-center mt-16">
      <h3 className="text-2xl font-bold text-gray-300 mb-4">Want More?</h3>
      <p className="text-gray-300 mb-6">
        Explore our full collection to discover more amazing stories
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/browse" 
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
        >
          Browse All Novels
        </Link>
        <Link 
          href="/browse?sort=popular" 
          className="px-8 py-3 border-2 border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white font-semibold rounded-lg transition-all duration-300"
        >
          Popular Choices
        </Link>
      </div>
    </div>
  );
};
