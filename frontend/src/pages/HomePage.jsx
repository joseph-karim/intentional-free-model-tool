import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          Intentional Free Model Quiz
        </h1>
        <p className="text-xl text-gray-600">
          Evaluate how well your free AI model delivers value using the DEEP framework
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">About the Quiz</h2>
        <p className="mb-4">
          Building a successful free model for your AI product requires intentionality. 
          The best free models provide real value to users while sustainably serving your business goals.
        </p>
        <p className="mb-6">
          This quiz evaluates your free model based on four key dimensions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Desirable</h3>
            <p className="text-gray-700">Users actually want it and find it valuable</p>
          </div>
          
          <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Effective</h3>
            <p className="text-gray-700">It solves a real problem well</p>
          </div>
          
          <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Efficient</h3>
            <p className="text-gray-700">Users can get value quickly with minimal friction</p>
          </div>
          
          <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50">
            <h3 className="font-bold text-lg mb-2 text-indigo-700">Polished</h3>
            <p className="text-gray-700">High quality implementation and design</p>
          </div>
        </div>

        <p className="mb-8">
          After completing this short assessment, you'll receive personalized feedback and scores
          that will help you identify areas for improvement in your free model strategy.
        </p>

        <div className="text-center">
          <Link 
            to="/quiz" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg inline-block transition-colors"
          >
            Start the Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 