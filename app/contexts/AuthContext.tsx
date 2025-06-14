"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, User, AuthError } from '../hooks/useAuth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  register: (credentials: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<any>;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
  updateProfile: (profileData: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>) => Promise<User>;
  changePassword: (passwords: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
  refreshAuthFromStorage: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  const refreshUserData = async () => {
    try {
      const response = await auth.getCurrentUser();
      if (response) {
        auth.user = response;
        auth.isEmailVerified = response.email_verified;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
