import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Shield, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useOrder } from '../contexts/OrderContext';

export const OrderSummary: React.FC = () => {
  const { currentOrder, setCurrentOrder } = useOrder();
  const navigate = useNavigate();

  const basePrice = 120;
  const extraRotiPrice = currentOrder.extraRoti * 5;
  const upgradesPrice = 
    (currentOrder.upgrades.specialPaneer ? 30 : 0) +
    (currentOrder.upgrades.extraRaita ? 15 : 0) +
    (currentOrder.upgrades.saladAddons ? 20 : 0);
  
  const perThaliTotal = basePrice + extraRotiPrice + upgradesPrice;
  const subtotal = perThaliTotal * currentOrder.quantity;
  const deliveryFee = subtotal >= 200 ? 0 : 20;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(5, currentOrder.quantity + change));
    setCurrentOrder({ ...currentOrder, quantity: newQuantity });
  };

  const getBaseText = () => {
    switch (currentOrder.baseOption) {
      case 'roti-only': return `Roti (${5 + currentOrder.extraRoti})`;
      case 'both': return `Roti (${3 + currentOrder.extraRoti}) + Rice`;
      case 'rice-only': return 'Rice Bowl';
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/meal-builder">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-primary-900">Order Summary</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Plate Preview */}
        {/* <Card className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-900 mb-2">Your Custom Thali</h2>
          <p className="text-sm text-primary-600">Freshly prepared with love</p>
        </Card> */}

        {/* Order Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-primary-900 mb-4">Your Selection</h3>
          
          <div className="space-y-3">
            {/* Sabjis */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-primary-900">Sabjis</span>
                <div className="text-sm text-primary-600">
                  {currentOrder.selectedSabjis.map(s => s.name).join(', ')}
                </div>
              </div>
              <span className="text-sm font-medium text-primary-900">₹{basePrice}</span>
            </div>

            {/* Base */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary-900">{getBaseText()}</span>
              {extraRotiPrice > 0 && (
                <span className="text-sm font-medium text-primary-900">+₹{extraRotiPrice}</span>
              )}
            </div>

            {/* Default Included */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm font-medium text-green-800 mb-1">Included Free</div>
              <div className="text-sm text-green-700">Fresh Raita • Garden Salad</div>
            </div>

            {/* Upgrades */}
            {(currentOrder.upgrades.specialPaneer || currentOrder.upgrades.extraRaita || currentOrder.upgrades.saladAddons) && (
              <>
                <div className="border-t border-primary-200 pt-3">
                  <span className="font-medium text-primary-900 block mb-2">Upgrades</span>
                  {currentOrder.upgrades.specialPaneer && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-700">Special Paneer</span>
                      <span className="font-medium">+₹30</span>
                    </div>
                  )}
                  {currentOrder.upgrades.extraRaita && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-700">Extra Raita</span>
                      <span className="font-medium">+₹15</span>
                    </div>
                  )}
                  {currentOrder.upgrades.saladAddons && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-700">Salad Add-ons</span>
                      <span className="font-medium">+₹20</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Quantity Selector */}
        <Card className="p-6">
          <h3 className="font-semibold text-primary-900 mb-4">Quantity</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-medium text-primary-900">How many thalis?</span>
              <p className="text-sm text-primary-600">Most students choose 1</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={currentOrder.quantity === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-medium text-xl px-4">{currentOrder.quantity}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={currentOrder.quantity === 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {currentOrder.quantity >= 3 && (
            <div className="mt-3 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800 font-medium">🎉 Bulk saving: 5% off total!</p>
            </div>
          )}
        </Card>

        {/* Price Breakdown */}
        <Card className="p-6">
          <h3 className="font-semibold text-primary-900 mb-4">Price Breakdown</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-primary-700">Per thali</span>
              <span className="font-medium">₹{perThaliTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Quantity × {currentOrder.quantity}</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {currentOrder.quantity >= 3 && (
              <div className="flex justify-between text-orange-600">
                <span>Bulk discount (5%)</span>
                <span>-₹{Math.round(subtotal * 0.05)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-primary-700">Tax (5%)</span>
              <span className="font-medium">₹{tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-700">Delivery fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>
            {deliveryFee === 0 && (
              <p className="text-xs text-green-600">Free delivery for this Orde</p>
            )}
            <div className="border-t border-primary-200 pt-2 flex justify-between">
              <span className="font-semibold text-lg text-primary-900">Total</span>
              <span className="font-bold text-xl text-orange-600">
                ₹{currentOrder.quantity >= 3 ? total - Math.round(subtotal * 0.05) : total}
              </span>
            </div>
          </div>
        </Card>
        
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          <Button 
            size="lg" 
            fullWidth 
            onClick={() => navigate('/checkout')}
            className="text-lg py-4"
          >
            Pay ₹{currentOrder.quantity >= 3 ? total - Math.round(subtotal * 0.05) : total} - Razorpay
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth 
            disabled
            className="opacity-50"
          >
            Pay Later (COD) - Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
};