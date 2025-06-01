import { useEffect, useState } from "react";
import axios from "axios";
import { Novel } from "./useNovels";
import { API_ENDPOINTS } from "../config/api";

export interface RecommendationsState {
  recommendations: Novel[];
  isLoading: boolean;
  error: string | null;
}

export const useRecommendations = (): RecommendationsState & { refetch: () => Promise<void> } => {
  const [recommendations, setRecommendations] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(API_ENDPOINTS.novels.recommendations);
      setRecommendations(response.data.novels || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to load recommendations. Please try again later.");
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const refetch = async () => {
    await fetchRecommendations();
  };

  return {
    recommendations,
    isLoading,
    error,
    refetch,
  };
};