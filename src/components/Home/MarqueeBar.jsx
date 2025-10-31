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

        setAppStatus({
          isOpen: data.isOpen ?? false,
          year: data.year ?? null,
          startDate: data.startDate ?? null,
          endDate: data.endDate ?? null,
          message: data.message ?? null,
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

  // Use real current time
  const now = Date.now();

  const format = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

  const getMarqueeText = () => {
    // 1. Custom admin message overrides everything
    if (appStatus.message) return appStatus.message;

    const year = appStatus.year ?? 'this year';

    // 2. Dates not set yet
    if (!appStatus.startDate || !appStatus.endDate) {
      return `Application dates not released yet for ${year}`;
    }

    const start = new Date(appStatus.startDate).getTime();
    const end = new Date(appStatus.endDate).getTime();

    // 3. Not started yet
    if (now < start) {
      return `Applications not yet started for ${year} | Opens on ${format(appStatus.startDate)}`;
    }

    // 4. Currently open
    if (now >= start && now <= end) {
      return `Applications Open: QAE Rankings ${year} | From ${format(appStatus.startDate)} | Until ${format(appStatus.endDate)} | Submit Now!`;
    }

    // 5. Closed
    return `Applications closed for ${year}`;
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