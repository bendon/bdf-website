// src/components/features/AndroidFeatures.js
import React from 'react';

const androidFeatures = [
  {
    title: "On-Demand & On-Install Scan",
    description: "Scan your Android phone or tablet any time to make sure all your apps are clean. Plus, the antivirus module automatically scans each app once you install it, and immediately lets you know whether it poses any danger.",
  },
  {
    title: "Web Protection",
    description: "Our anti-phishing system scans webpages and warns you when you come across fraudulent pages.",
  },
  {
    title: "WearON",
    description: "Extend Bitdefender security to your connected smart watch.",
  },
  {
    title: "Anti-Theft",
    description: "Locate, lock, wipe, or send a message to your device in case of loss or theft.",
  },
  {
    title: "Autopilot",
    description: "Our latest Autopilot is designed to act as a Security Advisor and give you deeper insights into your security posture.",
  },
  {
    title: "Battery & Performance Saver",
    description: "Secures your mobile experience with virtually no impact on speed or battery life.",
  },
  {
    title: "Fast & Light-Weight",
    description: "Bitdefender is powerful against malware, yet easy on your phone's resources, with no negative impact on performance.",
  },
  {
    title: "Bitdefender VPN",
    description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device.",
  },
  {
    title: "App Lock",
    description: "Protects your sensitive apps from unauthorized access with a PIN code or your fingerprint.",
  },
  {
    title: "Account Privacy",
    description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk.",
  },
];

const AndroidFeatures = () => (
  <div id="android-features" className="py-16 bg-gray-100">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Android Protection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {androidFeatures.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AndroidFeatures;
