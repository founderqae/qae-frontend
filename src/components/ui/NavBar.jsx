import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, ChevronDown, FileText, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.svg';
import axios from 'axios'; // Add axios for API calls

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Check if token exists
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Loading...', email: '' });
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          navigate('/auth?page=login');
          return;
        }

        const response = await axios.get('https://qae-server.vercel.app/api/section-a/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: response.data.username || 'User',
          email: response.data.email || '',
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401 || error.response?.status === 500) {
          // Token expired or invalid
          handleLogout();
        }
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogin = (page) => {
    navigate(`/auth?page=${page}`);
  };

  const handleLogout = () => {
    // Remove token and clear user data
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser({ name: '', email: '' });
    setShowProfileDropdown(false);
    setShowMobileMenu(false);
    navigate('/auth?page=login');
  };

  const toggleDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Click away listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Axios interceptor for handling token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const navItems = ['home', 'about', 'leaderboard', 'Application', 'faqs', 'contact'];

  return (
    <nav className="bg-white shadow-lg border-b border-teal-100 w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href='/'>
              <img className="h-20 w-auto pt-2" src={logo} alt="QAE Rankings Logo" />
            </a>
          </div>

          {/* Centered Navigation - Desktop */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item}
                  to={item === 'home' ? '/' : `/${item}`}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 capitalize ${
                      isActive
                        ? 'bg-teal-100 text-teal-700 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side - Profile/Auth + Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Profile/Auth */}
            <div className="hidden md:block">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleLogin('login')}
                    className="text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => handleLogin('signup')}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-2 border border-gray-300 rounded-full hover:bg-teal-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button onClick={() => navigate("/submissions")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Submissions</span>
                      </button>
                      
                      <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-teal-50"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div ref={mobileMenuRef} className="md:hidden pb-4 border-t border-gray-200">
            <div className="space-y-2 mt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item}
                  to={item === 'home' ? '/' : `/${item}`}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 capitalize ${
                      isActive
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth/Profile */}
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      handleLogin('login');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left text-teal-600 px-3 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      handleLogin('signup');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left bg-teal-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => {navigate('/profile'); setShowMobileMenu(false);}} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 rounded">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button onClick={() => {navigate("/submissions"); setShowMobileMenu(false);}} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 rounded">
                    <FileText className="w-4 h-4" />
                    <span>Submissions</span>
                  </button>
                  <button onClick={() => {navigate('/settings'); setShowMobileMenu(false);}} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 rounded">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;