import React, { useState, useContext, useCallback, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Modal from './Modal';
import { submitEmail, verifyOTP } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EmailVerificationModal = ({
  isOpen,
  onClose,
  transactionId,
  mpesaCode,
}) => {
  const { login } = useContext(UserContext);
  const [step, setStep] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('EmailVerificationModal Props:', {
      isOpen,
      transactionId,
      mpesaCode
    });
  }, [isOpen, transactionId, mpesaCode]);

  // Reset resend timer
  const startResendTimer = useCallback(() => {
    setResendDisabled(true);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle email submission to request OTP
  const handleEmailSubmit = async () => {
    // Debug logs
    console.log('Submit Email Params:', {
      email,
      transactionId,
      mpesaCode
    });
    // Validate required fields
    if (!transactionId) {
      console.error('Missing transactionId:', transactionId);
      setError('Transaction ID is missing. Please try again.');
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Add validation for transactionId
      if (!transactionId) {
        setError('Transaction ID is required');
        return;
      }
    
      const response = await submitEmail(email, transactionId, mpesaCode);
      console.log('Email submission response:', response);
      
      // Check the nested status in response.message.status
      if (response?.message?.status === 'success') {
        setSuccess(response.message.message || 'OTP sent to your email');
        
        if (step === 'OTP') {
          startResendTimer();
        } else {
          setTimeout(() => {
            setStep('OTP');
            startResendTimer();
          }, 1500);
        }
        
        if (response.message.user_exists) {
          console.log('Existing user detected:', response.message.user_exists);
        }
      } else {
        setError(response?.message?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to process request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const response = await verifyOTP(email, otp, transactionId);
      console.log('Response structure:', {
        response,
        messageStatus: response?.message?.status,
        messageContent: response?.message?.message
      });
      
      // Updated condition to match API response structure
      if (response?.message?.status === 'success') {
        setSuccess(
          typeof response.message.message === 'string' 
            ? response.message.message 
            : 'Verification successful'
        );
        await login(email);
        
        setTimeout(() => {
          navigate('/account');
          handleClose();
        }, 2000);
      } else {
        setError(
          typeof response?.message?.message === 'string' 
            ? response.message.message 
            : 'Invalid OTP. Please try again.'
        );
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to verify OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    setStep('EMAIL');
    setEmail('');
    setOtp('');
    setError('');
    setSuccess('');
    setResendDisabled(false);
    setResendTimer(0);
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {step === 'EMAIL' ? 'Verify Your Email' : 'Enter OTP'}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Please verify your email to complete the purchase process
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded mb-4" role="status">
            {success}
          </div>
        )}

        {step === 'EMAIL' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={loading}
                placeholder="Enter your email"
                autoComplete="email"
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll send a verification code to this email
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOTPVerification();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={loading}
                maxLength={6}
                pattern="\d{6}"
                placeholder="Enter 6-digit OTP"
                autoComplete="one-time-code"
              />
              <p className="text-sm text-gray-500 mt-1">
                Check your email {email} for the verification code
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button
              type="button"
              onClick={handleEmailSubmit}
              className="w-full text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || resendDisabled}
            >
              {resendDisabled 
                ? `Resend OTP (${resendTimer}s)` 
                : 'Resend OTP'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EmailVerificationModal;