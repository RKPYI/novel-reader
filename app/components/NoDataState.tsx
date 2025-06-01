import Link from "next/link";

export const NoDataState = () => {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-6">
        <div className="text-6xl text-gray-500 mb-6">📚</div>
        <h2 className="text-2xl font-bold text-gray-300 mb-4">No novels available yet</h2>
        <p className="text-gray-400 mb-8">Start building your reading collection...</p>
        <Link href="/browse" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          Explore Collection
        </Link>
      </div>
    </section>
  );
};
