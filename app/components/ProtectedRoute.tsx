"use client";
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireEmailVerification?: boolean;
  adminOnly?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/',
  requireEmailVerification = false,
  adminOnly = false,
  fallback
}) => {
  const { isAuthenticated, user, loading, isEmailVerified, isAdmin } = useAuthContext();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check authentication
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      return;
    }

    // Check email verification if required
    if (requireEmailVerification && !isEmailVerified) {
      if (typeof window !== 'undefined') {
        window.location.href = '/verify-email';
      }
      return;
    }

    // Check admin access if required
    if (adminOnly && !isAdmin) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      return;
    }

    setShouldRender(true);
  }, [isAuthenticated, isEmailVerified, isAdmin, loading, redirectTo, requireEmailVerification, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-grey-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grey-400 mx-auto mb-4"></div>
          <p className="text-grey-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen bg-grey-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-grey-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
