import { Target, ClipboardList, Upload, CheckCircle, Database, BarChart3, Award, FileCheck, Users, Calendar, Download } from 'lucide-react';

const Methodology = () => {
  const sections = [
    { label: "Section A", name: "General & Institute Level Information", color: "teal" },
    { label: "Section B", name: "Gender, Diversity & Finance", color: "blue" },
    { label: "Section C", name: "Academics", color: "purple" },
    { label: "Section D", name: "Infrastructure", color: "orange" },
    { label: "Section E", name: "Research", color: "pink" }
  ];

  const steps = [
    {
      number: 1,
      title: "Expression of Interest & Registration",
      icon: <ClipboardList className="w-8 h-8" />,
      bgColor: "bg-teal-500",
      items: [
        "Institution visits QAE website → clicks Sign up",
        "Fill the necessary information and create the login credentials",
        "Apply for Ranking through my profile"
      ]
    },
    {
      number: 2,
      title: "Document Submission (Self-Assessment Pack)",
      icon: <Upload className="w-8 h-8" />,
      bgColor: "bg-blue-500",
      items: [
        "QAE shows the Self-Assessment Pack (SAP) template mapped to Sections A–E",
        "Institution needs to complete the SAP",
        "Provide the supporting documents link through the drive link",
        "Minimum required documents by section (checklist — Download Excel File)",
        "Pay processing fee — payment link provided in the portal"
      ]
    },
    {
      number: 3,
      title: "Preliminary Completeness Check (Admin Validation)",
      icon: <CheckCircle className="w-8 h-8" />,
      bgColor: "bg-purple-500",
      items: [
        "QAE Secretariat verifies that the SAP is complete, documents are legible, and mandatory fields are filled",
        "Any missing items are flagged — institution has a fixed window (usually 7 calendar days) to respond",
        "Once complete, QAE assigns the submission to an Evaluation Team"
      ],
      highlight: {
        icon: <Calendar className="w-5 h-5" />,
        text: "7-day response window for missing items"
      }
    },
    {
      number: 4,
      title: "Technical Validation & Data Verification",
      icon: <Database className="w-8 h-8" />,
      bgColor: "bg-orange-500",
      items: [
        "QAE's data verification team performs:",
        "• Cross-checks (e.g., faculty lists vs. payroll/appointment orders)",
        "• Validation of numeric data (student counts, finances, research outputs)",
        "• Verification against public sources (university websites, statutory bodies) where applicable",
        "If critical inconsistencies are found, QAE issues a Data Clarification Request. Institution must respond within the prescribed timeline",
        "If the submitted data is insufficient in the stage of clarification, then QAE have the rights to filter out the necessary information"
      ],
      warning: true
    },
    {
      number: 5,
      title: "Scoring (Section-wise Evaluation)",
      icon: <BarChart3 className="w-8 h-8" />,
      bgColor: "bg-pink-500",
      items: [
        "Each section (A–E) is evaluated using pre-defined rubrics and weightages. Scores are broken down by sub-criteria",
        "Evaluation is performed by at least two independent assessors (academic + industry/subject expert) to ensure balance",
        "Scores are aggregated for each section; an overall weighted score is calculated"
      ],
      highlight: {
        icon: <Users className="w-5 h-5" />,
        text: "Minimum 2 independent assessors per evaluation"
      }
    }
  ];

  const getSectionColorClasses = (color) => {
    const colors = {
      teal: "bg-teal-500 text-white",
      blue: "bg-blue-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      pink: "bg-pink-500 text-white"
    };
    return colors[color] || "bg-gray-500 text-white";
  };

  const getSectionBorderColor = (color) => {
    const colors = {
      teal: "border-teal-400",
      blue: "border-blue-400",
      purple: "border-purple-400",
      orange: "border-orange-400",
      pink: "border-pink-400"
    };
    return colors[color] || "border-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header Section */}
      <div className="bg-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-16 h-16 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Methodology</h1>
          </div>
          <p className="text-center text-teal-100 text-lg max-w-4xl mx-auto mt-4">
            QAE's Quality Assessment & Technical Evaluation Ranking process is a transparent, evidence-driven, and repeatable sequence of steps designed to ensure fair and comprehensive institutional evaluation.
          </p>
        </div>
      </div>

      {/* Core Sections Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center mb-6">
            <FileCheck className="w-8 h-8 text-teal-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Five Core Evaluation Sections</h2>
          </div>
          <p className="text-gray-700 mb-6 text-lg">
            Each institution is evaluated across five comprehensive sections, ensuring a holistic assessment of quality and performance:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {sections.map((section, idx) => (
              <div key={idx} className={`bg-gray-50 rounded-xl p-5 border-2 ${getSectionBorderColor(section.color)} hover:shadow-lg transition-all`}>
                <div className={`${getSectionColorClasses(section.color)} text-sm font-bold px-3 py-1 rounded-full inline-block mb-3`}>
                  {section.label}
                </div>
                <p className="text-gray-800 font-semibold text-sm leading-relaxed">{section.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process Overview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">End-to-End Evaluation Process</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Below is our transparent, step-by-step methodology. Each step is actionable and reproducible so institutions know exactly what to expect.
          </p>
        </div>

        {/* Steps */}
        {steps.map((step, idx) => (
          <div key={idx} className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              {/* Step Header */}
              <div className={`${step.bgColor} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    
                    <div>
                      <div className="text-sm font-semibold opacity-90">STEP {step.number}</div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-8">
                <ul className="space-y-4">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start">
                      <div className="mt-1 mr-3">
                        {item.startsWith('•') ? (
                          <span className="text-gray-400 ml-4">•</span>
                        ) : (
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                        )}
                      </div>
                      <span className="text-gray-700 leading-relaxed text-lg">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Highlight Box */}
                {step.highlight && (
                  <div className="mt-6 bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
                    <div className="flex items-center text-teal-700">
                      <div className="mr-3">{step.highlight.icon}</div>
                      <span className="font-semibold">{step.highlight.text}</span>
                    </div>
                  </div>
                )}

                {/* Warning Box */}
                {step.warning && (
                  <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div className="flex items-start text-amber-800">
                      <div className="mr-3 mt-1">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Data Accuracy is Critical</p>
                        <p className="text-sm">Institutions must ensure all submitted data is accurate and verifiable. Inconsistencies may trigger clarification requests or result in data filtering by QAE.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center py-4">
                <div className="w-1 h-12 bg-teal-400 rounded-full"></div>
              </div>
            )}
          </div>
        ))}

        {/* Key Principles */}
        <div className="bg-teal-600 rounded-2xl shadow-xl p-8 text-white mt-12">
          <div className="flex items-center justify-center mb-6">
            <Award className="w-10 h-10 mr-3" />
            <h2 className="text-3xl font-bold">Our Core Principles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-700 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Transparency</h3>
              <p className="text-teal-100">Clear, documented processes at every stage of evaluation</p>
            </div>
            <div className="bg-teal-700 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Evidence-Driven</h3>
              <p className="text-teal-100">All assessments based on verified data and documentation</p>
            </div>
            <div className="bg-teal-700 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Reproducible</h3>
              <p className="text-teal-100">Standardized methodology ensuring consistent evaluations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;