import React from 'react';

interface StepCardProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  children, 
  className = '', 
  isActive = false, 
  isCompleted = false 
}) => {
  const baseClasses = '';
  const stateClasses = '';

  return (
    <div className={`${baseClasses} ${stateClasses} ${className}`}>
      {children}
    </div>
  );
};