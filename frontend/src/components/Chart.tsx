import React from 'react';
import { Card } from './Card';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'bar' | 'line';
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  type = 'bar',
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-primary-900 mb-6">{title}</h3>}

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary-900">{item.label}</span>
              <span className="font-bold text-primary-900">{item.value}</span>
            </div>
            <div className="w-full h-3 bg-primary-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || colors[index % colors.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  className = ''
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  let cumulativePercentage = 0;

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-primary-900 mb-6">{title}</h3>}

      <div className="flex items-center justify-center mb-6">
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = (cumulativePercentage / 100) * 360 - 90;
            const endAngle = startAngle + angle;

            const startX = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M 100 100`,
              `L ${startX} ${startY}`,
              `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');

            const result = (
              <path
                key={item.label}
                d={pathData}
                fill={item.color || colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );

            cumulativePercentage += percentage;
            return result;
          })}
        </svg>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-primary-700">{item.label}</span>
            </div>
            <div className="text-sm font-semibold text-primary-900">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
