import React from 'react';

const NavbarWithCTA = () => {
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
                <div className="text-2xl font-bold">
                  <span className="text-blue-600">Bit</span>Point
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-blue-600">
                  Sign In
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Spacer div to push content below fixed navbar */}
      <div className="h-24"></div> {/* Adjust height as needed */}
    </>
  );
};

export default NavbarWithCTA;