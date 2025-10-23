import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SectionB = ({ onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [genderData, setGenderData] = useState({
    male: {},
    female: {},
    transgender: {},
  });
  const [diversityData, setDiversityData] = useState({
    interstate: {},
    intrastate: {},
    overseas: {},
  });
  const [examRows, setExamRows] = useState([
    { id: 1, department: '', examName: '', highestRank: '', lowestRank: '' },
    { id: 2, department: '', examName: '', highestRank: '', lowestRank: '' },
    { id: 3, department: '', examName: '', highestRank: '', lowestRank: '' },
    { id: 4, department: '', examName: '', highestRank: '', lowestRank: '' },
    { id: 5, department: '', examName: '', highestRank: '', lowestRank: '' },
  ]);
  const [financeData, setFinanceData] = useState({
    avgTuitionFees: '',
    otherFees: '',
    hostelFees: '',
    totalExpensesSalary: '',
    totalExpensesLabs: '',
    perStudentExpenditure: '',
  });
  const [sectionBDriveLink, setSectionBDriveLink] = useState('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      toast.error('Please log in to access this section');
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch year configuration with retry
  const fetchYearConfig = async (retryCount = 3, delay = 1000) => {
    try {
      setLoading(true);
      const response = await axios.get('https://qae-server.vercel.app/api/config/year', {
        headers: getAuthHeader(),
      });
      console.log('Year Config Response:', response.data);
      const config = response.data;
      if (!config.p || !config.pMinus1 || !config.pMinus2) {
        throw new Error('Invalid year configuration data');
      }
      const dynamicYears = [config.p, config.pMinus1, config.pMinus2];
      setYears(dynamicYears);
      const initialData = dynamicYears.reduce((acc, y) => ({ ...acc, [y]: '' }), {});
      setGenderData({
        male: { ...initialData },
        female: { ...initialData },
        transgender: { ...initialData },
      });
      setDiversityData({
        interstate: { ...initialData },
        intrastate: { ...initialData },
        overseas: { ...initialData },
      });
    } catch (err) {
      console.error('Fetch Year Config Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (retryCount > 0) {
        console.log(`Retrying fetchYearConfig (${retryCount} attempts left)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchYearConfig(retryCount - 1, delay * 2);
      }
      toast.error(err.response?.data?.message || 'Failed to fetch year configuration. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
const currentYear = new Date().getFullYear();
  // Fetch existing Section B data
  const fetchSectionBData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://qae-server.vercel.app/api/submit/submissions/section-b?year=${currentYear}`, {
        headers: getAuthHeader(),
      });
      console.log('Section B Data Response:', response.data);
      const data = response.data;

      const transformToObject = (arr, keys) => {
        const result = {};
        keys.forEach(key => { result[key] = {}; });
        arr.forEach(item => {
          keys.forEach(key => {
            if (item[key] !== undefined) {
              result[key][item.year] = item[key].toString();
            }
          });
        });
        return result;
      };

      if (data.genderInfos && data.genderInfos.length > 0) {
        const genderTransformed = transformToObject(data.genderInfos, ['male', 'female', 'transgender']);
        setGenderData({
          male: genderTransformed.male || {},
          female: genderTransformed.female || {},
          transgender: genderTransformed.transgender || {},
        });
      }

      if (data.diversityInfos && data.diversityInfos.length > 0) {
        const diversityTransformed = transformToObject(data.diversityInfos, ['interstate', 'intrastate', 'overseas']);
        setDiversityData({
          interstate: diversityTransformed.interstate || {},
          intrastate: diversityTransformed.intrastate || {},
          overseas: diversityTransformed.overseas || {},
        });
      }

      if (data.examScores && data.examScores.length > 0) {
        setExamRows(data.examScores.map((e, index) => ({
          id: index + 1,
          department: e.departmentName || '',
          examName: e.examName || '',
          highestRank: e.highestRank?.toString() || '',
          lowestRank: e.lowestRank?.toString() || '',
        })));
      }

      if (data.financeInfos && data.financeInfos.length > 0) {
        const latestFinance = data.financeInfos[0];
        setFinanceData({
          avgTuitionFees: latestFinance.avgTuitionFees?.toString() || '',
          otherFees: latestFinance.otherFees?.toString() || '',
          hostelFees: latestFinance.hostelFees?.toString() || '',
          totalExpensesSalary: latestFinance.totalExpensesSalary?.toString() || '',
          totalExpensesLabs: latestFinance.totalExpensesLabs?.toString() || '',
          perStudentExpenditure: latestFinance.perStudentExpenditure?.toString() || '',
        });
      }

      setSectionBDriveLink(data.sectionBDriveLink || '');
    } catch (err) {
      console.error('Fetch Section B Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err.response?.status !== 404) {
        // toast.error(err.response?.data?.message || 'Failed to fetch Section B data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearConfig();
  }, []);

  useEffect(() => {
    if (years.length > 0) {
      fetchSectionBData();
    }
  }, [years]);

  // Calculate totals for Gender and Diversity
  const calculateTotals = (data) => {
    const totals = years.reduce((acc, y) => ({ ...acc, [y]: 0 }), {});
    Object.values(data).forEach(category => {
      years.forEach(year => {
        totals[year] += Number(category[year]) || 0;
      });
    });
    return totals;
  };

  const genderTotals = calculateTotals(genderData);
  const diversityTotals = calculateTotals(diversityData);

  // Handle input changes
  const handleGenderChange = (gender, year, value) => {
    if (value < 0) return;
    setGenderData(prev => ({
      ...prev,
      [gender]: { ...prev[gender], [year]: value },
    }));
  };

  const handleDiversityChange = (category, year, value) => {
    if (value < 0) return;
    setDiversityData(prev => ({
      ...prev,
      [category]: { ...prev[category], [year]: value },
    }));
  };

  const handleExamChange = (id, field, value) => {
    if ((field === 'highestRank' || field === 'lowestRank') && value < 0) return;
    setExamRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleFinanceChange = (field, value) => {
    if (value < 0) return;
    setFinanceData(prev => ({ ...prev, [field]: value }));
  };

  // Add new row to Exam Scores table
  const addExamRow = () => {
    const newId = Math.max(...examRows.map(row => row.id), 0) + 1;
    setExamRows(prev => [
      ...prev,
      { id: newId, department: '', examName: '', highestRank: '', lowestRank: '' },
    ]);
  };

  // Remove last row from Exam Scores table
  const removeExamRow = () => {
    if (examRows.length > 2) {
      setExamRows(prev => prev.slice(0, -1));
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    if (!sectionBDriveLink || !/^(https?:\/\/)/.test(sectionBDriveLink)) {
      toast.error('Please provide a valid Google Drive link');
      return false;
    }
    for (const row of examRows) {
      if (row.department && !row.examName) {
        toast.error('Exam name is required for all departments');
        return false;
      }
      if ((row.highestRank || row.lowestRank) && (!row.department || !row.examName)) {
        toast.error('Department and exam name are required if ranks are provided');
        return false;
      }
    }
    return true;
  };

  // Transform frontend state to backend array format
  const transformToArray = (data, keys) => {
    return years.map(year => {
      const item = { year };
      keys.forEach(key => {
        item[key] = Number(data[key][year]) || 0;
      });
      return item;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const genderInfos = transformToArray(genderData, ['male', 'female', 'transgender']);
      const diversityInfos = transformToArray(diversityData, ['interstate', 'intrastate', 'overseas']);
      const examScores = examRows
        .filter(row => row.department || row.examName || row.highestRank || row.lowestRank)
        .map(row => ({
          departmentName: row.department,
          examName: row.examName,
          highestRank: Number(row.highestRank) || 0,
          lowestRank: Number(row.lowestRank) || 0,
        }));
      const financeInfos = [{
        year: years[0],
        avgTuitionFees: Number(financeData.avgTuitionFees) || 0,
        otherFees: Number(financeData.otherFees) || 0,
        hostelFees: Number(financeData.hostelFees) || 0,
        totalExpensesSalary: Number(financeData.totalExpensesSalary) || 0,
        totalExpensesLabs: Number(financeData.totalExpensesLabs) || 0,
        perStudentExpenditure: Number(financeData.perStudentExpenditure) || 0,
      }];

      const payload = {
        genderInfos,
        diversityInfos,
        examScores,
        financeInfos,
        sectionBDriveLink,
      };

      try {
        await axios.put('https://qae-server.vercel.app/api/submit/submissions/section-b', payload, {
          headers: getAuthHeader(),
        });
      } catch (putErr) {
        if (putErr.response?.status === 404) {
          await axios.post('https://qae-server.vercel.app/api/submit/submissions/section-b', payload, {
            headers: getAuthHeader(),
          });
        } else {
          throw putErr;
        }
      }

      setTimeout(() => {
        if (onNext) onNext();
      }, 2000);
      toast.success('Section B submitted successfully');
    } catch (err) {
      console.error('Submit Section B Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(err.response?.data?.message || 'Failed to submit Section B');
    } finally {
      setLoading(false);
    }
  };

  // Render fallback UI if years failed to load
  if (!years.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pb-40">
        <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Section B: Gender Information, Diversity and Finance
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Provide details on student admissions, diversity, exam scores, and financial information for the specified academic years.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Gender Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Gender Information</h2>
              <p className="text-teal-100">Number of students admitted (includes government, management, and others).</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Gender</th>
                      {years.map(year => (
                        <th key={year} className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['male', 'female', 'transgender'].map(gender => (
                      <tr key={gender} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 capitalize">{gender}</td>
                        {years.map(year => (
                          <td key={year} className="py-4 px-6">
                            <input
                              type="number"
                              min="0"
                              value={genderData[gender][year] || ''}
                              required
                              onChange={(e) => handleGenderChange(gender, year, e.target.value)}
                              placeholder="Enter count"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              disabled={loading}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b-2 border-gray-300 bg-teal-50">
                      <td className="py-4 px-6 font-bold text-gray-900">Total</td>
                      {years.map(year => (
                        <td key={year} className="py-4 px-6">
                          <input
                            type="number"
                            value={genderTotals[year]}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Diversity Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Diversity Information</h2>
              <p className="text-teal-100">Number of students admitted from the above table, categorized by location.</p>
            </div>
            <div className="p-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-medium">
                  <strong>Note:</strong> The student count is only admitted count in the Academic Year (AY); not enrolled in the AY.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Category</th>
                      {years.map(year => (
                        <th key={year} className="text-center py-4 px-6 font-semibold text-gray-900 bg-gray-50">{year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['interstate', 'intrastate', 'overseas'].map(category => (
                      <tr key={category} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900 capitalize">{category.replace('state', ' state')}</td>
                        {years.map(year => (
                          <td key={year} className="py-4 px-6">
                            <input
                              type="number"
                              min="0"
                              value={diversityData[category][year] || ''}
                              required
                              onChange={(e) => handleDiversityChange(category, year, e.target.value)}
                              placeholder="Enter count"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                              disabled={loading}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b-2 border-gray-300 bg-teal-50">
                      <td className="py-4 px-6 font-bold text-gray-900">Total</td>
                      {years.map(year => (
                        <td key={year} className="py-4 px-6">
                          <input
                            type="number"
                            value={diversityTotals[year]}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Exam Scores */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Exam Scores</h2>
              <p className="text-teal-100">Provide exam scores for admitted students (JEE, State Entrance, Counselling rank, etc.)</p>
            </div>
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Department</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Exam Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Highest Rank</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 bg-gray-50">Lowest Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examRows.map(row => (
                      <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={row.department}
                            required
                            onChange={(e) => handleExamChange(row.id, 'department', e.target.value)}
                            placeholder="Enter department"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            disabled={loading}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={row.examName}
                            required
                            onChange={(e) => handleExamChange(row.id, 'examName', e.target.value)}
                            placeholder="Enter exam name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            disabled={loading}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            min="0"
                            value={row.highestRank}
                            required
                            onChange={(e) => handleExamChange(row.id, 'highestRank', e.target.value)}
                            placeholder="Enter rank"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            disabled={loading}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="number"
                            min="0"
                            value={row.lowestRank}
                            required
                            onChange={(e) => handleExamChange(row.id, 'lowestRank', e.target.value)}
                            placeholder="Enter rank"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                            disabled={loading}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={addExamRow}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    disabled={loading}
                  >
                    + Add more rows
                  </button>
                  {examRows.length > 2 && (
                    <button
                      type="button"
                      onClick={removeExamRow}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                      disabled={loading}
                    >
                      - Remove last row
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Financial Details for Last Academic Year</h2>
              <p className="text-teal-100">Provide financial details for the last academic year ({years[0]}).</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Average tuition fees collected from the student per year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.avgTuitionFees}
                    required
                    onChange={(e) => handleFinanceChange('avgTuitionFees', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Other fees collected per year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.otherFees}
                    required
                    onChange={(e) => handleFinanceChange('otherFees', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Hostel fees per year
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.hostelFees}
                    required
                    onChange={(e) => handleFinanceChange('hostelFees', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Total expenses (salary/remuneration) for teaching, non-teaching, staff salary
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.totalExpensesSalary}
                    required
                    onChange={(e) => handleFinanceChange('totalExpensesSalary', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Total expenses on labs (all laboratories)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.totalExpensesLabs}
                    required
                    onChange={(e) => handleFinanceChange('totalExpensesLabs', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Per student expenditure
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={financeData.perStudentExpenditure}
                    required
                    onChange={(e) => handleFinanceChange('perStudentExpenditure', e.target.value)}
                    placeholder="Enter amount in ₹"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B Drive Link */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Section B Drive Link (for verification)
            </label>
            <input
              type="url"
              value={sectionBDriveLink}
              required
              onChange={(e) => setSectionBDriveLink(e.target.value)}
              placeholder="Enter Google Drive link"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
              disabled={loading}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Section A
              </button>
            )}
            <div className="flex space-x-4 ml-auto">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    Save and Continue to Section C
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-12 pt-8 border-t border-teal-200">
          <p className="text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:founderqae@gmail.com" className="text-teal-600 hover:text-teal-700 font-medium">
              founderqae@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionB;