"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthContext } from '../contexts/AuthContext';

interface UserDropdownProps {
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isEmailVerified } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Avatar/Name Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-grey-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500 rounded-lg p-2"
        aria-label="User menu"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-grey-600"
          />
        ) : (
          <div className="w-8 h-8 bg-grey-700 rounded-full flex items-center justify-center border-2 border-grey-600">
            <span className="text-sm font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden md:block font-medium">{user.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-grey-900 border border-grey-700/50 rounded-lg shadow-xl backdrop-blur-sm z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-grey-700/50">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-grey-600"
                />
              ) : (
                <div className="w-10 h-10 bg-grey-700 rounded-full flex items-center justify-center border-2 border-grey-600">
                  <span className="text-lg font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.name}</p>
                <p className="text-grey-400 text-sm truncate">{user.email}</p>
                {!isEmailVerified && (
                  <p className="text-yellow-400 text-xs mt-1">Email not verified</p>
                )}
                {user.is_admin && (
                  <p className="text-blue-400 text-xs mt-1">Administrator</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-grey-100 hover:text-white hover:bg-grey-800/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-grey-100 hover:text-white hover:bg-grey-800/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>

            <Link
              href="/my-library"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-grey-100 hover:text-white hover:bg-grey-800/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Library
            </Link>

            {!isEmailVerified && (
              <Link
                href="/verify-email"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-grey-800/50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Verify Email
              </Link>
            )}

            {user.is_admin && (
              <>
                <div className="border-t border-grey-700/50 my-2"></div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-grey-800/50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Panel
                </Link>
              </>
            )}

            <div className="border-t border-grey-700/50 my-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-grey-100 hover:text-white hover:bg-grey-800/50 transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
