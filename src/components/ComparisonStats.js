import React from 'react';

const ComparisonBar = ({ brand, score, isHighest }) => (
  <div className="flex items-center mb-2">
    <div className="w-32 text-sm">{brand}</div>
    <div className={`h-6 ${isHighest ? 'bg-blue-600' : 'bg-gray-300'} rounded-full flex-grow mr-2`}>
      <div 
        className={`h-full ${isHighest ? 'bg-blue-600' : 'bg-gray-300'} rounded-full`} 
        style={{width: `${(score / 6) * 100}%`}}
      ></div>
    </div>
    <div className="w-12 text-right text-sm">{score.toFixed(2)}</div>
  </div>
);

const ComparisonStats = () => {
  const protectionData = [
    { brand: 'Bitdefender', score: 5.94 },
    { brand: 'Kaspersky', score: 5.92 },
    { brand: 'Norton', score: 5.86 },
    { brand: 'McAfee', score: 5.32 },
  ];

  const performanceData = [
    { brand: 'Bitdefender', score: 5.84 },
    { brand: 'Kaspersky', score: 5.82 },
    { brand: 'Norton', score: 5.54 },
    { brand: 'McAfee', score: 5.42 },
  ];

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">How Bitdefender compares to other cybersecurity brands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Best Protection
            </h3>
            <p className="text-sm mb-4">Best Protection against e-Threats (On a scale of 0 to 6, with 6 as the highest level of protection)</p>
            {protectionData.map((item, index) => (
              <ComparisonBar key={index} {...item} isHighest={index === 0} />
            ))}
            <p className="text-xs mt-2">Overall Score. January 2011 - June 2022. AV TEST.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Best Performance
            </h3>
            <p className="text-sm mb-4">Lowest Impact on Performance (On a scale of 0 to 6, with 6 as the lightest level of impact)</p>
            {performanceData.map((item, index) => (
              <ComparisonBar key={index} {...item} isHighest={index === 0} />
            ))}
            <p className="text-xs mt-2">Overall Score. January 2013 - June 2022. AV TEST.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonStats;