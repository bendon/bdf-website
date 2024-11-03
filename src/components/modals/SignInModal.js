// src/components/modals/SignInModal.js
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { submitEmail, verifyOTP } from '../../services/api';
import { UserContext } from '../../context/UserContext';

const SignInModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await submitEmail(email);
      
      if (response.status === 'error') {
        setError(typeof response.message === 'string' ? response.message : 'Failed to send OTP');
      } else {
        setStep('OTP');
      }
    } catch (err) {
      setError(typeof err.message === 'string' ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP(email, otp);
      
      if (response.status === 'error') {
        setError(typeof response.message === 'string' ? response.message : 'Invalid OTP');
      } else {
        // Update authentication state
        const loginSuccess = login(email);
        
        if (loginSuccess) {
          // Reset form state
          setStep('EMAIL');
          setEmail('');
          setOtp('');
          onClose(); // Close the modal
          navigate('/account'); // Redirect to Account Page
        } else {
          setError('Failed to initialize session. Please try again.');
        }
      }
    } catch (err) {
      setError(typeof err.message === 'string' ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {step === 'EMAIL' ? 'Sign In with Your Email' : 'Enter OTP'}
        </h2>
        
        {error && typeof error === 'string' && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'EMAIL' ? (
          <form
            onSubmit={handleEmailSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleOTPSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                disabled={loading}
                maxLength={6}
                pattern="\d{6}"
                placeholder="Enter 6-digit OTP"
              />
              <p className="text-sm text-gray-500 mt-1">
                Please check your email for the OTP code
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default SignInModal;