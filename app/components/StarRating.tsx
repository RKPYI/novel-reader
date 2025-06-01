'use client';

import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating || rating;
    
    if (starIndex <= currentRating) {
      return 'fill-yellow-400 text-yellow-400';
    } else if (starIndex - 0.5 <= currentRating) {
      return 'fill-yellow-400/50 text-yellow-400';
    } else {
      return 'fill-gray-300 text-gray-300';
    }
  };

  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starIndex = index + 1;
        return (
          <button
            key={starIndex}
            type="button"
            className={`
              ${sizeClasses[size]} 
              ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
              focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded
            `}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            disabled={!interactive}
            aria-label={`${starIndex} star${starIndex !== 1 ? 's' : ''}`}
          >
            <svg
              className={`${sizeClasses[size]} ${getStarFill(starIndex)} transition-colors duration-150`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
      
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {typeof rating === "number"
    ? rating.toFixed(1)
    : "N/A"} / {maxRating}
        </span>
      )}
    </div>
  );
};
