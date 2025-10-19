import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Payment = ({ onBack }) => {
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState("");
  const [qrLoading, setQrLoading] = useState(true);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch submission ID
    const fetchSubmission = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/submit/submissions/payment", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch submission");
        }
        const data = await response.json();
        setSubmissionId(data.id);
        // Optionally check if all sections are completed
        if (
          !data.sectionACompleted ||
          !data.sectionBCompleted ||
          !data.sectionCCompleted ||
          !data.sectionDCompleted ||
          !data.sectionECompleted
        ) {
          setError("Please complete all sections (A-E) before proceeding to payment.");
        }
      } catch (err) {
        setError("Failed to load submission. Please ensure you have a valid submission.");
        console.error(err);
      }
    };

    // Fetch payment configuration (UPI ID and amount)
    const fetchPaymentConfig = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payment/config", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch payment config");
        }
        const data = await response.json();
        setPaymentConfig(data);
      } catch (err) {
        setError("Failed to load payment details. Please try again.");
        console.error(err);
      }
    };

    // Fetch QR code
    const fetchQR = async () => {
      try {
        setQrLoading(true);
        const response = await fetch("http://localhost:5000/api/payment/qr", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch QR code");
        }
        const data = await response.json();
        setQr(data.qrCode);
      } catch (err) {
        setError("Failed to load QR code. Please refresh the page.");
        console.error(err);
      } finally {
        setQrLoading(false);
      }
    };

    fetchSubmission();
    fetchPaymentConfig();
    fetchQR();
  }, []);

  const handleSubmit = async () => {
    if (!transactionId || !upiId) {
      setError('Please fill in all payment details');
      return;
    }
    if (!submissionId) {
      setError('No valid submission found. Please complete your submission first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/payment/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          submissionId,
          userUpiId: upiId,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit payment details");
      }

      const data = await response.json();
      alert('Payment details submitted successfully!');
      navigate('/submissions'); // Navigate back or to a confirmation page
    } catch (err) {
      setError('Failed to submit payment details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full mb-6 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Payment
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Complete your application fee payment to proceed with your submission.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="ml-3 text-gray-700 font-medium">Processing...</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Amount Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Application Fee</h2>
              <p className="text-teal-100">One-time payment for application processing</p>
            </div>
            <div className="p-8">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border-2 border-teal-200 text-center">
                <p className="text-teal-700 text-sm font-semibold mb-2 uppercase tracking-wider">
                  Total Amount
                </p>
                <p className="text-5xl font-bold text-teal-600">
                  ₹{paymentConfig ? paymentConfig.amount.toLocaleString('en-IN') : 'Loading...'}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  (Non-refundable application processing fee)
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Scan & Pay</h2>
              <p className="text-teal-100">
                Pay to UPI ID: {paymentConfig ? paymentConfig.upiId : 'Loading...'}
              </p>
            </div>
            <div className="p-8">
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 mb-4">
                  <div className="w-64 h-64 bg-white flex items-center justify-center border-2 border-gray-300 rounded-lg p-3">
                    {qrLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        <p className="text-gray-600 mt-4 text-sm">Loading QR Code...</p>
                      </div>
                    ) : qr ? (
                      <img src={qr} alt="UPI QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center text-gray-500">
                        <p className="text-sm">QR Code not available</p>
                        <p className="text-xs mt-2">Please refresh the page</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium mb-2">Scan with any UPI app</p>
                  <p className="text-gray-500 text-sm">Google Pay • PhonePe • Paytm • BHIM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
              <p className="text-teal-100">Enter transaction details after completing payment</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label htmlFor="transactionId" className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction ID / UTR Number *
                </label>
                <input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter 12-digit transaction ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can find this in your payment app after successful transaction
                </p>
              </div>

              <div>
                <label htmlFor="upiId" className="block text-sm font-semibold text-gray-900 mb-2">
                  UPI ID *
                </label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-900 placeholder-gray-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the UPI ID you used for payment
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-blue-900">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Complete the payment using the QR code above</li>
                        <li>Enter the transaction ID exactly as shown in your payment app</li>
                        <li>Ensure the UPI ID matches the one used for payment</li>
                        <li>Keep a screenshot of the payment confirmation for your records</li>
                        <li>Payment verification may take 24-48 hours</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Section E
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !transactionId || !upiId || !submissionId}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Submit Payment Details"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-teal-200">
          <p className="text-gray-600">
            Payment issues? Contact our support team at{" "}
            <a href="mailto:founderqae@gmail.com" className="text-teal-600 hover:text-teal-700 font-medium">
              founderqae@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;