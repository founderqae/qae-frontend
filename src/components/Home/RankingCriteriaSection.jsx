import { FileText, GraduationCap, Building, Users2, Shield } from 'lucide-react';

const RankingCriteriaSection = () => {
  const rankingCriteria = [
    { 
      section: 'A', 
      title: 'General Information', 
      icon: FileText,
      description: 'Basic institutional data and accreditation'
    },
    { 
      section: 'B', 
      title: 'Diversity & Finance', 
      icon: GraduationCap,
      description: 'Diversity metrics, inclusion policies, and financial management'
    },
    { 
      section: 'C', 
      title: 'Academics', 
      icon: Users2,
      description: 'Academic programs, teaching quality, and outcomes'
    },
    { 
      section: 'D', 
      title: 'Infrastructure', 
      icon: Building,
      description: 'Campus facilities, labs, and learning resources'
    },
    { 
      section: 'E', 
      title: 'Research', 
      icon: Shield,
      description: 'Research output, innovation, and impact'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ranking Methodology</h2>
          <p className="text-xl text-gray-600">Comprehensive 5-section evaluation framework</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {rankingCriteria.map((item, index) => (
            <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <item.icon className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RankingCriteriaSection;