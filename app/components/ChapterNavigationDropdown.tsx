import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChapterListItem } from '../hooks/useChapterReader';

interface ChapterNavigationDropdownProps {
  chapters: ChapterListItem[];
  currentChapterId: number | undefined;
  onNavigateToChapter: (chapterNumber: number) => void;
}

export const ChapterNavigationDropdown: React.FC<ChapterNavigationDropdownProps> = ({
  chapters,
  currentChapterId,
  onNavigateToChapter
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentChapter = chapters.find(ch => ch.id === currentChapterId);
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);

  // Debug logging
  console.log('ChapterNavigationDropdown Debug:', {
    currentChapterId,
    chaptersLength: chapters.length,
    chapters: chapters.map(ch => ({ id: ch.id, chapter_number: ch.chapter_number, title: ch.title })),
    currentChapter,
    currentIndex,
    firstFewChapterIds: chapters.slice(0, 5).map(ch => ch.id)
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChapterSelect = () => {
    setIsOpen(false);
  };

  if (chapters.length === 0) {
    return <div className="text-red-500">No chapters available</div>;
  }

  if (!currentChapter) {
    return (
      <div className="text-yellow-500 text-sm p-4 bg-yellow-100/10 rounded">
        <div>Current chapter not found (ID: {currentChapterId})</div>
        <div className="mt-2 text-xs">
          Available chapters: {chapters.slice(0, 3).map(ch => `${ch.id}(#${ch.chapter_number})`).join(', ')}
          {chapters.length > 3 && ` ... and ${chapters.length - 3} more`}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-auto min-w-[100px] md:min-w-[280px] px-4 py-2 bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 rounded-lg transition-colors border border-gray-800/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full text-sm font-medium">
            {currentChapter.chapter_number}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-200 truncate max-w-[100px] md:max-w-[180px]">
              {currentChapter.title}
            </div>
            <div className="text-xs text-gray-400">
              Chapter {currentChapter.chapter_number} of {chapters.length}
            </div>
          </div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full md:w-[400px] max-h-[400px] bg-gray-950/95 border border-gray-800/50 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-800/50">
            <div className="text-sm font-medium text-gray-300">Select Chapter</div>
            <div className="text-xs text-gray-400 mt-1">
              {chapters.length} chapters available
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {chapters.map((chapter, index) => {
              const isCurrent = chapter.id === currentChapterId;
              const isRead = index < currentIndex;
              return (
                <button
                  key={chapter.chapter_number}
                  onClick={() => {
                    onNavigateToChapter(chapter.chapter_number);
                    handleChapterSelect();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-800/30 last:border-b-0 text-left
                    ${isCurrent
                      ? 'bg-gray-600/30 text-gray-100'
                      : 'hover:bg-gray-900/50 text-gray-300'
                    }
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${isCurrent
                      ? 'bg-gray-500 text-white'
                      : isRead
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-800 text-gray-400'
                    }
                  `}>
                    {chapter.chapter_number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`
                      text-sm font-medium truncate
                      ${isCurrent ? 'text-gray-100' : 'text-gray-200'}
                    `}>
                      {chapter.title}
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>Chapter {chapter.chapter_number}</span>
                      {chapter.word_count && (
                        <>
                          <span>•</span>
                          <span>{chapter.word_count.toLocaleString()} words</span>
                        </>
                      )}
                      {isRead && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">Read</span>
                        </>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="flex items-center justify-center w-5 h-5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
