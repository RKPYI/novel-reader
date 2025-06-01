import Link from "next/link";

interface ErrorSectionProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorSection = ({ error, onRetry }: ErrorSectionProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-6xl text-gray-400 mb-4">⚠</div>
        <div className="text-xl text-gray-200 mb-2">{error}</div>
        <div className="flex gap-4 justify-center">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          <Link 
            href="/browse" 
            className="px-6 py-2 border-2 border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white rounded-lg transition-colors"
          >
            Browse All
          </Link>
        </div>
      </div>
    </div>
  );
};
