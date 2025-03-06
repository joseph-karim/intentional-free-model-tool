import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const { result } = location.state || { result: null };
  const [feedbackExpanded, setFeedbackExpanded] = useState({});

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">No results to display. Please take the quiz first.</p>
          <Link 
            to="/quiz" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Take the Quiz
          </Link>
        </div>
      </div>
    );
  }

  const { scores, feedback } = result;
  const categories = ['desirable', 'effective', 'efficient', 'polished'];
  const categoryColors = {
    desirable: 'blue',
    effective: 'green',
    efficient: 'yellow',
    polished: 'purple'
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'desirable': 
        return 'Desirable';
      case 'effective': 
        return 'Effective';
      case 'efficient': 
        return 'Efficient';
      case 'polished': 
        return 'Polished';
      default: 
        return category;
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const toggleFeedback = (category) => {
    setFeedbackExpanded({
      ...feedbackExpanded,
      [category]: !feedbackExpanded[category]
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Free Model Assessment Results</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Overall Score</h2>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 border-4 border-indigo-500">
                <span className="text-2xl font-bold text-indigo-700">
                  {Math.round(
                    (scores.desirable + scores.effective + scores.efficient + scores.polished) / 4
                  )}%
                </span>
              </div>
              <div className="ml-6">
                <p className="text-gray-600">
                  Based on your responses, your free model implementation is
                  <span className={`font-bold ml-1 ${
                    getScoreColor(
                      (scores.desirable + scores.effective + scores.efficient + scores.polished) / 4
                    )
                  }`}>
                    {getScoreLabel(
                      (scores.desirable + scores.effective + scores.efficient + scores.polished) / 4
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">DEEP Framework Scores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map(category => (
                <div key={category} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-bold text-${categoryColors[category]}-600`}>
                      {getCategoryLabel(category)}
                    </h3>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${getScoreColor(scores[category])}`}>
                        {scores[category]}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`bg-${categoryColors[category]}-500 h-3 rounded-full`} 
                      style={{ width: `${scores[category]}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-4">
                    <button 
                      onClick={() => toggleFeedback(category)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
                    >
                      {feedbackExpanded[category] ? 'Hide Feedback' : 'View Feedback'}
                    </button>
                    
                    {feedbackExpanded[category] && (
                      <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                        <p className="text-gray-700">{feedback[category]}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-800 mb-3">What's Next?</h2>
            <p className="text-gray-700 mb-4">
              Based on your assessment, we recommend focusing on improving your 
              <span className={`font-bold ml-1 text-${
                categoryColors[
                  Object.entries(scores).reduce((min, [key, val]) => 
                    val < scores[min] ? key : min, 'desirable')
                ]
              }-600`}>
                {getCategoryLabel(
                  Object.entries(scores).reduce((min, [key, val]) => 
                    val < scores[min] ? key : min, 'desirable')
                )}
              </span> 
              score first.
            </p>
            
            <div className="mt-6 text-center">
              <Link 
                to="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg inline-block font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 