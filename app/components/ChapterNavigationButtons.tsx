import React from 'react';
import { ChapterNavigationDropdown } from './ChapterNavigationDropdown';
import { ChapterListItem, Chapter } from '../hooks/useChapterReader';

interface ChapterNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
  theme: 'dark' | 'sepia' | 'light';
  chapters?: ChapterListItem[];
  currentChapter?: Chapter;
  onNavigateToChapter?: (chapterNumber: number) => void;
}

export const ChapterNavigationButtons: React.FC<ChapterNavigationButtonsProps> = ({
  onPrevious,
  onNext,
  canNavigatePrevious,
  canNavigateNext,
  theme,
  chapters = [],
  currentChapter,
  onNavigateToChapter
}) => {
  const getButtonColors = () => {
    if (theme === 'light') {
      return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25';
    } else if (theme === 'sepia') {
      return 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25';
    } else {
      return 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-500/25 border border-gray-600/50';
    }
  };

  const getDisabledColors = () => {
    if (theme === 'light') {
      return 'bg-gray-200 text-gray-400 border border-gray-300';
    } else if (theme === 'sepia') {
      return 'bg-amber-200/50 text-amber-400 border border-amber-300/50';
    } else {
      return 'bg-gray-800/50 text-gray-500 border border-gray-700/50';
    }
  };

  const getBorderColor = () => {
    if (theme === 'light') {
      return 'border-gray-300';
    } else if (theme === 'sepia') {
      return 'border-amber-300/30';
    } else {
      return 'border-gray-700/50';
    }
  };

  return (
    <div className={`flex flex-col gap-4 pt-6 md:pt-8 mt-6 md:mt-8 rounded-lg p-4 md:p-6`}>
      
      {/* Navigation Layout: Previous [Dropdown] Next */}
      <div className="flex flex-col gap-4">
        {/* Mobile Layout - Single row: [←] [Dropdown] [→] */}
        <div className="flex sm:hidden items-center gap-3">
          {/* Previous Button - Mobile (Arrow only) */}
          <div className="flex-shrink-0">
            {canNavigatePrevious ? (
              <button
                onClick={onPrevious}
                className={`inline-flex items-center justify-center w-12 h-12 ${getButtonColors()} rounded-lg transition-all duration-200 transform hover:scale-105`}
                aria-label="Previous Chapter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <div className={`inline-flex items-center justify-center w-12 h-12 ${getDisabledColors()} rounded-lg cursor-not-allowed`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            )}
          </div>

          {/* Dropdown - Mobile (Center, flexible width) */}
          {chapters.length > 0 && currentChapter && onNavigateToChapter && (
            <div className="flex-1 flex justify-center">
              <ChapterNavigationDropdown
                chapters={chapters}
                currentChapterId={currentChapter.id}
                onNavigateToChapter={onNavigateToChapter}
              />
            </div>
          )}

          {/* Next Button - Mobile (Arrow only) */}
          <div className="flex-shrink-0">
            {canNavigateNext ? (
              <button
                onClick={onNext}
                className={`inline-flex items-center justify-center w-12 h-12 ${getButtonColors()} rounded-lg transition-all duration-200 transform hover:scale-105`}
                aria-label="Next Chapter"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className={`inline-flex items-center justify-center w-12 h-12 ${getDisabledColors()} rounded-lg cursor-not-allowed`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Single row with dropdown in center */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Previous Button - Desktop */}
          <div className="flex-1">
            {canNavigatePrevious ? (
              <button
                onClick={onPrevious}
                className={`w-full sm:w-auto inline-flex items-center justify-start px-4 md:px-6 py-3 ${getButtonColors()} rounded-lg transition-all duration-200 transform hover:scale-105 font-medium text-sm md:text-base`}
              >
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous Chapter</span>
              </button>
            ) : (
              <div className={`w-full sm:w-auto inline-flex items-center justify-start px-4 md:px-6 py-3 ${getDisabledColors()} rounded-lg cursor-not-allowed font-medium text-sm md:text-base`}>
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous Chapter</span>
              </div>
            )}
          </div>

          {/* Dropdown - Desktop Center */}
          {chapters.length > 0 && currentChapter && onNavigateToChapter && (
            <div className="flex-shrink-0">
              <ChapterNavigationDropdown
                chapters={chapters}
                currentChapterId={currentChapter.id}
                onNavigateToChapter={onNavigateToChapter}
              />
            </div>
          )}

          {/* Next Button - Desktop */}
          <div className="flex-1 text-right">
            {canNavigateNext ? (
              <button
                onClick={onNext}
                className={`w-full sm:w-auto inline-flex items-center justify-end px-4 md:px-6 py-3 ${getButtonColors()} rounded-lg transition-all duration-200 transform hover:scale-105 font-medium text-sm md:text-base`}
              >
                <span>Next Chapter</span>
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className={`w-full sm:w-auto inline-flex items-center justify-end px-4 md:px-6 py-3 ${getDisabledColors()} rounded-lg cursor-not-allowed font-medium text-sm md:text-base`}>
                <span>Next Chapter</span>
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
