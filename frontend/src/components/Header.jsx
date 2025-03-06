import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
            <path
              fillRule="evenodd"
              d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.175 7.616.514a.75.75 0 01.634.738zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-xl font-bold">Intentional Free Model Quiz</h1>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link 
                to="/" 
                className="text-white hover:text-indigo-200 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/quiz" 
                className="text-white hover:text-indigo-200 transition-colors"
              >
                Take Quiz
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 