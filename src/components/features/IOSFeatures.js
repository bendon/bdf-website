// src/components/features/IOSFeatures.js
import React from 'react';

const iosFeatures = [
  {
    title: "Web Protection",
    description: "Notifies you about webpages that contain malware, phishing, or fraudulent content.",
  },
  {
    title: "Bitdefender VPN",
    description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device.",
  },
  {
    title: "Account Privacy",
    description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk.",
  },
];

const IOSFeatures = () => (
  <div id="ios-features" className="py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">iOS Protection</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {iosFeatures.map((feature, index) => (
          <div key={index} className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default IOSFeatures;
