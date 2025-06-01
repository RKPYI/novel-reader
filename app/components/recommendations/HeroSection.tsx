export const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="absolute inset-0 bg-gray-800/10 opacity-40"></div>
      <div className="relative container mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
          Recommendations
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Discover your next obsession. Our algorithms have selected these tales just for you.
        </p>
        <div className="flex items-center justify-center space-x-2 text-gray-300/70">
          <span className="text-2xl">📚</span>
          <span>Curated for your reading pleasure</span>
        </div>
      </div>
    </section>
  );
};
