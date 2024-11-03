// src/components/features/FeaturesSection.js
import React from 'react';
import AndroidFeatures from './AndroidFeatures';
import IOSFeatures from './IOSFeatures';

const FeatureItem = ({ children, tag }) => (
  <div className="flex items-center mb-2">
    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    <span>{children}</span>
    {tag && (
      <span className={`ml-2 px-2 py-1 text-xs font-bold text-white ${tag === 'IMPROVED' ? 'bg-green-500' : 'bg-blue-500'} rounded`}>
        {tag}
      </span>
    )}
  </div>
);

const FeaturesSection = () => (
  <div className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Mobile Security Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Protection</h3>
        <FeatureItem tag="INDUSTRY 1ST">App Anomaly Detection</FeatureItem>
        <FeatureItem>Malware Scanner</FeatureItem>
        <FeatureItem>On-Demand & On-Install Scan</FeatureItem>
        <FeatureItem>Web Protection</FeatureItem>
        <FeatureItem>Scam Alert</FeatureItem>
        <FeatureItem>WearON</FeatureItem>
        <FeatureItem>Anti-Theft</FeatureItem>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Performance</h3>
        <FeatureItem>Autopilot</FeatureItem>
        <FeatureItem>Battery & Performance Saver</FeatureItem>
        <FeatureItem>Fast & Light-Weight</FeatureItem>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Privacy</h3>
        <FeatureItem tag="IMPROVED">Bitdefender VPN</FeatureItem>
        <FeatureItem>App Lock</FeatureItem>
        <FeatureItem>Account Privacy</FeatureItem>
      </div>
    </div>

    {/* Android Features Section */}
    <div className="py-16 bg-gray-100 mt-16">
      <AndroidFeatures />
    </div>

    {/* iOS Features Section */}
    <div className="py-16">
      <IOSFeatures />
    </div>
  </div>
);

export default FeaturesSection;
