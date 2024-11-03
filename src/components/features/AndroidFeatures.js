import React from 'react';
import { 
  Smartphone, Shield, Globe, Watch, Lock, 
  Bot, Battery, Zap, Router, UserCheck 
} from 'lucide-react';

const androidFeatures = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "On-Demand & On-Install Scan",
    description: "Scan your Android phone or tablet any time to make sure all your apps are clean. Plus, the antivirus module automatically scans each app once you install it, and immediately lets you know whether it poses any danger.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Web Protection",
    description: "Our anti-phishing system scans webpages and warns you when you come across fraudulent pages.",
  },
  {
    icon: <Watch className="w-5 h-5" />,
    title: "WearON",
    description: "Extend Bitdefender security to your connected smart watch.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Anti-Theft",
    description: "Locate, lock, wipe, or send a message to your device in case of loss or theft.",
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: "Autopilot",
    description: "Our latest Autopilot is designed to act as a Security Advisor and give you deeper insights into your security posture.",
  },
  {
    icon: <Battery className="w-5 h-5" />,
    title: "Battery & Performance Saver",
    description: "Secures your mobile experience with virtually no impact on speed or battery life.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Fast & Light-Weight",
    description: "Bitdefender is powerful against malware, yet easy on your phone's resources, with no negative impact on performance.",
  },
  {
    icon: <Router className="w-5 h-5" />,
    title: "Bitdefender VPN",
    description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "App Lock",
    description: "Protects your sensitive apps from unauthorized access with a PIN code or your fingerprint.",
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: "Account Privacy",
    description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk.",
  },
];

const AndroidFeatures = () => (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section with better spacing and visual hierarchy */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Android Protection</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive security features to protect your Android device from threats
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {androidFeatures.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-blue-600 p-2 bg-blue-50 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Get Android Protection
        </button>
        <p className="mt-3 text-sm text-gray-600">
          Protect your Android device with our comprehensive security suite
        </p>
      </div>
    </div>
);

export default AndroidFeatures;