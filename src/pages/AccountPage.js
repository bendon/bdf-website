import React, { useState, useEffect, useContext } from 'react';
import { 
  Shield, 
  Copy, 
  CheckCircle, 
  Download, 
  Key, 
  Clock, 
  Receipt, 
  Phone,
  Mail,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { UserContext } from '../context/UserContext';
import LicenseService from '../services/licenseService';
import PurchaseModal from '../components/modals/PurchaseModal';

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-green-50 text-green-700 border border-green-100',
    'Completed': 'bg-green-50 text-green-700 border border-green-100',
    'Expired': 'bg-red-50 text-red-700 border border-red-100',
    'Pending': 'bg-yellow-50 text-yellow-700 border border-yellow-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles['Active']}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ icon: Icon, label, value, copyable, onCopy }) => {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="text-blue-500 h-5 w-5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {copyable ? (
          <div className="flex items-center space-x-2">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{value}</code>
            <button 
              onClick={() => onCopy(value)}
              className="text-blue-500 hover:text-blue-600"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
};

const AccountPage = () => {
  const { user } = useContext(UserContext);
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClick = () => {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.bitdefender.security';
  };

  // Function to handle sending the email
  const handleEmailLicense = async () => {
    if (!selectedLicense) return;

    try {
      const response = await fetch('/api/method/eclbitpoint.api.license_purchase.send_license_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          license_key: selectedLicense.license_key,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        console.log('License details emailed successfully');
        alert('License details have been emailed successfully.');
      } else {
        throw new Error(data.message || 'Failed to email license details');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to email license details. Please try again later.');
    }
  };

  const fetchLicenseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await LicenseService.getLicenses(user?.email);
      const licenseData = response?.message?.data;

      if (licenseData && Array.isArray(licenseData)) {
        setLicenses(licenseData);
        setSelectedLicense(licenseData[0]);
      } else {
        setError('No active licenses found');
      }
    } catch (err) {
      console.error('Error fetching licenses:', err);
      setError(err?.message || 'Failed to fetch license data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchLicenseData();
    }
  }, [user?.email]);

  const handlePurchaseSuccess = () => {
    // Refresh license data after successful purchase
    fetchLicenseData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !selectedLicense) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 pt-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center p-6 text-center">
              <div className="mb-4">
                <Shield className="h-12 w-12 text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Active Licenses Found
              </h2>
              <p className="text-gray-600 mb-6">
                Get started with Bitdefender Mobile Security by purchasing a license.
              </p>
              
              <div className="w-full flex p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  {error || "To protect your device with Bitdefender, you'll need to purchase a license."}
                </p>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 text-left">Real-time malware protection</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 text-left">Web protection & filtering</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 text-left">Anti-theft features</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 text-left">24/7 technical support</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPurchaseModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Shield className="h-5 w-5" />
                <span>Purchase License</span>
              </button>
            </div>
          </div>
        </div>

        <PurchaseModal 
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* License Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">License Status</h2>
              <StatusBadge status="Assigned" />
            </div>

            {licenses.length > 1 && (
              <div className="mb-4">
                <select
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  value={selectedLicense?.license_key}
                  onChange={(e) => {
                    const selected = licenses.find(l => l.license_key === e.target.value);
                    if (selected) setSelectedLicense(selected);
                  }}
                >
                  {licenses.map(license => (
                    <option key={license.license_key} value={license.license_key}>
                      License {license.masked_license_key} - Assigned
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailRow
                  icon={Key}
                  label="License Key"
                  value={selectedLicense?.license_key}
                  copyable
                  onCopy={copyToClipboard}
                />
                 <DetailRow
                  icon={Clock}
                  label="Valid For"
                  value="12 Months"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleClick}
                    className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download Bitdefender</span>
                  </button>
                  <button 
                    onClick={handleEmailLicense}
                    className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email License Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              <StatusBadge status="Completed" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <DetailRow
                  icon={Phone}
                  label="M-Pesa Number"
                  value={selectedLicense?.payment_details?.phone_number}
                />
                <DetailRow
                  icon={Receipt}
                  label="Transaction Code"
                  value={selectedLicense?.payment_details?.mpesa_receipt.toUpperCase()}
                  copyable
                  onCopy={copyToClipboard}
                />
                <DetailRow
                  icon={Clock}
                  label="Transaction Date"
                  value={new Date(selectedLicense?.payment_details?.date).toLocaleString()}
                />
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-gray-900">
                      KES {selectedLicense?.payment_details?.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedLicense?.payment_details?.media_profile || 'M-Pesa'}
                    </span>
                  </div>
                  <button className="w-full mt-2 bg-white text-green-600 border border-green-200 hover:bg-green-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Guide Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Installation Guide</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Smartphone className="text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Mobile Installation</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Download Bitdefender Mobile Security from your device's app store</li>
                  <li>Open the app and click "Activate License"</li>
                  <li>Enter your license key shown above</li>
                  <li>Follow the on-screen instructions to complete setup</li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-yellow-600 h-5 w-5 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Verification Status</h4>
                  <p className="text-sm text-yellow-700">
                    Your license has been successfully linked to {selectedLicense?.user_email || user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;