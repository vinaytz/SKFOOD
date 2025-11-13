import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  selected = false,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-xl border border-primary-200/80 shadow-sm transition-all duration-250 ease-smooth';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-primary-300 cursor-pointer active:scale-[0.99]' : '';
  const selectedClasses = selected ? 'ring-2 ring-primary-900 ring-offset-2 border-primary-900 shadow-md' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${selectedClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};