import Link from "next/link";
import { Novel, Chapter } from "../hooks";

interface NovelHeaderProps {
  novel: Novel;
  chapters: Chapter[];
}

export const NovelHeader = ({ novel, chapters }: NovelHeaderProps) => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/browse" className="text-gray-400 hover:text-gray-200 transition-colors">
                ← Back to Browse
              </Link>
              <div className="flex items-center gap-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
                  ${novel.status === 'completed' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : novel.status === 'ongoing'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }
                `}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    novel.status === 'completed' ? 'bg-emerald-400' : novel.status === 'ongoing' ? 'bg-blue-400' : 'bg-gray-400'
                  }`} />
                  {novel.status}
                </span>
                <div className="flex items-center space-x-1 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-3 py-1">
                  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-amber-300">{parseFloat(novel.rating).toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                <div className="w-64 mx-auto lg:mx-0">
                  {novel.cover_image ? (
                    <img
                      src={novel.cover_image}
                      alt={`${novel.title} cover`}
                      className="w-full aspect-[9/16] object-cover rounded-lg shadow-lg border border-gray-700/30"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                      // onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}

                    />
                  ) : null}
                  <div className={`w-full aspect-[9/16] sm:hidden bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg border border-gray-700/30 flex items-center justify-center ${novel.cover_image ? 'hidden' : ''}`}>
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-sm">No Cover</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-200">
                  {novel.title}
                </h1>
                
                <p className="text-xl text-gray-400 mb-6">{novel.author}</p>
                
                {novel.description && (
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {novel.description}
                  </p>
                )}

                <div className="flex items-center gap-6 mb-6">
                  <div className="text-gray-300">
                    <span className="font-semibold">{novel.views.toLocaleString()}</span> views
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold">{chapters.length}</span> chapters
                  </div>
                </div>

                {novel.genres && novel.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {novel.genres.map((genre) => (
                      <span key={genre.id} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {chapters.length > 0 && (
                  <Link
                    href={`/novel/${novel.slug}/chapter/${chapters[0].chapter_number}`}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-purple-500/25"
                  >
                    Start Reading
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
