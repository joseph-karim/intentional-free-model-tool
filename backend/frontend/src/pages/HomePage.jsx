import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-800">
          Intentional Free Model Analyzer
        </h1>
        <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
          Develop a strategic free model for your product using the DEEP framework.
          Get AI-powered analysis and personalized recommendations.
        </p>
        <Link to="/analyzer" className="btn-primary text-lg py-3 px-8">
          Start Your Analysis
        </Link>
      </section>
      
      {/* DEEP Framework Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">The DEEP Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl mb-4">
              D
            </div>
            <h3 className="text-xl font-bold mb-2">Desirable</h3>
            <p className="text-gray-600">
              How compelling is your free offering to users? Evaluate the value proposition and user outcome alignment.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl mb-4">
              E
            </div>
            <h3 className="text-xl font-bold mb-2">Effective</h3>
            <p className="text-gray-600">
              How well does your free model solve real user problems? Analyze the solution fit and impact.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl mb-4">
              E
            </div>
            <h3 className="text-xl font-bold mb-2">Efficient</h3>
            <p className="text-gray-600">
              How sustainable is your free model for the business? Optimize feature allocation and conversion triggers.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl mb-4">
              P
            </div>
            <h3 className="text-xl font-bold mb-2">Polished</h3>
            <p className="text-gray-600">
              How refined is your free model experience? Create a clear, cohesive user journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Use This Tool?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
            <p className="text-gray-600">
              Get sophisticated analysis of your free model strategy using advanced AI models that understand the nuances of product-led growth.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Comprehensive Framework</h3>
            <p className="text-gray-600">
              Follow a structured approach to evaluate your free model from multiple angles, ensuring nothing important is overlooked.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Actionable Recommendations</h3>
            <p className="text-gray-600">
              Receive specific, prioritized recommendations to improve your free model strategy and implementation plan.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="text-center py-8 bg-indigo-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to optimize your free model strategy?</h2>
        <p className="text-lg mb-6 text-gray-600 max-w-2xl mx-auto">
          Get detailed insights and recommendations tailored to your product and business goals.
        </p>
        <Link to="/analyzer" className="btn-primary">
          Start Your Analysis
        </Link>
      </section>
    </div>
  );
}

export default HomePage; 