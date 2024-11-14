import React, { useState, useContext, useCallback } from 'react';
import { UserContext } from '../../context/UserContext';
import { useGoogleLogin } from '@react-oauth/google';
import Modal from './Modal';
import { submitEmail, verifyOTP, processGoogleLogin } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Mail, Timer, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const EmailVerificationModal = ({ isOpen, onClose, transactionId, mpesaCode }) => {
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    step: 'EMAIL',
    email: '',
    otp: '',
    loading: false,
    googleLoading: false,
    error: '',
    success: '',
    resendTimer: 0,
  });

  const { step, email, otp, loading, googleLoading, error, success, resendTimer } = formState;

  const updateFormState = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = useCallback(() => {
    setFormState({
      step: 'EMAIL',
      email: '',
      otp: '',
      loading: false,
      googleLoading: false,
      error: '',
      success: '',
      resendTimer: 0,
    });
    onClose();
  }, [onClose]);

  const handleEmailSubmit = async () => {
    if (!transactionId || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      updateFormState({
        error: !transactionId ? 'Transaction ID is missing' : 'Please enter a valid email',
      });
      return;
    }

    updateFormState({ loading: true, error: '', success: '' });

    try {
      const response = await submitEmail(email, transactionId, mpesaCode);

      if (response?.message?.status === 'success') {
        updateFormState({
          success: response.message.message || 'OTP sent to your email',
          step: 'OTP',
          resendTimer: 30,
        });

        // Start resend timer
        const timer = setInterval(() => {
          setFormState((prev) => ({
            ...prev,
            resendTimer: prev.resendTimer > 0 ? prev.resendTimer - 1 : 0,
          }));
        }, 1000);

        setTimeout(() => clearInterval(timer), 30000);
      } else {
        throw new Error(response?.message?.message || 'Failed to send OTP');
      }
    } catch (error) {
      updateFormState({
        error: error.message || 'Failed to process request',
      });
    } finally {
      updateFormState({ loading: false });
    }
  };

  const handleOTPVerification = async () => {
    if (!/^\d{6}$/.test(otp)) {
      updateFormState({ error: 'Please enter a valid 6-digit OTP' });
      return;
    }

    updateFormState({ loading: true, error: '', success: '' });

    try {
      const response = await verifyOTP(email, otp, transactionId);

      if (response?.message?.status === 'success') {
        updateFormState({ success: response.message.message || 'Verification successful' });
        
        // Ensure login is successful before proceeding
        const loginSuccess = await login(email);
        if (!loginSuccess) {
          throw new Error('Failed to log in after verification');
        }

        // Clear any stored transaction data
        localStorage.removeItem('purchaseTransaction');
        localStorage.removeItem('purchaseState');

        setTimeout(() => {
          navigate('/account');
          handleClose();
        }, 2000);
      } else {
        throw new Error(response?.message?.message || 'Invalid OTP');
      }
    } catch (error) {
      updateFormState({ error: error.message || 'Failed to verify OTP' });
    } finally {
      updateFormState({ loading: false });
    }
  };

  // Google Login Integration
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        updateFormState({ googleLoading: true, error: '' });

        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error(`Failed to fetch user information: ${userInfoResponse.statusText}`);
        }

        const userInfo = await userInfoResponse.json();

        // Send email to backend with transaction ID
        const googleLoginResponse = await processGoogleLogin(userInfo.email, transactionId);

        if (googleLoginResponse?.message?.status === 'success') {
          // Ensure login is successful before proceeding
          const loginSuccess = await login(userInfo.email);
          if (!loginSuccess) {
            throw new Error('Failed to log in after Google verification');
          }

          // Clear any stored transaction data
          localStorage.removeItem('purchaseTransaction');
          localStorage.removeItem('purchaseState');

          navigate('/account');
          handleClose();
        } else {
          throw new Error('Failed to complete Google login and send license email');
        }
      } catch (err) {
        console.error('Login error:', err);
        updateFormState({
          error: err.message || 'Failed to sign in with Google. Please try again.',
        });
      } finally {
        updateFormState({ googleLoading: false });
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      updateFormState({
        error: 'Failed to sign in with Google. Please try again.',
        googleLoading: false,
      });
    },
  });

  if (user) {
    return null; // No need for verification if user is already logged in
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-8 max-w-md w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {step === 'EMAIL' ? (
              <Mail className="w-12 h-12 text-blue-600" />
            ) : (
              <Timer className="w-12 h-12 text-blue-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold">
            {step === 'EMAIL' ? 'Verify Your Email' : 'Enter Verification Code'}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === 'EMAIL'
              ? 'Please verify your email to complete the purchase process'
              : `We've sent a code to ${email}`}
          </p>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={() => googleLogin()}
          disabled={googleLoading}
          className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          {googleLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span className="font-medium">Signing in...</span>
            </>
          ) : (
            <>
              <img
                src="/google-logo.svg"
                alt=""
                className="w-6 h-6"
                aria-hidden="true"
              />
              <span className="font-medium">Continue with Google</span>
            </>
          )}
        </button>

        {/* Error/Success Messages */}
        {(error || success) && (
          <div
            className={`flex items-center ${
              error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
            } p-4 rounded-lg mb-6`}
          >
            {error ? <AlertCircle className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
            <p className="text-sm">{error || success}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            step === 'EMAIL' ? handleEmailSubmit() : handleOTPVerification();
          }}
        >
          {step === 'EMAIL' ? (
            <input
              type="email"
              value={email}
              onChange={(e) => updateFormState({ email: e.target.value.trim() })}
              className="w-full h-14 px-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-6"
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          ) : (
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => updateFormState({ otp: e.target.value.replace(/\D/g, '') })}
              className="w-full h-14 px-4 text-center text-xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 mb-6"
              placeholder="Enter 6-digit code"
              disabled={loading}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading || (step === 'EMAIL' ? !email : otp.length !== 6)}
            className="w-full h-14 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mb-4"
          >
            {loading ? (step === 'EMAIL' ? 'Sending...' : 'Verifying...') : step === 'EMAIL' ? 'Continue' : 'Verify Code'}
          </button>

          {step === 'OTP' && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleEmailSubmit}
                disabled={loading || resendTimer > 0}
                className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive the code? Resend"}
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default EmailVerificationModal;
