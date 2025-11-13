import React from 'react';
import { Video as LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'orange' | 'blue' | 'green' | 'purple' | 'red';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  colorScheme = 'orange',
  className = ''
}) => {
  const colorClasses = {
    orange: {
      bg: 'from-orange-50 to-white',
      icon: 'bg-orange-100 text-orange-600',
      text: 'text-orange-600'
    },
    blue: {
      bg: 'from-blue-50 to-white',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600'
    },
    green: {
      bg: 'from-green-50 to-white',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600'
    },
    purple: {
      bg: 'from-purple-50 to-white',
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600'
    },
    red: {
      bg: 'from-red-50 to-white',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`p-6 bg-gradient-to-br ${colors.bg} hover:shadow-md transition-all duration-250 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-primary-900 mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
