import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Intentional Free Model</h2>
            <p className="text-gray-400 mt-2">
              Make your free model work harder for your business.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">About DEEP Framework</h3>
              <ul className="text-gray-400">
                <li><span className="text-blue-400">D</span>esirable - Something users want</li>
                <li><span className="text-green-400">E</span>ffective - Solves real problems</li>
                <li><span className="text-yellow-400">E</span>fficient - Delivers value quickly</li>
                <li><span className="text-purple-400">P</span>olished - Well-designed experience</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Resources</h3>
              <ul className="text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Free Model Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Intentional Free Model Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 