import React from 'react';
import { useForm } from 'react-hook-form';

function PolishForm({ onSubmit, initialData = {}, selectedChallenges = {}, freeFeatures = [] }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  
  // Example data from the document
  const exampleData = {
    desired_outcome: "Publish your event for free and start selling tickets.",
    top_challenges: [
      "Getting the event set up",
      "Planning the event",
      "Selling the tickets"
    ],
    free_features: [
      "Free event page builder",
      "Payment processing options",
      "Ticket inventory management",
      "Unlimited ticket types",
      "Staff accounts with roles & permissions"
    ],
    call_to_action: "Upgrade to Pro for advanced analytics and premium support."
  };
  
  // Get top challenges from previous sections
  const getTopChallenges = () => {
    let allChallenges = [];
    Object.keys(selectedChallenges).forEach(level => {
      allChallenges = [...allChallenges, ...selectedChallenges[level]];
    });
    return allChallenges;
  };
  
  const processFormData = (data) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Phase 4: Polish - Intentional Model Summary</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Complete your Intentional Free Model summary by defining the overall desired outcome,
          the top challenges being addressed, and a clear call-to-action for users.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(processFormData)}>
        {/* Desired Outcome Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Beginner Outcome</h3>
          <p className="text-gray-600 mb-2">
            Define a clear, specific outcome that beginner users can achieve with your free model.
          </p>
          
          <div className="mb-4">
            <textarea
              {...register('desired_outcome', { 
                required: 'Beginner outcome is required',
                minLength: { value: 10, message: 'Please provide a more detailed outcome' }
              })}
              className="form-input h-24"
              placeholder="e.g. Publish your event for free and start selling tickets."
            />
            {errors.desired_outcome && (
              <p className="text-red-500 text-sm mt-1">{errors.desired_outcome.message}</p>
            )}
            
            <div className="mt-1">
              <button
                type="button"
                className="text-indigo-600 text-sm"
                onClick={() => document.getElementById('example-outcome').classList.toggle('hidden')}
              >
                See example
              </button>
              <div id="example-outcome" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Example:</strong> {exampleData.desired_outcome}
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Challenges Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Top Challenges Addressed</h3>
          <p className="text-gray-600 mb-2">
            Select the top 3 challenges your free model addresses.
          </p>
          
          <div className="mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Selected Challenges:</h4>
              
              {getTopChallenges().length > 0 ? (
                <div className="space-y-2">
                  {getTopChallenges().map((challenge, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`top-challenge-${index}`}
                        value={challenge}
                        className="mr-2 h-5 w-5 text-indigo-600"
                        {...register('top_challenges', { 
                          validate: value => !value || value.length <= 3 || 'Please select at most 3 top challenges' 
                        })}
                      />
                      <label htmlFor={`top-challenge-${index}`} className="text-gray-700">
                        {challenge}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No challenges selected in previous phases. Go back to Phase 2 to select challenges.
                </p>
              )}
            </div>
            
            {errors.top_challenges && (
              <p className="text-red-500 text-sm mt-1">{errors.top_challenges.message}</p>
            )}
            
            <div className="mt-1">
              <button
                type="button"
                className="text-indigo-600 text-sm"
                onClick={() => document.getElementById('example-challenges').classList.toggle('hidden')}
              >
                See example
              </button>
              <div id="example-challenges" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Example top challenges:</strong>
                <ul className="list-disc pl-5 mt-1">
                  {exampleData.top_challenges.map((challenge, i) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Free Features Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Solutions We're Giving Away</h3>
          <p className="text-gray-600 mb-2">
            Review the free features you've defined in the previous phase.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            {freeFeatures && freeFeatures.length > 0 ? (
              <ul className="list-disc pl-5">
                {freeFeatures.map((feature, i) => (
                  <li key={i} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                No free features defined. Go back to Phase 3 to define free features.
              </p>
            )}
          </div>
        </div>
        
        {/* Call-to-Action Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Call-to-Action</h3>
          <p className="text-gray-600 mb-2">
            Define a clear call-to-action that will prompt users to upgrade or take the next step.
          </p>
          
          <div className="mb-4">
            <textarea
              {...register('call_to_action', { 
                required: 'Call-to-action is required',
                minLength: { value: 10, message: 'Please provide a more detailed call-to-action' }
              })}
              className="form-input h-24"
              placeholder="e.g. Upgrade to Pro for advanced analytics and premium support."
            />
            {errors.call_to_action && (
              <p className="text-red-500 text-sm mt-1">{errors.call_to_action.message}</p>
            )}
            
            <div className="mt-1">
              <button
                type="button"
                className="text-indigo-600 text-sm"
                onClick={() => document.getElementById('example-cta').classList.toggle('hidden')}
              >
                See example
              </button>
              <div id="example-cta" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Example:</strong> {exampleData.call_to_action}
              </div>
            </div>
          </div>
        </div>
        
        {/* Free Model Canvas Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Free Model Canvas Preview</h3>
          <div className="border border-indigo-200 rounded-lg p-5 bg-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-indigo-700 mb-2">Desired Outcome:</h4>
                <p className="mb-4">{watch('desired_outcome') || '[Add your desired outcome]'}</p>
                
                <h4 className="font-bold text-indigo-700 mb-2">Top Challenges:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {watch('top_challenges') ? (
                    watch('top_challenges').map((challenge, i) => (
                      <li key={i}>{challenge}</li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">[Select top challenges]</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-indigo-700 mb-2">Free Features:</h4>
                <ul className="list-disc pl-5 mb-4">
                  {freeFeatures && freeFeatures.length > 0 ? (
                    freeFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))
                  ) : (
                    <li className="text-gray-500 italic">[Add free features in Phase 3]</li>
                  )}
                </ul>
                
                <h4 className="font-bold text-indigo-700 mb-2">Call-to-Action:</h4>
                <p>{watch('call_to_action') || '[Add your call-to-action]'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button type="button" className="btn-secondary">
            Back to Efficiency
          </button>
          <button type="submit" className="btn-primary">
            Complete Analysis
          </button>
        </div>
      </form>
    </div>
  );
}

export default PolishForm; 