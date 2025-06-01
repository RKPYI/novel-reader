"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import {LoadingSpinner} from '../../../components/LoadingSpinner';
import {ErrorMessage} from '../../../components/ErrorMessage';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleCallback, refreshAuthFromStorage } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if this is a success response from backend
        const success = searchParams.get('success');
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');
        const errorMessage = searchParams.get('message');

        // Handle backend redirect with error
        if (errorParam) {
          const errorDescription = errorMessage || 'Google authentication failed';
          setError(errorDescription);
          setIsProcessing(false);
          setTimeout(() => {
            router.push('/');
          }, 3000);
          return;
        }

        // Handle backend redirect with success
        if (success === 'true' && token && userParam) {
          try {
            // Decode user data
            const userData = JSON.parse(atob(userParam));
            
            console.log('Google auth success, storing data and redirecting...');
            
            // Store token and user data in your auth context
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            
            // Refresh auth context from storage
            refreshAuthFromStorage();
            
            // Set success state
            setIsSuccess(true);
            setIsProcessing(false);
            
            // Navigate to home with a small delay to ensure state updates
            if (!hasRedirected) {
              setHasRedirected(true);
              setTimeout(() => {
                console.log('Redirecting to home page...');
                console.log('Current location:', window.location.href);
                console.log('About to redirect to:', '/');
                // Use window.location for more reliable redirect
                window.location.href = '/';
              }, 1000);
            }
            return;
          } catch (decodeError) {
            console.error('Failed to decode user data:', decodeError);
            setError('Failed to process authentication data');
            setIsProcessing(false);
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
            return;
          }
        }

        // Handle old OAuth flow (if still using the old method)
        const code = searchParams.get('code');
        const oauthError = searchParams.get('error');

        // Handle OAuth errors
        if (oauthError) {
          const errorDescription = searchParams.get('error_description') || 'Google authentication was cancelled or failed';
          setError(errorDescription);
          setIsProcessing(false);
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        // Check if we have the authorization code (old flow)
        if (code) {
          console.log('Processing old OAuth flow...');
          // Process the Google callback by passing all search parameters
          await handleGoogleCallback(searchParams);
          
          // Set success state
          setIsSuccess(true);
          setIsProcessing(false);
          
          // Successful authentication - redirect to home with delay
          if (!hasRedirected) {
            setHasRedirected(true);
            setTimeout(() => {
              console.log('Redirecting to home page...');
              window.location.href = '/';
            }, 1000);
          }
          return;
        }

        // No valid parameters
        setError('Invalid callback - no authentication data received');
        setIsProcessing(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        
      } catch (error: any) {
        console.error('Google callback error:', error);
        setError(error.message || 'Failed to complete Google authentication');
        setIsProcessing(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    // Only run if we have search params (meaning we're in the callback)
    if (searchParams.toString()) {
      handleCallback();
    } else {
      // No params means this page was accessed directly
      setError('Invalid callback - no authentication data received');
      setIsProcessing(false);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, [searchParams, handleGoogleCallback, router]);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-950">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 text-grey-300 font-medium">Authentication successful!</p>
          <p className="mt-2 text-grey-400 text-sm">Redirecting to home page...</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-950">
        <div className="max-w-md w-full bg-grey-900 rounded-lg shadow-md border border-grey-700/50 p-6">
          <div className="text-center mb-4">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-lg font-semibold text-white mb-2">Authentication Failed</h2>
          </div>
          <ErrorMessage message={error} />
          <p className="text-center text-sm text-grey-400 mt-4">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-950">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 text-white mx-auto mb-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <LoadingSpinner />
          <p className="mt-4 text-grey-300 font-medium">Completing Google authentication...</p>
          <p className="mt-2 text-grey-400 text-sm">Please wait while we sign you in</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-grey-950">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-grey-300 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
