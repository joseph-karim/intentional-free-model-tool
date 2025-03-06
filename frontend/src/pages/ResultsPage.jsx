import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('quizResults');
    
    if (!storedResults) {
      // Redirect to quiz if no results found
      navigate('/quiz');
      return;
    }
    
    try {
      setResults(JSON.parse(storedResults));
    } catch (err) {
      console.error('Error parsing results:', err);
      navigate('/quiz');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: ['Desirable', 'Effective', 'Efficient', 'Polished'],
    datasets: [
      {
        label: 'Your Score',
        data: [
          results.scores.desirable,
          results.scores.effective,
          results.scores.efficient,
          results.scores.polished
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  // Calculate overall score
  const overallScore = Math.round(
    (results.scores.desirable + 
     results.scores.effective + 
     results.scores.efficient + 
     results.scores.polished) / 4
  );

  // Determine overall assessment
  let overallAssessment = '';
  if (overallScore >= 90) {
    overallAssessment = 'Exceptional Free Model';
  } else if (overallScore >= 75) {
    overallAssessment = 'Strong Free Model';
  } else if (overallScore >= 60) {
    overallAssessment = 'Good Free Model with Room for Improvement';
  } else if (overallScore >= 40) {
    overallAssessment = 'Basic Free Model Needing Significant Improvement';
  } else {
    overallAssessment = 'Early Stage Free Model Requiring Fundamental Changes';
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Your Free Model Assessment Results
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-50 rounded-full mb-2">
            <div className="text-5xl font-bold text-indigo-600">{overallScore}</div>
            <div className="text-sm text-indigo-500">Overall Score</div>
          </div>
          <h2 className="text-xl font-semibold mt-2">{overallAssessment}</h2>
        </div>
        
        <div className="mb-12 h-80">
          <Radar data={chartData} options={chartOptions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(results.feedback).map(([category, feedback]) => (
            <div key={category} className="p-5 border rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-indigo-700 capitalize">{category}</h3>
                <div className="text-lg font-semibold">{results.scores[category]}/100</div>
              </div>
              <p className="text-gray-700">{feedback}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-lg mb-3 text-indigo-700">Next Steps</h3>
          <p className="mb-2">
            Based on your scores, consider focusing on areas with lower scores first. Here are some general recommendations:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Conduct user research to better understand what your target users truly value</li>
            <li>Measure and analyze usage patterns to identify friction points</li>
            <li>Test the effectiveness of your free model with real users</li>
            <li>Streamline onboarding and key workflows to improve efficiency</li>
            <li>Invest in design and polish to create a professional experience</li>
          </ul>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            to="/quiz"
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retake Quiz
          </Link>
          <Link
            to="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 