import React from 'react';
import { Award, Target, Eye, CheckCircle, Users, Building2, TrendingUp, Globe, BookOpen, LineChart } from 'lucide-react';

const AboutPage = () => {
  const evaluationDimensions = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Academic & Teaching Quality",
      description: "Assessment of curriculum, pedagogy, and learning methodologies"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Faculty & Research",
      description: "Credentials, publications, and research contributions"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Student Outcomes",
      description: "Learning outcomes, employability, and placement records"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Infrastructure & Resources",
      description: "Facilities, technology adoption, and learning resources"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Governance & Sustainability",
      description: "Administrative practices and institutional sustainability"
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Innovation & Engagement",
      description: "Entrepreneurship, research, and community outreach"
    }
  ];

  const coverageAreas = [
    "Universities",
    "Autonomous Colleges",
    "Engineering Institutions",
    "Management & Business Schools",
    "Medical & Healthcare Colleges",
    "Professional Schools"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-12 h-12" />
            <h1 className="text-5xl font-bold">QAE</h1>
          </div>
          <p className="text-2xl text-teal-100 font-medium">
            Empowering Education Through Transparent Rankings & Quality Assurance
          </p>
          <p className="text-lg text-teal-50 mt-4 max-w-3xl">
            India's dedicated Quality Ranking Agency, focused on evaluating, accrediting, and ranking higher education institutions with integrity, transparency, and global benchmarks.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* About Us Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">About Us</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              QAE is an independent and trusted body established with the primary objective of enhancing the quality of education across India. In today's competitive global environment, educational institutions are expected to meet rigorous standards of teaching, research, innovation, and governance.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              Recognizing this need, QAE was founded to act as a catalyst for academic excellence, institutional growth, and global competitiveness. We specialize in providing <span className="font-semibold text-teal-700">comprehensive assessment, accreditation, and ranking solutions</span> that support higher education institutions in achieving their goals of quality enhancement and recognition.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              By combining global best practices with an in-depth understanding of the Indian higher education landscape, we deliver evaluation frameworks that are transparent, reliable, and benchmarked against international standards.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              At QAE, we believe that <span className="font-semibold text-teal-700">quality is the foundation of excellence.</span> Our role goes beyond ranking institutions; we aim to foster a culture of continuous improvement. Through structured methodologies, objective assessment tools, and expert guidance, we help institutions identify their strengths, overcome challenges, and chart a clear roadmap toward academic and administrative excellence.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Expertise Spans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span className="text-slate-700 font-medium">{area}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evaluation Dimensions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Evaluation Framework</h2>
          <p className="text-slate-600 text-lg mb-8">
            Our comprehensive evaluation covers multiple dimensions of higher education:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evaluationDimensions.map((dimension, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                    {dimension.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{dimension.title}</h3>
                    <p className="text-slate-600">{dimension.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-teal-50 rounded-lg border border-teal-200 p-6 mt-6">
            <p className="text-slate-700 leading-relaxed">
              We also evaluate <span className="font-semibold">inclusivity, outreach, and societal impact</span> to ensure institutions contribute meaningfully to society while maintaining high academic standards.
            </p>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Commitment</h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              By ensuring fairness and credibility in every assessment, QAE has positioned itself as a trusted partner for institutions seeking to enhance their performance, secure higher national rankings, and gain recognition at the international level.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              In essence, <span className="font-semibold text-teal-700">QAE is more than a ranking agency—it is a partner in institutional growth and transformation.</span> Through our services, we strive to raise the standards of Indian education, making it globally respected, nationally relevant, and socially responsible.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vision */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg shadow-md p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-teal-50 text-lg leading-relaxed">
                To be India's most trusted authority in educational quality rankings and an enabler of academic excellence.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-md p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-teal-400" />
                  <span className="text-slate-100">Promote excellence in education through transparent and credible rankings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-teal-400" />
                  <span className="text-slate-100">Support institutions in continuous improvement and quality enhancement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1 text-teal-400" />
                  <span className="text-slate-100">Benchmark Indian institutions at global standards</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-8 text-center">
            <Globe className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Partner with QAE</h2>
            <p className="text-slate-700 text-lg mb-6 max-w-2xl mx-auto">
              Join us in our mission to elevate Indian education to global standards. Together, we can build institutions that are recognized for excellence, innovation, and impact.
            </p>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
              Get in Touch
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;