import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Intentional Free Model Analyzer
          </Link>
          <nav className="flex space-x-4">
            <Link to="/" className="hover:text-indigo-200">
              Home
            </Link>
            <Link to="/analyzer" className="hover:text-indigo-200">
              Analyzer
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header; 