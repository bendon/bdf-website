import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import { processPurchase, getTransactionStatus, verifyMpesaCode } from '../../services/api';
import { PAYMENT_STATUS } from '../../config/apiConfig';
import EmailVerificationModal from '../modals/EmailVerificationModal';


const PurchaseModal = ({ isOpen, onClose, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '+254',
    purchaseCode: ''
  });

  // Main state
  const [state, setState] = useState({
    loading: false,
    error: '',
    status: null,
    transactionId: null,
    checkoutRequestId: null,
    pollInterval: null
  });

  // Timer states
  const [timeoutTimer, setTimeoutTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60);
  
  // UI states
  const [showMpesaCodeEntry, setShowMpesaCodeEntry] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [timeoutAction, setTimeoutAction] = useState(null);

  // Email verification state
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (state.pollInterval) clearInterval(state.pollInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
    };
  }, [state.pollInterval, timeoutTimer]);

  // Countdown effect
  useEffect(() => {
    let countdownInterval;
    if (state.loading && remainingTime > 0) {
      countdownInterval = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [state.loading, remainingTime]);

  const handleTimeout = () => {
    if (state.pollInterval) clearInterval(state.pollInterval);
    if (timeoutTimer) clearTimeout(timeoutTimer);
    setTimeoutTimer(null);
    
    setState(prev => ({
      ...prev,
      loading: false,
      error: 'Payment verification timed out. Please select an option below:',
      pollInterval: null
    }));
    
    setTimeoutAction('choose');
  };

  const handleRetryCheck = async () => {
    setTimeoutAction(null);
    setState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      const response = await getTransactionStatus(
        state.transactionId,
        state.checkoutRequestId
      );
      
      if (response.message?.payment_status?.toLowerCase() === PAYMENT_STATUS.COMPLETED) {
        handleSuccess(response.message);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Payment not found. Please enter your M-PESA code manually.'
        }));
        setShowMpesaCodeEntry(true);
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to verify payment. Please enter your M-PESA code manually.'
      }));
      setShowMpesaCodeEntry(true);
    }
  };

  const handleManualCodeSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      const response = await verifyMpesaCode(
        state.transactionId,
        mpesaCode
      );
      
      console.log('Verification response:', response);
      
      if (response.message?.status === 'success' && 
          response.message.data?.transaction_status?.toLowerCase() === 'completed') {

            console.log('Verification successful. Transaction ID:', state.transactionId);
        
        if (state.pollInterval) {
          clearInterval(state.pollInterval);
        }
        
        setState(prev => ({
          ...prev,
          loading: false,
          status: PAYMENT_STATUS.COMPLETED,
          error: ''
        }));
        
        handleSuccess(response.message.data);
        // Show email verification instead of immediate success
        setShowEmailVerification(true);
        setShowMpesaCodeEntry(false);
        
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Payment verification failed. Please check the code and try again.'
        }));
      }
    } catch (err) {
      console.error('M-PESA verification error:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to verify M-PESA code. Please try again.'
      }));
    }
  };

// Helper to validate M-PESA code format before submission
const validateMpesaCode = (code) => {
  // M-PESA codes are typically 10 characters
  const MPESA_CODE_REGEX = /^[A-Z0-9]{10}$/;
  return MPESA_CODE_REGEX.test(code.toUpperCase());
};

// Add validation before submission
const handleMpesaCodeChange = (e) => {
  const value = e.target.value.toUpperCase();
  setMpesaCode(value);
  
  // Clear error if valid format
  if (validateMpesaCode(value)) {
    setState(prev => ({ ...prev, error: '' }));
  }
};
  
const handleSuccess = (paymentDetails) => {
  setState(prev => ({
    ...prev,
    loading: false,
    status: PAYMENT_STATUS.COMPLETED,
    error: ''
  }));
  if (paymentDetails.mpesa_receipt) {
    setMpesaCode(paymentDetails.mpesa_receipt);
  }
  // Store the payment details
  //setMpesaCode(paymentDetails.mpesa_receipt || paymentDetails.mpesa_code);
  // Show email verification modal
  setShowEmailVerification(true);
};

const handleEmailVerificationClose = () => {
  setShowEmailVerification(false);
  onSuccess(); // Complete the entire flow
};
  const startPollingStatus = (transactionId, checkoutRequestId) => {
    console.log('🔄 Starting payment status polling:', { transactionId, checkoutRequestId });
    
    setRemainingTime(60);
    setState(prev => ({ ...prev, status: PAYMENT_STATUS.PROCESSING }));
  
    const pollInterval = setInterval(async () => {
      try {
        const response = await getTransactionStatus(transactionId, checkoutRequestId);
        // Update to match the actual response structure
        const status = response.message?.data?.transaction_status?.toUpperCase();
  
        console.log('📊 Poll response:', { status, response });
  
        if (status === 'COMPLETED') {
          // Clear intervals and timers
          clearInterval(pollInterval);
          if (timeoutTimer) clearTimeout(timeoutTimer);
          
          // Update state and trigger success
          setState(prev => ({
            ...prev,
            loading: false,
            status: PAYMENT_STATUS.COMPLETED,
            error: '',
            pollInterval: null
          }));
          
          // Pass the correct data structure to success handler
          handleSuccess(response.message.data);
          setShowEmailVerification(true);
        }
      } catch (error) {
        console.error('Status check error:', error);
        if (remainingTime <= 0) {
          clearInterval(pollInterval);
          handleTimeout();
        }
      }
    }, 2500);
  
    setState(prev => ({ ...prev, pollInterval }));
  
    // Set timeout
    const timeout = setTimeout(() => {
      handleTimeout();
    }, 60000);
  
    setTimeoutTimer(timeout);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    setState(prev => ({
      ...prev,
      loading: true,
      error: '',
      status: null
    }));

    try {
      const response = await processPurchase(
        formData.phoneNumber,
        formData.purchaseCode
      );
      
      if (response.message?.status === 'success') {
        setState(prev => ({
          ...prev,
          transactionId: response.message.transaction_id,
          checkoutRequestId: response.message.checkout_request_id
        }));
        
        startPollingStatus(
          response.message.transaction_id,
          response.message.checkout_request_id
        );
      } else {
        setState(prev => ({
          ...prev,
          error: response.message?.message || 'Failed to initiate payment',
          loading: false
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.message || 'An error occurred',
        loading: false
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setTimeoutAction(null);
    setShowMpesaCodeEntry(false);
    setMpesaCode('');
    setState({
      loading: false,
      error: '',
      status: null,
      transactionId: null,
      checkoutRequestId: null,
      pollInterval: null
    });
    setFormData({
      phoneNumber: '+254',
      purchaseCode: ''
    });
  };


 const debugInfo = {
    transactionId: state.transactionId || 'None',
    checkoutRequestId: state.checkoutRequestId || 'None',
    status: state.status || 'None',
    loading: state.loading ? 'Yes' : 'No',
    error: state.error || 'None',
    timeRemaining: `${remainingTime}s`,
    mpesaCode: mpesaCode || 'None'
  };

  const renderTimeoutOptions = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        If you've already made the payment, you can:
      </p>
      <div className="flex justify-between space-x-4">
        <button
          onClick={handleRetryCheck}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Check Again
        </button>
        <button
          onClick={() => setShowMpesaCodeEntry(true)}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Enter M-PESA Code
        </button>
      </div>
      <button
        onClick={resetForm}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
      >
        Start Over
      </button>
    </div>
  );

  const renderMpesaCodeEntry = () => (
    <form onSubmit={handleManualCodeSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          M-PESA Transaction Code
        </label>
        <input
          type="text"
          value={mpesaCode}
          onChange={handleMpesaCodeChange}
          maxLength={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                     focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., SJV74BTLC5"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the M-PESA transaction code from your payment confirmation message
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={state.loading || !validateMpesaCode(mpesaCode)}
          className={`flex-1 py-2 px-4 rounded transition ${
            state.loading || !validateMpesaCode(mpesaCode)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {state.loading ? 'Verifying...' : 'Verify Code'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowMpesaCodeEntry(false);
            setTimeoutAction('choose');
            setMpesaCode('');
          }}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded 
                     hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </form>
  );


  const renderProgressBar = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Waiting for payment...</span>
        <span className="text-sm font-medium text-blue-600">
          {remainingTime}s
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${(remainingTime / 60) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStatusMessage = () => {
    if (!state.status && !state.error) return null;
  
    const statusConfigs = {
      [PAYMENT_STATUS.PROCESSING]: {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        title: 'Processing payment...',
        message: 'Please check your phone for the M-PESA prompt and complete the payment.'
      },
      [PAYMENT_STATUS.COMPLETED]: {
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        borderColor: 'border-green-200',
        title: 'Payment completed!',
        message: 'Please verify your email to complete the process.'
      }
    };
  
    const config = statusConfigs[state.status] || {
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      title: 'Payment Verification',
      message: state.error || 'An error occurred'
    };
  

    return (
      <div className={`${config.bgColor} ${config.textColor} p-3 rounded border ${config.borderColor}`}>
        <p className="font-medium">{config.title}</p>
        <p className="text-sm mt-1">{config.message}</p>
      </div>
    );
  };

 // Add email verification success handler
 const handleEmailVerificationSuccess = () => {
  setShowEmailVerification(false);
  onSuccess(); // Complete the entire flow
};

console.log('Purchase Modal State:', {
  transactionId: state.transactionId,
  mpesaCode: mpesaCode,
  showEmailVerification
});

  return (
    <>
    <Modal 
    isOpen={isOpen} 
    onClose={onClose}
    showDebug={true}  // Will only show in development
    debugInfo={debugInfo}>
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Complete Your Purchase
        </h2>

        {renderStatusMessage()}

        {state.loading && renderProgressBar()}

        {timeoutAction === 'choose' && renderTimeoutOptions()}
        {showMpesaCodeEntry && renderMpesaCodeEntry()}

        {!timeoutAction && !showMpesaCodeEntry && state.status !== PAYMENT_STATUS.COMPLETED && (
          <form onSubmit={handlePurchaseSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="+254XXXXXXXXX"
                required
                disabled={state.loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Code
              </label>
              <input
                type="text"
                name="purchaseCode"
                value={formData.purchaseCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 4-digit code"
                maxLength={4}
                required
                disabled={state.loading}
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className={`w-full py-2 px-4 rounded transition duration-300 ${
                state.loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {state.loading ? 'Processing...' : 'Submit Purchase'}
            </button>
          </form>
        )}

        {state.status === PAYMENT_STATUS.COMPLETED && (
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300 mt-4"
          >
            Close
          </button>
        )}
      </div>
    </Modal>
    

    <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={handleEmailVerificationSuccess}
        transactionId={state.transactionId}
        mpesaCode={mpesaCode}
        onSuccess={handleEmailVerificationSuccess}
      />
    
    </>
  );
};

export default PurchaseModal;