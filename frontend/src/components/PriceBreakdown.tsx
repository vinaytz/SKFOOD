import React from 'react';
import { Card } from './Card';
import { Minus, Plus } from 'lucide-react';

interface PriceBreakdownProps {
  items: Array<{
    label: string;
    price: number;
    quantity?: number;
  }>;
  discount?: number;
  total: number;
  className?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  items,
  discount = 0,
  total,
  className = ''
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <Card className={`p-6 sticky top-24 ${className}`}>
      <h3 className="text-lg font-bold text-primary-900 mb-4">Price Breakdown</h3>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm animate-slide-in-right" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center gap-2">
              <span className="text-primary-700">{item.label}</span>
              {item.quantity && item.quantity > 1 && (
                <span className="text-primary-500">x{item.quantity}</span>
              )}
            </div>
            <span className="font-semibold text-primary-900">₹{item.price * (item.quantity || 1)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-200 pt-3 mb-3">
        <div className="flex items-center justify-between text-sm text-primary-600 mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600 mb-2">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-primary-600">
          <span>Taxes & Fees</span>
          <span>₹{Math.round(subtotal * 0.05)}</span>
        </div>
      </div>

      <div className="border-t-2 border-primary-900 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-900">Total</span>
          <span className="text-2xl font-bold text-orange-600">₹{total}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-green-50/50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800 font-medium">
          You're saving ₹{discount + Math.round(subtotal * 0.08)} on this order!
        </p>
      </div>
    </Card>
  );
};
