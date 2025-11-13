import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className = ''
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const displayValue = hoverValue || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          className={`
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            transition-transform duration-150
          `}
        >
          <Star
            className={`${sizes[size]} ${
              star <= displayValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-primary-300'
            }`}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-2 text-sm font-medium text-primary-700">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

interface ReviewCardProps {
  author: string;
  rating: number;
  comment: string;
  date: Date;
  avatar?: string;
  images?: string[];
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  rating,
  comment,
  date,
  avatar,
  images
}) => {
  return (
    <div className="p-6 bg-white border border-primary-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
          {avatar || author.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-primary-900">{author}</h4>
            <span className="text-sm text-primary-500">
              {date.toLocaleDateString()}
            </span>
          </div>

          <Rating value={rating} readonly size="sm" className="mb-3" />

          <p className="text-primary-700 leading-relaxed mb-3">{comment}</p>

          {images && images.length > 0 && (
            <div className="flex gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
