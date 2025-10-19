import { FileText, UserCheck, Upload, Copyright, ShieldAlert, AlertTriangle, XCircle, Scale, Mail } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Purpose of the Website",
      content: [
        {
          text: "The QAE website serves as an informational and interactive platform to:",
          list: [
            "Provide details about QAE's ranking, accreditation, and quality assessment services.",
            "Facilitate institutional registration for evaluation and ranking.",
            "Publish ranking results, reports, and research findings.",
            "Offer resources and updates related to educational quality enhancement."
          ]
        },
        {
          text: "The information presented is for institutional and academic purposes only and should not be interpreted as a legal or binding certification unless explicitly stated.",
          isNote: true
        }
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "2. Eligibility",
      content: [
        {
          text: "By using this website, you confirm that you are:",
          list: [
            "An authorized representative of an educational institution.",
            "Using the website for lawful and legitimate purposes only.",
            "Providing accurate and verifiable information during any registration or communication process."
          ]
        }
      ]
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "3. Institutional Registration and Data Submission",
      content: [
        {
          text: "Institutions engaging with QAE for ranking/accreditation/audit purposes agree to:",
          list: [
            "Provide accurate, complete, and verifiable information and supporting documents.",
            "Authorize QAE to validate, verify, and utilize submitted data solely for evaluation purposes.",
            "Accept that QAE's decisions, assessments, and rankings are based on the methodologies and data available during evaluation and are final and binding."
          ]
        },
        {
          text: "QAE reserves the right to withhold, modify, or revoke published rankings or reports if discrepancies or misrepresentations are later identified.",
          isWarning: true
        }
      ]
    },
    {
      icon: <Copyright className="w-6 h-6" />,
      title: "4. Intellectual Property Rights",
      content: [
        {
          text: "All materials, data, logos, text, reports, graphics, methodologies, and website content are the intellectual property of QAE and protected under applicable copyright and trademark laws."
        },
        {
          text: "Users may not reproduce, distribute, modify, or commercially exploit QAE's content without prior written consent. Institutions may, however, cite or display QAE rankings for promotional purposes with appropriate acknowledgment and in compliance with QAE's branding guidelines."
        }
      ]
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "5. Use of Website and Restrictions",
      content: [
        {
          text: "You agree not to:",
          list: [
            "Use the website for any unlawful or fraudulent activity.",
            "Attempt to gain unauthorized access to the website or related systems.",
            "Upload or transmit harmful code, viruses, or data.",
            "Misrepresent institutional data or credentials.",
            "Copy, modify, or redistribute website materials without permission."
          ]
        },
        {
          text: "Violation of these terms may result in suspension or permanent removal of access and may be subject to legal action.",
          isWarning: true
        }
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "6. Ranking Methodology Disclaimer",
      content: [
        {
          text: "QAE rankings and assessments are based on structured methodologies, verified data, and independent expert reviews. While we ensure fairness and transparency, rankings are indicative assessments and not certifications or regulatory endorsements."
        },
        {
          text: "QAE shall not be liable for any decisions, claims, or outcomes derived from interpretation or use of ranking results by institutions, students, or third parties."
        }
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "7. Limitation of Liability",
      content: [
        {
          text: "To the fullest extent permitted by law:",
          list: [
            "QAE shall not be responsible for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our website or services.",
            "QAE makes no warranties regarding uninterrupted access, data accuracy, or completeness of published information.",
            "Users access the website and its contents at their own discretion and risk."
          ]
        }
      ]
    },
    {
      icon: <XCircle className="w-6 h-6" />,
      title: "8. Termination of Access",
      content: [
        {
          text: "QAE may suspend or terminate access to the website or specific services if users violate these Terms, engage in misuse, or submit false information."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-16 h-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-center text-teal-100 text-lg max-w-3xl mx-auto mt-4">
            Welcome to QAE – Quality Assessment & Technical Evaluation Ranking. These Terms of Service govern your access to and use of our website and services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-teal-600">
          <p className="text-gray-700 leading-relaxed text-lg">
            These Terms of Service ("Terms") govern your access to and use of our website (
            <a href="https://www.qae.co.in" className="text-teal-600 hover:text-teal-700 font-semibold">www.qae.co.in</a>
            ), related online services, and all materials, reports, and communications provided by QAE ("QAE," "we," "our," or "us").
          </p>
          <div className="mt-6 bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg">
            <p className="text-gray-800 font-semibold">
              <strong>By accessing or using our website or services, you agree to comply with these Terms.</strong>
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">{section.title}</h2>
            </div>
            
            {section.content.map((item, idx) => (
              <div key={idx} className="ml-16 mb-4 last:mb-0">
                {item.text && !item.isNote && !item.isWarning && (
                  <p className="text-gray-700 leading-relaxed mb-3">{item.text}</p>
                )}
                
                {item.isNote && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-gray-800 leading-relaxed">
                      <strong className="text-blue-700">Note:</strong> {item.text}
                    </p>
                  </div>
                )}
                
                {item.isWarning && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-gray-800 leading-relaxed">
                      <strong className="text-amber-700">Important:</strong> {item.text}
                    </p>
                  </div>
                )}
                
                {item.list && (
                  <ul className="space-y-2 mt-3">
                    {item.list.map((listItem, listIdx) => (
                      <li key={listIdx} className="flex items-start">
                        <span className="text-teal-600 mr-3 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Important Notice</h2>
          </div>
          <p className="text-white leading-relaxed">
            By continuing to use QAE's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of our website immediately.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Questions About These Terms?</h2>
          </div>
          <p className="text-center text-teal-100 mb-6">
            If you have any questions or concerns regarding these Terms of Service, please contact us:
          </p>
          <div className="text-center">
            <a 
              href="mailto:founderqae@gmail.com" 
              className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              founderqae@gmail.com
            </a>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default TermsOfService;