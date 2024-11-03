// src/config/apiConfig.js
import axios from 'axios';

const API_TOKEN = '195026a7a3dc994:06107f998d77f1b';


export const BASE_URL = 'https://bdf.bitpoint.co.ke/api';
export const PAYMENT_STATUS = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  FAILED: 'Failed'
};

export const API_PATHS = {
  LICENSE_PURCHASE: {
    PROCESS: '/method/eclbitpoint.api.license_purchase.process_purchase',
    STATUS: '/method/transaction_status',
    SUBMIT_EMAIL: '/method/email_otp',
    VERIFY_OTP: '/method/eclbitpoint.api.license_purchase.verify_otp',
    VERIFY_MPESA: '/method/verify_mpesa'
  },
  LICENSE: {
    GET_ALL: '/method/get_licenses',
    GET_PAYMENTS: '/method/get_license_payments'
  }
};

// Add request logging interceptor
const logRequest = (config) => {
  console.log('🚀 API Request:', {
    url: `${config.baseURL}${config.url}`,
    method: config.method?.toUpperCase(),
    data: config.data,
    headers: config.headers,
    params: config.params
  });
  return config;
};

// Add response logging interceptor
const logResponse = (response) => {
  console.log('✅ API Response:', {
    url: `${response.config.baseURL}${response.config.url}`,
    status: response.status,
    data: response.data
  });
  return response;
};

// Enhanced error logging interceptor with timeout handling
const logError = (error) => {
  const errorDetails = {
    url: `${error.config?.baseURL}${error.config?.url}`,
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
    code: error.code
  };

  console.error('❌ API Error:', errorDetails);

  // Create a user-friendly error message
  let userMessage = 'An error occurred while connecting to the server.';
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
    userMessage = 'The server is taking too long to respond. Please try again.';
  } else if (error.response?.status === 404) {
    userMessage = 'The requested resource was not found.';
  } else if (error.response?.status === 403) {
    userMessage = 'You do not have permission to access this resource.';
  }

  const enhancedError = new Error(userMessage);
  enhancedError.originalError = error;
  enhancedError.details = errorDetails;
  throw enhancedError;
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `token ${API_TOKEN}`
  },
  // Add timeout configuration
  timeout: 30000, // 30 seconds
  // Add retry configuration using axios-retry if needed
});

// Add the interceptors
apiClient.interceptors.request.use(logRequest);
apiClient.interceptors.response.use(logResponse, logError);

export default apiClient;