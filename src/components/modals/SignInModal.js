import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Modal from './Modal';
import { submitEmailSignin, verifyOTPSignin } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import { Mail, Timer, AlertCircle, ArrowRight, Loader } from 'lucide-react';

const SignInModal = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState({
    step: 'EMAIL',
    email: '',
    otp: ['', '', '', '', '', ''],
    loading: false,
    error: '',
    resendDisabled: false,
    resendCountdown: 0,
    googleLoading: false,
  });

  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const otpRefs = Array(6).fill(0).map(() => React.createRef());

  const updateFormState = (updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    // Reset form state when modal closes
    updateFormState({
      step: 'EMAIL',
      email: '',
      otp: ['', '', '', '', '', ''],
      loading: false,
      error: '',
      resendDisabled: false,
      resendCountdown: 0,
      googleLoading: false,
    });
    onClose();
  };

  const handleResendTimer = () => {
    updateFormState({
      resendDisabled: true,
      resendCountdown: 30,
    });

    const timer = setInterval(() => {
      setFormState(prev => {
        const newCount = prev.resendCountdown - 1;
        if (newCount <= 0) {
          clearInterval(timer);
          return { ...prev, resendDisabled: false, resendCountdown: 0 };
        }
        return { ...prev, resendCountdown: newCount };
      });
    }, 1000);
  };

  // Google Login Integration with enhanced error handling
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        updateFormState({ googleLoading: true, error: '' });

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });

        if (!userInfoResponse.ok) {
          throw new Error(`Failed to fetch user information: ${userInfoResponse.statusText}`);
        }

        const userInfo = await userInfoResponse.json();
        const loginSuccess = await login(userInfo.email);

        if (!loginSuccess) {
          throw new Error('Failed to initialize session');
        }

        handleClose();
        navigate('/account');
      } catch (err) {
        console.error('Login error:', err);
        updateFormState({
          error: err.message || 'Failed to sign in with Google. Please try again.',
          googleLoading: false,
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    updateFormState({ loading: true, error: '' });

    try {
      const response = await submitEmailSignin(formState.email);

      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to send OTP');
      }

      updateFormState({
        step: 'OTP',
        loading: false,
        error: ''
      });

      handleResendTimer();

      // Focus first OTP input after transition
      setTimeout(() => {
        if (otpRefs[0].current) {
          otpRefs[0].current.focus();
        }
      }, 100);

    } catch (error) {
      console.error('Email submission error:', error);
      updateFormState({
        loading: false,
        error: error.message || 'An error occurred while sending OTP'
      });
    } finally {
      updateFormState({ loading: false });
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formState.otp];
    newOtp[index] = value;
    updateFormState({ otp: newOtp });

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formState.otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    const otpString = formState.otp.join('');
    if (otpString.length !== 6) {
      updateFormState({ error: 'Please enter a valid 6-digit OTP' });
      return;
    }

    if (!/^\d{6}$/.test(otpString)) {
      updateFormState({ error: 'OTP must contain only numbers' });
      return;
    }

    updateFormState({ loading: true, error: '' });

    try {
      const response = await verifyOTPSignin(formState.email, otpString);

      if (response.status === 'error') {
        throw new Error(response.message || 'Invalid OTP');
      }

      const loginSuccess = await login(formState.email);

      if (loginSuccess) {
        handleClose();
        navigate('/account');
      } else {
        throw new Error('Failed to initialize session');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      updateFormState({
        loading: false,
        error: error.message || 'Failed to verify OTP'
      });

      setFormState(prev => ({
        ...prev,
        otp: ['', '', '', '', '', '']
      }));

      if (otpRefs[0].current) {
        otpRefs[0].current.focus();
      }
    } finally {
      updateFormState({ loading: false });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-8 max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Sign In to BitPoint
          </h2>
          <p className="text-gray-600">
            Choose your preferred sign-in method below
          </p>
        </div>

        {formState.error && (
          <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-6" role="alert">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{formState.error}</p>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          onClick={() => googleLogin()}
          disabled={formState.googleLoading || formState.loading}
          className="w-full h-14 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          {formState.googleLoading ? (
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

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or sign in with email</span>
          </div>
        </div>

        {/* Email Sign-in Form */}
        {formState.step === 'EMAIL' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => updateFormState({ email: e.target.value.trim() })}
                className="w-full h-14 px-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter your email"
                disabled={formState.loading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={formState.loading || !formState.email}
              className="w-full h-14 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {formState.loading ? 'Sending...' : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {formState.otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  disabled={formState.loading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={formState.loading || formState.otp.some(digit => !digit)}
              className="w-full h-14 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {formState.loading ? 'Verifying...' : 'Sign In'}
            </button>

            {formState.resendDisabled ? (
              <p className="text-sm text-gray-500 text-center mt-4">
                Resend available in {formState.resendCountdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleEmailSubmit}
                disabled={formState.loading}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Resend verification code
              </button>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
};

export default SignInModal;
