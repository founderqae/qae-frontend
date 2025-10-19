import { Building, Users, Award, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

const StatsSection = () => {
  const stats = [
    { icon: Building, label: "Registered Colleges", value: 2500, suffix: "+" },
    { icon: Users, label: "Active Submissions", value: 1800, suffix: "+" },
    { icon: Award, label: "Categories", value: 2, suffix: "" },
    { icon: Trophy, label: "Years of Excellence", value: 10, suffix: "+" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <CountingCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CountingCard = ({ stat }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`stat-${stat.label}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [stat.label]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = stat.value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, stat.value]);

  return (
    <div
      id={`stat-${stat.label}`}
      className="text-center p-6 rounded-xl bg-white border border-teal-100 hover:shadow-lg transition-all duration-300 group"
    >
      <stat.icon className="h-12 w-12 text-teal-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-gray-600 font-medium">{stat.label}</div>
    </div>
  );
};

export default StatsSection;