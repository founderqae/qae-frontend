import React, { useEffect, useState } from 'react';

const MarqueeBar = () => {
  const [appStatus, setAppStatus] = useState({
    isOpen: false,
    year: null,
    startDate: null,
    endDate: null,
    message: 'Loading application status...',
  });

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch('https://qae-server.vercel.app/api/date-config/is-open');
        if (!response.ok) {
          throw new Error('Failed to fetch application status');
        }
        const data = await response.json();
        
        // Assuming the backend returns { isOpen, year, startDate, endDate }
        // If dates not set, isOpen will be false with optional message
        setAppStatus({
          isOpen: data.isOpen,
          year: data.year || null,
          startDate: data.startDate ? new Date(data.startDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : null,
          endDate: data.endDate ? new Date(data.endDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : null,
          message: data.message || null,
        });
      } catch (error) {
        console.error('Error fetching application status:', error);
        setAppStatus({
          isOpen: false,
          year: null,
          startDate: null,
          endDate: null,
          message: 'Error loading application status',
        });
      }
    };

    fetchApplicationStatus();
  }, []);

  const getMarqueeText = () => {
    if (appStatus.message) {
      return appStatus.message;
    }
    if (appStatus.isOpen && appStatus.year && appStatus.startDate && appStatus.endDate) {
      return `🚨 Applications Open: QAE Rankings ${appStatus.year} | Start Date: ${appStatus.startDate} | End Date: ${appStatus.endDate} | Submit Now! 🚨`;
    }
    if (appStatus.year) {
      return `🚨 Applications Closed for the year ${appStatus.year} 🚨`;
    }
    return '🚨 Application status unavailable 🚨';
  };

  return (
    <div className="bg-gradient-to-r from-red-900 to-yellow-500 text-white py-3 overflow-hidden w-full">
      <div
        className="inline-flex whitespace-nowrap"
        style={{
          animation: 'scroll-left 30s linear infinite',
          width: 'max-content',
        }}
      >
        {[...Array(4)].map((_, index) => (
          <span key={index} className="text-lg font-regular mx-3">
            {getMarqueeText()}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBar;