'use client';

import React from 'react';
import { Rating } from '../types';
import { StarRating } from './StarRating';

interface RatingDisplayProps {
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
  userRating?: Rating | null;
  className?: string;
}

interface RatingBreakdown {
  [key: number]: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  ratings,
  averageRating,
  totalRatings,
  userRating,
  className = '',
}) => {
  // Calculate rating breakdown
  const ratingBreakdown: RatingBreakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratings.forEach((rating) => {
    if (rating.rating >= 1 && rating.rating <= 5) {
      ratingBreakdown[rating.rating] = (ratingBreakdown[rating.rating] || 0) + 1;
    }
  });

  const getPercentage = (count: number): number => {
    return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reader Ratings
        </h3>
        {userRating && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Your rating: <StarRating rating={userRating.rating} size="sm" interactive={false} />
          </div>
        )}
      </div>

      {totalRatings === 0 ? (
        /* No Ratings State */
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No ratings yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to rate this novel!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {typeof averageRating === "number"
    ? averageRating.toFixed(1)
    : "N/A"}
            </div>
            <StarRating rating={averageRating} size="lg" interactive={false} />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              Rating Breakdown
            </h4>
            
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingBreakdown[star];
              const percentage = getPercentage(count);
              
              return (
                <div key={star} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {star}
                    </span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="w-12 text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                  </div>
                  
                  <div className="w-12 text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPercentage(ratingBreakdown[5] + ratingBreakdown[4]).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Positive (4-5★)
                </div>
              </div>
              
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPercentage(ratingBreakdown[3]).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Neutral (3★)
                </div>
              </div>
              
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPercentage(ratingBreakdown[2] + ratingBreakdown[1]).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Critical (1-2★)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
