import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : 'animate-pulse-subtle';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-primary-200 p-6 space-y-4">
      <Skeleton variant="rectangular" height="200px" />
      <Skeleton variant="text" width="60%" height="1.5rem" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-2">
        <Skeleton variant="text" width="100px" />
        <Skeleton variant="text" width="100px" />
      </div>
    </div>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-primary-200 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width="48px" height="48px" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" height="1.25rem" />
              <Skeleton variant="text" width="70%" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton variant="text" width="300px" height="2.5rem" />
        <Skeleton variant="text" width="200px" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-primary-200 p-6 space-y-2">
            <Skeleton variant="text" width="50%" height="2rem" />
            <Skeleton variant="text" width="30%" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-primary-200 p-6 space-y-4">
            <Skeleton variant="text" width="50%" height="1.5rem" />
            <div className="space-y-3">
              <Skeleton variant="rectangular" height="48px" />
              <Skeleton variant="rectangular" height="48px" />
              <Skeleton variant="rectangular" height="48px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
