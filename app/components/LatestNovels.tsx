import Link from "next/link";
import { Novel } from "../hooks";
import { NovelCard } from "./NovelCard";

interface LatestNovelsProps {
  novels: Novel[];
}

export const LatestNovels = ({ novels }: LatestNovelsProps) => {
  if (novels.length === 0) return null;

  return (
    <section className="py-16 bg-gray-800/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-300">
            Latest <span className="text-white">Updates</span>
          </h2>
          <Link href="/browse?sort=latest" className="text-gray-400 hover:text-gray-200 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {novels.slice(0, 8).map((novel) => (
            <NovelCard key={novel.slug} novel={novel} variant="latest" />
          ))}
        </div>
      </div>
    </section>
  );
};
