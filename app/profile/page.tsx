"use client";
import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuthContext } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, isEmailVerified } = useAuthContext();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-grey-950">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-8 mb-8">
            <div className="flex items-center space-x-6">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-grey-600"
                />
              ) : (
                <div className="w-24 h-24 bg-grey-700 rounded-full flex items-center justify-center border-4 border-grey-600">
                  <span className="text-3xl font-bold text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <p className="text-grey-300 mb-2">{user?.email}</p>
                
                <div className="flex items-center space-x-4">
                  {isEmailVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900/20 text-green-400 border border-green-700/50">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Email Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-900/20 text-yellow-400 border border-yellow-700/50">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Email Not Verified
                    </span>
                  )}
                  
                  {user?.is_admin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-900/20 text-blue-400 border border-blue-700/50">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Details */}
            <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-grey-300 mb-1">Name</label>
                  <p className="text-white">{user?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-300 mb-1">Email</label>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-grey-300 mb-1">Member Since</label>
                  <p className="text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                {user?.bio && (
                  <div>
                    <label className="block text-sm font-medium text-grey-300 mb-1">Bio</label>
                    <p className="text-white">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/settings"
                  className="flex items-center p-3 bg-grey-800/50 hover:bg-grey-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-grey-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white">Edit Profile & Settings</span>
                </a>
                
                <a
                  href="/my-library"
                  className="flex items-center p-3 bg-grey-800/50 hover:bg-grey-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-grey-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-white">My Library</span>
                </a>

                {!isEmailVerified && (
                  <a
                    href="/verify-email"
                    className="flex items-center p-3 bg-yellow-900/20 hover:bg-yellow-900/30 border border-yellow-700/50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-yellow-400">Verify Email Address</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
