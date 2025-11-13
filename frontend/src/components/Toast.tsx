import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

export const Toast: React.FC = () => {
  const { toast } = useOrder();

  if (!toast.show) return null;

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      classes: 'bg-white border-green-200/80 shadow-lg',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      classes: 'bg-white border-red-200/80 shadow-lg',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-600" />,
      classes: 'bg-white border-blue-200/80 shadow-lg',
    },
  };

  const currentConfig = config[toast.type];

  return (
    <div className="fixed bottom-16 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-slide-up">
      <div className={`${currentConfig.classes} border rounded-lg p-4 backdrop-blur-sm`}>
        <div className="flex items-center space-x-3">
          {currentConfig.icon}
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
        </div>  
      </div>
    </div>
  );
};