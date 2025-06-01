import Link from "next/link";
import { Novel } from "../types";
import { NovelCard } from "./NovelCard";

interface PopularNovelsProps {
  novels: Novel[];
}

export const PopularNovels = ({ novels }: PopularNovelsProps) => {
  if (novels.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-300">
            Popular <span className="text-white">Novels</span>
          </h2>
          <Link href="/browse?sort=popular" className="text-gray-400 hover:text-gray-200 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {novels.slice(0, 6).map((novel) => (
            <NovelCard key={novel.slug} novel={novel} variant="popular" />
          ))}
        </div>
      </div>
    </section>
  );
};
