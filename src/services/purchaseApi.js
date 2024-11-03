// src/services/purchaseApi.js
import axios from 'axios';

const BASE_URL = 'https://bdf.bitpoint.co.ke/api/method/eclbitpoint.api.license_purchase';

// Function to initiate purchase
export const initiatePurchase = async (phoneNumber, purchaseCode) => {
  try {
    const response = await axios.post(`${BASE_URL}/process_purchase`, {
      phone_number: phoneNumber,
      purchase_code: purchaseCode,
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating purchase:', error);
    throw new Error('Failed to initiate purchase. Please try again.');
  }
};

// Function to get the transaction status
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await axios.post(`${BASE_URL}/get_transaction_status`, {
      transaction_id: transactionId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw new Error('Failed to get transaction status. Please try again.');
  }
};
