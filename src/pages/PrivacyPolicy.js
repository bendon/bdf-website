import React from 'react';
import { Shield, Lock, Users, FileText, Bell } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600">
          Version 1.0, Last Updated: November 11, 2024
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">1. General Information</h2>
            <p className="text-gray-600 mb-4">
              MullaPoint is committed to protecting your privacy and personal data. This privacy policy explains how we collect, 
              use, and protect your personal information when you use our website and services. As a financial technology platform,
              we understand the importance of maintaining the confidentiality and security of your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Data Collection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">2. Data We Collect</h2>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">2.1 Information You Provide</h3>
              <ul className="list-disc ml-6 text-gray-600">
                <li>Name and contact information</li>
                <li>Email address for account creation and verification</li>
                <li>Mobile phone number for M-PESA transactions</li>
                <li>M-PESA transaction details and history</li>
                <li>Account preferences and settings</li>
              </ul>

              <h3 className="font-semibold text-lg">2.2 Automatically Collected Information</h3>
              <ul className="list-disc ml-6 text-gray-600">
                <li>IP address and device information</li>
                <li>Browser type and settings</li>
                <li>Website usage data and analytics</li>
                <li>Transaction patterns and frequency</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Usage */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Data</h2>
            <ul className="list-disc ml-6 text-gray-600">
              <li>To process and manage your M-PESA transactions</li>
              <li>To provide and manage your MullaPoint account</li>
              <li>To verify your identity and prevent fraud</li>
              <li>To send transaction confirmations and important notifications</li>
              <li>To improve our financial services and user experience</li>
              <li>To comply with financial regulations and legal obligations</li>
              <li>To provide customer support and resolve disputes</li>
              <li>To analyze transaction patterns for security purposes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Protection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">4. Data Protection</h2>
            <p className="text-gray-600 mb-4">
              As a financial technology platform, we implement robust security measures to protect your data:
            </p>
            <ul className="list-disc ml-6 text-gray-600">
              <li>End-to-end encryption for all financial transactions</li>
              <li>Multi-factor authentication for account access</li>
              <li>Regular security audits and penetration testing</li>
              <li>Compliance with financial industry security standards</li>
              <li>Secure data centers with 24/7 monitoring</li>
              <li>Regular staff training on financial data protection</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Your Rights */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              Under applicable data protection laws, you have the following rights:
            </p>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Right to access your transaction history and personal data</li>
              <li>Right to correct inaccurate personal information</li>
              <li>Right to request deletion of your account and data</li>
              <li>Right to restrict processing of your data</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent for optional services</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-gray-600">
                <strong>Contact Us:</strong> For any privacy-related questions or to exercise your rights, 
                please contact our Data Protection Officer at privacy@mullapoint.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;