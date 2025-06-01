import { useState, useEffect } from "react";
import axios from "axios";
import { Novel, Chapter } from "../types";
import { API_ENDPOINTS } from "../config/api";

interface UseNovelDetailReturn {
  novel: Novel | null;
  chapters: Chapter[];
  isLoading: boolean;
  error: string | null;
}

export const useNovelDetail = (slug: string | string[] | undefined): UseNovelDetailReturn => {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch novel details using slug
        const novelResponse = await axios.get(API_ENDPOINTS.novels.detail(slug as string));
        setNovel(novelResponse.data.novel);

        // Fetch chapters using novel slug
        const chaptersResponse = await axios.get(API_ENDPOINTS.novels.chapters(slug as string));
        setChapters(chaptersResponse.data.chapters || []);
      } catch (error) {
        console.error("Error fetching novel data:", error);
        setError("Failed to load novel. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  return {
    novel,
    chapters,
    isLoading,
    error,
  };
};
