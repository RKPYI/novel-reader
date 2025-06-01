import React from 'react';
import { Chapter, ReadingProgress } from '../hooks/useChapterReader';

interface ReadingStatsProps {
  chapter: Chapter | null;
  readingProgress: ReadingProgress | null;
  theme: 'dark' | 'sepia' | 'light';
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({
  chapter,
  readingProgress,
  theme
}) => {
  const getEstimatedReadingTime = () => {
    if (!chapter?.word_count) return null;
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(chapter.word_count / wordsPerMinute);
    return minutes;
  };
  const estimatedReadingTime = getEstimatedReadingTime();

  return (
    <div className={`hidden md:flex items-center gap-4 text-sm ${
      theme === 'dark' ? 'text-grey-300' : 
      theme === 'sepia' ? 'text-amber-700' : 
      'text-gray-600'
    }`}>
      {chapter?.word_count && (
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {chapter.word_count.toLocaleString()} words
        </span>
      )}
      {estimatedReadingTime && (
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ~{estimatedReadingTime} min read
        </span>
      )}
      {readingProgress && (
        <span className="flex items-center gap-1 text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Progress: {readingProgress.progress_percentage}%
        </span>
      )}
    </div>
  );
};
