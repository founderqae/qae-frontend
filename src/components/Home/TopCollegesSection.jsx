import { MapPin, Calendar, Star, TrendingUp, ChevronRight } from 'lucide-react';

const TopCollegesSection = () => {
  const topColleges = [
    {
      rank: 1,
      name: "Indian Institute of Technology, Delhi",
      type: "Engineering",
      score: 98.5,
      location: "New Delhi",
      established: 1961,
      rating: 4.9
    },
    {
      rank: 2,
      name: "Indian Institute of Science",
      type: "Arts & Science",
      score: 97.8,
      location: "Bangalore",
      established: 1909,
      rating: 4.8
    },
    {
      rank: 3,
      name: "IIT Bombay",
      type: "Engineering",
      score: 96.9,
      location: "Mumbai",
      established: 1958,
      rating: 4.7
    },
    {
      rank: 4,
      name: "Jadavpur University",
      type: "Engineering",
      score: 94.2,
      location: "Kolkata",
      established: 1955,
      rating: 4.6
    },
    {
      rank: 5,
      name: "Delhi University",
      type: "Arts & Science",
      score: 93.7,
      location: "New Delhi",
      established: 1922,
      rating: 4.5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Ranked Colleges 2024</h2>
          <p className="text-xl text-gray-600">Leading institutions based on comprehensive evaluation</p>
        </div>
        
        <div className="space-y-6">
          {topColleges.map((college, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold text-xl ${
                    college.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    college.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    college.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-teal-500 to-teal-700'
                  }`}>
                    #{college.rank}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {college.name}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        college.type === 'Engineering' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {college.type}
                      </span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {college.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Est. {college.established}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                        {college.rating}/5
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="text-3xl font-bold text-teal-600">{college.score}</span>
                  </div>
                  <span className="text-sm text-gray-500">QAE Score</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 inline-flex items-center group">
            View Complete Rankings
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopCollegesSection;