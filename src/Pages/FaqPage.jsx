import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, BookOpen, Award, Building2, Users, FileCheck, Globe } from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: "General Information",
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          question: "What is QAE?",
          answer: "QAE (Quality Assurance & Excellence) is India's dedicated Quality Ranking Agency focused on evaluating, accrediting, and ranking higher education institutions with integrity, transparency, and global benchmarks. We assess universities, colleges, and professional institutions across various parameters to provide credible rankings."
        },
        {
          question: "Why are college rankings important?",
          answer: "College rankings help students and parents make informed decisions about higher education choices. They provide a comparative assessment of institutions based on academic quality, infrastructure, faculty, placements, and other crucial factors. Rankings also encourage institutions to maintain and improve their standards."
        },
        {
          question: "How often are the rankings updated?",
          answer: "QAE rankings are updated annually. We conduct comprehensive assessments throughout the year and release updated rankings once all evaluations are completed. This ensures that our rankings reflect the most current performance of institutions."
        },
        {
          question: "Are QAE rankings recognized nationally?",
          answer: "Yes, QAE rankings are recognized by educational institutions, students, and stakeholders across India. We follow rigorous evaluation methodologies aligned with national and international standards, making our rankings credible and reliable."
        }
      ]
    },
    {
      category: "Ranking Methodology",
      icon: <BookOpen className="w-5 h-5" />,
      questions: [
        {
          question: "What criteria are used for ranking colleges?",
          answer: "QAE evaluates institutions across multiple dimensions including: Academic & Teaching Quality, Faculty Credentials & Research, Student Learning Outcomes & Placements, Infrastructure & Resources, Governance & Sustainability, Innovation & Entrepreneurship, and Inclusivity & Societal Impact. Each parameter is weighted based on its importance."
        },
        {
          question: "How is the scoring system calculated?",
          answer: "Our scoring system uses a comprehensive weighted average approach. Each evaluation dimension has specific sub-parameters with assigned weights. Data is collected through institutional submissions, third-party verification, and on-site assessments. Scores are normalized to a 100-point scale for easy comparison."
        },
        {
          question: "What is the difference between Engineering and Arts & Science rankings?",
          answer: "Engineering and Arts & Science colleges are ranked separately because they have different evaluation parameters and benchmarks. Engineering colleges are assessed with emphasis on technical infrastructure, research output, and industry placements, while Arts & Science colleges focus on academic diversity, research quality, and holistic education."
        },
        {
          question: "How do you ensure objectivity in rankings?",
          answer: "QAE ensures objectivity through multiple measures: transparent methodology, data verification from multiple sources, third-party audits, peer review processes, and expert committee oversight. We follow strict protocols to prevent bias and maintain the integrity of our rankings."
        }
      ]
    },
    {
      category: "For Institutions",
      icon: <Building2 className="w-5 h-5" />,
      questions: [
        {
          question: "How can my institution participate in QAE rankings?",
          answer: "Institutions can register for QAE rankings by submitting an application through our official portal. The process involves providing comprehensive data about your institution, including academic programs, faculty details, student outcomes, infrastructure, and governance practices. Our team will guide you through the evaluation process."
        },
        {
          question: "What documents are required for the ranking process?",
          answer: "Required documents include institutional accreditation certificates, faculty qualifications and publications, student enrollment and outcome data, infrastructure details, financial statements, placement records, research output documentation, and governance policies. A detailed checklist is provided during registration."
        },
        {
          question: "Is there a fee for participating in rankings?",
          answer: "Yes, there is an evaluation fee that covers the comprehensive assessment process, including data verification, on-site visits, expert reviews, and report generation. The fee structure varies based on institution type and size. Please contact us for detailed pricing information."
        },
        {
          question: "How can institutions improve their rankings?",
          answer: "Institutions can improve rankings by focusing on: enhancing teaching quality, increasing faculty research output, improving student outcomes and placements, upgrading infrastructure and facilities, strengthening governance practices, fostering innovation and entrepreneurship, and increasing community engagement. QAE provides detailed feedback reports to help institutions identify areas for improvement."
        },
        {
          question: "Can institutions appeal their ranking results?",
          answer: "Yes, institutions can submit an appeal within 30 days of ranking publication if they believe there are factual errors or procedural irregularities. Appeals must be accompanied by supporting documentation. Our review committee will examine the case and provide a decision within 45 days."
        }
      ]
    },
    {
      category: "For Students & Parents",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: "How should I use rankings to choose a college?",
          answer: "Rankings are one of several factors to consider. Use them as a starting point to identify quality institutions, but also consider your specific needs: program offerings, location, fees, campus culture, placement opportunities, and career goals. Visit shortlisted colleges and speak with current students and alumni."
        },
        {
          question: "Do higher-ranked colleges guarantee better placements?",
          answer: "While higher-ranked colleges generally have strong placement records, individual outcomes depend on various factors including your academic performance, skills, chosen specialization, and career aspirations. Rankings reflect overall institutional quality, but personal effort and choices significantly impact career success."
        },
        {
          question: "Are rankings the same across all parameters?",
          answer: "No, colleges may rank differently across various parameters. A college might excel in research but score lower in infrastructure, or vice versa. QAE provides detailed parameter-wise scores so you can evaluate institutions based on factors most important to you."
        },
        {
          question: "How reliable is the placement data in rankings?",
          answer: "QAE verifies placement data through multiple sources including institutional records, third-party audits, and student feedback. However, we recommend students independently verify placement claims during college visits and speak with alumni about their experiences."
        }
      ]
    },
    {
      category: "Technical & Data",
      icon: <FileCheck className="w-5 h-5" />,
      questions: [
        {
          question: "How is data collected for rankings?",
          answer: "Data is collected through multiple channels: institutional self-reporting via our online portal, third-party data verification agencies, government databases, student and faculty surveys, alumni feedback, employer surveys, and on-site institutional visits by our assessment teams."
        },
        {
          question: "How do you verify the accuracy of submitted data?",
          answer: "We employ a rigorous verification process including cross-referencing with government databases, third-party audits, document verification, random sampling checks, and on-site inspections. Institutions found providing false information are penalized and may be excluded from rankings."
        },
        {
          question: "Can I access detailed ranking reports?",
          answer: "Yes, detailed ranking reports are available on our website. Public reports include overall rankings, category-wise scores, and key highlights. Institutions receive comprehensive confidential reports with detailed parameter-wise analysis, benchmarking data, and improvement recommendations."
        },
        {
          question: "How can I download or export ranking data?",
          answer: "Ranking data can be exported in PDF format using the 'Export PDF' button available on the leaderboard page. This allows you to save and share rankings with others. We also provide CSV downloads for research and analysis purposes."
        }
      ]
    },
    {
      category: "Accreditation & Standards",
      icon: <Award className="w-5 h-5" />,
      questions: [
        {
          question: "What is the difference between ranking and accreditation?",
          answer: "Accreditation is a quality assurance process that certifies an institution meets minimum standards, while ranking compares institutions and orders them based on relative performance. QAE provides both services - accreditation ensures baseline quality, while rankings showcase excellence."
        },
        {
          question: "Are QAE rankings aligned with international standards?",
          answer: "Yes, QAE methodology incorporates best practices from international ranking agencies while considering the unique context of Indian higher education. We benchmark our evaluation parameters against global standards to ensure our rankings are internationally relevant."
        },
        {
          question: "Do you rank international institutions?",
          answer: "Currently, QAE focuses exclusively on Indian higher education institutions. However, we use international benchmarks in our evaluation process and plan to expand to regional collaborations in the future."
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-teal-100 text-lg">
            Find answers to common questions about QAE rankings and our evaluation process
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-slate-700"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{category.category}</h2>
                </div>

                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={questionIndex}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-slate-800 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-teal-600 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-slate-700">No questions found</p>
            <p className="text-slate-500 mt-2">Try searching with different keywords</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-8 text-center">
          <Globe className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Still Have Questions?</h3>
          <p className="text-slate-700 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors" onClick={() => window.location.href = '/contact'} >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;