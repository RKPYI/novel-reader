export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  is_admin?: boolean;
  email_verified?: boolean;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

export interface Novel {
  id: number;
  slug: string;
  title: string;
  author?: string;
  description?: string;
  cover_image?: string;
  status: string;
  rating: number;
  rating_count: number;
  views: number;
  genres?: Genre[];
  created_at?: string;
  updated_at?: string;
}

export interface Chapter {
  id: number;
  novel_id: number;
  chapter_number: number;
  title: string;
  content?: string;
  word_count?: number;
  created_at?: string;
}

export interface Comment {
  id: number;
  user_id: number;
  novel_id: number;
  chapter_id?: number;
  parent_id?: number;
  content: string;
  likes: number;
  dislikes: number;
  is_spoiler: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
  userVote?: {
    is_upvote: boolean;
  };
}

export interface CommentVote {
  id: number;
  user_id: number;
  comment_id: number;
  is_upvote: boolean;
  created_at: string;
}

export interface Rating {
  id: number;
  user_id: number;
  novel_id: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
  user: User;
  novel?: Novel;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  rating_breakdown: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
