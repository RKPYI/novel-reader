"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { login, register, loginWithGoogle, loading, error, clearError } = useAuthContext();
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    // Only reset form if modal just opened
    if (isOpen && !prevIsOpen.current) {
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
      setFieldErrors({});
      setGlobalError(null);
      clearError();
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);
    clearError();
    let success = false;
    try {
      if (mode === 'signin') {
        await login({
          email: formData.email,
          password: formData.password
        });
        success = true;
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        });
        success = true;
      }
    } catch (error: any) {
      if (error.errors) {
        setFieldErrors(error.errors);
      }
      if (error.message && !error.errors) {
        setGlobalError(error.message);
      }
      return;
    }
    if (success) {
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
      setFieldErrors({});
      setGlobalError(null);
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setFieldErrors({});
    setGlobalError(null);
    clearError();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-grey-900 rounded-xl border border-grey-700/50 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-700/50">
          <h2 className="text-xl font-bold text-white">
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-grey-400 hover:text-white transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-grey-50 border border-grey-300 rounded-lg text-gray-800 font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-grey-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-grey-900 text-grey-400">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Global Error */}
            {(globalError || (error && typeof error === 'string')) && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 text-sm mb-2">
                {globalError || error}
              </div>
            )}
            {/* Field errors for non-field-specific errors (e.g. API returns errors not mapped to a field) */}
            {Object.keys(fieldErrors).length > 0 &&
              Object.entries(fieldErrors).map(([field, messages]) => (
                !['name','email','password','password_confirmation'].includes(field) &&
                  <div key={field} className="p-2 bg-red-900/10 border border-red-700/30 rounded text-red-300 text-xs mb-1">
                    {messages.join(' ')}
                  </div>
              ))
            }

            {/* Name Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-grey-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-grey-950/50 border rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500 ${
                    fieldErrors.name ? 'border-red-500' : 'border-grey-700/50'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.name[0]}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-grey-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-grey-950/50 border rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500 ${
                  fieldErrors.email ? 'border-red-500' : 'border-grey-700/50'
                }`}
                placeholder="Enter your email"
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-grey-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 bg-grey-950/50 border rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500 ${
                    fieldErrors.password ? 'border-red-500' : 'border-grey-700/50'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Password Confirmation (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-grey-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 bg-grey-950/50 border rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500 ${
                      fieldErrors.password_confirmation ? 'border-red-500' : 'border-grey-700/50'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-grey-400 hover:text-white"
                  >
                    {showPasswordConfirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.password_confirmation[0]}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-grey-700 hover:bg-grey-600 disabled:bg-grey-800 disabled:cursor-not-allowed border border-grey-600 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'signin' ? 'Signing In...' : 'Signing Up...'}
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-grey-400">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-grey-300 hover:text-white font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
