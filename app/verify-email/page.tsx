"use client";
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { user, resendVerificationEmail, isEmailVerified, logout } = useAuthContext();

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage('');
    setError('');
    
    try {
      await resendVerificationEmail();
      setMessage('Verification email sent successfully! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isEmailVerified) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-grey-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-grey-900 rounded-xl border border-grey-700/50 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-grey-300">
            We've sent a verification link to <span className="text-white font-medium">{user?.email}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-grey-800/50 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-2">To verify your email:</h3>
          <ol className="text-grey-300 text-sm space-y-1 list-decimal list-inside">
            <li>Check your email inbox</li>
            <li>Look for an email from RDKNovel</li>
            <li>Click the verification link in the email</li>
            <li>Return to this page to continue</li>
          </ol>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-4">
            <p className="text-green-300 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full py-3 px-4 bg-grey-700 hover:bg-grey-600 disabled:bg-grey-800 disabled:cursor-not-allowed border border-grey-600 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500"
          >
            {isResending ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Resend Verification Email'
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-transparent hover:bg-grey-800/50 border border-grey-700 rounded-lg text-grey-300 hover:text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500"
          >
            Sign Out
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-grey-400 text-sm">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
}
