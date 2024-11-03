// src/pages/BitPointLandingPage.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import NavbarWithCTA from '../components/layout/NavbarWithCTA';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/layout/HeroSection';
import FeaturesSection from '../components/features/FeaturesSection';
import ComparisonStats from '../components/features/ComparisonStats';
import PurchaseModal from '../components/modals/PurchaseModal';
import EmailVerificationModal from '../components/modals/EmailVerificationModal';

const BitPointLandingPage = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [transactionId, setTransactionId] = useState('123456');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('EMAIL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is authenticated and was redirected from a protected route
    if (isAuthenticated && location.state?.from) {
      navigate(location.state.from.pathname);
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleBuyNow = () => {
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    navigate('/account');
  };

  const handlePurchaseSubmit = () => {
    setShowPurchaseModal(false);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleOTPVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowEmailModal(false);
      navigate('/account');
    }, 1000);
  };

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroSection handleBuyNow={handleBuyNow} />
        <FeaturesSection />
      </div>

      <ComparisonStats />

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={handlePurchaseSuccess}
      />

      {/* Email & OTP Modal */}
      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        step={step}
        email={email}
        otp={otp}
        setEmail={setEmail}
        setOtp={setOtp}
        handleEmailSubmit={handleEmailSubmit}
        handleOTPVerification={handleOTPVerification}
        loading={loading}
        error={error}
      />

      <Footer />
    </div>
  );
};

export default BitPointLandingPage;