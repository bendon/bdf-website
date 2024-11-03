// src/services/licenseService.js
import apiClient, { API_PATHS } from '../config/apiConfig';

class LicenseService {
  /**
   * Get all licenses with their payment details
   * @param {string} email - User's email address
   * @returns {Promise<{message: string, data: Array}>} Licenses data and status message
   * @throws {Error} If email is missing or API request fails
   */
  static async getLicenses(email) {
    if (!email) {
      throw new Error('Email is required to fetch licenses');
    }

    try {
      const response = await apiClient.get(API_PATHS.LICENSE.GET_ALL, {
        params: { user_email: email }
      });
      
      // Check if response indicates an error
      if (response.data.status === 'error') {
        throw new Error(response.data.message);
      }

      // If no licenses found, return empty array with message
      if (!response.data.data || response.data.data.length === 0) {
        return {
          message: response.data.message || 'No licenses found for your account',
          data: []
        };
      }

      // Return both message and license data
      return {
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching licenses:', error);
      throw error;
    }
  }

  /**
   * Get all license-related payments
   * @returns {Promise<Array>} Array of payment records
   * @throws {Error} If API request fails
   */
  static async getLicensePayments() {
    try {
      const response = await apiClient.get(API_PATHS.LICENSE.GET_PAYMENTS);
      return response.data.message;
    } catch (error) {
      console.error('Error fetching license payments:', error);
      throw error;
    }
  }

  /**
   * Helper method to format date strings
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  static formatDate(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Helper method to calculate days until expiry
   * @param {string} expiryDate - Expiry date string
   * @returns {number} Number of days until expiry
   */
  static getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export default LicenseService;