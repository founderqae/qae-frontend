import React from 'react';
import { CheckCircle, Mail, Phone, Shield } from 'lucide-react';

export default function AuditServicesSection() {
  const auditServices = [
    {
      title: 'NBA Audit',
      description: 'Conducted as per the official NBA Checklist'
    },
    {
      title: 'NAAC Audit',
      description: 'Conducted as per the official NAAC Checklist'
    },
    {
      title: 'Academic and Administrative Audit (AAA)',
      description: 'Conducted as per the QAE Checklist, a comprehensive framework that integrates elements from NAAC, NBA, and other evaluation verticals'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Audit Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            QAE supports the following audit services as per the convenience and requirements of member institutions
          </p>
        </div>

        {/* Audit Services Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {auditServices.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-start mb-3">
                <CheckCircle className="w-5 h-5 text-teal-600 mt-1 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <p className="text-gray-700 text-base">
              For each of the above audits, QAE assigns a <span className="font-semibold text-teal-600">dedicated Senior Executive</span> to guide and support your institution throughout the entire audit process.
            </p>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-center text-gray-900 font-semibold mb-4 text-lg">
              For Audit Inquiries
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="mailto:admin@qae.co.in"
                className="flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2 text-teal-600" />
                <span>admin@qae.co.in</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <a 
                href="tel:+910000000000"
                className="flex items-center text-gray-700 hover:text-teal-600 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2 text-teal-600" />
                <span>80-72403817</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
