// src/components/modals/Modal.js
import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  children,
  showDebug = false,
  debugInfo = {} 
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderDebugInfo = () => {
    if (!showDebug || process.env.NODE_ENV !== 'development') return null;

    return (
      <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs font-mono border border-gray-200">
        <div className="font-semibold mb-2 text-gray-700">Debug Info</div>
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="grid grid-cols-12 gap-2 mb-1">
            <span className="col-span-4 text-gray-600">{key}:</span>
            <span className="col-span-8 break-all">
              {typeof value === 'object' 
                ? JSON.stringify(value) 
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close only if clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        {children}
        {renderDebugInfo()}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-150"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;