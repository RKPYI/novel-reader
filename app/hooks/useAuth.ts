"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  role: number;
  avatar?: string;
  bio?: string;
  is_admin: boolean;
  created_at: string;
  email_verified_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  verification_notice?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
  type?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  // Setup axios interceptor for auth token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    setError(null);
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const handleAuthError = (error: any): AuthError => {
    const authError: AuthError = {
      message: error.response?.data?.message || 'An error occurred',
      errors: error.response?.data?.errors,
      retry_after: error.response?.data?.retry_after,
      type: error.response?.data?.type
    };
    
    setError(authError.message);
    return authError;
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, credentials, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      handleAuthSuccess(response.data);
      return response.data;
    } catch (error: any) {
      throw handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      handleAuthSuccess(response.data);
      return response.data;
    } catch (error: any) {
      throw handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setLoading(false);
    }
  }, [token]);

  const getCurrentUser = async (): Promise<User> => {
    if (!token) throw new Error('No token available');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      throw handleAuthError(error);
    }
  };

  const updateProfile = async (profileData: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>): Promise<User> => {
    if (!token) throw new Error('No token available');
    
    setLoading(true);
    
    try {
      const response = await axios.put(`${API_BASE_URL}/api/auth/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      throw handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwords: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> => {
    if (!token) throw new Error('No token available');
    
    setLoading(true);
    
    try {
      await axios.put(`${API_BASE_URL}/api/auth/change-password`, passwords, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    } catch (error: any) {
      throw handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (!token) throw new Error('No token available');
    
    try {
      await axios.post(`${API_BASE_URL}/api/auth/email/verification-notification`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error: any) {
      throw handleAuthError(error);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    isEmailVerified: user?.email_verified || false,
    isAdmin: user?.is_admin || false,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    changePassword,
    resendVerificationEmail,
    loginWithGoogle,
    clearError: () => setError(null)
  };
};
