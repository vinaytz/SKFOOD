// src/pages/Payment.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useOrder } from '../contexts/OrderContext';
import { orderAPI } from '../utils/api';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Payment: React.FC = () => {
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress;

  const [processing, setProcessing] = useState(false);
  const [loadingRazorpay, setLoadingRazorpay] = useState(true);

  const { currentOrder, showToast, resetOrder } = useOrder();
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setLoadingRazorpay(false);
    script.onerror = () => {
      showToast('Failed to load payment gateway', 'error');
      setLoadingRazorpay(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if no address selected
  useEffect(() => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      navigate('/checkout');
    }
  }, [selectedAddress]);

  // Calculate pricing
  const basePrice = currentOrder.basePrice || 60;
  const specialSabjiPrice = currentOrder.selectedSabjis.some(s => s.isSpecial) ? 20 : 0;
  const extraRotiPrice = currentOrder.extraRoti * 10;
  const perThaliTotal = basePrice + specialSabjiPrice + extraRotiPrice;
  const subtotal = perThaliTotal * currentOrder.quantity;
  const discount = currentOrder.quantity >= 3 ? Math.round(subtotal * 0.05) : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const deliveryFee = 0;
  const total = subtotal - discount + tax + deliveryFee;

  // Map baseOption to string format for backend
  const getBaseOptionString = () => {
    switch (currentOrder.baseOption) {
      case 'roti-only':
        return '5 Roti';
      case 'both':
        return '3 Roti + Rice';
      case 'rice-only':
        return 'Rice Only';
      default:
        return '5 Roti';
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      navigate('/checkout');
      return;
    }

    if (!currentOrder.menuId || !currentOrder.mealType) {
      showToast('Invalid order data', 'error');
      navigate('/meal-builder');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create order on backend
      const orderData = {
        mealType: currentOrder.mealType,
        menuId: currentOrder.menuId,
        selectedSabjis: currentOrder.selectedSabjis,
        baseOption: getBaseOptionString(),
        extraRoti: currentOrder.extraRoti,
        quantity: currentOrder.quantity,
        deliveryAddress: {
          label: selectedAddress.label || 'Hostel',
          address: selectedAddress.address,
          lat: selectedAddress.coordinates?.lat,
          lng: selectedAddress.coordinates?.lng,
          phoneNumber: selectedAddress.phoneNumber,
          hostel: selectedAddress.hostel,
          room: selectedAddress.room,
        },
      };

      const response = await orderAPI.prepareThali(orderData);

      if (!response.data.success) {
        throw new Error('Failed to create order');
      }

      const { order: backendOrder, razorpayOrder } = response.data;

      // Step 2: Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add your Razorpay key
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Sk Food',
        description: `${currentOrder.mealType === 'lunch' ? 'Lunch' : 'Dinner'} Order`,
        order_id: razorpayOrder.id,
        handler: async function (razorpayResponse: any) {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await orderAPI.verifyPayment({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              orderId: backendOrder.id,
            });

            if (verifyResponse.data.success) {
              showToast('Payment successful!', 'success');
              
              // Reset order and navigate to confirmation
              resetOrder();
              navigate('/order-confirmation', {
                state: {
                  orderId: backendOrder.id,
                  otp: verifyResponse.data.order.otp,
                  estimatedDelivery: verifyResponse.data.order.estimatedDelivery,
                  total: total,
                },
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            showToast('Payment verification failed', 'error');
            setProcessing(false);
          }
        },
        prefill: {
          name: '', // You can get this from user context if available
          email: '',
          contact: selectedAddress.phoneNumber || '',
        },
        notes: {
          orderId: backendOrder.id,
          mealType: currentOrder.mealType,
        },
        theme: {
          color: '#F97316', // Orange color matching your theme
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            showToast('Payment cancelled', 'error');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      showToast(
        error.response?.data?.message || 'Failed to process payment',
        'error'
      );
      setProcessing(false);
    }
  };

  if (loadingRazorpay) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-primary-600 font-medium">Loading payment gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/checkout">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-primary-900">Payment</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Order Summary */}
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-900">Order Total</h3>
              <p className="text-sm text-primary-600">
                {currentOrder.quantity} Thali(s) • {currentOrder.mealType === 'lunch' ? 'Lunch' : 'Dinner'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-orange-600">₹{total}</span>
              {discount > 0 && (
                <p className="text-sm text-green-600">₹{discount} saved!</p>
              )}
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h3 className="font-semibold text-primary-900 mb-3">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-600">Dishes</span>
              <span className="font-medium">
                {currentOrder.selectedSabjis.map(s => s.name).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600">Base</span>
              <span className="font-medium">{getBaseOptionString()}</span>
            </div>
            {currentOrder.extraRoti > 0 && (
              <div className="flex justify-between">
                <span className="text-primary-600">Extra Roti</span>
                <span className="font-medium">{currentOrder.extraRoti}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-primary-600">Quantity</span>
              <span className="font-medium">{currentOrder.quantity}</span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        {selectedAddress && (
          <Card className="p-4">
            <h3 className="font-semibold text-primary-900 mb-2">Delivery Address</h3>
            <p className="text-sm text-primary-600">{selectedAddress.address}</p>
            {selectedAddress.phoneNumber && (
              <p className="text-xs text-primary-500 mt-1">📞 {selectedAddress.phoneNumber}</p>
            )}
          </Card>
        )}

        {/* Price Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold text-primary-900 mb-3">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-600">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bulk Discount (5%)</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-primary-600">Tax (GST 5%)</span>
              <span className="font-medium">₹{tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600">Delivery Fee</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="border-t border-primary-200 pt-2 flex justify-between">
              <span className="font-semibold text-primary-900">Total</span>
              <span className="font-bold text-orange-600">₹{total}</span>
            </div>
          </div>
        </Card>

        {/* Payment Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Secure Payment</h4>
              <p className="text-sm text-blue-700">
                You'll be redirected to Razorpay's secure payment gateway. Choose from UPI, 
                Cards, Net Banking, or Wallets.
              </p>
            </div>
          </div>
        </Card>

        {/* Security Info */}
        <div className="flex items-center justify-center space-x-2 text-sm text-primary-500">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL encrypted & secure</span>
        </div>

        {/* Razorpay Branding */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-primary-500 bg-white px-4 py-2 rounded-lg border border-primary-200">
            <span>Powered by</span>
            <span className="font-bold text-blue-600">Razorpay</span>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4">
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            fullWidth
            onClick={handlePayment}
            loading={processing}
            disabled={processing}
            className="text-lg py-4"
          >
            {processing ? 'Processing...' : `Pay ₹${total}`}
          </Button>
        </div>
      </div>
    </div>
  );
};