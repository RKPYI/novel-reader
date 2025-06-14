export const NovelDetailLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-6"></div>
        <div className="text-xl text-gray-200">Loading novel...</div>
        <div className="text-sm text-gray-400 mt-2">Preparing your reading experience</div>
      </div>
    </div>
  );
};
