import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export type Genre = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

export type Novel = {
  slug: string;
  title: string;
  author?: string;
  description?: string;
  cover_image?: string;
  status: string;
  rating: string;
  views: number;
  genres?: Genre[];
};

export const useNovels = () => {
  const [popularNovels, setPopularNovels] = useState<Novel[]>([]);
  const [latestNovels, setLatestNovels] = useState<Novel[]>([]);
  const [featuredNovels, setFeaturedNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch popular novels
        const popularResponse = await axios.get(API_ENDPOINTS.novels.popular);
        setPopularNovels(popularResponse.data.novels || []);

        // Fetch latest novels
        const latestResponse = await axios.get(API_ENDPOINTS.novels.latest);
        setLatestNovels(latestResponse.data.novels || []);

        // Set featured novels (top 3 popular for now)
        setFeaturedNovels((popularResponse.data.novels || []).slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load novels. Please try again later.");
        setPopularNovels([]);
        setLatestNovels([]);
        setFeaturedNovels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    popularNovels,
    latestNovels,
    featuredNovels,
    isLoading,
    error,
  };
};
