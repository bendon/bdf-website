import React, { useState, useEffect, useContext } from 'react';
import Modal from '../modals/Modal';
import { processPurchase, getTransactionStatus, verifyMpesaCode } from '../../services/api';
import { PAYMENT_STATUS } from '../../config/apiConfig';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import { UserContext } from '../../context/UserContext';
import { AlertCircle, CheckCircle, Timer } from 'lucide-react';

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
    timeoutAction: null
  });

  const updateFormState = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
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

  const startPolling = (transactionId, checkoutRequestId) => {
    updateFormState({ status: PAYMENT_STATUS.PROCESSING, remainingTime: 60 });

    const interval = setInterval(async () => {
      try {
        const response = await getTransactionStatus(transactionId, checkoutRequestId);
        const status = response.message?.data?.transaction_status?.toUpperCase();

        if (status === 'COMPLETED') {
          clearInterval(interval);
          clearTimeout(pollTimer.timeout);
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
    if (pollTimer.interval) clearInterval(pollTimer.interval);
    if (pollTimer.timeout) clearTimeout(pollTimer.timeout);
    setPollTimer({ interval: null, timeout: null });

    updateFormState({
      loading: false,
      error: 'Payment verification timed out. Please select an option below:',
      timeoutAction: 'choose',
    });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    updateFormState({ loading: true, error: '', status: null });

    try {
      const response = await processPurchase(formState.phoneNumber, formState.purchaseCode);

      if (response.message?.status === 'success') {
        const { transaction_id, checkout_request_id } = response.message;
        updateFormState({ transactionId: transaction_id, checkoutRequestId: checkout_request_id });
        localStorage.setItem('purchaseTransaction', JSON.stringify({ transaction_id, mpesaCode: '' }));
        startPolling(transaction_id, checkout_request_id);
      } else {
        throw new Error(response.message?.message || 'Failed to initiate payment');
      }
    } catch (error) {
      updateFormState({ loading: false, error: error.message || 'An error occurred' });
    }
  };

  const handleMpesaCodeVerify = async (e) => {
    e.preventDefault();
    updateFormState({ loading: true, error: '' });

    try {
      const response = await verifyMpesaCode(formState.transactionId, formState.mpesaCode);
      if (response.message?.status === 'success' && response.message.data?.transaction_status?.toLowerCase() === 'completed') {
        handleSuccess(response.message.data);
      } else {
        throw new Error('Payment verification failed. Please check the code and try again.');
      }
    } catch (error) {
      updateFormState({ loading: false, error: error.message || 'Failed to verify M-PESA code' });
    }
  };

  const handleSuccess = (paymentDetails) => {
    localStorage.setItem('purchaseTransaction', JSON.stringify({ transaction_id: formState.transactionId, mpesaCode: paymentDetails.mpesa_receipt }));
    updateFormState({
      loading: false,
      status: PAYMENT_STATUS.COMPLETED,
      error: '',
      mpesaCode: paymentDetails.mpesa_receipt || formState.mpesaCode,
      showEmailVerification: true,
      showMpesaCodeEntry: false,
    });
  };

  const resetForm = () => {
    updateFormState({
      phoneNumber: '+254',
      purchaseCode: '',
      mpesaCode: '',
      loading: false,
      error: '',
      status: null,
      timeoutAction: null,
      showMpesaCodeEntry: false,
    });
  };

  // Render purchase form
  const renderForm = () => (
    <form onSubmit={handlePurchaseSubmit} className="space-y-4">
      {['phoneNumber', 'purchaseCode'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field === 'phoneNumber' ? 'M-Pesa Phone Number' : 'Purchase Code'}
          </label>
          <input
            type={field === 'phoneNumber' ? 'tel' : 'text'}
            value={formState[field]}
            onChange={(e) => updateFormState({ [field]: e.target.value })}
            className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder={field === 'phoneNumber' ? '+254XXXXXXXXX' : 'Enter 4-digit code'}
            maxLength={field === 'purchaseCode' ? 4 : undefined}
            required
            disabled={formState.loading}
          />
        </div>
      ))}
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>

          {formState.error && (
            <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">{formState.error}</p>
            </div>
          )}

          {!user && formState.showEmailVerification ? (
            <EmailVerificationModal
              isOpen={formState.showEmailVerification}
              onClose={() => {
                updateFormState({ showEmailVerification: false });
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
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PurchaseModal;
