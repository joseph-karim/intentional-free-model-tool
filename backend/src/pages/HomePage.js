import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Intentional Free Model Quiz</h1>
          <p className="text-xl md:text-2xl mb-8">
            Learn how to make your free AI model work harder for your business.
          </p>
          <Link 
            to="/quiz" 
            className="bg-white text-indigo-700 hover:bg-indigo-100 transition-colors py-3 px-8 rounded-full font-semibold text-lg inline-block"
          >
            Take the Quiz
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">What is the DEEP Framework?</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              The DEEP Framework helps you evaluate and enhance your free AI model implementation
              across four critical dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-blue-600 text-4xl font-bold mb-4">D</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Desirable</h3>
              <p className="text-gray-600">
                Your free model should offer something users genuinely want, 
                drawing them to your product and encouraging engagement.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-green-600 text-4xl font-bold mb-4">E</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Effective</h3>
              <p className="text-gray-600">
                Your implementation should solve real problems for users
                and deliver meaningful results they can act upon.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="text-yellow-600 text-4xl font-bold mb-4">E</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Efficient</h3>
              <p className="text-gray-600">
                Users should be able to get value quickly, without excessive
                steps, complexity, or waiting time.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-purple-600 text-4xl font-bold mb-4">P</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Polished</h3>
              <p className="text-gray-600">
                The experience should be refined, professional, and complete,
                giving users confidence in your product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Ready to evaluate your free model?</h2>
          <Link 
            to="/quiz" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors py-3 px-8 rounded-full font-semibold text-lg inline-block"
          >
            Start the Quiz Now
          </Link>
          <p className="mt-4 text-gray-600">
            Takes less than 5 minutes to complete!
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 