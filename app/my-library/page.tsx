"use client";
import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuthContext } from '../contexts/AuthContext';

export default function MyLibraryPage() {
  const { user } = useAuthContext();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-grey-950">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
            <p className="text-grey-300">Your bookmarked novels, reading progress, and favorites</p>
          </div>

          {/* Library Sections */}
          <div className="space-y-8">
            {/* Currently Reading */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Currently Reading</h2>
              <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-8">
                <div className="text-center text-grey-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-lg mb-2">No novels in progress</p>
                  <p className="text-sm">Start reading a novel to see your progress here</p>
                  <a
                    href="/browse"
                    className="inline-block mt-4 px-4 py-2 bg-grey-700 hover:bg-grey-600 text-white rounded-lg transition-colors"
                  >
                    Browse Novels
                  </a>
                </div>
              </div>
            </section>

            {/* Bookmarked Novels */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Bookmarked Novels</h2>
              <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-8">
                <div className="text-center text-grey-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-lg mb-2">No bookmarked novels</p>
                  <p className="text-sm">Bookmark novels to read later</p>
                  <a
                    href="/browse"
                    className="inline-block mt-4 px-4 py-2 bg-grey-700 hover:bg-grey-600 text-white rounded-lg transition-colors"
                  >
                    Discover Novels
                  </a>
                </div>
              </div>
            </section>

            {/* Completed Novels */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Completed Novels</h2>
              <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-8">
                <div className="text-center text-grey-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg mb-2">No completed novels</p>
                  <p className="text-sm">Novels you've finished reading will appear here</p>
                </div>
              </div>
            </section>

            {/* Reading Statistics */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Reading Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">0</div>
                  <div className="text-grey-300">Novels Read</div>
                </div>
                <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">0</div>
                  <div className="text-grey-300">Chapters Read</div>
                </div>
                <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">0</div>
                  <div className="text-grey-300">Hours Reading</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
