// src/components/layout/HeroSection.js
import React from 'react';
import { Shield, Zap, Lock, Smartphone } from 'lucide-react';

const HeroSection = ({ handleBuyNow }) => (
  <div className="flex flex-col md:flex-row items-center py-16">
    <div className="md:w-1/2 md:pr-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        Secure Your Device 
        <span className="block">With <span className="text-blue-600">Bitdefender</span></span>
        <span className="block">Mobile Security</span>
      </h1>
      <p className="mb-6 text-gray-600">
        Get top-tier mobile protection for <span className="font-bold">Android</span> for just <span className="font-bold">Ksh. 350</span> per year.
      </p>
      <button 
        onClick={handleBuyNow}
        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition duration-300 w-40 font-bold"
      >
        Buy Now →
      </button>
      <div className="flex space-x-8 mt-8">
        <div>
          <div className="text-2xl font-bold text-blue-600">25M+</div>
          <div className="text-sm text-gray-600">Users Protected</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">5000+</div>
          <div className="text-sm text-gray-600">Threats Blocked</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">200+</div>
          <div className="text-sm text-gray-600">Security Experts</div>
        </div>
      </div>
    </div>
    <div className="md:w-1/2 mt-8 md:mt-0 w-full">
      <div className="bg-blue-600 p-4 md:p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg text-center flex flex-col items-center">
            <Shield className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-blue-600 mb-2">Protection</h3>
            <p className="text-gray-700">Keeps your device safe from all online threats</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center flex flex-col items-center">
            <Zap className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-blue-600 mb-2">Performance</h3>
            <p className="text-gray-700">Instant reaction without compromising speed</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center flex flex-col items-center">
            <Lock className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-blue-600 mb-2">Privacy</h3>
            <p className="text-gray-700">Safeguards your online privacy and personal data</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center flex flex-col items-center">
            <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-blue-600 mb-2">Anti-Theft</h3>
            <p className="text-gray-700">Locate, lock, or wipe your device remotely</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;