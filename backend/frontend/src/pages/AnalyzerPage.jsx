import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DesirabilityForm from '../components/DesirabilityForm';
import EffectivenessForm from '../components/EffectivenessForm';
import EfficiencyForm from '../components/EfficiencyForm';
import PolishForm from '../components/PolishForm';

const PHASES = {
  DESIRABILITY: 'desirability',
  EFFECTIVENESS: 'effectiveness',
  EFFICIENCY: 'efficiency',
  POLISH: 'polish',
  ANALYSIS: 'analysis'
};

function AnalyzerPage() {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(PHASES.DESIRABILITY);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisTaskId, setAnalysisTaskId] = useState(null);
  
  // Track the completion status of each phase
  const [phasesCompleted, setPhasesCompleted] = useState({
    [PHASES.DESIRABILITY]: false,
    [PHASES.EFFECTIVENESS]: false,
    [PHASES.EFFICIENCY]: false,
    [PHASES.POLISH]: false
  });
  
  // Handle form submission for each phase
  const handleDesirabilitySubmit = (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setPhasesCompleted({ ...phasesCompleted, [PHASES.DESIRABILITY]: true });
    setCurrentPhase(PHASES.EFFECTIVENESS);
  };
  
  const handleEffectivenessSubmit = (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setPhasesCompleted({ ...phasesCompleted, [PHASES.EFFECTIVENESS]: true });
    setCurrentPhase(PHASES.EFFICIENCY);
  };
  
  const handleEfficiencySubmit = (data) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setPhasesCompleted({ ...phasesCompleted, [PHASES.EFFICIENCY]: true });
    setCurrentPhase(PHASES.POLISH);
  };
  
  const handlePolishSubmit = async (data) => {
    setIsSubmitting(true);
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setPhasesCompleted({ ...phasesCompleted, [PHASES.POLISH]: true });
    
    try {
      // Format the data for API submission
      const submissionData = formatDataForApi(updatedFormData);
      
      // Send the submission to the API
      const response = await axios.post('/api/v2/analyze', submissionData);
      const { task_id } = response.data;
      
      // Store the task ID for polling
      setAnalysisTaskId(task_id);
      setCurrentPhase(PHASES.ANALYSIS);
      
      // Begin polling for the analysis result
      pollAnalysisResult(task_id);
    } catch (error) {
      console.error('Error submitting analysis:', error);
      alert('An error occurred while submitting your analysis. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Format the data for API submission
  const formatDataForApi = (data) => {
    // Here we transform the form data into the structure expected by the API
    // This should match the QuizSubmission schema in the backend
    return {
      context: {
        product_description: data.product_description || '',
        target_audience: data.target_audience || '',
        business_goals: data.business_goals || ''
      },
      user_journey: {
        user_endgame: data.user_endgame || '',
        beginner_stage: data.beginner_stage || '',
        intermediate_stage: data.intermediate_stage || '',
        advanced_stage: data.advanced_stage || '',
        key_challenges: data.key_challenges || {}
      },
      current_model: data.current_model ? {
        current_model: data.current_model,
        current_metrics: data.current_metrics || {}
      } : null,
      deep_inputs: {
        desirable: {
          value_proposition: data.value_proposition || '',
          user_needs: data.user_needs || data.user_endgame || '',
          competitive_differentiation: data.competitive_differentiation || '',
          additional_notes: data.desirable_notes || ''
        },
        effective: {
          core_problems: data.core_problems || '',
          success_metrics: data.success_metrics || '',
          friction_points: data.friction_points || '',
          additional_notes: data.effective_notes || ''
        },
        efficient: {
          acquisition_cost: data.acquisition_cost || '',
          conversion_strategy: data.conversion_strategy || '',
          resource_allocation: data.resource_allocation || '',
          additional_notes: data.efficient_notes || ''
        },
        polished: {
          user_experience: data.user_experience || '',
          onboarding_process: data.onboarding_process || '',
          feedback_mechanisms: data.feedback_mechanisms || '',
          additional_notes: data.polished_notes || ''
        }
      }
    };
  };
  
  // Poll for analysis results
  const pollAnalysisResult = async (taskId) => {
    try {
      const response = await axios.get(`/api/v2/analyze/${taskId}/status`);
      const { status, result_id } = response.data;
      
      if (status === 'completed' && result_id) {
        // Analysis is complete, navigate to the results page
        navigate(`/results/${result_id}`);
      } else if (status === 'processing') {
        // Still processing, poll again after a delay
        setTimeout(() => pollAnalysisResult(taskId), 3000);
      } else {
        // Error or other status
        setIsSubmitting(false);
        alert('An error occurred during analysis. Please try again.');
      }
    } catch (error) {
      console.error('Error polling analysis status:', error);
      setIsSubmitting(false);
      alert('An error occurred while checking analysis status. Please try again.');
    }
  };
  
  // Handle phase navigation
  const goToPhase = (phase) => {
    // Only allow navigation to completed phases or the current phase
    if (phasesCompleted[phase] || 
        phase === currentPhase || 
        (phase === PHASES.EFFECTIVENESS && phasesCompleted[PHASES.DESIRABILITY]) ||
        (phase === PHASES.EFFICIENCY && phasesCompleted[PHASES.EFFECTIVENESS]) ||
        (phase === PHASES.POLISH && phasesCompleted[PHASES.EFFICIENCY])) {
      setCurrentPhase(phase);
    }
  };
  
  // Render the progress indicators
  const renderProgressIndicators = () => {
    return (
      <div className="flex justify-between mb-8">
        {Object.values(PHASES).slice(0, 4).map((phase, index) => (
          <div 
            key={phase}
            className={`flex flex-col items-center cursor-pointer ${
              currentPhase === phase ? 'opacity-100' : 'opacity-60'
            }`}
            onClick={() => goToPhase(phase)}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-white mb-2
              ${phasesCompleted[phase] ? 'bg-green-500' : currentPhase === phase ? 'bg-indigo-600' : 'bg-gray-400'}
            `}>
              {index + 1}
            </div>
            <div className="text-sm font-medium capitalize">{phase}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Intentional Free Model Analyzer</h1>
      
      {/* Progress indicators */}
      {currentPhase !== PHASES.ANALYSIS && renderProgressIndicators()}
      
      {/* Phase content */}
      <div>
        {currentPhase === PHASES.DESIRABILITY && (
          <DesirabilityForm 
            onSubmit={handleDesirabilitySubmit} 
            initialData={formData} 
          />
        )}
        
        {currentPhase === PHASES.EFFECTIVENESS && (
          <EffectivenessForm 
            onSubmit={handleEffectivenessSubmit} 
            initialData={formData}
            challenges={formData.key_challenges || {}} 
          />
        )}
        
        {currentPhase === PHASES.EFFICIENCY && (
          <EfficiencyForm 
            onSubmit={handleEfficiencySubmit} 
            initialData={formData}
            allSolutions={formData.solutions || {}} 
          />
        )}
        
        {currentPhase === PHASES.POLISH && (
          <PolishForm 
            onSubmit={handlePolishSubmit} 
            initialData={formData}
            selectedChallenges={formData.selected_challenges || {}}
            freeFeatures={formData.free_features || []} 
          />
        )}
        
        {currentPhase === PHASES.ANALYSIS && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Analyzing Your Free Model Strategy</h2>
            <p className="text-gray-600 mb-6">
              Our AI is currently analyzing your inputs to provide personalized recommendations.
              This may take a few moments.
            </p>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-6 text-indigo-600 font-medium">
              Please wait while we generate your comprehensive report...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyzerPage; 