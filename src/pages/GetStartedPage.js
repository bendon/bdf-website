import React from 'react';
import { ArrowRight, Key, Mail, ShieldCheck, CreditCard } from 'lucide-react';

const GetStartedPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get Started with BitPoint</h1>
        <p className="text-xl text-gray-600">
          Follow these simple steps to secure your license and get started
        </p>
      </div>

      {/* Steps Grid */}
      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Purchase Your License</h2>
              <p className="text-gray-600 mb-4">
                Choose your preferred license type and complete the purchase using M-PESA.
                You'll receive a 4-digit purchase code upon payment.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Keep your purchase code safe - you'll need it for verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">2. Verify Your Email</h2>
              <p className="text-gray-600 mb-4">
                After purchase, you'll need to verify your email address. Enter your email
                and the verification code we send you.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Pro tip:</strong> Check your spam folder if you don't see our email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">3. Access Your Account</h2>
              <p className="text-gray-600 mb-4">
                Once verified, you'll have immediate access to your BitPoint account.
                View your license details and manage your security services.
              </p>
            </div>
          </div>
        </div>

        {/* Ready to Start */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Your License Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-gray-600">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;