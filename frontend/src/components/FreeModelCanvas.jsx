import React from 'react';
import { useFormContext } from '../context/FormContext';

/**
 * FreeModelCanvas - A comprehensive summary of the user's free model strategy
 * 
 * This component displays a canvas-style overview of all the key components
 * of the user's free model strategy, organized by the DEEP framework dimensions.
 */
const FreeModelCanvas = () => {
  const { formData } = useFormContext();
  
  // Extract data from formData for each section
  const endgame = formData.endgame || {};
  const challenges = formData.challenges || [];
  const solutions = formData.solutions || [];
  const impactCost = formData.impactCost || { highImpact: [], mediumImpact: [], lowImpact: [] };
  const modelType = formData.modelType || {};
  const features = formData.features || { free: [], paid: [] };
  
  // Helper to render a canvas section
  const CanvasSection = ({ title, children, bgColor = 'bg-blue-50' }) => (
    <div className={`rounded-lg ${bgColor} p-4 h-full`}>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      {children}
    </div>
  );
  
  // Helper to render a list of items
  const ItemList = ({ items, emptyMessage = "No items added" }) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500 italic text-sm">{emptyMessage}</p>;
    }
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm">
            {typeof item === 'string' ? item : item.text || item.name || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="free-model-canvas">
      <h2 className="text-2xl font-bold mb-6 text-center">Free Model Strategy Canvas</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Desirable */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
            <h2 className="text-xl font-bold">Desirable</h2>
            <p className="text-sm opacity-90">The value proposition for users</p>
          </div>
          
          <CanvasSection title="Endgame & Goals" bgColor="bg-blue-50">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">End Game:</h4>
                <p className="text-sm">{endgame.endgame || "Not defined"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Primary Goal:</h4>
                <p className="text-sm">{endgame.primaryGoal || "Not defined"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Secondary Goal:</h4>
                <p className="text-sm">{endgame.secondaryGoal || "Not defined"}</p>
              </div>
            </div>
          </CanvasSection>
          
          <CanvasSection title="User Challenges" bgColor="bg-blue-50">
            <ItemList 
              items={challenges.map(c => `${c.description} (Level: ${c.userLevel || "Any"}, Magnitude: ${c.magnitude || "N/A"})`)} 
              emptyMessage="No user challenges identified" 
            />
          </CanvasSection>
        </div>
        
        {/* Column 2: Effective & Efficient */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg">
            <h2 className="text-xl font-bold">Effective & Efficient</h2>
            <p className="text-sm opacity-90">Solutions that work & scale</p>
          </div>
          
          <CanvasSection title="Solutions & Approaches" bgColor="bg-green-50">
            <ItemList 
              items={solutions} 
              emptyMessage="No solutions defined" 
            />
          </CanvasSection>
          
          <CanvasSection title="High-Impact Solutions" bgColor="bg-green-50">
            <ItemList 
              items={impactCost.highImpact} 
              emptyMessage="No high-impact solutions prioritized" 
            />
          </CanvasSection>
          
          <CanvasSection title="Free Model Type" bgColor="bg-green-50">
            <div className="space-y-2">
              <div>
                <h4 className="font-medium text-sm">Selected Model:</h4>
                <p className="text-sm">{modelType.selectedModel || "Not selected"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Alignment Reason:</h4>
                <p className="text-sm">{modelType.alignmentReason || "Not provided"}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Pricing Strategy:</h4>
                <p className="text-sm">{modelType.pricingStrategy || "Not defined"}</p>
              </div>
            </div>
          </CanvasSection>
        </div>
        
        {/* Column 3: Polished */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg">
            <h2 className="text-xl font-bold">Polished</h2>
            <p className="text-sm opacity-90">Features & implementation</p>
          </div>
          
          <CanvasSection title="Free Features" bgColor="bg-purple-50">
            <ItemList 
              items={features.free} 
              emptyMessage="No free features defined" 
            />
          </CanvasSection>
          
          <CanvasSection title="Paid Features" bgColor="bg-purple-50">
            <ItemList 
              items={features.paid} 
              emptyMessage="No paid features defined" 
            />
          </CanvasSection>
          
          <CanvasSection title="Implementation Notes" bgColor="bg-purple-50">
            <div className="text-sm">
              <p>The free model implementation should focus on delivering high-impact solutions while maintaining a clear upgrade path to paid features.</p>
              <p className="mt-2">See the full analysis for detailed implementation guidance.</p>
            </div>
          </CanvasSection>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-bold text-lg mb-2">Strategy Summary</h3>
        <p className="text-sm">
          This canvas summarizes your free model strategy based on the DEEP framework. 
          The strategy aims to provide a desirable solution for users by addressing their key challenges, 
          implements effective and efficient solutions prioritized by impact and cost, 
          and polishes the implementation with a clear distinction between free and paid features.
        </p>
      </div>
    </div>
  );
};

export default FreeModelCanvas; 