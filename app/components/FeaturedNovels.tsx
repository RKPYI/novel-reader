import { Novel } from "../types";
import { NovelCard } from "./NovelCard";

interface FeaturedNovelsProps {
  novels: Novel[];
}

export const FeaturedNovels = ({ novels }: FeaturedNovelsProps) => {
  if (novels.length === 0) return null;

  return (
    <section className="py-16 bg-gray-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-300">
          Featured <span className="text-white">Stories</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {novels.map((novel) => (
            <NovelCard key={novel.slug} novel={novel} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
};
