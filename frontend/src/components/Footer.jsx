import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Intentional Free Model Tool
            </p>
          </div>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-indigo-600 text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 