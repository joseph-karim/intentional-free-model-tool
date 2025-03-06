import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Intentional Free Model Analyzer</h3>
            <p className="text-gray-400">Optimize your product-led growth strategy</p>
          </div>
          <div>
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Intentional Free Model Tool. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 