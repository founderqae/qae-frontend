import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Submissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [institutionName, setInstitutionName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const response = await axios.get('https://qae-server.vercel.app/api/submit/submissions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { submissions: data, institutionName } = response.data;
        const formattedSubmissions = data.map(sub => ({
          id: sub.id,
          year: sub.submissionYear.toString(),
          submissionDate: sub.submittedAt ? new Date(sub.submittedAt).toISOString().split('T')[0] : 'N/A',
          status: sub.status.replace('_', '-'),
          institutionName,
        }));
        setSubmissions(formattedSubmissions);
        setInstitutionName(institutionName);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchSubmissions();
  }, []);

  const handleViewDetails = (submissionId, year) => {
    navigate(`/submission-detail/${submissionId}?year=${year}`);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'PENDING-REVIEW':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING-REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">My Submissions</h1>

      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-700 to-teal-600">
              <tr>
                <th className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">Institution Name</th>
                <th className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">Submission Date</th>
                <th className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-white font-semibold text-sm uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-200 hover:bg-teal-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-teal-700 font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>{submission.year}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 font-medium">{submission.institutionName}</td>
                  <td className="px-4 py-4 text-gray-600">
                    {submission.submissionDate !== 'N/A' ? new Date(submission.submissionDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not Submitted'}
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${getStatusClass(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span>{submission.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => handleViewDetails(submission.id, submission.year)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-teal-800 hover:to-teal-700"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {submissions.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600 font-semibold mb-2">No Submissions Found</h3>
              <p className="text-gray-500">You haven't submitted any applications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;