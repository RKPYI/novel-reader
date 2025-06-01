import { Novel } from "../../hooks";
import { NovelCard } from "../NovelCard";

interface NovelGridProps {
  novels: Novel[];
  onClearFilters?: () => void;
}

export const NovelGrid = ({ novels, onClearFilters }: NovelGridProps) => {
  if (novels.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl text-gray-400 mb-6">📚</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-4">No novels found</h3>
        <p className="text-gray-300 mb-6">
          Try adjusting your filters or search terms
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-300">
          {novels.length} Novel{novels.length !== 1 ? 's' : ''} Found
        </h2>
      </div>

      {/* Novels Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {novels.map((novel) => (
          <NovelCard 
            key={novel.slug} 
            novel={novel} 
            variant="popular" 
          />
        ))}
      </div>
    </>
  );
};
