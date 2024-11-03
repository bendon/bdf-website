import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { submitEmail, verifyOTP } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import { Mail, Timer, AlertCircle, ArrowRight } from 'lucide-react';

const SignInModal = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState({
    step: 'EMAIL',
    email: '',
    otp: ['', '', '', '', '', ''],
    loading: false,
    error: ''
  });

  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const otpRefs = Array(6).fill(0).map(() => React.createRef());

  const updateFormState = (updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    updateFormState({ loading: true, error: '' });

    try {
      const response = await submitEmail(formState.email);
      
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to send OTP');
      }
      
      updateFormState({ 
        step: 'OTP',
        loading: false
      });
      
      // Focus first OTP input after transition
      setTimeout(() => {
        if (otpRefs[0].current) {
          otpRefs[0].current.focus();
        }
      }, 100);
      
    } catch (error) {
      updateFormState({
        loading: false,
        error: error.message || 'An error occurred'
      });
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

    updateFormState({ loading: true, error: '' });

    try {
      const response = await verifyOTP(formState.email, otpString);
      
      if (response.status === 'error') {
        throw new Error(response.message || 'Invalid OTP');
      }

      const loginSuccess = await login(formState.email);
      
      if (loginSuccess) {
        updateFormState({
          step: 'EMAIL',
          email: '',
          otp: ['', '', '', '', '', ''],
          loading: false,
          error: ''
        });
        onClose();
        navigate('/account');
      } else {
        throw new Error('Failed to initialize session');
      }
    } catch (error) {
      updateFormState({
        loading: false,
        error: error.message || 'An error occurred'
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {formState.step === 'EMAIL' ? 
              <Mail className="w-12 h-12 text-blue-600" /> : 
              <Timer className="w-12 h-12 text-blue-600" />
            }
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {formState.step === 'EMAIL' ? 'Sign In with Email' : 'Enter Verification Code'}
          </h2>
          <p className="text-gray-600">
            {formState.step === 'EMAIL' 
              ? "We'll send you a verification code to sign in"
              : `We've sent a code to ${formState.email}`}
          </p>
        </div>

        {formState.error && (
          <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{formState.error}</p>
          </div>
        )}

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

            <button
              type="button"
              onClick={handleEmailSubmit}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Resend verification code
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default SignInModal;