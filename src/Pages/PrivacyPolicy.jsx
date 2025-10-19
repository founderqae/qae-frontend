import { Shield, Lock, Users, FileText, Bell, Database, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you contact us and register for ranking, we may collect:",
          list: [
            "Name and contact details (email, phone number, address)",
            "Institutional details (name, category, location, accreditation status, etc.)",
            "Designation and professional details of authorities",
            "Any documents or data submitted for assessment or ranking purposes"
          ]
        }
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "2. How We Use the Information",
      content: [
        {
          text: "QAE uses the collected information for the following purposes:",
          list: [
            "To process institutional applications for ranking/accreditation/audit services",
            "To communicate updates, notifications, and results",
            "To prepare institutional profiles, reports, and ranking data",
            "To comply with applicable laws, regulations, and audit requirements"
          ]
        }
      ]
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "3. Information Disclosure",
      content: [
        {
          text: "We do not sell, trade, or rent users' personal information. However, we may share information under the following conditions:",
          list: [
            "With authorized evaluation/audit experts of QAE",
            "With government or regulatory authorities when required by law"
          ]
        }
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "4. Data Security",
      content: [
        {
          text: "QAE employs appropriate technical and organizational measures to ensure the security and confidentiality of your information. This includes restricted access and regular data protection reviews."
        }
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "5. Data Retention",
      content: [
        {
          text: "We retain institutional and personal data only as long as necessary to fulfill the purposes outlined in this policy or as required by law. Upon completion of evaluation cycles, certain data may be archived (in client web drive) for audit or record-keeping purposes."
        }
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "6. Your Rights",
      content: [
        {
          text: "You may request to:",
          list: [
            "Access, review, or update your information",
            "Requests can be sent to founderqae@gmail.com. We will respond within a reasonable timeframe in accordance with applicable data protection laws."
          ]
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
            <Shield className="w-16 h-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-center text-teal-100 text-lg max-w-3xl mx-auto mt-4">
            At QAE – Quality Assessment & Technical Evaluation Ranking, we value your privacy and are committed to protecting the personal information you share with us.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-teal-600">
          <p className="text-gray-700 leading-relaxed text-lg">
            This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website (
            <a href="https://www.qae.co.in" className="text-teal-600 hover:text-teal-700 font-semibold">www.qae.co.in</a>
            ) or engage with our services.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            <strong>By accessing or using our website, you agree to the terms of this Privacy Policy.</strong>
          </p>
        </div>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-2">{section.title}</h2>
            </div>
            
            {section.content.map((item, idx) => (
              <div key={idx} className="ml-16">
                {item.subtitle && (
                  <h3 className="text-xl font-semibold text-teal-700 mb-3">{item.subtitle}</h3>
                )}
                {item.text && (
                  <p className="text-gray-700 leading-relaxed mb-3">{item.text}</p>
                )}
                {item.list && (
                  <ul className="space-y-2">
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

        {/* Additional Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start mb-4">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">8. Third-Party Links</h2>
          </div>
          <div className="ml-16 space-y-3">
            <p className="text-gray-700 leading-relaxed flex items-start">
              <span className="text-teal-600 mr-3">•</span>
              Our website will not contain links to other educational or governmental websites.
            </p>
            <p className="text-gray-700 leading-relaxed flex items-start">
              <span className="text-teal-600 mr-3">•</span>
              QAE is not responsible for the privacy practices or content of external sites.
            </p>
            <p className="text-gray-700 leading-relaxed flex items-start">
              <span className="text-teal-600 mr-3">•</span>
              Users are encouraged to review their respective privacy policies.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 hover:shadow-xl transition-shadow">
          <div className="flex items-start mb-4">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">9. Policy Updates</h2>
          </div>
          <div className="ml-16">
            <p className="text-gray-700 leading-relaxed">
              QAE reserves the right to update this Privacy Policy periodically. Any changes will be reflected on this page with the updated effective date. Continued use of the website after changes indicates acceptance of the revised policy.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">Have Questions?</h2>
          </div>
          <p className="text-center text-teal-100 mb-6">
            For any privacy-related inquiries or to exercise your rights, please contact us:
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

export default PrivacyPolicy;