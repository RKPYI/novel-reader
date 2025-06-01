import React from 'react';

// filepath: /home/randk/repo/scrape/novel-reader/app/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16',
  };

  const spinnerElement = (
    <div className={`animate-spin rounded-full border-b-2 border-gray-400 ${sizeClasses[size]}`} />
  );

  if (size === 'small') {
    return <div className={`inline-block ${className}`}>{spinnerElement}</div>;
  }

  if (fullScreen) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gray-900 ${className}`}>
        <div className="text-center">
          <div className="mx-auto mb-6">{spinnerElement}</div>
          <div className="text-xl text-gray-200">{text || 'Loading stories...'}</div>
          <div className="text-sm text-gray-400 mt-2">Gathering your collection</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="mx-auto">{spinnerElement}</div>
        {text && <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{text}</div>}
      </div>
    </div>
  );
};

// Default export for backward compatibility
export default LoadingSpinner;
