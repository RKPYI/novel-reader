import axios, { AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { Comment, Rating, RatingStats, PaginatedResponse, ApiResponse } from '../types';

// Define the new response structure for comments with total count
export interface CommentsWithCountResponse {
  comments: PaginatedResponse<Comment>;
  total_comments_count: number;
}

// Create axios instance with default headers
const apiClient = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Comment Service
export const commentService = {
  // Get comments for a novel
  getNovelComments: async (novelSlug: string): Promise<CommentsWithCountResponse> => { // Returns paginated comments and the total count for the novel
    const response = await apiClient.get<CommentsWithCountResponse>(API_ENDPOINTS.novels.comments(novelSlug)); // Specify type for apiClient.get
    return response.data;
  },

  // Get comments for a chapter
  getChapterComments: async (novelSlug: string, chapterNumber: number): Promise<CommentsWithCountResponse> => { // Returns paginated comments and the total count for the chapter
    const response = await apiClient.get<CommentsWithCountResponse>(API_ENDPOINTS.novels.chapterComments(novelSlug, chapterNumber));
    return response.data;
  },

  // Create a new comment
  createComment: async (commentData: {
    novel_id: number;
    chapter_id?: number;
    parent_id?: number;
    content: string;
    is_spoiler?: boolean;
  }): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post(API_ENDPOINTS.comments.create, commentData);
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: number, content: string, is_spoiler?: boolean): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.put(API_ENDPOINTS.comments.update(commentId), {
      content,
      is_spoiler,
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<ApiResponse> => {
    const response = await apiClient.delete(API_ENDPOINTS.comments.delete(commentId));
    return response.data;
  },

  // Vote on a comment
  voteComment: async (commentId: number, isUpvote: boolean): Promise<ApiResponse<{ likes: number; dislikes: number }>> => {
    const response = await apiClient.post(API_ENDPOINTS.comments.vote(commentId), {
      is_upvote: isUpvote,
    });
    return response.data;
  },

  // Get user's vote on a comment
  getUserVote: async (commentId: number): Promise<ApiResponse<{ vote: { is_upvote: boolean } | null }>> => {
    const response = await apiClient.get(API_ENDPOINTS.comments.getUserVote(commentId));
    return response.data;
  },
};

// Rating Service
export const ratingService = {
  // Get ratings for a novel
  getNovelRatings: async (novelSlug: string): Promise<{
    ratings: PaginatedResponse<Rating>;
    stats: RatingStats;
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.novels.ratings(novelSlug));
    return response.data;
  },

  // Create or update a rating
  createRating: async (ratingData: {
    novel_id: number;
    rating: number;
    review?: string;
  }): Promise<ApiResponse<{
    rating: Rating;
    novel_stats: {
      average_rating: number;
      total_ratings: number;
    };
  }>> => {
    const response = await apiClient.post(API_ENDPOINTS.ratings.create, ratingData);
    return response.data;
  },

  // Get user's rating for a novel
  getUserRating: async (novelSlug: string): Promise<ApiResponse<{ rating: Rating | null }>> => {
    const response = await apiClient.get(API_ENDPOINTS.novels.myRating(novelSlug));
    return response.data;
  },

  // Delete a rating
  deleteRating: async (ratingId: number): Promise<ApiResponse<{
    novel_stats: {
      average_rating: number;
      total_ratings: number;
    };
  }>> => {
    const response = await apiClient.delete(API_ENDPOINTS.ratings.delete(ratingId));
    return response.data;
  },

  // Get all user's ratings
  getUserRatings: async (): Promise<PaginatedResponse<Rating>> => {
    const response = await apiClient.get(API_ENDPOINTS.ratings.myRatings);
    return response.data;
  },
};

// Error handler utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    return Object.values(errors).flat().join(', ');
  }
  return error.message || 'An unexpected error occurred';
};
