import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Solution types
const SOLUTION_TYPES = {
  PRODUCT: 'product',
  CONTENT: 'content',
  RESOURCE: 'resource'
};

// Impact and cost levels
const LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

function EffectivenessForm({ onSubmit, initialData = {}, challenges = {} }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  
  const [selectedChallenges, setSelectedChallenges] = useState(
    initialData.selected_challenges || {
      beginner: [],
      intermediate: [],
      advanced: []
    }
  );
  
  const [solutions, setSolutions] = useState(
    initialData.solutions || {}
  );
  
  // Example PCR test results from document
  const exampleSolutions = {
    "Getting the event set up": {
      product: [
        { solution: "Free event page builder", impact: "High", cost: "High" },
        { solution: "Payment processing options", impact: "High", cost: "High" },
        { solution: "Embedded checkout", impact: "High", cost: "High" },
        { solution: "Ticket inventory management", impact: "High", cost: "High" },
        { solution: "Unlimited ticket types", impact: "High", cost: "High" }
      ],
      content: [
        { solution: "What to include on your event page", impact: "Medium", cost: "Low" },
        { solution: "How to write event descriptions that convert", impact: "Medium", cost: "Low" },
        { solution: "Examples of event pages", impact: "Medium", cost: "Low" }
      ],
      resource: [
        { solution: "List of the best event page designers", impact: "Low", cost: "Low" },
        { solution: "1,000 top venues and who to contact", impact: "Medium", cost: "Low" },
        { solution: "Ticket tier pricing model", impact: "Medium", cost: "Low" }
      ]
    }
  };
  
  const toggleChallengeSelection = (level, challenge) => {
    if (selectedChallenges[level].includes(challenge)) {
      // Remove the challenge
      setSelectedChallenges({
        ...selectedChallenges,
        [level]: selectedChallenges[level].filter(c => c !== challenge)
      });
      
      // Remove solutions for this challenge
      const updatedSolutions = { ...solutions };
      delete updatedSolutions[challenge];
      setSolutions(updatedSolutions);
    } else {
      // Add the challenge
      setSelectedChallenges({
        ...selectedChallenges,
        [level]: [...selectedChallenges[level], challenge]
      });
      
      // Initialize solutions for this challenge
      if (!solutions[challenge]) {
        setSolutions({
          ...solutions,
          [challenge]: {
            product: [],
            content: [],
            resource: []
          }
        });
      }
    }
  };
  
  const addSolution = (challenge, type) => {
    setSolutions({
      ...solutions,
      [challenge]: {
        ...solutions[challenge],
        [type]: [
          ...solutions[challenge][type],
          { solution: '', impact: LEVELS.MEDIUM, cost: LEVELS.MEDIUM }
        ]
      }
    });
  };
  
  const removeSolution = (challenge, type, index) => {
    const updatedSolutions = { ...solutions };
    updatedSolutions[challenge][type].splice(index, 1);
    setSolutions(updatedSolutions);
  };
  
  const updateSolution = (challenge, type, index, field, value) => {
    const updatedSolutions = { ...solutions };
    updatedSolutions[challenge][type][index] = {
      ...updatedSolutions[challenge][type][index],
      [field]: value
    };
    setSolutions(updatedSolutions);
  };
  
  const processFormData = (data) => {
    // Format the data for submission
    const formattedData = {
      ...data,
      selected_challenges: selectedChallenges,
      solutions: solutions
    };
    
    onSubmit(formattedData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Phase 2: Effectiveness - Challenge Solutions</h2>
      
      <form onSubmit={handleSubmit(processFormData)}>
        {/* Challenge Selection Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Select Top Challenges to Solve</h3>
          <p className="text-gray-600 mb-4">
            Choose 3-5 high-priority challenges from each user level that your free model should address.
          </p>
          
          {/* Display challenges by level for selection */}
          {Object.keys(challenges).map(level => (
            <div key={level} className="mb-6">
              <h4 className="text-lg font-medium capitalize mb-2">{level} Level Challenges</h4>
              
              <div className="space-y-2">
                {challenges[level] && challenges[level].length > 0 ? (
                  challenges[level].map((challenge, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${level}-challenge-${index}`}
                        checked={selectedChallenges[level].includes(challenge.challenge)}
                        onChange={() => toggleChallengeSelection(level, challenge.challenge)}
                        className="mr-2 h-5 w-5 text-indigo-600"
                      />
                      <label 
                        htmlFor={`${level}-challenge-${index}`}
                        className="text-gray-700"
                      >
                        {challenge.challenge} (Magnitude: {challenge.magnitude})
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No challenges found for this level. Please go back to Phase 1 to add challenges.</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* PCR Test (Product/Content/Resource) Solutions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">PCR Test - Solutions for Each Challenge</h3>
          <p className="text-gray-600 mb-4">
            For each selected challenge, identify product, content, and resource solutions.
            Rate each solution's impact and implementation cost.
          </p>
          
          <div className="mt-1 mb-4">
            <button
              type="button"
              className="text-indigo-600 text-sm"
              onClick={() => document.getElementById('example-pcr').classList.toggle('hidden')}
            >
              See example PCR solutions
            </button>
            <div id="example-pcr" className="hidden mt-2 p-3 bg-gray-50 rounded text-sm">
              <strong>Example for "Getting the event set up":</strong>
              <div className="mt-2">
                <div className="mb-2">
                  <strong className="text-indigo-700">Product Solutions:</strong>
                  <ul className="list-disc pl-5">
                    {exampleSolutions["Getting the event set up"].product.map((sol, i) => (
                      <li key={i}>{sol.solution} (Impact: {sol.impact}, Cost: {sol.cost})</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <strong className="text-indigo-700">Content Solutions:</strong>
                  <ul className="list-disc pl-5">
                    {exampleSolutions["Getting the event set up"].content.map((sol, i) => (
                      <li key={i}>{sol.solution} (Impact: {sol.impact}, Cost: {sol.cost})</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-indigo-700">Resource Solutions:</strong>
                  <ul className="list-disc pl-5">
                    {exampleSolutions["Getting the event set up"].resource.map((sol, i) => (
                      <li key={i}>{sol.solution} (Impact: {sol.impact}, Cost: {sol.cost})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Solutions for each selected challenge */}
          {Object.keys(selectedChallenges).flatMap(level => 
            selectedChallenges[level].map(challenge => (
              <div key={challenge} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-lg font-medium mb-3">
                  Challenge: <span className="text-indigo-700">{challenge}</span>
                </h4>
                
                {/* Product Solutions */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Product Solutions</h5>
                    <button
                      type="button"
                      onClick={() => addSolution(challenge, SOLUTION_TYPES.PRODUCT)}
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      + Add Product Solution
                    </button>
                  </div>
                  
                  {solutions[challenge] && solutions[challenge].product && solutions[challenge].product.map((solution, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={solution.solution}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.PRODUCT, index, 'solution', e.target.value)}
                          className="form-input w-full"
                          placeholder="e.g. Free event page builder"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          value={solution.impact}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.PRODUCT, index, 'impact', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Impact</option>
                          <option value={LEVELS.MEDIUM}>Medium Impact</option>
                          <option value={LEVELS.HIGH}>High Impact</option>
                        </select>
                        
                        <select
                          value={solution.cost}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.PRODUCT, index, 'cost', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Cost</option>
                          <option value={LEVELS.MEDIUM}>Medium Cost</option>
                          <option value={LEVELS.HIGH}>High Cost</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => removeSolution(challenge, SOLUTION_TYPES.PRODUCT, index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!solutions[challenge] || !solutions[challenge].product || solutions[challenge].product.length === 0) && (
                    <p className="text-gray-500 italic text-sm">No product solutions added yet.</p>
                  )}
                </div>
                
                {/* Content Solutions */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Content Solutions</h5>
                    <button
                      type="button"
                      onClick={() => addSolution(challenge, SOLUTION_TYPES.CONTENT)}
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      + Add Content Solution
                    </button>
                  </div>
                  
                  {solutions[challenge] && solutions[challenge].content && solutions[challenge].content.map((solution, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={solution.solution}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.CONTENT, index, 'solution', e.target.value)}
                          className="form-input w-full"
                          placeholder="e.g. How to write event descriptions that convert"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          value={solution.impact}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.CONTENT, index, 'impact', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Impact</option>
                          <option value={LEVELS.MEDIUM}>Medium Impact</option>
                          <option value={LEVELS.HIGH}>High Impact</option>
                        </select>
                        
                        <select
                          value={solution.cost}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.CONTENT, index, 'cost', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Cost</option>
                          <option value={LEVELS.MEDIUM}>Medium Cost</option>
                          <option value={LEVELS.HIGH}>High Cost</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => removeSolution(challenge, SOLUTION_TYPES.CONTENT, index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!solutions[challenge] || !solutions[challenge].content || solutions[challenge].content.length === 0) && (
                    <p className="text-gray-500 italic text-sm">No content solutions added yet.</p>
                  )}
                </div>
                
                {/* Resource Solutions */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Resource Solutions</h5>
                    <button
                      type="button"
                      onClick={() => addSolution(challenge, SOLUTION_TYPES.RESOURCE)}
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      + Add Resource Solution
                    </button>
                  </div>
                  
                  {solutions[challenge] && solutions[challenge].resource && solutions[challenge].resource.map((solution, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={solution.solution}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.RESOURCE, index, 'solution', e.target.value)}
                          className="form-input w-full"
                          placeholder="e.g. Ticket tier pricing model"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <select
                          value={solution.impact}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.RESOURCE, index, 'impact', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Impact</option>
                          <option value={LEVELS.MEDIUM}>Medium Impact</option>
                          <option value={LEVELS.HIGH}>High Impact</option>
                        </select>
                        
                        <select
                          value={solution.cost}
                          onChange={(e) => updateSolution(challenge, SOLUTION_TYPES.RESOURCE, index, 'cost', e.target.value)}
                          className="form-input"
                        >
                          <option value={LEVELS.LOW}>Low Cost</option>
                          <option value={LEVELS.MEDIUM}>Medium Cost</option>
                          <option value={LEVELS.HIGH}>High Cost</option>
                        </select>
                        
                        <button
                          type="button"
                          onClick={() => removeSolution(challenge, SOLUTION_TYPES.RESOURCE, index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!solutions[challenge] || !solutions[challenge].resource || solutions[challenge].resource.length === 0) && (
                    <p className="text-gray-500 italic text-sm">No resource solutions added yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {Object.values(selectedChallenges).every(arr => arr.length === 0) && (
            <p className="text-gray-500 italic">Please select challenges above to add solutions.</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button type="button" className="btn-secondary">
            Back to Desirability
          </button>
          <button type="submit" className="btn-primary">
            Save & Continue to Efficiency
          </button>
        </div>
      </form>
    </div>
  );
}

export default EffectivenessForm; 