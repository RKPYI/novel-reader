import Link from "next/link";

export const BackToHomeSection = () => {
  return (
    <section className="py-8 border-t border-gray-700/30">
      <div className="container mx-auto px-6 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </section>
  );
};
