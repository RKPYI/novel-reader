/**
 * API Configuration
 *
 * Central configuration for all API endpoints.
 * Change the BASE_URL to point to your API server.
 */

// Base API URL - change this to your production API URL when deploying
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.12:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    me: `${API_BASE_URL}/api/auth/me`,
    profile: `${API_BASE_URL}/api/auth/profile`,
    changePassword: `${API_BASE_URL}/api/auth/change-password`,
    verifyEmail: `${API_BASE_URL}/api/auth/email/verify`,
    resendVerification: `${API_BASE_URL}/api/auth/email/verification-notification`,
    forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    google: `${API_BASE_URL}/api/auth/google`,
    googleCallback: `${API_BASE_URL}/api/auth/google/callback`,
  },

  // Novel endpoints
  novels: {
    search: (query: string) => `${API_BASE_URL}/api/novels/search?q=${encodeURIComponent(query)}`,
    popular: `${API_BASE_URL}/api/novels/popular`,
    latest: `${API_BASE_URL}/api/novels/latest`,
    detail: (slug: string) => `${API_BASE_URL}/api/novels/${slug}`,
    chapters: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/chapters`,
    chapter: (slug: string, chapterNum: string | number) => `${API_BASE_URL}/api/novels/${slug}/chapters/${chapterNum}`,
    readingProgress: (slug: string, userId: number = 1) => `${API_BASE_URL}/api/novels/${slug}/reading-progress?user_id=${userId}`,
    updateProgress: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/reading-progress`,
    genres: `${API_BASE_URL}/api/novels/genres`,
    recommendations: `${API_BASE_URL}/api/novels/recommendations`,
    browse: `${API_BASE_URL}/api/novels`,

    // Novel interaction endpoints (require authentication)
    rate: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/rate`,
    comment: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/comments`,
    comments: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/comments`,
    bookmark: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/bookmark`,
    removeBookmark: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/bookmark`,
    
    // Comments and ratings
    ratings: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/ratings`,
    myRating: (slug: string) => `${API_BASE_URL}/api/novels/${slug}/my-rating`,
    chapterComments: (slug: string, chapterNumber: string | number) => 
      `${API_BASE_URL}/api/novels/${slug}/chapters/${chapterNumber}/comments`,
  },

  // Comment endpoints
  comments: {
    create: `${API_BASE_URL}/api/comments`,
    update: (commentId: number) => `${API_BASE_URL}/api/comments/${commentId}`,
    delete: (commentId: number) => `${API_BASE_URL}/api/comments/${commentId}`,
    vote: (commentId: number) => `${API_BASE_URL}/api/comments/${commentId}/vote`,
    getUserVote: (commentId: number) => `${API_BASE_URL}/api/comments/${commentId}/vote`,
  },

  // Rating endpoints
  ratings: {
    create: `${API_BASE_URL}/api/ratings`,
    delete: (ratingId: number) => `${API_BASE_URL}/api/ratings/${ratingId}`,
    myRatings: `${API_BASE_URL}/api/my-ratings`,
  },
} as const;

// Helper function to get API URL (for cases where you need just the base)
export const getApiUrl = (path: string = '') => {
  return `${API_BASE_URL}${path}`;
};
