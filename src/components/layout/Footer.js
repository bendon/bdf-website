import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} MullaPoint. All rights reserved.</p>
          </div>
          <div className="text-center md:text-right">
            <p>
              Delivered by{' '}
              <a 
                href="https://edgetech.co.ke" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition duration-300"
              >
                EdgeTech Consults Ltd.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;