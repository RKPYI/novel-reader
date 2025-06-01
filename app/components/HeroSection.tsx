import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="absolute inset-0 bg-gray-800/10 opacity-40"></div>
      <div className="relative container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
          Novel <span className="text-gray-400">Reader</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          This is a fan-made site with no official affiliation or monetization—just a place to enjoy and discover great stories.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gray-700/25">
            Explore Collection
          </Link>
          <Link href="/recommendations" className="px-8 py-3 border-2 border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white font-semibold rounded-lg transition-all duration-300">
            Get Recommendations
          </Link>
        </div>
      </div>
    </section>
  );
};
