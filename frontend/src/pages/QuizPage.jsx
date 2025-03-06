import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, submitQuiz } from '../services/api.js';

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions on component mount
  useEffect(() => {
    const getQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading questions. Please try again later.');
        setLoading(false);
      }
    };

    getQuestions();
  }, []);

  // Handle option selection
  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    try {
      setSubmitting(true);
      const results = await submitQuiz(answers);
      // Store results in sessionStorage to pass to results page
      sessionStorage.setItem('quizResults', JSON.stringify(results));
      navigate('/results');
    } catch (err) {
      setError('Error submitting quiz. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Group questions by category
  const categories = {
    desirable: questions.filter(q => q.category === 'desirable'),
    effective: questions.filter(q => q.category === 'effective'),
    efficient: questions.filter(q => q.category === 'efficient'),
    polished: questions.filter(q => q.category === 'polished'),
  };

  // Map category to title
  const categoryTitles = {
    desirable: 'Desirability',
    effective: 'Effectiveness',
    efficient: 'Efficiency',
    polished: 'Polish'
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Intentional Free Model Quiz
      </h1>
      
      <form onSubmit={handleSubmit}>
        {Object.entries(categories).map(([category, categoryQuestions]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
              {categoryTitles[category]}
            </h2>
            
            {categoryQuestions.map((question) => (
              <div key={question.id} className="mb-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">
                  {question.text}
                </h3>
                
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <label 
                      key={index} 
                      className={`
                        flex items-start p-3 border rounded-lg cursor-pointer transition-all
                        ${answers[question.id] === option 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-indigo-300'}
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleOptionSelect(question.id, option)}
                        className="mt-1 mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        
        <div className="flex justify-center mt-8 mb-12">
          <button
            type="submit"
            disabled={submitting}
            className={`
              py-3 px-8 rounded-lg text-white font-medium 
              ${submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizPage; 