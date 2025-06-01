"use client";
import React, { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuthContext } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user, updateProfile, changePassword, resendVerificationEmail, isEmailVerified } = useAuthContext();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Email verification state
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await updateProfile(profileData);
      setProfileMessage('Profile updated successfully!');
    } catch (error: any) {
      setProfileError(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      await changePassword(passwordData);
      setPasswordMessage('Password changed successfully!');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setEmailLoading(true);
    setEmailMessage('');
    setEmailError('');

    try {
      await resendVerificationEmail();
      setEmailMessage('Verification email sent successfully!');
    } catch (error: any) {
      setEmailError(error.message || 'Failed to send verification email');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-grey-950">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-grey-300">Manage your account preferences and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
              
              {profileMessage && (
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-4">
                  <p className="text-green-300 text-sm">{profileMessage}</p>
                </div>
              )}

              {profileError && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
                  <p className="text-red-300 text-sm">{profileError}</p>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-grey-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-grey-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 bg-grey-800/50 border border-grey-700/50 rounded-lg text-grey-400 cursor-not-allowed"
                  />
                  <p className="text-grey-400 text-xs mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-grey-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-3 py-2 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-2 px-4 bg-grey-700 hover:bg-grey-600 disabled:bg-grey-800 disabled:cursor-not-allowed border border-grey-600 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500"
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Password Settings */}
            <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
              
              {passwordMessage && (
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-4">
                  <p className="text-green-300 text-sm">{passwordMessage}</p>
                </div>
              )}

              {passwordError && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
                  <p className="text-red-300 text-sm">{passwordError}</p>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-grey-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full px-3 py-2 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-grey-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-grey-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                    className="w-full px-3 py-2 bg-grey-950/50 border border-grey-700/50 rounded-lg text-white placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-grey-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-2 px-4 bg-grey-700 hover:bg-grey-600 disabled:bg-grey-800 disabled:cursor-not-allowed border border-grey-600 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-grey-500"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Email Verification */}
            {!isEmailVerified && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6 lg:col-span-2">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Email Verification Required</h2>
                
                {emailMessage && (
                  <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 mb-4">
                    <p className="text-green-300 text-sm">{emailMessage}</p>
                  </div>
                )}

                {emailError && (
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
                    <p className="text-red-300 text-sm">{emailError}</p>
                  </div>
                )}

                <p className="text-yellow-300 mb-4">
                  Your email address needs to be verified to access all features. 
                  Check your inbox for a verification email.
                </p>

                <button
                  onClick={handleResendVerification}
                  disabled={emailLoading}
                  className="py-2 px-4 bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-800 disabled:cursor-not-allowed border border-yellow-600 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {emailLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-grey-900 rounded-xl border border-grey-700/50 p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-grey-400">Member Since</p>
                  <p className="text-white font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-grey-400">Account Type</p>
                  <p className="text-white font-medium">
                    {user?.is_admin ? 'Administrator' : 'Member'}
                  </p>
                </div>
                <div>
                  <p className="text-grey-400">Email Status</p>
                  <p className={`font-medium ${isEmailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {isEmailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
