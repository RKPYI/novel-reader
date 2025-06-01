'use client';

import { useChapterReader } from '../hooks/useChapterReader';
import {
  ChapterPageHeader,
  ChapterContent,
  ReadingProgressIndicator,
  ChapterNavigationButtons,
  ReadingSettingsPanel,
  ReadingStats
} from './index';

interface ChapterReaderPageProps {
  novelSlug: string;
  chapterNumber: string;
}

export default function ChapterReaderPage({ novelSlug, chapterNumber }: ChapterReaderPageProps) {
  const {
    novel,
    chapter,
    chapters,
    readingSettings,
    readingProgress,
    isLoading,
    error,
    showSettings,
    setShowSettings,
    updateReadingSettings,
    markAsRead,
    navigateToChapter,
    navigateToPrevious,
    navigateToNext,
    canNavigatePrevious,
    canNavigateNext
  } = useChapterReader(novelSlug, chapterNumber);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Chapter</h1>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!novel || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">Chapter Not Found</h1>
          <p className="text-gray-500">The requested chapter could not be found.</p>
        </div>
      </div>
    );
  }

  // Enhanced background system for better reading experience
  const getBackgroundClasses = () => {
    switch (readingSettings.theme) {
      case 'light':
        return 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-900 transition-all duration-700 ease-in-out';
      case 'sepia':
        return 'min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-amber-900 transition-all duration-700 ease-in-out';
      case 'dark':
      default:
        return 'min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-gray-100 transition-all duration-700 ease-in-out';
    }
  };

  const getTextClasses = () => {
    switch (readingSettings.theme) {
      case 'light':
        return 'text-gray-900';
      case 'sepia':
        return 'text-amber-900';
      case 'dark':
      default:
        return 'text-gray-100';
    }
  };

  const getOverlayClasses = () => {
    switch (readingSettings.theme) {
      case 'light':
        return 'absolute inset-0 opacity-3 pointer-events-none bg-gradient-to-br from-blue-100/20 via-transparent to-slate-100/20';
      case 'sepia':
        return 'absolute inset-0 opacity-3 pointer-events-none bg-gradient-to-br from-amber-100/20 via-transparent to-orange-100/20';
      case 'dark':
      default:
        return 'absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-indigo-800/20 via-transparent to-slate-800/20';
    }
  };

  // Compute if current chapter is read
  const isCurrentChapterRead = (): boolean => {
    if (!readingProgress || !chapter) return false;
    return readingProgress.current_chapter !== null && 
           readingProgress.current_chapter.chapter_number >= chapter.chapter_number;
  };

  return (
    <div className={getBackgroundClasses()}>
      {/* Enhanced reading environment overlay */}
      <div className={getOverlayClasses()}>
        <div className="w-full h-full" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 183, 197, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(139, 69, 19, 0.05) 0%, transparent 50%)
            `,
            backgroundSize: '600px 600px, 800px 800px, 400px 400px',
            backgroundPosition: '0% 0%, 100% 0%, 50% 100%'
          }} 
        />
      </div>

      {/* Reading Progress Indicator */}
      <ReadingProgressIndicator 
        readingProgress={readingProgress} 
        theme={readingSettings.theme}
      />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Novel Title */}
        <h1 className={`text-3xl font-bold mb-6 text-center ${getTextClasses()}`}>
          {novel.title}
        </h1>

        {/* Chapter Header */}
        <ChapterPageHeader
          novel={novel}
          chapter={chapter}
          chapters={chapters}
          novelSlug={novelSlug}
          onNavigateToChapter={navigateToChapter}
          onToggleSettings={() => setShowSettings(!showSettings)}
          showSettings={showSettings}
        />

                {/* Navigation Buttons */}
        <ChapterNavigationButtons
          onPrevious={navigateToPrevious}
          onNext={navigateToNext}
          canNavigatePrevious={canNavigatePrevious}
          canNavigateNext={canNavigateNext}
          theme={readingSettings.theme}
          chapters={chapters}
          currentChapter={chapter}
          onNavigateToChapter={navigateToChapter}
        />

        {/* Reading Settings Panel */}
        {showSettings && (
          <ReadingSettingsPanel
            settings={readingSettings}
            onUpdateSettings={updateReadingSettings}
            onMarkAsRead={markAsRead}
            onClose={() => setShowSettings(false)}
            isRead={isCurrentChapterRead()}
          />
        )}

        {/* Chapter Content */}
        <ChapterContent
          chapter={chapter}
          readingSettings={readingSettings}
        />

        {/* Reading Stats */}
        <ReadingStats
          chapter={chapter}
          readingProgress={readingProgress}
          theme={readingSettings.theme}
        />

        {/* Navigation Buttons */}
        <ChapterNavigationButtons
          onPrevious={navigateToPrevious}
          onNext={navigateToNext}
          canNavigatePrevious={canNavigatePrevious}
          canNavigateNext={canNavigateNext}
          theme={readingSettings.theme}
          chapters={chapters}
          currentChapter={chapter}
          onNavigateToChapter={navigateToChapter}
        />
      </div>
    </div>
  );
}
