import React, { useState } from 'react';
import { X, Gift, Percent, TrendingUp, Zap } from 'lucide-react';
import { Button } from './Button';

interface PromoBannerProps {
  title: string;
  description: string;
  code?: string;
  type?: 'discount' | 'gift' | 'cashback' | 'special';
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  description,
  code,
  type = 'discount',
  action,
  dismissible = true,
  className = ''
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const typeConfig = {
    discount: {
      icon: Percent,
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
      border: 'border-orange-200'
    },
    gift: {
      icon: Gift,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
      border: 'border-purple-200'
    },
    cashback: {
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-gradient-to-r from-green-50 to-green-100',
      border: 'border-green-200'
    },
    special: {
      icon: Zap,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
      border: 'border-blue-200'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`relative rounded-2xl border-2 overflow-hidden ${config.border} ${config.bg} ${className}`}>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4 text-primary-600" />
        </button>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-xl font-bold text-primary-900 mb-1">{title}</h3>
            <p className="text-primary-700 mb-3">{description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              {code && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-primary-300 rounded-lg">
                  <span className="text-xs text-primary-600 font-medium">Code:</span>
                  <span className="text-sm font-bold text-primary-900">{code}</span>
                </div>
              )}

              {action && (
                <Button size="sm" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
    </div>
  );
};

interface PromoCarouselProps {
  promos: Array<Omit<PromoBannerProps, 'dismissible'>>;
  className?: string;
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ promos, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    if (promos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promos.length]);

  if (promos.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden">
        {promos.map((promo, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 absolute inset-0 translate-x-full'
            }`}
          >
            <PromoBanner {...promo} dismissible={false} />
          </div>
        ))}
      </div>

      {promos.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-primary-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
