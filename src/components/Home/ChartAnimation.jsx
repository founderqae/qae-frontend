import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

const ChartAnimation = () => {
  const [animate, setAnimate] = useState(false);
  const [chartData, setChartData] = useState([
    { value: 45 },
    { value: 62 },
    { value: 38 },
    { value: 78 },
    { value: 92 },
    { value: 55 },
  ]);

  useEffect(() => {
    setAnimate(true);
    
    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setChartData(prevData =>
          prevData.map(() => ({
            value: Math.floor(Math.random() * 100) + 20,
          }))
        );
        setAnimate(true);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div>
      <div className="relative bg-white rounded-2xl shadow-2xl p-12 border border-teal-100 w-full max-w-2xl">
        <div className="absolute top-4 left-4">
          <BarChart3 className="h-6 w-6 text-teal-600" />
        </div>

        {/* Bar Chart Container */}
        <div className="mt-8 pt-4">
          <div className="flex items-end justify-between gap-3 h-64">
            {chartData.map((item, index) => {
              const heightPercent = (item.value / maxValue) * 100;
              const delay = index * 80;

              return (
                <div key={index} className="flex-1">
                  <div className="w-full h-56 flex items-end justify-center">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg shadow-lg hover:shadow-xl hover:from-teal-400 hover:to-teal-300 cursor-pointer transform transition-all duration-700 hover:scale-105"
                      style={{
                        height: animate ? `${heightPercent}%` : '0%',
                        transitionDelay: `${delay}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartAnimation;