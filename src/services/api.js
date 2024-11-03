// src/services/api.js
import apiClient, { API_PATHS } from '../config/apiConfig';

const logServiceCall = (serviceName, params) => {
  console.log(`📡 Calling ${serviceName}:`, params);
};

export const processPurchase = async (phoneNumber, purchaseCode) => {
  logServiceCall('processPurchase', { phoneNumber, purchaseCode });
  
  try {
    const response = await apiClient.post(API_PATHS.LICENSE_PURCHASE.PROCESS, {
      phone_number: phoneNumber,
      purchase_code: purchaseCode,
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getTransactionStatus = async (transactionId, checkoutRequestId) => {
  logServiceCall('getTransactionStatus', { transactionId, checkoutRequestId });
  
  try {
    const response = await apiClient.get(API_PATHS.LICENSE_PURCHASE.STATUS, {
      params: {
        transaction_id: transactionId,
        checkout_request_id: checkoutRequestId
      }
    });
    
    // Validate response structure
    if (!response.data?.message) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Transaction status check failed:', {
      error,
      transactionId,
      checkoutRequestId
    });
    
    // Preserve the original error message if it's from our API
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Failed to check transaction status');
  }
};


export const verifyMpesaCode = async (transactionId, mpesaCode) => {
  logServiceCall('verifyMpesaCode', { transactionId, mpesaCode });
  
  try {
    const response = await apiClient.get(API_PATHS.LICENSE_PURCHASE.VERIFY_MPESA, {
      params: {
        transaction_id: transactionId,
        mpesa_code: mpesaCode
      }
    });
    
    // Validate response structure
    if (!response.data?.message) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('M-PESA verification failed:', {
      error,
      transactionId,
      mpesaCode
    });
    
    // Preserve the original error message if it's from our API
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Failed to verify M-PESA code');
  }
};

export const submitEmail = async (email, transactionId, mpesaCode) => {
  logServiceCall('submitEmail', { email, transactionId, mpesaCode });
  
  try {
    const response = await apiClient.post(API_PATHS.LICENSE_PURCHASE.SUBMIT_EMAIL, {
      email,
      transaction_id: transactionId,  // Add this with underscore to match backend
      mpesa_code: mpesaCode          // Add this to match backend
    });
    
    console.log('💫 Submit Email Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('⚠️ Submit Email Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export const verifyOTP = async (email, otp, transactionId) => {
  logServiceCall('verifyOTP', { email, otp, transactionId });
  
  try {
    const response = await apiClient.post(API_PATHS.LICENSE_PURCHASE.VERIFY_OTP, {
      email,
      otp,
      transaction_id: transactionId,
    });
    
    console.log('💫 Verify OTP Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('⚠️ Verify OTP Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

// Add a test function to verify the API connection
export const testApiConnection = async () => {
  logServiceCall('testApiConnection');
  
  try {
    const response = await apiClient.get('/test');
    console.log('💫 Test Connection Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('⚠️ Test Connection Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

export default {
  processPurchase,
  getTransactionStatus,
  submitEmail,
  verifyOTP,
  testApiConnection
};