import React, { useState, useEffect } from 'react';
import { Check, XCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionA from '../components/Section/SectionA';
import SectionB from '../components/Section/SectionB';
import SectionC from '../components/Section/SectionC';
import SectionD from '../components/Section/SectionD';
import SectionE from '../components/Section/SectionE';
import Payment from '../components/Section/Payment';
import axios from 'axios'; // Assuming axios for API calls

const StepperForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Application status states (now fetched from backend)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    institutionName: "",
    yearEstablished: "",
    address: "",
    pinCode: "",
    state: "",
    website: "",
    headName: "",
    instituteType: [],
    instituteCategory: [],
    affiliatedUniversity: "",
    aicteApproval: "",
    nbaAccredited: "",
    nbaValidityDate: "",
    naacAccredited: "",
    naacScore: "",
    naacValidityDate: "",
    otherAccreditation: "",
    applicantName: "",
    applicantDesignation: "",
    applicantContact: "",
    applicantEmail: "",
    driveLink: "",
  });

  const steps = [
    {
      id: 'A',
      title: 'Institution Details',
      description: 'Basic information about your institution',
      component: SectionA
    },
    {
      id: 'B',
      title: 'Academic Programs',
      description: 'Courses and curriculum details',
      component: SectionB
    },
    {
      id: 'C',
      title: 'Faculty & Staff',
      description: 'Teaching and support staff information',
      component: SectionC
    },
    {
      id: 'D',
      title: 'Infrastructure',
      description: 'Campus facilities and resources',
      component: SectionD
    },
    {
      id: 'E',
      title: 'Documents',
      description: 'Required certificates and attachments',
      component: SectionE
    },
    {
      id: 'F',
      title: 'Payment',
      description: 'Application fee payment',
      component: Payment
    }
  ];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        // Fetch if application is open
        const openResponse = await axios.get('http://localhost:5000/api/date-config/is-open');
        setIsApplicationOpen(openResponse.data.isOpen);

        // Fetch if user has submitted (requires auth, assuming token is set)
        const submittedResponse = await axios.get('http://localhost:5000/api/submit/is-submitted',
           {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsSubmitted(submittedResponse.data.isSubmitted);
      } catch (err) {
        setError('Failed to fetch application status. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleNavigateToSubmissions = () => {
    navigate('/submissions');
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="stepper-container">
        <div className="status-message-container">
          <div className="status-card loading">
            <div className="spinner-container">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-100 border-t-teal-600 mx-auto mb-4"></div>
            </div>
            <h2 className="status-title">Loading Application Status</h2>
            <p className="status-description">Checking application status and availability...</p>
          </div>
        </div>
        <style jsx>{`
          .stepper-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .status-message-container {
            width: 100%;
            max-width: 600px;
          }

          .status-card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }

          .status-card.loading {
            border: 2px solid #ccfbf1;
          }

          .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .status-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .status-description {
            font-size: 1.125rem;
            color: #6b7280;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stepper-container">
        <div className="status-message-container">
          <div className="status-card closed">
            <XCircle className="status-icon closed-icon" />
            <h2 className="status-title">Error</h2>
            <p className="status-description">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show "Application Closed" message
  if (!isApplicationOpen) {
    return (
      <div className="stepper-container">
        <div className="status-message-container">
          <div className="status-card closed">
            <XCircle className="status-icon closed-icon" />
            <h2 className="status-title">Application is Closed</h2>
            <p className="status-description">
              The application period has ended. Please check back during the next application cycle.
            </p>
          </div>
        </div>
        <style jsx>{`
          .stepper-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .status-message-container {
            width: 100%;
            max-width: 600px;
          }

          .status-card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 2px solid #fee2e2;
          }

          .status-card.closed {
            border-color: #fee2e2;
          }

          .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
          }

          .closed-icon {
            color: #dc2626;
          }

          .status-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .status-description {
            font-size: 1.125rem;
            color: #6b7280;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  // Show "Already Submitted" message
  if (isSubmitted) {
    return (
      <div className="stepper-container">
        <div className="status-message-container">
          <div className="status-card submitted">
            <CheckCircle className="status-icon submitted-icon" />
            <h2 className="status-title">Application Already Submitted</h2>
            <p className="status-description">
              You have already submitted your application for {currentYear}. You can view your submission details below.
            </p>
            <button 
              onClick={handleNavigateToSubmissions}
              className="navigate-button"
            >
              View Submissions
              <ExternalLink className="button-icon" />
            </button>
          </div>
        </div>
        <style jsx>{`
          .stepper-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .status-message-container {
            width: 100%;
            max-width: 600px;
          }

          .status-card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }

          .status-card.submitted {
            border: 2px solid #d1fae5;
          }

          .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
          }

          .submitted-icon {
            color: #10b981;
          }

          .status-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .status-description {
            font-size: 1.125rem;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .navigate-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #0f766e, #0d9488);
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
          }

          .navigate-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(15, 118, 110, 0.4);
          }

          .button-icon {
            width: 18px;
            height: 18px;
          }
        `}</style>
      </div>
    );
  }

  // Show the normal application form
  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="stepper-container">
      {/* Submission Year Header */}
      <div className="submission-year-header">
        <h1 className="submission-year-title">Submission for {currentYear}</h1>
      </div>
      {/* Stepper Navigation */}
      <div className="stepper-nav">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = true;

          return (
            <div key={step.id} className="stepper-wrapper">
              <div
                className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && handleStepClick(index)}
              >
                <div className="stepper-circle">
                  {isCompleted ? (
                    <Check className="step-icon" />
                  ) : (
                    <span className="step-letter">{step.id}</span>
                  )}
                </div>
                <div className="stepper-content">
                  <h3 className="step-title">Section {step.id}</h3>
                  <p className="step-description">{step.title}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`stepper-connector ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="stepper-main">
        <CurrentComponent
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>

      <style jsx>{`
        .stepper-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding-top: 2rem;
        }

        .submission-year-header {
          text-align: center;
          padding: 1rem 0;
        }

        .submission-year-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .stepper-nav {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 2rem;
          overflow-x: auto;
          margin-bottom: 0;
        }

        .stepper-wrapper {
          display: flex;
          align-items: center;
          min-width: auto;
        }

        .stepper-item {
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          cursor: default;
        }

        .stepper-item.clickable {
          cursor: pointer;
        }

        .stepper-item.clickable:hover {
          transform: translateY(-2px);
        }

        .stepper-item.active {
          color: white;
        }

        .stepper-item.active .stepper-circle {
          background: linear-gradient(135deg, #0f766e, #0d9488);
          box-shadow: 0 8px 25px rgba(15, 118, 110, 0.3);
          color: white;
        }

        .stepper-item.completed {
          color: white;
        }

        .stepper-item.completed .stepper-circle {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
        }

        .stepper-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e2e8f0;
          color: #64748b;
          font-weight: 600;
          font-size: 1.125rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .stepper-item:not(.active):not(.completed) .stepper-circle {
          background: #e2e8f0;
          color: #64748b;
        }

        .step-letter {
          font-weight: 700;
          font-size: 1.25rem;
        }

        .step-icon {
          width: 20px;
          height: 20px;
        }

        .stepper-main {
          max-width: 1500px;
          margin: 0 auto;
          padding: 2rem;
        }

        .stepper-content h3 {
          display: none;
        }

        .stepper-content p {
          display: none;
        }

        .stepper-item:not(.active):not(.completed) .stepper-content h3 {
          display: none;
        }

        .stepper-item:not(.active):not(.completed) .stepper-content p {
          display: none;
        }

        .stepper-connector {
          width: 80px;
          height: 3px;
          background: #e2e8f0;
          transition: all 0.3s ease;
          margin: 0 1rem;
        }

        .stepper-connector.completed {
          background: #10b981;
        }

        .stepper-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem 2rem;
        }

        @media (max-width: 768px) {
          .stepper-nav {
            flex-direction: column;
            align-items: stretch;
          }

          .stepper-wrapper {
            min-width: unset;
            flex-direction: column;
          }

          .stepper-connector {
            width: 3px;
            height: 40px;
            margin: 0.75rem 0;
            align-self: center;
          }

          .stepper-item {
            justify-content: center;
          }

          .stepper-container {
            padding-top: 1rem;
          }

          .submission-year-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StepperForm;