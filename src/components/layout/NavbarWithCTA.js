// src/components/layout/NavbarWithCTA.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const NavbarWithCTA = ({ onSignInModalOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext); // Make sure this line exists
  console.log('Current user state in navbar:', user);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log('NavbarWithCTA - Saved user in localStorage:', savedUser); // Debug log
  }, []);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* EdgeTech CTA Banner */}
      <div className="bg-blue-600 text-white py-2 text-center">
        <p className="text-sm md:text-base">
          Enhance Your Business Security! Get a Comprehensive Cybersecurity Assessment today.
          <a href="https://edgetech.co.ke" className="underline font-bold ml-2 hover:text-blue-200" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate('/')}
              >
                <span className="text-blue-600">Bit</span>Point
              </div>
              <div className="hidden md:flex ml-10 space-x-8">
                <a href="https://edgetech.co.ke" className="text-gray-700 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                  CyberSecurity Services
                </a>
                <a href="/#features" className="text-gray-700 hover:text-blue-600">
                  Features
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/account')}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    My Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onSignInModalOpen}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/get-started')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    

    </div>
    <div className="h-16"></div>
    </>
    
  );
};

export default NavbarWithCTA;