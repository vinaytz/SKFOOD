import React from 'react';
import { Check, Circle, Package, Truck, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';

interface OrderStatus {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'on-the-way' | 'delivered';
  timestamp?: Date;
}

interface OrderTrackerProps {
  currentStatus: OrderStatus['status'];
  estimatedTime?: string;
  className?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  currentStatus,
  estimatedTime,
  className = ''
}) => {
  const statuses = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'ready', label: 'Ready', icon: Check },
    { key: 'on-the-way', label: 'On the Way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const statusIndex = {
    'pending': 0,
    'confirmed': 0,
    'preparing': 1,
    'ready': 2,
    'on-the-way': 3,
    'delivered': 4
  };

  const currentIndex = statusIndex[currentStatus];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-primary-900">Order Status</h3>
        {estimatedTime && currentStatus !== 'delivered' && (
          <div className="text-sm">
            <span className="text-primary-600">ETA: </span>
            <span className="font-bold text-orange-600">{estimatedTime}</span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-200" style={{ top: '1rem', bottom: '1rem' }} />
        <div
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 transition-all duration-1000 ease-out"
          style={{
            top: '1rem',
            height: `${(currentIndex / (statuses.length - 1)) * (100 - 32 / statuses.length)}%`
          }}
        />

        <div className="space-y-8">
          {statuses.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = status.icon;

            return (
              <div key={status.key} className="relative flex items-start gap-4">
                <div className={`
                  relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                  ${isCompleted || isCurrent
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white border-2 border-primary-200 text-primary-400'
                  }
                  ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <h4 className={`font-semibold mb-1 transition-colors ${
                    isCompleted || isCurrent ? 'text-primary-900' : 'text-primary-500'
                  }`}>
                    {status.label}
                  </h4>
                  <p className="text-sm text-primary-600">
                    {isCompleted && 'Completed'}
                    {isCurrent && 'In Progress'}
                    {!isCompleted && !isCurrent && 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentStatus === 'delivered' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-50/50 border border-green-200 rounded-lg animate-fade-in">
          <p className="text-sm font-medium text-green-800 text-center">
            Order delivered successfully! Enjoy your meal!
          </p>
        </div>
      )}
    </Card>
  );
};
