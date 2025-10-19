import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, FileText, Calendar, Award, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    institutionName: '',
    institutionType: '',
    memberSince: '',
    lastLogin: '',
    phone: '',
    designation: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/institution/current-user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        // Format dates
        const memberSince = data.createdAt
          ? new Date(data.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })
          : 'N/A';
        const lastLogin = data.lastLogin
          ? new Date(data.lastLogin).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'N/A';

        setUserData({
          username: data.username || 'N/A',
          email: data.email || 'N/A',
          institutionName: data.institute?.name || 'N/A',
          institutionType: data.institutionType || 'N/A',
          memberSince,
          lastLogin,
          phone: data.institute?.applicantContact || 'N/A',
          designation: data.institute?.applicantDesignation || 'N/A',
          address: data.institute?.address || 'N/A',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account information and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {userData.username.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-bold text-slate-800 text-center">{userData.username}</h2>
                <p className="text-slate-500 text-sm">{userData.designation}</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-2 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-slate-600 text-sm">Member Since</span>
                  <span className="font-semibold text-slate-800 text-sm">{userData.memberSince}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Last Login</span>
                  <span className="font-semibold text-slate-800 text-sm">{userData.lastLogin}</span>
                </div>
                <div className="pb-2">
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <p className="text-slate-800">{userData.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <p className="text-slate-800">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Institution Name
                  </label>
                  <p className="text-slate-800">{userData.institutionName}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Award className="w-4 h-4 inline mr-1" />
                    Institution Type
                  </label>
                  <span className="inline-flex px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                    {userData.institutionType}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <p className="text-slate-800">{userData.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Designation
                  </label>
                  <p className="text-slate-800">{userData.designation}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Institution Address
                  </label>
                  <p className="text-slate-800">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;