'use client';

import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { useAuthContext } from '../contexts/AuthContext';
import { Rating } from '../types';

interface RatingFormProps {
  novelId: number;
  novelTitle: string;
  userRating?: Rating | null;
  onSubmitRating: (rating: number, review?: string) => Promise<void>;
  onDeleteRating?: () => Promise<void>;
  className?: string;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  novelId,
  novelTitle,
  userRating,
  onSubmitRating,
  onDeleteRating,
  className = '',
}) => {
  const { isAuthenticated, user } = useAuthContext();
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmitRating(rating, review.trim() || undefined);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteRating || !userRating) return;

    if (!confirm('Are you sure you want to delete your rating?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onDeleteRating();
      setRating(0);
      setReview('');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setRating(userRating?.rating || 0);
    setReview(userRating?.review || '');
    setError(null);
  };

  if (!isAuthenticated) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Rate this Novel</h3>
        <p className="text-gray-400">Please log in to rate and review this novel.</p>
      </div>
    );
  }

  // Display existing rating (not editing)
  if (userRating && !isEditing) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Rating</h3>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            {onDeleteRating && (
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={userRating.rating} size="md" />
          <span className="text-white font-medium">{userRating.rating}/5</span>
        </div>
        
        {userRating.review && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{userRating.review}</p>
          </div>
        )}
      </div>
    );
  }

  // Rating form (new rating or editing)
  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">
        {userRating ? 'Edit Your Rating' : 'Rate this Novel'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            interactive
            onRatingChange={setRating}
            size="lg"
            className="mb-2"
          />
          {rating > 0 && (
            <p className="text-sm text-gray-400">You rated this {rating}/5 stars</p>
          )}
        </div>

        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-2">
            Review (Optional)
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={`Share your thoughts about "${novelTitle}"...`}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/1000 characters
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !rating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : (userRating ? 'Update Rating' : 'Submit Rating')}
          </button>
          
          {userRating && isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
