import { useState, useEffect, useCallback } from 'react';
import { Rating, RatingStats } from '../types';
import { ratingService, handleApiError } from '../services/commentRatingService';

export const useRatings = (novelId: string | null | undefined) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchRatings = useCallback(async () => {
    // Early return if novelId is not available
    if (!novelId || novelId.trim() === '') {
      setLoading(false);
      setRatings([]);
      setStats(null);
      setUserRating(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [ratingsResponse, userRatingResponse] = await Promise.all([
        ratingService.getNovelRatings(novelId),
        ratingService.getUserRating(novelId).catch(() => ({ data: { rating: null } }))
      ]);

      setRatings(ratingsResponse.ratings.data);
      setStats(ratingsResponse.stats);
      setUserRating(userRatingResponse?.data?.rating || null);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [novelId]);

  const submitRating = useCallback(async (rating: number, review?: string) => {
    // Early return if novelId is not available
    if (!novelId || novelId.trim() === '') {
      throw new Error('Novel ID is required to submit a rating');
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await ratingService.createRating({
        novel_id: parseInt(novelId),
        rating,
        review,
      });

      if (response?.data?.rating) {
        setUserRating(response.data.rating);
        
        // Add to ratings list if not already there
        setRatings(prev => {
          const exists = prev.find(r => r.id === response.data!.rating!.id);
          if (!exists) {
            return [response.data!.rating!, ...prev];
          }
          return prev.map(r => r.id === response.data!.rating!.id ? response.data!.rating! : r);
        });
      }
      
      // Update stats with new averages (preserve existing breakdown)
      if (response?.data?.novel_stats) {
        setStats(prev => prev ? {
          ...prev,
          average_rating: response.data!.novel_stats!.average_rating,
          total_ratings: response.data!.novel_stats!.total_ratings,
        } : null);
      }

      return response?.data?.rating;
    } catch (err: any) {
      setError(handleApiError(err));
      throw new Error(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  }, [novelId]);

  const deleteRating = useCallback(async (ratingId: number) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await ratingService.deleteRating(ratingId);
      
      setUserRating(null);
      
      // Remove from ratings list
      setRatings(prev => prev.filter(r => r.id !== ratingId));
      
      // Update stats (preserve existing breakdown)
      if (response?.data?.novel_stats) {
        setStats(prev => prev ? {
          ...prev,
          average_rating: response.data!.novel_stats!.average_rating,
          total_ratings: response.data!.novel_stats!.total_ratings,
        } : null);
      }
    } catch (err: any) {
      setError(handleApiError(err));
      throw new Error(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return {
    ratings,
    stats,
    userRating,
    loading,
    error,
    submitting,
    submitRating,
    deleteRating,
    refetch: fetchRatings,
  };
};
