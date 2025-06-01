import Link from "next/link";
import { Novel, Chapter } from "../types";

interface ChaptersListProps {
  novel: Novel;
  chapters: Chapter[];
}

export const ChaptersList = ({ novel, chapters }: ChaptersListProps) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-300">
            Chapters <span className="text-white">({chapters.length})</span>
          </h2>
          {chapters.length > 0 ? (
            <div className="bg-gray-800/20 border border-gray-700/30 rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.chapter_number}
                    href={`/novel/${novel.slug}/chapter/${chapter.chapter_number}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-800/40 transition-colors border-b border-gray-700/30 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm w-12">
                        #{chapter.chapter_number}
                      </span>
                      <div>
                        <h3 className="text-gray-200 hover:text-white transition-colors">
                          {chapter.title}
                        </h3>
                        {chapter.word_count && (
                          <p className="text-gray-400 text-sm">
                            {chapter.word_count.toLocaleString()} words
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/20 border border-gray-700/30 rounded-xl">
              <div className="text-4xl text-gray-500 mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No chapters available</h3>
              <p className="text-gray-400">This novel doesn't have any chapters yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
