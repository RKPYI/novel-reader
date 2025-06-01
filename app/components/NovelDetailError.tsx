import Link from "next/link";

interface NovelDetailErrorProps {
  error: string;
}

export const NovelDetailError = ({ error }: NovelDetailErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-6xl text-gray-400 mb-4">⚠</div>
        <div className="text-xl text-gray-200 mb-2">{error}</div>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/browse" 
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    </div>
  );
};
