import React, { useState, useEffect, useContext } from 'react';
import Modal from '../modals/Modal';
import { processPurchase, getTransactionStatus, verifyMpesaCode, submitEmail } from '../../services/api';
import { PAYMENT_STATUS } from '../../config/apiConfig';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import { UserContext } from '../../context/UserContext';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const PurchaseModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useContext(UserContext);
  const [formState, setFormState] = useState({
    phoneNumber: '+254',
    purchaseCode: '',
    mpesaCode: '',
    loading: false,
    error: '',
    status: null,
    transactionId: null,
    checkoutRequestId: null,
    remainingTime: 60,
    showMpesaCodeEntry: false,
    showEmailVerification: false,
    timeoutAction: null,
    showSuccess: false
  });

  // Check for existing transaction when modal opens
  useEffect(() => {
    if (isOpen) {
      checkExistingTransaction();
    }
  }, [isOpen, user]);

  const checkExistingTransaction = async () => {
    console.log('Checking existing transaction...'); // Debug log
    const savedTransaction = localStorage.getItem('purchaseTransaction');
    const savedState = localStorage.getItem('purchaseState');
    
    if (savedTransaction && !user) {
      try {
        const transaction = JSON.parse(savedTransaction);
        const state = savedState ? JSON.parse(savedState) : null;
        const isExpired = new Date() - new Date(transaction.timestamp) > 24 * 60 * 60 * 1000;

        if (!isExpired) {
          // Check transaction status with backend
          const response = await getTransactionStatus(transaction.transaction_id);
          console.log('Transaction status:', response); // Debug log

          const status = response.message?.data?.transaction_status?.toUpperCase();
          const hasEmail = response.message?.data?.user_email;

          if (status === 'COMPLETED' && !hasEmail) {
            // Force email verification for completed transaction without email
            updateFormState({
              transactionId: transaction.transaction_id,
              mpesaCode: transaction.mpesa_code,
              status: PAYMENT_STATUS.COMPLETED,
              showEmailVerification: true,
              showMpesaCodeEntry: false
            });
            return;
          }
        }

        // Clear expired or invalid transaction
        cleanup();
      } catch (error) {
        console.error('Error checking transaction:', error);
        cleanup();
      }
    }

    // No valid transaction found, start fresh
    resetForm();
  };

  const updateFormState = (updates) => {
    setFormState((prev) => {
      const newState = { ...prev, ...updates };
      // Store relevant state
      const stateToStore = {
        transactionId: newState.transactionId,
        status: newState.status,
        mpesaCode: newState.mpesaCode,
        showEmailVerification: newState.showEmailVerification
      };
      localStorage.setItem('purchaseState', JSON.stringify(stateToStore));
      return newState;
    });
  };

  const [pollTimer, setPollTimer] = useState({ interval: null, timeout: null });

  useEffect(() => {
    return () => {
      if (pollTimer.interval) clearInterval(pollTimer.interval);
      if (pollTimer.timeout) clearTimeout(pollTimer.timeout);
    };
  }, [pollTimer]);

  useEffect(() => {
    let countdownInterval;
    if (formState.loading && formState.remainingTime > 0) {
      countdownInterval = setInterval(() => {
        updateFormState({ remainingTime: formState.remainingTime - 1 });
      }, 1000);
    }
    return () => countdownInterval && clearInterval(countdownInterval);
  }, [formState.loading, formState.remainingTime]);

  const cleanup = () => {
    if (pollTimer.interval) clearInterval(pollTimer.interval);
    if (pollTimer.timeout) clearTimeout(pollTimer.timeout);
    setPollTimer({ interval: null, timeout: null });
    localStorage.removeItem('purchaseState');
    localStorage.removeItem('purchaseTransaction');
  };

// Updated startPolling to handle user email association
const startPolling = (transactionId, checkoutRequestId) => {
  updateFormState({ 
    status: PAYMENT_STATUS.PROCESSING, 
    remainingTime: 60,
    transactionId,
    checkoutRequestId
  });

  const interval = setInterval(async () => {
    try {
      const response = await getTransactionStatus(transactionId, checkoutRequestId);
      const status = response.message?.data?.transaction_status?.toUpperCase();

      if (status === 'COMPLETED') {
        clearInterval(interval);
        clearTimeout(pollTimer.timeout);
        
        // If user is logged in, update the transaction with email before handling success
        if (user?.email) {
          try {
            await submitEmail(
              user.email,
              transactionId,
              response.message.data.mpesa_receipt,
              true // is_google_auth true for logged-in users
            );
          } catch (emailError) {
            console.error('Failed to associate email:', emailError);
          }
        }

        handleSuccess(response.message.data);
      }
    } catch (error) {
      if (formState.remainingTime <= 0) {
        clearInterval(interval);
        handleTimeout();
      }
    }
  }, 2500);

  const timeout = setTimeout(handleTimeout, 60000);
  setPollTimer({ interval, timeout });
};

  const handleTimeout = () => {
    cleanup();
    updateFormState({
      loading: false,
      error: 'Payment verification timed out. Please select an option below:',
      timeoutAction: 'choose',
    });
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    
    if (!value.startsWith('+254')) {
      value = '+254';
    } else {
      const prefix = '+254';
      const rest = value.slice(prefix.length).replace(/\D/g, '');
      value = prefix + rest;
    }
    
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    
    updateFormState({ phoneNumber: value });
  };

  const handlePurchaseCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    updateFormState({ purchaseCode: value });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
  
    if (!formState.phoneNumber.startsWith('+254') || formState.phoneNumber.length !== 13) {
      updateFormState({ 
        error: 'Please enter a valid phone number starting with +254'
      });
      return;
    }
  
    if (!/^\d{4}$/.test(formState.purchaseCode)) {
      updateFormState({ 
        error: 'Please enter a valid 4-digit purchase code'
      });
      return;
    }
  
    updateFormState({ loading: true, error: '', status: null });
  
    try {
      // Use the existing API service properly
      const response = await processPurchase(
        formState.phoneNumber,
        formState.purchaseCode
      );
  
      if (response.message?.status === 'success') {
        const { transaction_id, checkout_request_id } = response.message;
        updateFormState({ 
          transactionId: transaction_id, 
          checkoutRequestId: checkout_request_id 
        });
  
        localStorage.setItem('purchaseTransaction', JSON.stringify({ 
          transaction_id, 
          mpesaCode: '',
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          user_email: user?.email // Store user email if available
        }));
  
        startPolling(transaction_id, checkout_request_id);
      } else {
        throw new Error(response.message?.message || 'Failed to initiate payment');
      }
    } catch (error) {
      updateFormState({ loading: false, error: error.message || 'An error occurred' });
    }
  };
  

  const handleMpesaCodeVerify = async (e) => {
    e?.preventDefault();
    updateFormState({ loading: true, error: '' });

    try {
      const response = await verifyMpesaCode(formState.transactionId, formState.mpesaCode);
      if (response.message?.status === 'success') {
        handleSuccess(response.message.data);
      } else {
        throw new Error('Payment verification failed. Please check the code and try again.');
      }
    } catch (error) {
      updateFormState({ loading: false, error: error.message || 'Failed to verify M-PESA code' });
    }
  };

  const handleSuccess = async (paymentDetails) => {
    try {
      if (user?.email) {
        const emailResponse = await submitEmail(
          user.email,
          formState.transactionId,
          paymentDetails.mpesa_receipt || formState.mpesaCode,
          true
        );
  
        if (emailResponse.status === 'success') {
          updateFormState({
            loading: false,
            status: PAYMENT_STATUS.COMPLETED,
            showSuccess: true,
            error: ''
          });
          await new Promise(resolve => setTimeout(resolve, 2000));
          cleanup();
          onSuccess();
          return;
        }
      }
  
      localStorage.setItem('purchaseTransaction', JSON.stringify({ 
        transaction_id: formState.transactionId,
        mpesa_code: paymentDetails.mpesa_receipt || formState.mpesaCode,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      }));
  
      updateFormState({
        loading: false,
        status: PAYMENT_STATUS.COMPLETED,
        error: '',
        mpesaCode: paymentDetails.mpesa_receipt || formState.mpesaCode,
        showEmailVerification: !user,
        showMpesaCodeEntry: false,
        showSuccess: user,  // ADD THIS LINE
      });
    } catch (error) {
      console.error('License association error:', error);
      updateFormState({
        loading: false,
        error: error.message || 'Failed to complete license registration'
      });
    }
  };

  const handleModalClose = () => {
    // Prevent closing if email verification is needed
    if (formState.status === PAYMENT_STATUS.COMPLETED && !user) {
      return;
    }
    onClose();
  };

  const resetForm = () => {
    cleanup();
    updateFormState({
      phoneNumber: '+254',
      purchaseCode: '',
      mpesaCode: '',
      loading: false,
      error: '',
      status: null,
      timeoutAction: null,
      showMpesaCodeEntry: false,
      showEmailVerification: false,
    });
  };

  // Render purchase form
  const renderForm = () => (
    <form onSubmit={handlePurchaseSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          M-Pesa Phone Number
        </label>
        <input
          type="tel"
          value={formState.phoneNumber}
          onChange={handlePhoneNumberChange}
          className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="+254XXXXXXXXX"
          required
          disabled={formState.loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Purchase Code
        </label>
        <input
          type="text"
          value={formState.purchaseCode}
          onChange={handlePurchaseCodeChange}
          className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Enter 4-digit code"
          maxLength={4}
          required
          disabled={formState.loading}
        />
      </div>
      <button
        type="submit"
        disabled={formState.loading}
        className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {formState.loading ? 'Processing...' : 'Submit Purchase'}
      </button>
    </form>
  );

  // Render M-Pesa code entry form
  const renderMpesaCodeEntry = () => (
    <form onSubmit={handleMpesaCodeVerify} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">M-PESA Transaction Code</label>
        <input
          type="text"
          value={formState.mpesaCode}
          onChange={(e) => updateFormState({ mpesaCode: e.target.value.toUpperCase() })}
          maxLength={10}
          className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="e.g., SJV74BTLC5"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={formState.loading || !/^[A-Z0-9]{10}$/.test(formState.mpesaCode)}
          className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {formState.loading ? 'Verifying...' : 'Verify Code'}
        </button>
        <button
          type="button"
          onClick={() => updateFormState({ showMpesaCodeEntry: false, timeoutAction: 'choose' })}
          className="flex-1 h-12 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
    </form>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        Payment Successful!
      </h3>
      <p className="text-gray-600">
        Your license has been activated successfully.
      </p>
      <div className="pt-4">
        <button
          onClick={() => {
            cleanup();
            onSuccess();
          }}
          className="w-full h-12 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          View License Details
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
  
        {formState.error && (
          <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p className="text-sm">{formState.error}</p>
          </div>
        )}
  
        {formState.loading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {formState.status === PAYMENT_STATUS.COMPLETED 
                  ? 'Associating license with your account...' 
                  : 'Processing payment...'}
              </span>
              {formState.status !== PAYMENT_STATUS.COMPLETED && (
                <span className="text-sm font-medium">{formState.remainingTime}s</span>
              )}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-1000"
                style={{ 
                  width: formState.status === PAYMENT_STATUS.COMPLETED 
                    ? '100%' 
                    : `${(formState.remainingTime / 60) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
  
        {formState.showSuccess ? (
          renderSuccessState()
        ) : formState.showEmailVerification ? (
          <EmailVerificationModal
            isOpen={true}
            onClose={() => {
              if (!user) return;
              updateFormState({ showEmailVerification: false });
              cleanup();
              onSuccess();
            }}
            transactionId={formState.transactionId}
            mpesaCode={formState.mpesaCode}
          />
        ) : (
          <>
            {formState.showMpesaCodeEntry
              ? renderMpesaCodeEntry()
              : !formState.timeoutAction &&
                formState.status !== PAYMENT_STATUS.COMPLETED &&
                renderForm()}
  
            {formState.timeoutAction === 'choose' && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      updateFormState({ loading: true, error: '' });
                      handleMpesaCodeVerify();
                    }}
                    className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Check Again
                  </button>
                  <button
                    onClick={() => updateFormState({ 
                      showMpesaCodeEntry: true, 
                      timeoutAction: null 
                    })}
                    className="flex-1 h-12 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Enter M-PESA Code
                  </button>
                </div>
                <button
                  onClick={resetForm}
                  className="w-full h-12 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default PurchaseModal;
