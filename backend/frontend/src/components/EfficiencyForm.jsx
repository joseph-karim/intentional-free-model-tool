import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Free model types
const MODEL_TYPES = [
  { 
    id: 'freemium', 
    name: 'Freemium', 
    description: 'Offer a limited version of your product for free with premium features requiring payment' 
  },
  { 
    id: 'free_trial', 
    name: 'Free Trial', 
    description: 'Full product available for a limited time period, then requires payment' 
  },
  { 
    id: 'usage_based', 
    name: 'Usage-Based',
    description: 'Free up to certain usage limits, then requires payment for additional usage'
  },
  { 
    id: 'community_edition', 
    name: 'Community Edition',
    description: 'Free basic version with limited support and features' 
  },
  { 
    id: 'open_core', 
    name: 'Open Core',
    description: 'Free core features with paid premium extensions or plugins' 
  },
  { 
    id: 'sandbox', 
    name: 'Sandbox',
    description: 'Free test environment with mock/limited data and features' 
  }
];

function EfficiencyForm({ onSubmit, initialData = {}, allSolutions = {} }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  
  const selectedModelType = watch('model_type') || initialData.model_type || '';
  
  // State for free features
  const [freeFeatures, setFreeFeatures] = useState(
    initialData.free_features || []
  );
  
  // State for future features
  const [futureFeatures, setFutureFeatures] = useState(
    initialData.future_features || []
  );
  
  // Filter solutions to get high-impact, low-cost options for beginners
  const getBeginnerSolutions = () => {
    const result = [];
    
    // Process all solutions
    Object.keys(allSolutions).forEach(challenge => {
      const solutionsByType = allSolutions[challenge];
      
      // For each type (product, content, resource)
      Object.keys(solutionsByType).forEach(type => {
        solutionsByType[type].forEach(solution => {
          // Focus on high impact solutions with manageable cost for beginners
          if (solution.impact === 'High' && (solution.cost === 'Low' || solution.cost === 'Medium')) {
            result.push({
              challenge,
              type,
              ...solution
            });
          }
        });
      });
    });
    
    return result;
  };
  
  // Add feature to free tier
  const addFreeFeature = () => {
    setFreeFeatures([...freeFeatures, '']);
  };
  
  // Remove feature from free tier
  const removeFreeFeature = (index) => {
    const updatedFeatures = [...freeFeatures];
    updatedFeatures.splice(index, 1);
    setFreeFeatures(updatedFeatures);
  };
  
  // Update free feature
  const updateFreeFeature = (index, value) => {
    const updatedFeatures = [...freeFeatures];
    updatedFeatures[index] = value;
    setFreeFeatures(updatedFeatures);
  };
  
  // Add future feature
  const addFutureFeature = () => {
    setFutureFeatures([...futureFeatures, '']);
  };
  
  // Remove future feature
  const removeFutureFeature = (index) => {
    const updatedFeatures = [...futureFeatures];
    updatedFeatures.splice(index, 1);
    setFutureFeatures(updatedFeatures);
  };
  
  // Update future feature
  const updateFutureFeature = (index, value) => {
    const updatedFeatures = [...futureFeatures];
    updatedFeatures[index] = value;
    setFutureFeatures(updatedFeatures);
  };
  
  // Process form submission
  const processFormData = (data) => {
    // Add the features to the data
    const formattedData = {
      ...data,
      free_features: freeFeatures.filter(f => f.trim() !== ''),
      future_features: futureFeatures.filter(f => f.trim() !== '')
    };
    
    onSubmit(formattedData);
  };
  
  // Example data from document
  const exampleData = {
    model_type: "freemium",
    free_features: [
      "Free event page builder",
      "Payment processing options",
      "Ticket inventory management",
      "Unlimited ticket types",
      "Staff accounts with roles & permissions"
    ],
    future_features: [
      "Event flyer generator",
      "Ticket tier pricing model"
    ]
  };
  
  // Get recommended solutions for beginners
  const recommendedSolutions = getBeginnerSolutions();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Phase 3: Efficiency - Free vs Paid Features</h2>
      
      <form onSubmit={handleSubmit(processFormData)}>
        {/* Model Selection Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Free Model Type Selection</h3>
          <p className="text-gray-600 mb-4">
            Choose the model type that best fits your product strategy and user journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODEL_TYPES.map(model => (
              <div key={model.id} className="relative">
                <input
                  type="radio"
                  id={`model-${model.id}`}
                  value={model.id}
                  className="hidden peer"
                  {...register('model_type', { required: 'Please select a model type' })}
                />
                <label
                  htmlFor={`model-${model.id}`}
                  className="block p-4 border rounded-lg cursor-pointer transition-colors
                    peer-checked:border-indigo-500 peer-checked:bg-indigo-50
                    hover:bg-gray-50"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{model.description}</div>
                </label>
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-indigo-500 peer-checked:bg-indigo-500"></div>
              </div>
            ))}
          </div>
          
          {errors.model_type && (
            <p className="text-red-500 text-sm mt-2">{errors.model_type.message}</p>
          )}
        </div>
        
        {/* Free Features Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Free Features</h3>
          <p className="text-gray-600 mb-4">
            Define what features will be included in your free tier.
            Focus on beginner-level solutions with high impact.
          </p>
          
          <div className="mt-1 mb-4">
            <button
              type="button"
              className="text-indigo-600 text-sm"
              onClick={() => document.getElementById('example-free-features').classList.toggle('hidden')}
            >
              See example free features
            </button>
            <div id="example-free-features" className="hidden mt-2 p-3 bg-gray-50 rounded text-sm">
              <strong>Example Freemium model features:</strong>
              <ul className="list-disc pl-5 mt-1">
                {exampleData.free_features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Free features inputs */}
          {freeFeatures.map((feature, index) => (
            <div key={`free-${index}`} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFreeFeature(index, e.target.value)}
                className="form-input flex-grow"
                placeholder="e.g. Free event page builder"
              />
              <button
                type="button"
                onClick={() => removeFreeFeature(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFreeFeature}
            className="text-indigo-600 hover:text-indigo-800"
          >
            + Add Free Feature
          </button>
          
          {/* Recommended solutions section */}
          {recommendedSolutions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recommended High-Impact Solutions:</h4>
              <div className="bg-gray-50 p-3 rounded">
                <ul className="space-y-1">
                  {recommendedSolutions.map((solution, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <button
                        type="button"
                        onClick={() => updateFreeFeature(freeFeatures.length - 1, solution.solution)}
                        className="text-indigo-600 hover:text-indigo-800 mr-2"
                        title="Add to free features"
                      >
                        +
                      </button>
                      <span>
                        <strong>{solution.solution}</strong> ({solution.type}) - 
                        For challenge: <em>{solution.challenge}</em>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Future Features Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Future Features (Optional)</h3>
          <p className="text-gray-600 mb-4">
            List features you plan to add to your free tier in future versions.
          </p>
          
          {/* Future features inputs */}
          {futureFeatures.map((feature, index) => (
            <div key={`future-${index}`} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFutureFeature(index, e.target.value)}
                className="form-input flex-grow"
                placeholder="e.g. Event flyer generator"
              />
              <button
                type="button"
                onClick={() => removeFutureFeature(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFutureFeature}
            className="text-indigo-600 hover:text-indigo-800"
          >
            + Add Future Feature
          </button>
        </div>
        
        {/* Model Specific Questions - these would depend on the selected model type */}
        {selectedModelType && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {MODEL_TYPES.find(m => m.id === selectedModelType)?.name} Details
            </h3>
            
            {selectedModelType === 'freemium' && (
              <div>
                <div className="mb-4">
                  <label className="form-label">What will trigger users to upgrade to a paid plan?</label>
                  <textarea
                    {...register('upgrade_trigger')}
                    className="form-input h-20"
                    placeholder="e.g. Need for advanced analytics, higher usage limits, premium features"
                  />
                </div>
              </div>
            )}
            
            {selectedModelType === 'free_trial' && (
              <div>
                <div className="mb-4">
                  <label className="form-label">How long will the free trial last?</label>
                  <select
                    {...register('trial_period')}
                    className="form-input"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="custom">Custom period</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label">Will you require credit card information upfront?</label>
                  <div className="flex gap-4 mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        className="form-radio"
                        {...register('requires_cc')}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="no"
                        className="form-radio"
                        {...register('requires_cc')}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {selectedModelType === 'usage_based' && (
              <div>
                <div className="mb-4">
                  <label className="form-label">What usage metrics will determine the limits?</label>
                  <textarea
                    {...register('usage_metrics')}
                    className="form-input h-20"
                    placeholder="e.g. Number of events, number of tickets, attendees per event"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between">
          <button type="button" className="btn-secondary">
            Back to Effectiveness
          </button>
          <button type="submit" className="btn-primary">
            Save & Continue to Polish
          </button>
        </div>
      </form>
    </div>
  );
}

export default EfficiencyForm; 