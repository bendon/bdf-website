import React from 'react';
import { Clock, ShieldCheck, Lock, Globe, AlertCircle } from 'lucide-react';

const iosFeatures = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Web Protection",
    description: "Notifies you about webpages that contain malware, phishing, or fraudulent content.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Bitdefender VPN",
    description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Account Privacy",
    description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk.",
  },
];

const IOSFeatures = () => (
  <div id="ios-features" className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">iOS Protection</h2>
        <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Licenses Available Soon</span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-blue-800">
              iOS protection licenses will be available for purchase soon. The features shown below will be included in your license when available.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {iosFeatures.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
          >
            <div className="text-blue-600 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Notification Signup */}
      <div className="mt-12 text-center">
        <button
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => {/* Add your notification signup logic */}}
        >
          Notify Me When Available
        </button>
        <p className="mt-3 text-sm text-gray-600">
          We'll let you know as soon as iOS licenses become available for purchase.
        </p>
      </div>

      {/* Price Preview (Optional) */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Expected starting price: KES 500/year
        </p>
      </div>
    </div>
  </div>
);

export default IOSFeatures;