import React, { useState } from 'react';
import { Settings, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: '', text: '' });
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password' });
      return false;
    }

    if (!passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Please enter a new password' });
      return false;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return false;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }

    if (!passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please confirm your new password' });
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://qae-server.vercel.app/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setMessage({ type: 'success', text: data.message });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          </div>
          <p className="text-slate-600">Manage your account settings and password</p>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
              <p className="text-slate-600 text-sm">Update your password to keep your account secure</p>
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Password Strength</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.label === 'Strong'
                          ? 'text-green-600'
                          : passwordStrength.label === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-500">Password must contain:</p>
                <ul className="text-xs text-slate-500 space-y-1 ml-4">
                  <li className={passwordData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                    • At least 8 characters
                  </li>
                  <li
                    className={
                      /[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword)
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    • Upper and lowercase letters
                  </li>
                  <li className={/\d/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                    • At least one number
                  </li>
                  <li className={/[^a-zA-Z\d]/.test(passwordData.newPassword) ? 'text-green-600' : ''}>
                    • At least one special character
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              )}
              {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                } text-white`}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-teal-50 rounded-lg border border-teal-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            Password Security Tips
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">•</span>
              <span>Use a unique password that you don't use for other accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">•</span>
              <span>Avoid using personal information like birthdays or names</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">•</span>
              <span>Change your password regularly to maintain account security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">•</span>
              <span>Never share your password with anyone</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;