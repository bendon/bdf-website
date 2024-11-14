// src/components/layout/NavbarWithCTA.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import PurchaseModal from '../modals/PurchaseModal';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import { getTransactionStatus } from '../../services/api';

const NavbarWithCTA = ({ onSignInModalOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);

  // Check for pending transaction on mount and when user changes
  useEffect(() => {
    const checkTransaction = async () => {
      const savedTransaction = localStorage.getItem('purchaseTransaction');
      if (savedTransaction && !user) {
        try {
          const transaction = JSON.parse(savedTransaction);
          const isExpired = new Date() - new Date(transaction.timestamp) > 24 * 60 * 60 * 1000;
          
          if (!isExpired) {
            // Check with backend for transaction status
            const response = await getTransactionStatus(transaction.transaction_id);
            const status = response.message?.data?.transaction_status?.toUpperCase();
            const hasEmail = response.message?.data?.user_email;

            if (status === 'COMPLETED' && !hasEmail) {
              // Transaction completed but no email association
              setPendingTransaction(transaction);
              setShowEmailVerification(true);
              setShowPurchaseModal(false);
            }
          } else {
            // Clear expired transaction
            localStorage.removeItem('purchaseTransaction');
            localStorage.removeItem('purchaseState');
          }
        } catch (error) {
          console.error('Error checking transaction:', error);
          // Clear invalid transaction data
          localStorage.removeItem('purchaseTransaction');
          localStorage.removeItem('purchaseState');
        }
      }
    };

    checkTransaction();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuyNow = () => {
    // If there's a pending transaction needing email verification, show that
    if (pendingTransaction) {
      setShowEmailVerification(true);
    } else {
      setShowPurchaseModal(true);
    }
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    navigate('/account');
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    setPendingTransaction(null);
    localStorage.removeItem('purchaseTransaction');
    localStorage.removeItem('purchaseState');
  };

  const handleEmailVerificationSuccess = () => {
    setShowEmailVerification(false);
    setPendingTransaction(null);
    localStorage.removeItem('purchaseTransaction');
    localStorage.removeItem('purchaseState');
    navigate('/account');
  };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* EdgeTech CTA Banner */}
      <div className="bg-blue-600 text-white py-2 text-center">
        <p className="text-sm md:text-base">
          Enhance Your Business Security! Get a Comprehensive Cybersecurity Assessment today.
          <a href="https://edgetech.co.ke" className="underline font-bold ml-2 hover:text-blue-200" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate('/')}
              >
                <span className="text-blue-600">Bit</span>Point
              </div>
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="https://edgetech.co.ke" className="text-gray-700 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                  CyberSecurity Services
                </a>
                <a href="/#features" className="text-gray-700 hover:text-blue-600">
                  Features
                </a>
                <a href="/get-started" className="text-gray-700 hover:text-blue-600">
                  Purchase Guide
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/account')}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    My Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onSignInModalOpen}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div className="h-16"></div>

    {/* Purchase Modal */}
    <PurchaseModal
      isOpen={showPurchaseModal}
      onClose={() => setShowPurchaseModal(false)}
      onSuccess={handlePurchaseSuccess}
    />

    {/* Email Verification Modal for pending transaction */}
    {showEmailVerification && pendingTransaction && (
      <EmailVerificationModal
        isOpen={true}
        onClose={handleEmailVerificationClose}
        onSuccess={handleEmailVerificationSuccess}
        transactionId={pendingTransaction.transaction_id}
        mpesaCode={pendingTransaction.mpesa_code}
      />
    )}
    </>
  );
};

export default NavbarWithCTA;
