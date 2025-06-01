"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useAuthContext } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { UserDropdown } from "./UserDropdown";

type SearchResult = {
  slug: string;
  title: string;
  author?: string;
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchNovels = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.novels.search(searchQuery));
        setSearchResults(response.data.novels || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchNovels, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
    setIsSearchVisible(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchVisible(false);
  };

  const toggleMobileSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-grey-900 via-grey-800 to-grey-900 shadow-2xl border-b border-grey-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-bold text-white hover:text-grey-200 transition-colors flex items-center flex-shrink-0">
              <span className="text-grey-300">📚</span>
              <span className="ml-2 bg-gradient-to-r from-white to-grey-100 bg-clip-text">
                RDKNovel
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search novels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="w-full px-4 py-2 pl-10 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-300/70 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:border-transparent backdrop-blur-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-grey-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Desktop Search Results Dropdown */}
              {isSearchOpen && (searchQuery.length >= 2 || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-grey-950/95 border border-grey-700/50 rounded-lg shadow-xl backdrop-blur-sm z-50 max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-grey-300">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((novel) => (
                      <Link
                        key={novel.slug}
                        href={`/novel/${novel.slug}`}
                        onClick={handleResultClick}
                        className="block p-3 hover:bg-grey-900/50 border-b border-grey-700/30 last:border-b-0 transition-colors"
                      >
                        <div className="text-white font-medium">{novel.title}</div>
                        {novel.author && (
                          <div className="text-grey-300/70 text-sm">by {novel.author}</div>
                        )}
                      </Link>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-grey-300">No novels found</div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-grey-100 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link href="/browse" className="text-grey-100 hover:text-white transition-colors font-medium">
                Browse
              </Link>
              <Link href="/recommendations" className="text-grey-100 hover:text-white transition-colors font-medium">
                Recommendations
              </Link>
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="text-grey-100 hover:text-white transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Mobile Search Button */}
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-grey-300 hover:text-white transition-colors"
                aria-label="Toggle search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-grey-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {isSearchVisible && (
        <div className="md:hidden bg-grey-900/95 border-b border-grey-700/50 backdrop-blur-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search novels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="w-full px-4 py-3 pl-10 pr-4 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-300/70 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:border-transparent backdrop-blur-sm text-base"
                  autoFocus
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-grey-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {/* Close Search Button */}
              <button
                onClick={() => setIsSearchVisible(false)}
                className="p-2 text-grey-300 hover:text-white transition-colors rounded-lg hover:bg-grey-800/50"
                aria-label="Close search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search Results */}
            {isSearchOpen && (searchQuery.length >= 2 || searchResults.length > 0) && (
              <div className="mt-3 bg-grey-950/95 border border-grey-700/50 rounded-lg shadow-xl backdrop-blur-sm max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-grey-300">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((novel) => (
                    <Link
                      key={novel.slug}
                      href={`/novel/${novel.slug}`}
                      onClick={handleResultClick}
                      className="block p-4 hover:bg-grey-900/50 border-b border-grey-700/30 last:border-b-0 transition-colors"
                    >
                      <div className="text-white font-medium text-base">{novel.title}</div>
                      {novel.author && (
                        <div className="text-grey-300/70 text-sm mt-1">by {novel.author}</div>
                      )}
                    </Link>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-grey-300">No novels found</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-grey-900/95 border-b border-grey-700/50 backdrop-blur-sm sticky top-16 z-40" ref={mobileMenuRef}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Mobile Menu Header with Close Button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-grey-700/30">
              <h3 className="text-white font-semibold text-lg">Menu</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-grey-300 hover:text-white transition-colors rounded-lg hover:bg-grey-800/50"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-grey-100 hover:text-white transition-colors font-medium text-lg py-2 border-b border-grey-700/30"
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-grey-100 hover:text-white transition-colors font-medium text-lg py-2 border-b border-grey-700/30"
              >
                Browse
              </Link>
              <Link 
                href="/recommendations" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-grey-100 hover:text-white transition-colors font-medium text-lg py-2 border-b border-grey-700/30"
              >
                Recommendations
              </Link>
              
              {/* Mobile Authentication Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-grey-700/30">
                  <div className="flex items-center space-x-3 mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-grey-600"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-grey-700 rounded-full flex items-center justify-center border-2 border-grey-600">
                        <span className="text-lg font-medium text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-grey-400 text-sm">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-grey-100 hover:text-white transition-colors font-medium py-2"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-library"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-grey-100 hover:text-white transition-colors font-medium py-2"
                    >
                      My Library
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-grey-100 hover:text-white transition-colors font-medium py-2"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left text-grey-100 hover:text-white transition-colors font-medium py-2"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-grey-700/30 space-y-3">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="w-full bg-grey-700 hover:bg-grey-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
}
