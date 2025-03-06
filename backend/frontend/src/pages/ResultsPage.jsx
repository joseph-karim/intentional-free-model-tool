import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ResultsPage() {
  const { resultId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`/api/v2/results/${resultId}`);
        setResult(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analysis result:', error);
        setError('Failed to load analysis result. Please try again.');
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [resultId]);
  
  const createChatSession = async () => {
    try {
      const response = await axios.post('/api/chat/sessions', {
        quiz_result_id: resultId
      });
      
      window.location.href = `/chat/${response.data.id}`;
    } catch (error) {
      console.error('Error creating chat session:', error);
      alert('Failed to start chat session. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <Link to="/analyzer" className="btn-primary mt-4 inline-block">
          Start New Analysis
        </Link>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Result Not Found</h2>
        <p className="text-yellow-600">The analysis result you're looking for could not be found.</p>
        <Link to="/analyzer" className="btn-primary mt-4 inline-block">
          Start New Analysis
        </Link>
      </div>
    );
  }
  
  // Extract data from the result
  const { analysis_result, recommendations, overall_score } = result;
  const scores = {
    desirable: result.desirable_score,
    effective: result.effective_score,
    efficient: result.efficient_score,
    polished: result.polished_score,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Free Model Analysis Results</h1>
        <div>
          <button 
            onClick={createChatSession}
            className="btn-primary flex items-center"
          >
            <span className="mr-2">Ask Questions</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Score Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Overall Score</h2>
            <div className="flex items-center">
              <div className="relative w-64 h-64">
                {/* This would be replaced with Chart.js in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-indigo-700">
                    {Math.round(overall_score * 10) / 10}
                  </span>
                </div>
                <div className="absolute inset-0 border-8 rounded-full border-indigo-500 opacity-20"></div>
                <div 
                  className="absolute inset-0 border-8 rounded-full border-indigo-500"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * overall_score / 10)}% ${50 - 50 * Math.cos(2 * Math.PI * overall_score / 10)}%, 50% 50%)` 
                  }}
                ></div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold mb-2">DEEP Scores</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between">
                      <span>Desirable:</span>
                      <span className="font-bold">{scores.desirable.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${scores.desirable * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Effective:</span>
                      <span className="font-bold">{scores.effective.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${scores.effective * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Efficient:</span>
                      <span className="font-bold">{scores.efficient.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${scores.efficient * 10}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Polished:</span>
                      <span className="font-bold">{scores.polished.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${scores.polished * 10}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Key Findings</h2>
            <ul className="space-y-2">
              {analysis_result && analysis_result.key_findings ? (
                analysis_result.key_findings.map((finding, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{finding}</span>
                  </li>
                ))
              ) : (
                <li>No key findings available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Tabs for details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-3 font-medium ${activeTab === 'recommendations' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('implementation')}
            className={`px-4 py-3 font-medium ${activeTab === 'implementation' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Implementation Plan
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-medium ${activeTab === 'details' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Detailed Analysis
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Free Model Overview</h2>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Recommended Model Type</h3>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="font-bold text-lg text-indigo-800">{result.recommended_model}</p>
                  <p className="text-gray-700 mt-2">
                    {analysis_result && analysis_result.model_explanation ? 
                      analysis_result.model_explanation : 
                      "No model explanation available."}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Product Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold">Product Description</h4>
                    <p className="text-gray-700 mt-1">{result.product_description || "Not provided"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold">Target Audience</h4>
                    <p className="text-gray-700 mt-1">{result.target_audience || "Not provided"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">User Journey</h3>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <h4 className="font-bold">Desired Outcome</h4>
                  <p className="text-gray-700 mt-1">{result.user_endgame || "Not provided"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold">Beginner Users</h4>
                    <p className="text-gray-700 mt-1">{result.beginner_stage || "Not provided"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold">Intermediate Users</h4>
                    <p className="text-gray-700 mt-1">{result.intermediate_stage || "Not provided"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold">Advanced Users</h4>
                    <p className="text-gray-700 mt-1">{result.advanced_stage || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              <div className="prose max-w-none">
                {recommendations ? (
                  <div dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>No recommendations available.</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'implementation' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Implementation Plan</h2>
              
              {analysis_result && analysis_result.implementation_plan ? (
                <div>
                  <p className="text-gray-600 mb-6">{analysis_result.implementation_plan.timeline}</p>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">Success Metrics</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysis_result.implementation_plan.success_metrics.map((metric, index) => (
                        <li key={index} className="text-gray-700">{metric}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    {Object.keys(analysis_result.implementation_plan.phases).map((phase, phaseIndex) => (
                      <div key={phaseIndex} className="mb-8">
                        <h3 className="text-xl font-bold mb-4">{phase}</h3>
                        <div className="space-y-4">
                          {analysis_result.implementation_plan.phases[phase].map((step, stepIndex) => (
                            <div key={stepIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg">{step.title}</h4>
                                <div className="flex space-x-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium
                                    ${step.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                      step.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'}`}>
                                    {step.priority} Priority
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium
                                    ${step.expected_impact === 'High' ? 'bg-green-100 text-green-800' : 
                                      step.expected_impact === 'Medium' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'}`}>
                                    {step.expected_impact} Impact
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium
                                    ${step.estimated_effort === 'Low' ? 'bg-green-100 text-green-800' : 
                                      step.estimated_effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                    {step.estimated_effort} Effort
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-700 my-2">{step.description}</p>
                              <div>
                                <h5 className="font-medium text-sm text-gray-500">Success Metrics:</h5>
                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                  {step.metrics.map((metric, metricIndex) => (
                                    <li key={metricIndex}>{metric}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No implementation plan available.</p>
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {analysis_result ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-green-800 mb-4">Desirable - {analysis_result.desirable.score.toFixed(1)}/10</h3>
                      <div className="prose max-w-none text-gray-800">
                        <p>{analysis_result.desirable.analysis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.desirable.strengths.map((strength, i) => (
                              <li key={i} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Weaknesses</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.desirable.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-gray-700">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Opportunities</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.desirable.opportunities.map((opportunity, i) => (
                              <li key={i} className="text-gray-700">{opportunity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">Effective - {analysis_result.effective.score.toFixed(1)}/10</h3>
                      <div className="prose max-w-none text-gray-800">
                        <p>{analysis_result.effective.analysis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.effective.strengths.map((strength, i) => (
                              <li key={i} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Weaknesses</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.effective.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-gray-700">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Opportunities</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.effective.opportunities.map((opportunity, i) => (
                              <li key={i} className="text-gray-700">{opportunity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-yellow-800 mb-4">Efficient - {analysis_result.efficient.score.toFixed(1)}/10</h3>
                      <div className="prose max-w-none text-gray-800">
                        <p>{analysis_result.efficient.analysis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.efficient.strengths.map((strength, i) => (
                              <li key={i} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Weaknesses</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.efficient.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-gray-700">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Opportunities</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.efficient.opportunities.map((opportunity, i) => (
                              <li key={i} className="text-gray-700">{opportunity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-purple-800 mb-4">Polished - {analysis_result.polished.score.toFixed(1)}/10</h3>
                      <div className="prose max-w-none text-gray-800">
                        <p>{analysis_result.polished.analysis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-purple-800 mb-2">Strengths</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.polished.strengths.map((strength, i) => (
                              <li key={i} className="text-gray-700">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800 mb-2">Weaknesses</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.polished.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-gray-700">{weakness}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800 mb-2">Opportunities</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis_result.polished.opportunities.map((opportunity, i) => (
                              <li key={i} className="text-gray-700">{opportunity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>No detailed analysis available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage; 