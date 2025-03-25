import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * ModelSelector - Radio button group with model descriptions
 * 
 * This component allows users to select a free model type,
 * which is a key part of the Efficiency dimension in the DEEP framework.
 */
const ModelSelector = () => {
  const { formData, updateFormData } = useFormContext();
  const modelType = formData.modelType || {};
  const [pricingStrategy, setPricingStrategy] = useState(modelType.pricingStrategy || '');

  const handleModelChange = (modelId) => {
    updateFormData({
      ...formData,
      modelType: {
        ...modelType,
        selectedModel: modelId
      }
    });
  };

  const handleReasonChange = (e) => {
    updateFormData({
      ...formData,
      modelType: {
        ...modelType,
        alignmentReason: e.target.value
      }
    });
  };
  
  const handlePricingStrategyChange = (e) => {
    const newPricingStrategy = e.target.value;
    setPricingStrategy(newPricingStrategy);
    updateFormData({
      ...formData,
      modelType: {
        ...modelType,
        pricingStrategy: newPricingStrategy
      }
    });
  };

  // Free model types with descriptions
  const modelTypes = [
    {
      id: 'freemium',
      name: 'Freemium',
      description: 'Offer a feature-limited free version alongside premium paid tiers',
      examples: 'Slack, Dropbox, Spotify',
      bestFor: 'Products with clear feature tiers and high user acquisition costs'
    },
    {
      id: 'free-trial',
      name: 'Free Trial',
      description: 'Provide full access for a limited time period',
      examples: 'Adobe Creative Cloud, Netflix, Microsoft 365',
      bestFor: 'Products with high value that needs to be experienced'
    },
    {
      id: 'usage-based',
      name: 'Usage-Based',
      description: 'Free up to certain usage limits, then pay as you go',
      examples: 'AWS, Twilio, OpenAI',
      bestFor: 'Services with variable usage patterns and clear value metrics'
    },
    {
      id: 'open-core',
      name: 'Open Core',
      description: 'Core functionality is free/open-source with paid add-ons or support',
      examples: 'MongoDB, GitLab, Elastic',
      bestFor: 'Developer tools and infrastructure software'
    },
    {
      id: 'community',
      name: 'Community Edition',
      description: 'Free version for individuals or small teams, paid for enterprises',
      examples: 'JetBrains, Docker, Unity',
      bestFor: 'Tools used by both individuals and large organizations'
    }
  ];

  return (
    <div className="model-selector-container">
      <h2 className="text-2xl font-bold mb-4">Select Your Free Model Type</h2>
      
      <p className="text-gray-700 mb-6">
        Choose the free model type that best aligns with your business goals and user needs.
        This will help determine the most efficient approach for your product.
      </p>
      
      <div className="space-y-4">
        {modelTypes.map((model) => (
          <div 
            key={model.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              modelType.selectedModel === model.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleModelChange(model.id)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={model.id}
                name="modelType"
                value={model.id}
                checked={modelType.selectedModel === model.id}
                onChange={() => handleModelChange(model.id)}
                className="mt-1 mr-3"
              />
              <div>
                <label htmlFor={model.id} className="font-medium text-lg cursor-pointer">
                  {model.name}
                </label>
                <p className="text-gray-700 mt-1">{model.description}</p>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Examples: </span>
                    <span className="text-gray-600">{model.examples}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Best for: </span>
                    <span className="text-gray-600">{model.bestFor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!modelType.selectedModel && (
        <div className="mt-4 text-amber-600">
          Please select a free model type to continue.
        </div>
      )}

      {modelType.selectedModel && (
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Why did you choose this model?
            </label>
            <textarea
              value={modelType.alignmentReason || ''}
              onChange={handleReasonChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Explain why this model type aligns with your business goals and user needs..."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Pricing Strategy
            </label>
            <textarea
              value={pricingStrategy}
              onChange={handlePricingStrategyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe your pricing strategy (e.g., price points, tier structure, discounts)..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Define how you'll price your paid offerings to balance accessibility and revenue generation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector; 