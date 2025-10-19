import { ChevronRight } from 'lucide-react';
import ChartAnimation from './ChartAnimation';

const HeroContentSection = () => (
  <section className="relative bg-gradient-to-br from-teal-50 to-cyan-50 py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transparent & Credible
            <span className="text-teal-600 block">College Rankings</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            India's premier ranking platform for Engineering and Arts & Science institutions. 
            Fair evaluation, verified data, and transparent methodology for better education choices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => window.location.href = '/leaderboard'} className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 flex items-center justify-center group" >
              View Rankings
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => window.location.href = '/application'}className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-all duration-200">
              Submit Your College
            </button>
          </div>
        </div>
        
        <div className="relative">
          <ChartAnimation />
        </div>
      </div>
    </div>
  </section>
);

export default HeroContentSection;