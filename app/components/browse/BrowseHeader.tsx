interface BrowseHeaderProps {
  title?: string;
  subtitle?: string;
}

export const BrowseHeader = ({ 
  title = "Browse Novels", 
  subtitle = "Discover your next great read from our extensive collection of novels" 
}: BrowseHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
        {title.split(' ').map((word, index) => (
          <span key={index}>
            {index === 0 ? word : <span className="text-gray-400">{word}</span>}
            {index < title.split(' ').length - 1 && ' '}
          </span>
        ))}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};
