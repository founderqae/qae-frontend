import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield, 
  TrendingUp, 
  Users, 
  Award,
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = queryParams.get('page') || 'login';

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    otp: ''
  });

  useEffect(() => {
    const page = queryParams.get('page') || 'login';
    setCurrentPage(page);
  }, [location.search]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePageChange = (page, resetFields = {}) => {
    setCurrentPage(page);
    navigate(`/auth?page=${page}`);
    setFormData((prev) => ({
      ...prev,
      ...resetFields
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent submission if already loading
    setIsLoading(true);

    try {
      if (currentPage === 'login') {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        toast.success('Login successful! Redirectin...');
        // Handle successful login (e.g., store token, redirect)
        localStorage.setItem('token', data.token);
      // Wait 1.5 seconds, then navigate
      setTimeout(() => {
        navigate('/'); // or use navigate('/') if using react-router-dom
      }, 1500);
        
      } else if (currentPage === 'signup') {
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password,
            institutionType: formData.userType === 'student' ? 'ENGINEERING' : 'ARTS_SCIENCE'
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        toast.success('Registration successful! Please verify OTP');
        handlePageChange('verify-otp', { password: '', confirmPassword: '', otp: '' });
      } else if (currentPage === 'verify-otp') {
        const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'OTP verification failed');
        toast.success('OTP verified successfully!');
        handlePageChange('login', { password: '', confirmPassword: '', otp: '' });
      } else if (currentPage === 'forgot') {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send reset instructions');
        toast.success('OTP sent to your email!');
        handlePageChange('update-password', { password: '', otp: '' });
      } else if (currentPage === 'update-password') {
        if (formData.password.length < 6) {
          toast.error('New password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const response = await fetch('http://localhost:5000/api/auth/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.password
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Password update failed');
        toast.success('Password updated successfully!');
        handlePageChange('login', { password: '', otp: '' });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLeftContent = () => {
    if (currentPage === 'login') {
      return (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Continue your journey with QAE's transparent ranking system
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">For Institutions</h3>
                <p className="text-gray-600">Update your details for fair ranking</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">For Students</h3>
                <p className="text-gray-600">Compare courses, placements, and reviews</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Access</h3>
                <p className="text-gray-600">Your data is protected with us</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentPage === 'signup' || currentPage === 'verify-otp') {
      return (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Join QAE</h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Be Part of Transparent Rankings
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create your account today and unlock access to comprehensive educational insights, verified institution data, and student-driven reviews.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">For Institutions</h3>
                <p className="text-gray-600">Update your details for fair ranking and showcase your achievements to prospective students worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">For Students</h3>
                <p className="text-gray-600">Compare courses, placements, fees, and authentic reviews to make informed decisions about your future</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Secure Access</h3>
                <p className="text-gray-600">Your personal data and privacy are protected with enterprise-grade security measures</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (currentPage === 'forgot' || currentPage === 'update-password') {
      return (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Password Reset</h2>
            </div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Securely reset your password
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Follow the steps to regain access to your QAE account with our secure password reset process.
            </p>
          </div>
        </div>
      );
    }
  };

  const renderLoginForm = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
        <p className="text-gray-600 mt-2">Access your QAE account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" disabled={isLoading} />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => handlePageChange('forgot', { password: '', otp: '' })}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            onClick={() => handlePageChange('signup', { password: '', confirmPassword: '', otp: '' })}
            className="text-teal-600 hover:text-teal-700 font-medium"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );

  const renderSignupForm = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Create Account</h3>
        <p className="text-gray-600 mt-2">Join the QAE community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your name"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
            Institution Type *
          </label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            required
            disabled={isLoading}
          >
            <option value="student">Engineering</option>
            <option value="institution">Arts & Sciences</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Create password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Confirm password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
            required
            disabled={isLoading}
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
            I agree to the <span className="text-teal-600 hover:text-teal-700 cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-teal-600 hover:text-teal-700 cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => handlePageChange('login', { password: '', confirmPassword: '', otp: '' })}
            className="text-teal-600 hover:text-teal-700 font-medium"
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );

  const renderVerifyOtpForm = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Verify OTP</h3>
        <p className="text-gray-600 mt-2">Enter the OTP sent to your email</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            OTP *
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Enter 6-digit OTP"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </button>

        <button
          type="button"
          onClick={() => handlePageChange('signup', { password: '', confirmPassword: '', otp: '' })}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 font-medium py-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign Up</span>
        </button>
      </form>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-600 mt-2">
          Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Sending...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </button>

        <button
          type="button"
          onClick={() => handlePageChange('login', { password: '', otp: '' })}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 font-medium py-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </button>
      </form>
    </div>
  );

  const renderUpdatePasswordForm = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-teal-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Update Password</h2>
        <p className="text-gray-600 mt-2">
          Enter the OTP and your new password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            OTP *
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            placeholder="Enter 6-digit OTP"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Create new password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-teal-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </button>

        <button
          type="button"
          onClick={() => handlePageChange('login', { password: '', otp: '' })}
          className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 font-medium py-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-25 to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-100/20 to-emerald-100/20"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      
      <div className="flex min-h-screen relative z-10">
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 lg:px-6">
          <div className="max-w-lg w-full">
            {renderLeftContent()}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 lg:px-6">
          <div className="max-w-md w-full">
            {currentPage === 'login' && renderLoginForm()}
            {currentPage === 'signup' && renderSignupForm()}
            {currentPage === 'verify-otp' && renderVerifyOtpForm()}
            {currentPage === 'forgot' && renderForgotPasswordForm()}
            {currentPage === 'update-password' && renderUpdatePasswordForm()}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AuthPage;