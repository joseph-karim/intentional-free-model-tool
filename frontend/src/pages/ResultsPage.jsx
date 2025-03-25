import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AnalysisReport from '../components/AnalysisReport';
import ChatInterface from '../components/ChatInterface';
import RadarChart from '../components/RadarChart';
import apiService from '../services/api';

/**
 * ResultsPage - Displays the analysis results
 * 
 * This page displays the AI-generated analysis of the user's
 * free model strategy, including DEEP framework scores, strengths,
 * weaknesses, recommendations, and implementation steps.
 */
const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [isSharedView, setIsSharedView] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareNotification, setShowShareNotification] = useState(false);
  
  // Load analysis from location state, sessionStorage or shared ID
  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      
      try {
        // First check if this is a shared view (URL contains a share ID)
        if (params.shareId) {
          // Load the shared analysis
          const sharedData = await apiService.getSharedAnalysis(params.shareId);
          setAnalysis(sharedData.analysis);
          setRecommendations(sharedData.recommendations);
          
          // Save the form data to session storage
          if (sharedData.form_data) {
            sessionStorage.setItem('formData', JSON.stringify(sharedData.form_data));
          }
          
          setIsSharedView(true);
          setLoading(false);
          return;
        }
        
        // Check if analysis was passed via router state
        if (location.state?.analysis) {
          setAnalysis(location.state.analysis.analysis);
          setRecommendations(location.state.analysis.recommendations);
          
          // Save form data to session storage if available
          if (location.state.analysis.form_data) {
            sessionStorage.setItem('formData', JSON.stringify(location.state.analysis.form_data));
          }
          
          setLoading(false);
          return;
        }
        
        // Then check session storage
        const savedAnalysis = sessionStorage.getItem('analysis');
        if (savedAnalysis) {
          const parsedAnalysis = JSON.parse(savedAnalysis);
          setAnalysis(parsedAnalysis.analysis);
          setRecommendations(parsedAnalysis.recommendations);
          setLoading(false);
          return;
        }
        
        // If no analysis available, redirect to quiz
        navigate('/quiz', { 
          replace: true,
          state: { message: 'Please complete the free model strategy assessment first.' }
        });
      } catch (error) {
        console.error('Error loading analysis:', error);
        setError('There was an error loading your analysis. Please try again.');
        setLoading(false);
      }
    };
    
    loadAnalysis();
  }, [location, navigate, params]);
  
  // Save analysis to session storage when it changes
  useEffect(() => {
    if (analysis && recommendations && !isSharedView) {
      // Save analysis and recommendations
      sessionStorage.setItem('analysis', JSON.stringify({ 
        analysis, 
        recommendations 
      }));
      
      // Save form data if it exists in location state
      if (location.state?.analysis?.form_data) {
        sessionStorage.setItem('formData', JSON.stringify(location.state.analysis.form_data));
      }
    }
  }, [analysis, recommendations, isSharedView, location.state]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle restart quiz
  const handleRestartQuiz = () => {
    // Clear session storage
    sessionStorage.removeItem('analysis');
    
    // Navigate back to quiz
    navigate('/quiz', { replace: true });
  };
  
  // Handle creating a shareable link
  const handleShare = async () => {
    try {
      if (!analysis || !analysis.scores) return;
      
      const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');
      
      // Get the current origin
      const origin = window.location.origin;
      
      // Create the shared analysis on the server
      const response = await apiService.createSharedAnalysis({
        form_data: formData
      });
      
      // Generate the full URL for sharing
      const fullShareUrl = `${origin}/results/share/${response.share_id}`;
      setShareUrl(fullShareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(fullShareUrl);
      
      // Show notification
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 3000);
    } catch (error) {
      console.error('Error creating shared link:', error);
      setError('There was an error creating a shareable link. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading your analysis...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-8" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/quiz')}
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-3 text-center">
        {isSharedView ? 'Shared' : 'Your'} Free Model Strategy Analysis
      </h1>
      
      <p className="text-center text-gray-700 mb-8">
        AI-powered analysis based on the DEEP framework:<br />
        <strong>D</strong>esirable, <strong>E</strong>ffective, <strong>E</strong>fficient, <strong>P</strong>olished
      </p>
      
      {/* Share Notification */}
      {showShareNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Share link copied to clipboard!</p>
        </div>
      )}
      
      {/* Summary Score */}
      {analysis?.scores?.overall && (
        <div className="overall-score-banner bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center p-6 rounded-lg mb-8">
          <div className="text-sm uppercase tracking-wider opacity-90">Overall DEEP Score</div>
          <div className="text-5xl font-bold mt-1">
            {analysis.scores.overall.toFixed(1)}/10
          </div>
        </div>
      )}
      
      {/* Tab Navigation - Only show if not shared view */}
      {!isSharedView && (
        <div className="tab-navigation mb-8">
          <div className="flex border-b">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'analysis'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('analysis')}
            >
              Analysis Report
            </button>
            
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('chat')}
            >
              Strategy Assistant
            </button>
          </div>
        </div>
      )}
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Analysis Report */}
        {(activeTab === 'analysis' || isSharedView) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnalysisReport 
                analysis={analysis} 
                recommendations={recommendations}
              />
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Actions - Only show for non-shared view */}
              {!isSharedView && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleRestartQuiz}
                      className="w-full py-2 px-4 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Restart Assessment
                    </button>
                    
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 px-4 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                      </svg>
                      Print Analysis
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="w-full py-2 px-4 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share Analysis
                    </button>
                    
                    <button
                      onClick={() => handleTabChange('chat')}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      Ask Follow-up Questions
                    </button>
                  </div>
                </div>
              )}
              
              {/* Implementation Timeline */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Implementation Timeline</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 pb-4">
                    <div className="font-medium text-blue-600">Immediate</div>
                    <p className="text-gray-700 text-sm mt-1">
                      Focus on quick wins and critical improvements
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4 pb-4">
                    <div className="font-medium text-yellow-600">Short-term (1-3 months)</div>
                    <p className="text-gray-700 text-sm mt-1">
                      Implement core feature improvements and gather feedback
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="font-medium text-green-600">Long-term (3+ months)</div>
                    <p className="text-gray-700 text-sm mt-1">
                      Refine approach based on data and expand capabilities
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  See the Analysis Report for detailed implementation steps for each phase.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat Assistant - Only show for non-shared view */}
        {activeTab === 'chat' && !isSharedView && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChatInterface analysisContext={analysis} />
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Strategy Overview</h3>
                
                {/* DEEP Radar Chart */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">DEEP Framework Scores</h4>
                  <RadarChart scores={analysis?.scores} width={300} height={300} />
                </div>
                
                {/* Strategy Strengths */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Key Strengths</h4>
                  {analysis?.strengths && analysis.strengths.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {analysis.strengths.slice(0, 3).map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No strengths identified.</p>
                  )}
                </div>
                
                {/* Top Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Top Recommendations</h4>
                  {recommendations && recommendations.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {recommendations
                        .filter(rec => rec.priority === 1)
                        .slice(0, 3)
                        .map((rec, index) => (
                          <li key={index}>{rec.text}</li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No recommendations available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage; 