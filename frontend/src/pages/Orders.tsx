// src/pages/Orders.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, RotateCcw, Eye, EyeOff, Loader } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { isAuthenticated, orderAPI } from '../utils/api';

export const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'on-the-way' | 'delivered'>('on-the-way');
  const [showOTP, setShowOTP] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { orders, setOrders, showToast } = useOrder();
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      showToast('Please login to view your orders', 'error');
      navigate('/');
      return;
    }
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await orderAPI.getUserOrders();
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      
      if (err.response?.status === 401) {
        showToast('Session expired. Please login again', 'error');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status
  const onTheWayOrders = orders.filter(order => 
    ['pending', 'paid', 'preparing', 'on-the-way'].includes(order.status)
  );
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  const toggleOTP = (orderId: string) => {
    setShowOTP(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'paid':
        return 'text-orange-600 bg-orange-100';
      case 'preparing':
        return 'text-yellow-600 bg-yellow-100';
      case 'on-the-way':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-primary-600 bg-primary-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment Pending';
      case 'paid':
        return 'Paid';
      case 'preparing':
        return 'Preparing';
      case 'on-the-way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getBaseOptionText = (baseOption: string) => {
    if (baseOption.includes('5 Roti')) return 'Roti Only';
    if (baseOption.includes('3 Roti')) return 'Roti + Rice';
    if (baseOption.toLowerCase().includes('rice')) return 'Rice Bowl';
    return baseOption;
  };

  const handleReorder = (order: any) => {
    showToast('Reorder feature coming soon!', 'info');
    // TODO: Implement reorder functionality
    // Navigate to meal builder with pre-filled data
  };

  const renderOrderCard = (order: any) => (
    <Card key={order._id} className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-primary-900">Order #{order._id.slice(-8)}</h3>
          <p className="text-sm text-primary-600">
            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>z
          <p className="text-xs text-primary-500 mt-1 capitalize">
            {order.mealType} Order
          </p>
        </div>
        <div className="text-right">
            <div className="relative inline-flex items-center mr-3">
              <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-300 opacity-75 animate-ping" aria-hidden="true"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600 ring-2 ring-white" aria-hidden="true"></span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
            </span>
            <p className="text-lg font-bold text-primary-900 mt-1">₹{order.pricing.total}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-600">Items</span>
          <span className="text-primary-900">{order.quantity} Thali(s)</span>
        </div>
        <div className="flex items-start justify-between text-sm">
          <span className="text-primary-600">Sabjis</span>
          <span className="text-primary-900 text-right">
            {order.selectedSabjis.map((s: any) => s.name).join(', ')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-600">Base</span>
          <span className="text-primary-900">
            {getBaseOptionText(order.baseOption)}
            {order.extraRoti > 0 && ` (+${order.extraRoti} roti)`}
          </span>
        </div>
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-600">Delivery ETA</span>
            <span className="text-orange-600 font-medium">
              {formatTime(order.estimatedDelivery)}
            </span>
          </div>
        )}
      </div>

      {/* Delivery Address */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="text-xs text-primary-600 mb-1">Delivery Address</div>
        <div className="text-sm text-primary-900">
          {order.deliveryAddress.address}
        </div>
        {order.deliveryAddress.phoneNumber && (
          <div className="text-xs text-primary-600 mt-1">
            📞 {order.deliveryAddress.phoneNumber}
          </div>
        )}
      </div>

      {/* OTP Section - Only for active orders */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && order.otp && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-blue-800">Delivery OTP</span>
              <p className="text-xs text-blue-600">Show this to delivery partner</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-bold text-blue-900">
                {showOTP[order._id] ? order.otp : '••••'}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleOTP(order._id)}
              >
                {showOTP[order._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={() => handleReorder(order)}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reorder
        </Button>
        {order.status === 'delivered' && (
          <Button size="sm" variant="ghost">
            Rate Order
          </Button>
        )}
      </div>
    </Card>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-primary-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-primary-50">
        <header className="bg-white border-b border-primary-200">
          <div className="flex items-center justify-between px-4 py-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-primary-900">My Orders</h1>
            <div className="w-10" />
          </div>
        </header>
        <div className="flex items-center justify-center px-4 py-12">
          <Card className="p-8 text-center max-w-md">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button onClick={fetchOrders}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-primary-200">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-primary-900">My Orders</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-primary-200">
        <div className="flex max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('on-the-way')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'on-the-way'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-primary-500 hover:text-primary-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Active ({onTheWayOrders.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'delivered'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-primary-500 hover:text-primary-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Delivered ({deliveredOrders.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-4 pb-24">
        {activeTab === 'on-the-way' && (
          <>
            {onTheWayOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-primary-900 mb-2">No active orders</h3>
                <p className="text-primary-600 mb-6">Your current orders will appear here</p>
                <Link to="/">
                  <Button>Order Now</Button>
                </Link>
              </div>
            ) : (
              onTheWayOrders.map(renderOrderCard)
            )}
          </>
        )}

        {activeTab === 'delivered' && (
          <>
            {deliveredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-primary-900 mb-2">No delivered orders</h3>
                <p className="text-primary-600 mb-6">Your past orders will appear here</p>
                <Link to="/">
                  <Button>Place Your First Order</Button>
                </Link>
              </div>
            ) : (
              deliveredOrders.map(renderOrderCard)
            )}
          </>
        )}
      </div>

      {/* Quick Order Button */}
      <div className="fixed bottom-6 right-4">
        <Link to="/">
          <Button size="lg" className="rounded-full shadow-lg">
            + New Order
          </Button>
        </Link>
      </div>
    </div>
  );
};