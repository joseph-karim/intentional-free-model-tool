import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

function DesirabilityForm({ onSubmit, initialData = {} }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  const [userLevels, setUserLevels] = useState({
    beginner: initialData.beginner_challenges || [{ challenge: '', magnitude: 3 }],
    intermediate: initialData.intermediate_challenges || [{ challenge: '', magnitude: 3 }],
    advanced: initialData.advanced_challenges || [{ challenge: '', magnitude: 3 }]
  });

  const addChallenge = (level) => {
    setUserLevels({
      ...userLevels,
      [level]: [...userLevels[level], { challenge: '', magnitude: 3 }]
    });
  };

  const removeChallenge = (level, index) => {
    if (userLevels[level].length > 1) {
      const newChallenges = [...userLevels[level]];
      newChallenges.splice(index, 1);
      setUserLevels({
        ...userLevels,
        [level]: newChallenges
      });
    }
  };

  const updateChallenge = (level, index, field, value) => {
    const newChallenges = [...userLevels[level]];
    newChallenges[index] = {
      ...newChallenges[index],
      [field]: value
    };
    
    setUserLevels({
      ...userLevels,
      [level]: newChallenges
    });
  };

  const processFormData = (data) => {
    // Format the challenges for each level
    const formattedData = {
      ...data,
      key_challenges: {
        beginner: userLevels.beginner.filter(c => c.challenge.trim() !== ''),
        intermediate: userLevels.intermediate.filter(c => c.challenge.trim() !== ''),
        advanced: userLevels.advanced.filter(c => c.challenge.trim() !== '')
      }
    };
    
    onSubmit(formattedData);
  };

  // Example data to show in the UI
  const example = {
    product_description: "Event ticketing platform that helps creators host events and sell tickets.",
    user_endgame: "Hosting sold-out events with happy attendees.",
    beginner_challenges: [
      { challenge: "Getting the event set up.", magnitude: 5 },
      { challenge: "Planning the event.", magnitude: 4 },
      { challenge: "Selling the tickets.", magnitude: 4 },
      { challenge: "Designing an image for the event page.", magnitude: 1 },
      { challenge: "Sharing the event page with people.", magnitude: 3 }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Phase 1: Desirability - User Outcome Mapping</h2>
      
      <form onSubmit={handleSubmit(processFormData)}>
        {/* Product Context Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Product Context</h3>
          
          <div className="mb-4">
            <label className="form-label">
              Product Description
              <span className="text-sm text-gray-500 ml-2">
                (Detailed description of your product and problem it solves)
              </span>
            </label>
            <textarea
              {...register('product_description', { required: 'Product description is required' })}
              className="form-input h-28"
              placeholder="e.g. Event ticketing platform that helps creators host events and sell tickets."
            />
            {errors.product_description && (
              <p className="text-red-500 text-sm mt-1">{errors.product_description.message}</p>
            )}
            <div className="mt-1">
              <button
                type="button"
                className="text-indigo-600 text-sm"
                onClick={() => document.getElementById('example-product').classList.toggle('hidden')}
              >
                See example
              </button>
              <div id="example-product" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Example:</strong> {example.product_description}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="form-label">
              User Endgame
              <span className="text-sm text-gray-500 ml-2">
                (Ultimate success state for your users)
              </span>
            </label>
            <textarea
              {...register('user_endgame', { required: 'User endgame is required' })}
              className="form-input h-20"
              placeholder="e.g. Hosting sold-out events with happy attendees."
            />
            {errors.user_endgame && (
              <p className="text-red-500 text-sm mt-1">{errors.user_endgame.message}</p>
            )}
            <div className="mt-1">
              <button
                type="button"
                className="text-indigo-600 text-sm"
                onClick={() => document.getElementById('example-endgame').classList.toggle('hidden')}
              >
                See example
              </button>
              <div id="example-endgame" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Example:</strong> {example.user_endgame}
              </div>
            </div>
          </div>
        </div>

        {/* User Levels Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">User Levels</h3>
          
          {/* Beginner Level */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="form-label">Beginner User Description</label>
              <textarea
                {...register('beginner_stage', { required: 'Beginner description is required' })}
                className="form-input h-20"
                placeholder="Describe your beginner-level users and their needs"
              />
              {errors.beginner_stage && (
                <p className="text-red-500 text-sm mt-1">{errors.beginner_stage.message}</p>
              )}
            </div>
            
            <div>
              <label className="form-label">
                Beginner Challenges
                <span className="text-sm text-gray-500 ml-2">(with magnitude 1-5)</span>
              </label>
              
              <div className="mt-1">
                <button
                  type="button"
                  className="text-indigo-600 text-sm"
                  onClick={() => document.getElementById('example-challenges').classList.toggle('hidden')}
                >
                  See example challenges
                </button>
                <div id="example-challenges" className="hidden mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Example challenges:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {example.beginner_challenges.map((c, i) => (
                      <li key={i}>{c.challenge} (Magnitude: {c.magnitude})</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {userLevels.beginner.map((challenge, index) => (
                <div key={`beginner-${index}`} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={challenge.challenge}
                    onChange={(e) => updateChallenge('beginner', index, 'challenge', e.target.value)}
                    className="form-input flex-grow"
                    placeholder="e.g. Getting the event set up"
                  />
                  <select
                    value={challenge.magnitude}
                    onChange={(e) => updateChallenge('beginner', index, 'magnitude', parseInt(e.target.value))}
                    className="form-input w-28"
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4</option>
                    <option value={5}>5 - High</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeChallenge('beginner', index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addChallenge('beginner')}
                className="mt-2 text-indigo-600 hover:text-indigo-800"
              >
                + Add Challenge
              </button>
            </div>
          </div>
          
          {/* Intermediate Level */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="form-label">Intermediate User Description</label>
              <textarea
                {...register('intermediate_stage', { required: 'Intermediate description is required' })}
                className="form-input h-20"
                placeholder="Describe your intermediate-level users and their needs"
              />
              {errors.intermediate_stage && (
                <p className="text-red-500 text-sm mt-1">{errors.intermediate_stage.message}</p>
              )}
            </div>
            
            <div>
              <label className="form-label">
                Intermediate Challenges
                <span className="text-sm text-gray-500 ml-2">(with magnitude 1-5)</span>
              </label>
              
              {userLevels.intermediate.map((challenge, index) => (
                <div key={`intermediate-${index}`} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={challenge.challenge}
                    onChange={(e) => updateChallenge('intermediate', index, 'challenge', e.target.value)}
                    className="form-input flex-grow"
                    placeholder="e.g. Marketing the tickets"
                  />
                  <select
                    value={challenge.magnitude}
                    onChange={(e) => updateChallenge('intermediate', index, 'magnitude', parseInt(e.target.value))}
                    className="form-input w-28"
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4</option>
                    <option value={5}>5 - High</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeChallenge('intermediate', index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addChallenge('intermediate')}
                className="mt-2 text-indigo-600 hover:text-indigo-800"
              >
                + Add Challenge
              </button>
            </div>
          </div>
          
          {/* Advanced Level */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="form-label">Advanced User Description</label>
              <textarea
                {...register('advanced_stage', { required: 'Advanced description is required' })}
                className="form-input h-20"
                placeholder="Describe your advanced-level users and their needs"
              />
              {errors.advanced_stage && (
                <p className="text-red-500 text-sm mt-1">{errors.advanced_stage.message}</p>
              )}
            </div>
            
            <div>
              <label className="form-label">
                Advanced Challenges
                <span className="text-sm text-gray-500 ml-2">(with magnitude 1-5)</span>
              </label>
              
              {userLevels.advanced.map((challenge, index) => (
                <div key={`advanced-${index}`} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={challenge.challenge}
                    onChange={(e) => updateChallenge('advanced', index, 'challenge', e.target.value)}
                    className="form-input flex-grow"
                    placeholder="e.g. Integration with other platforms"
                  />
                  <select
                    value={challenge.magnitude}
                    onChange={(e) => updateChallenge('advanced', index, 'magnitude', parseInt(e.target.value))}
                    className="form-input w-28"
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4</option>
                    <option value={5}>5 - High</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeChallenge('advanced', index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addChallenge('advanced')}
                className="mt-2 text-indigo-600 hover:text-indigo-800"
              >
                + Add Challenge
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Save & Continue to Effectiveness
          </button>
        </div>
      </form>
    </div>
  );
}

export default DesirabilityForm; 