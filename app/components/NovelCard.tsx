import Link from "next/link";
import { Novel } from "../types";

interface NovelCardProps {
  novel: Novel;
  variant?: "featured" | "popular" | "latest";
}

// Utility function to truncate text intelligently
const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If we found a space and it's not too close to the beginning, cut there
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  // Otherwise, just cut at max length
  return truncated + '...';
};

const StatusBadge = ({ status }: { status: string }) => {
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
  const isCompleted = formattedStatus === 'Completed';
  const isOngoing = formattedStatus === 'Ongoing';

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
      ${isCompleted 
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
        : isOngoing
        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
      }
    `}>
      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
        isCompleted ? 'bg-emerald-400' : isOngoing ? 'bg-blue-400' : 'bg-gray-400'
      }`} />
      {formattedStatus}
    </span>
  );
};

const RatingDisplay = ({ rating }: { rating: string }) => (
  <div className="flex items-center space-x-1 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-3 py-1">
    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-sm font-medium text-amber-300">{parseFloat(rating).toFixed(1)}</span>
  </div>
);

const GenreTag = ({ genre }: { genre: { id: number; name: string; color?: string } }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200">
    {genre.name}
  </span>
);

export const NovelCard = ({ novel, variant = "popular" }: NovelCardProps) => {
  if (variant === "featured") {
    return (
      <article className="group relative overflow-visible h-80">
        <Link
          href={`/novel/${novel.slug}`}
          className="block relative h-full bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-gray-950 border border-gray-700/60 rounded-2xl p-6 hover:border-gray-500/80 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 hover:z-20"
          aria-label={`Read ${novel.title} by ${novel.author}`}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
          <img src={novel.cover_image} 
              className="absolute top-0 right-0 h-full object-cover rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" 
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <div className="relative z-10 h-full flex flex-col">
            {/* Header with status and rating */}
            <div className="flex items-center justify-between mb-5">
              <StatusBadge status={novel.status} />
              <div className="flex items-center space-x-1 text-amber-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">{typeof novel.rating === "number" ? novel.rating.toFixed(1) : "N/A"}</span>
              </div>
            </div>
            
            {/* Title and author */}
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-white transition-colors duration-300 line-clamp-2">
                {novel.title}
              </h3>
              <p className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300">
                by {novel.author}
              </p>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-3 group-hover:text-gray-200 transition-colors duration-300 flex-grow">
              {truncateText(novel.description || '', 180)}
            </p>
            
            {/* Footer with genres and views */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap gap-2">
                {novel.genres?.slice(0, 2).map((genre) => (
                  <GenreTag key={genre.id} genre={genre} />
                ))}
                {novel.genres && novel.genres.length > 2 && (
                  <span className="text-xs text-gray-400 self-center">
                    +{novel.genres.length - 2} more
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {novel.views.toLocaleString()}
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "latest") {
    return (
      <article className="group relative overflow-visible h-35">
        <Link
          href={`/novel/${novel.slug}`}
          className="block relative h-full bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/60 rounded-xl p-4 hover:border-gray-500/80 transition-all duration-400 transform hover:scale-[1.01] hover:shadow-lg hover:shadow-gray-700/30 hover:z-20"
          aria-label={`Read ${novel.title} by ${novel.author}`}
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl" />
          
          <img src={novel.cover_image} 
              className="absolute top-0 right-0 h-full object-cover rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-400"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />

          <div className="relative z-10">
            {/* Title */}
            <h3 className="text-base font-semibold text-gray-200 group-hover:text-white transition-colors duration-300 mb-2 line-clamp-2 leading-snug">
              {novel.title}
            </h3>
            
            {/* Author */}
            <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors duration-300 font-medium">
              by {novel.author}
            </p>
            
            {/* Status and rating */}
            <div className="flex items-center justify-between">
              <StatusBadge status={novel.status} />
              <div className="flex items-center space-x-1 text-amber-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium">{typeof novel.rating === "number" ? novel.rating.toFixed(1) : "N/A"}</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Default: popular variant
  return (
    <article className="group relative overflow-visible h-55">
      <Link
        href={`/novel/${novel.slug}`}
        className="block relative h-full bg-gradient-to-br from-gray-800/70 to-gray-900/90 border border-gray-700/60 rounded-xl p-5 hover:border-gray-500/80 transition-all duration-400 transform hover:scale-[1.01] hover:shadow-xl hover:shadow-gray-700/25 hover:z-20"
        aria-label={`Read ${novel.title} by ${novel.author}`}
      >
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl" />
        
        <img src={novel.cover_image} 
            className="absolute top-0 right-0 h-full object-cover rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" 
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with title, author, and rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300 mb-1 line-clamp-2 leading-snug">
                {novel.title}
              </h3>
              <p className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300">
                by {novel.author}
              </p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <div className="flex items-center space-x-1 text-amber-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">{typeof novel.rating === "number" ? novel.rating.toFixed(1) : "N/A"}</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300 flex-grow">
            {truncateText(novel.description || '', 120)}
          </p>
          
          {/* Footer with genres and views */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {novel.genres?.slice(0, 2).map((genre) => (
                <GenreTag key={genre.id} genre={genre} />
              ))}
              {novel.genres && novel.genres.length > 2 && (
                <span className="text-xs text-gray-500 self-center font-medium">
                  +{novel.genres.length - 2}
                </span>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {novel.views.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
