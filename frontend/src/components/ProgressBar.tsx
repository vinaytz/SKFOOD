import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center space-x-4 mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              i < currentStep 
                ? 'bg-orange-500 text-white' 
                : i === currentStep 
                ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-500' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < currentStep ? 'bg-orange-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-sm text-gray-600 font-medium">
        Step {currentStep + 1} of {totalSteps} — {labels[currentStep]}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
        <div 
          className="bg-orange-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};