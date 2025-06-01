import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export type Novel = {
  title: string;
  slug: string;
  author: string;
};

export type Chapter = {
  id: number;
  title: string;
  content: string;
  chapter_number: number;
  word_count?: number;
  next_chapter?: number;
  previous_chapter?: number;
};

export type ReadingProgress = {
  novel_slug: string;
  user_id: number;
  current_chapter: {
    id: number;
    chapter_number: number;
    title: string;
  } | null;
  progress_percentage: number;
  last_read_at: string;
  total_chapters: number;
};

export type ReadingSettings = {
  fontSize: number;
  lineHeight: number;
  theme: 'dark' | 'sepia' | 'light';
  autoScroll: boolean;
};

export type ChapterListItem = {
  id: number;
  title: string;
  chapter_number: number;
  word_count?: number;
};

interface UseChapterReaderReturn {
  novel: Novel | null;
  chapter: Chapter | null;
  chapters: ChapterListItem[];
  readingSettings: ReadingSettings;
  readingProgress: ReadingProgress | null;
  isLoading: boolean;
  error: string | null;
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  updateReadingSettings: (newSettings: Partial<ReadingSettings>) => void;
  markAsRead: () => Promise<void>;
  navigateToChapter: (chapterNumber: number) => void;
  navigateToPrevious: () => void;
  navigateToNext: () => void;
  canNavigatePrevious: boolean;
  canNavigateNext: boolean;
}

export const useChapterReader = (
  novelSlug: string | string[] | undefined,
  chapterNumber: string | string[] | undefined
): UseChapterReaderReturn => {
  const [novelData, setNovelData] = useState<Novel | null>(null);
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    lineHeight: 1.7,
    theme: 'dark',
    autoScroll: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const router = useRouter();

  // Normalize parameters to strings
  const slug = Array.isArray(novelSlug) ? novelSlug[0] : novelSlug;
  const chapterNum = Array.isArray(chapterNumber) ? chapterNumber[0] : chapterNumber;

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('readingSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('readingSettings', JSON.stringify(settings));
  }, [settings]);

  // Fetch chapter data, reading progress, and chapters list
  useEffect(() => {
    if (!slug || !chapterNum) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch chapter data using new slug-based API
        const chapterResponse = await axios.get(
          API_ENDPOINTS.novels.chapter(slug, chapterNum)
        );
        setNovelData(chapterResponse.data.novel);
        setChapterData(chapterResponse.data.chapter);

        // Fetch all chapters for navigation dropdown using new slug-based API
        const chaptersResponse = await axios.get(API_ENDPOINTS.novels.chapters(slug));
        setChapters(chaptersResponse.data.chapters || []);

        // Fetch reading progress using new slug-based API
        try {
          const progressResponse = await axios.get(
            API_ENDPOINTS.novels.readingProgress(slug, 1)
          );
          if (progressResponse.data.current_chapter) {
            setReadingProgress(progressResponse.data);
          }
        } catch (error) {
          console.log("No existing progress found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chapter. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, chapterNum]);

  // Track reading time
  useEffect(() => {
    if (chapterData && !isReading) {
      setIsReading(true);
      startTimeRef.current = Date.now();
    }

    return () => {
      if (isReading && startTimeRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setReadingTime(prev => prev + timeSpent);
      }
    };
  }, [chapterData, isReading]);

  // Auto-update progress when chapter is completed
  useEffect(() => {
    if (chapterData && readingTime > 30) { // If reading for more than 30 seconds
      updateProgress();
    }
  }, [readingTime]);

  // Update reading progress
  const updateProgress = async () => {
    if (!chapterData || !slug || !chapterNum) return;

    try {
      const progressData = {
        chapter_number: parseInt(chapterNum),
        user_id: 1 // Default user for now
      };

      if (readingProgress && readingProgress.current_chapter) {
        // Update existing progress - use PUT endpoint
        await axios.put(
          API_ENDPOINTS.novels.updateProgress(slug),
          progressData
        );
      } else {
        // Create new progress
        await axios.post(
          API_ENDPOINTS.novels.updateProgress(slug),
          progressData
        );
      }
      
      // Refresh the reading progress after update
      const progressResponse = await axios.get(
        API_ENDPOINTS.novels.readingProgress(slug, 1)
      );
      if (progressResponse.data.current_chapter) {
        setReadingProgress(progressResponse.data);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Calculate estimated reading time
  const getEstimatedReadingTime = () => {
    if (!chapterData?.word_count) return null;
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(chapterData.word_count / wordsPerMinute);
    return minutes;
  };

  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'light':
        return 'bg-white text-gray-900';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-grey-950/20 text-grey-100';
    }
  };

  // Navigation functions
  const navigateToChapter = (chapterNumber: number) => {
    router.push(`/novel/${slug}/chapter/${chapterNumber}`);
  };

  const navigateToPrevious = () => {
    if (chapterData?.previous_chapter) {
      router.push(`/novel/${slug}/chapter/${chapterData.previous_chapter}`);
    }
  };

  const navigateToNext = () => {
    if (chapterData?.next_chapter) {
      router.push(`/novel/${slug}/chapter/${chapterData.next_chapter}`);
    }
  };

  const canNavigatePrevious = Boolean(chapterData?.previous_chapter);
  const canNavigateNext = Boolean(chapterData?.next_chapter);

  const updateReadingSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markAsRead = async () => {
    await updateProgress();
  };

  return {
    novel: novelData,
    chapter: chapterData,
    chapters,
    readingSettings: settings,
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
  };
};
