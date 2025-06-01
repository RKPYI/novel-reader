import React from 'react';
import { ReadingProgress } from '../hooks/useChapterReader';

interface ReadingProgressIndicatorProps {
  readingProgress: ReadingProgress | null;
  theme: 'dark' | 'sepia' | 'light';
}

export const ReadingProgressIndicator: React.FC<ReadingProgressIndicatorProps> = ({
  readingProgress,
  theme
}) => {
  if (!readingProgress || !readingProgress.current_chapter) {
    return null;
  }

  const { current_chapter, progress_percentage, last_read_at, total_chapters } = readingProgress;

  return (
    <div className="mt-6 p-4 bg-grey-950/20 border border-grey-800/30 rounded-lg text-center">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-grey-300">
          Reading Progress
        </div>
        <div className="text-sm text-grey-400">
          {progress_percentage.toFixed(1)}% Complete
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-grey-800/50 rounded-full h-2 mb-3">
        <div 
          className="bg-gradient-to-r from-grey-600 to-grey-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress_percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-grey-300">
          Chapter {current_chapter.chapter_number} of {total_chapters}
        </div>
        <div className="text-xs text-grey-400/70">
          Last read: {new Date(last_read_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
