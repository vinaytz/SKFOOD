// src/pages/OrderConfirmation.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, MessageCircle, Share2, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useOrder } from '../contexts/OrderContext';

export const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOrder, showToast } = useOrder();
  
  const [otpCopied, setOtpCopied] = useState(false);
  
  // Get order data from navigation state (passed from Payment page)
  const { orderId, otp, estimatedDelivery, total } = location.state || {};

  // Redirect if no order data
  useEffect(() => {
    if (!orderId || !otp) {
      showToast('Order data not found', 'error');
      navigate('/');
    }
  }, [orderId, otp, navigate]);

  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setOtpCopied(true);
      showToast('OTP copied to clipboard!', 'success');
      setTimeout(() => setOtpCopied(false), 2000);
    } catch (err) {
      showToast('Could not copy OTP', 'error');
    }
  };

  const handleShareOrder = async () => {
    const deliveryTime = estimatedDelivery 
      ? new Date(estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : '30-40 minutes';

    const shareData = {
      title: 'Campus Thali Order Confirmation',
      text: `Order confirmed! Order ID: ${orderId}\nOTP: ${otp}\nEstimated delivery: ${deliveryTime}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.text);
        showToast('Order details copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '30-40 minutes';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  if (!orderId || !otp) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="flex items-center justify-center px-4 py-4">
          <h1 className="text-lg font-semibold text-primary-900">Order Confirmed</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6 pb-32">
        {/* Success Animation */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">Order Confirmed! 🎉</h2>
            <p className="text-primary-600">Your delicious thali is being prepared</p>
          </div>
        </div>

        {/* Order Details */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-900">Order #{orderId.slice(-8)}</h3>
              <p className="text-sm text-primary-600">Placed at {getCurrentTime()}</p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-600 mb-1">₹{total}</div>
              <div className="text-sm text-primary-600">
                {currentOrder.quantity} {currentOrder.quantity > 1 ? 'Thalis' : 'Thali'} • {' '}
                {currentOrder.mealType === 'lunch' ? 'Lunch' : 'Dinner'}
              </div>
            </div>
          </div>
        </Card>

        {/* OTP Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-primary-900">Your Delivery OTP</h3>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-4xl font-mono font-bold text-primary-900 tracking-widest mb-3">
                {otp}
              </div>
              <p className="text-sm text-primary-600">Show this to delivery partner</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyOTP}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-1" />
                {otpCopied ? 'Copied!' : 'Copy OTP'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareOrder}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="p-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-orange-500 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-primary-900 mb-1">Estimated Delivery</h4>
              <p className="text-lg font-semibold text-orange-600">
                {formatTime(estimatedDelivery)}
              </p>
              <p className="text-sm text-primary-600 mt-1">
                We'll call you when we're near your location
              </p>
            </div>
          </div>
        </Card>

        {/* Order Items Summary */}
        <Card className="p-6">
          <h4 className="font-medium text-primary-900 mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-primary-600">Sabjis</span>
              <span className="text-primary-900 text-right">
                {currentOrder.selectedSabjis.map(s => s.name).join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600">Base</span>
              <span className="text-primary-900">
                {currentOrder.baseOption === 'roti-only' && `Roti (${5 + currentOrder.extraRoti})`}
                {currentOrder.baseOption === 'both' && `Roti (${3 + currentOrder.extraRoti}) + Rice`}
                {currentOrder.baseOption === 'rice-only' && 'Rice Bowl'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600">Quantity</span>
              <span className="text-primary-900">{currentOrder.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary-600">Included Free</span>
              <span className="text-primary-900">Raita • Salad</span>
            </div>
          </div>
        </Card>

        {/* WhatsApp Integration */}
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800">Share with Restaurant</h4>
              <p className="text-sm text-green-700">Send OTP via WhatsApp</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const message = `Hi! My order OTP is: ${otp}\nOrder ID: ${orderId.slice(-8)}\nPlease prepare my ${currentOrder.mealType} order.`;
                const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              Send
            </Button>
          </div>
        </Card>

        {/* Live Updates */}
        <Card className="p-4 border-l-4 border-l-orange-500">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
            <div>
              <p className="font-medium text-primary-900">Order being prepared 👨‍🍳</p>
              <p className="text-sm text-primary-600">We'll update you once it's ready for delivery</p>
            </div>
          </div>
        </Card>

        {/* Important Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📱 Important Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep your phone accessible for delivery updates</li>
            <li>• Be ready with the OTP when delivery arrives</li>
            <li>• Payment already completed - no cash needed!</li>
          </ul>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          <Link to="/orders">
            <Button size="lg" fullWidth className="text-lg py-4">
              Track Your Order
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" fullWidth>
              Order Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};