import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Title */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-1">
              RDKNovel
            </h3>
            <p className="text-gray-400 text-sm">
              Web Novel Gratis
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link href="/browse" className="text-gray-400 hover:text-white transition-colors text-sm">
              Browse
            </Link>
            <Link href="/recommendations" className="text-gray-400 hover:text-white transition-colors text-sm">
              Recommendations
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © 2025 RDKNovel
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}