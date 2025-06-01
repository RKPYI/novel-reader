import React from 'react';
import Link from 'next/link';
import { ChapterListItem, Chapter, Novel } from '../hooks/useChapterReader';

interface ChapterPageHeaderProps {
  novel: Novel | null;
  chapter: Chapter | null;
  chapters: ChapterListItem[];
  novelSlug: string;
  onNavigateToChapter: (chapterNumber: number) => void;
  onToggleSettings: () => void;
  showSettings: boolean;
}

export const ChapterPageHeader: React.FC<ChapterPageHeaderProps> = ({
  novel,
  chapter,
  novelSlug,
  onToggleSettings,
  showSettings,
}) => {
  const getButtonColors = (isActive: boolean) => {
    if (isActive) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Back to chapter list - Left side on desktop, top on mobile */}
        <Link
          href={`/novel/${novelSlug}`}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline transition-colors group"
        >
          <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm md:text-base">Back to chapter list</span>
        </Link>

        {/* Settings button - Right side on desktop, bottom on mobile */}
        {/* <button
          onClick={onToggleSettings}
          className={`inline-flex items-center px-3 md:px-4 py-2 border rounded-lg transition-all duration-200 text-sm md:text-base ${getButtonColors(showSettings)}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">{showSettings ? 'Hide Settings' : 'Reading Settings'}</span>
          <span className="sm:hidden">Settings</span>
        </button> */}
      </div>

      {/* Chapter info - Mobile responsive */}
      {/* {chapter && (
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Chapter {chapter.chapter_number}
          </h2>
          {chapter.title && chapter.title !== `Chapter ${chapter.chapter_number}` && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
              {chapter.title}
            </p>
          )}
        </div>
      )} */}
    </div>
  );
};
