import React, { useState } from 'react';
import { Shield, Zap, Lock, Smartphone } from 'lucide-react';
import NavbarWithCTA from './NavbarWithCTA';
import ComparisonStats from './ComparisonStats';
import Footer from './Footer'; 

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        {children}
        <button onClick={onClose} className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

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
const BitPointLandingPage = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+2547');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({ phone: '', code: '' });

  const handleBuyNow = () => {
    setShowPurchaseModal(true);
  };

  const validatePhone = (value) => {
    if (!value) {
      return 'Phone number is required';
    }
    if (!/^\+2547\d{0,9}$/.test(value)) {
      return 'Invalid phone number format';
    }
    if (value.length > 13) {
      return 'Phone number is too long';
    }
    return '';
  };

  const validateCode = (value) => {
    if (!value) {
      return 'Purchase code is required';
    }
    if (!/^\d{4}$/.test(value)) {
      return 'Code must be exactly 4 digits';
    }
    return '';
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.startsWith('+2547')) {
      setPhone(value);
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      setCode(value);
      setErrors(prev => ({ ...prev, code: validateCode(value) }));
    }
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    const phoneError = validatePhone(phone);
    const codeError = validateCode(code);
    setErrors({ phone: phoneError, code: codeError });

    if (!phoneError && !codeError) {
      console.log('Purchase submitted', { phone, code });
      setShowPurchaseModal(false);
      setShowEmailModal(true);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setShowEmailModal(false);
  };

  const androidFeatures = [
    { title: "On-Demand & On-Install Scan", description: "Scan your Android phone or tablet any time to make sure all your apps are clean. Plus, the antivirus module automatically scans each app once you install it, and immediately lets you know whether it poses any danger." },
    { title: "Web Protection", description: "Our anti-phishing system scans webpages and warns you when you come across fraudulent pages." },
    { title: "WearON", description: "Extend Bitdefender security to your connected smart watch." },
    { title: "Anti-Theft", description: "Locate, lock, wipe or send a message to your device in case of loss or theft." },
    { title: "Autopilot", description: "Our latest Autopilot is designed to act as a <Security Advisor> and to give you deeper insights into your security posture. Its smart capabilities mean that it can recommend security actions in the context of your system needs and usage patterns." },
    { title: "Battery & Performance Saver", description: "Secures your mobile experience with virtually no impact on speed or battery life." },
    { title: "Fast & Light-Weight", description: "Bitdefender is amazingly powerful against malware, yet easy on your phone's resources, so you won't see any negative impact on performance." },
    { title: "Bitdefender VPN", description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device." },
    { title: "App Lock", description: "Protects your sensitive apps from unauthorized access with a PIN code or your fingerprint." },
    { title: "Account Privacy", description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk, and lets you take action depending on its status." }
  ];

  const iosFeatures = [
    { title: "Web Protection", description: "Notifies you about webpages that contain malware, phishing, or fraudulent content." },
    { title: "Bitdefender VPN", description: "Protects your online presence by encrypting all Internet traffic. 200 MB daily traffic included per device." },
    { title: "Account Privacy", description: "Check if your online accounts have been involved in any data breach. Account Privacy notifies you when your sensitive data is at risk, and lets you take action depending on its status." }
  ];

  return (
    <div className="font-sans flex flex-col min-h-screen">
    {/* Updated Navigation */}
    <NavbarWithCTA />

      {/* Centered Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center py-16">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Secure Your Device 
              <span className="block">With <span className="text-blue-600">Bitdefender</span></span>
              <span className="block">Mobile Security</span>
            </h1>
            <p className="mb-6 text-gray-600">
              Get top-tier mobile protection for Android and iOS for just <span className="font-bold">Ksh. 350</span> per year.
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

        {/* Features Section */}
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
      </div>

      {/* Android Protection Section */}
      <div id="features" className="py-16 bg-gray-100">
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

      {/* iOS Protection Section */}
      <div className="py-16">
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
      </div>

      <ComparisonStats />

      {/* Purchase Modal */}
      <Modal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Complete Your Purchase</h2>
        <form onSubmit={handlePurchaseSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              className={`mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+2547XXXXXXXX"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Purchase Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={handleCodeChange}
              className={`mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.code ? 'border-red-500' : ''}`}
              placeholder="Enter 4-digit code"
            />
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300">
            Submit Purchase
          </button>
        </form>
      </Modal>

      {/* Email Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Your Account</h2>
        <p className="mb-4 text-gray-600">Enter your email to receive your license and create your account.</p>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-blue-500 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300">
            Create Account & Send License
          </button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};

export default BitPointLandingPage;