import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Star,
  Package,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Card } from '../../components/Card';
import { StatCard } from '../../components/StatCard';
import { Chart, PieChart } from '../../components/Chart';
import { Button } from '../../components/Button';
import { useOrder } from '../../contexts/OrderContext';

export const AnalyticsDashboard: React.FC = () => {
  const { orders } = useOrder();
  // const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => order.createdAt.toDateString() === today);

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const activeOrders = orders.filter(order => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)).length;

  const revenueByDay = [
    { label: 'Mon', value: 1250, color: '#f97316' },
    { label: 'Tue', value: 1580, color: '#f97316' },
    { label: 'Wed', value: 1420, color: '#f97316' },
    { label: 'Thu', value: 1780, color: '#f97316' },
    { label: 'Fri', value: 2100, color: '#f97316' },
    { label: 'Sat', value: 2450, color: '#f97316' },
    { label: 'Sun', value: 2200, color: '#f97316' }
  ];

  const ordersByStatus = [
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { label: 'Preparing', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { label: 'On the way', value: orders.filter(o => o.status === 'on-the-way').length, color: '#3b82f6' },
    { label: 'Cancelled', value: Math.floor(orders.length * 0.05), color: '#ef4444' }
  ];

  const popularDishes = [
    { label: 'Dal Tadka', value: 145, color: '#f97316' },
    { label: 'Paneer Butter', value: 128, color: '#3b82f6' },
    { label: 'Rajma', value: 96, color: '#10b981' },
    { label: 'Aloo Gobi', value: 82, color: '#8b5cf6' },
    { label: 'Chole', value: 64, color: '#f59e0b' }
  ];

  const topCustomers = [
    { name: 'Priya Sharma', orders: 24, spent: 2880 },
    { name: 'Rahul Kumar', orders: 18, spent: 2160 },
    { name: 'Anjali Patel', orders: 15, spent: 1800 },
    { name: 'Vikram Singh', orders: 12, spent: 1440 }
  ];

  const recentActivity = [
    { type: 'order', message: 'New order #1234 received', time: '2 min ago', status: 'success' },
    { type: 'delivery', message: 'Order #1230 delivered successfully', time: '15 min ago', status: 'success' },
    { type: 'alert', message: 'Low stock alert: Dal Tadka', time: '1 hour ago', status: 'warning' },
    { type: 'review', message: 'New 5-star review received', time: '2 hours ago', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Analytics Dashboard</h1>
              <p className="text-primary-600 mt-1">Real-time business insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Link to="/admin">
                <Button variant="ghost" size="sm">Back to Admin</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`₹${todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            colorScheme="green"
            trend={{ value: '+12.5%', isPositive: true }}
          />
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
            colorScheme="blue"
            trend={{ value: '+8.2%', isPositive: true }}
          />
          <StatCard
            title="Active Orders"
            value={activeOrders}
            icon={Clock}
            colorScheme="orange"
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${avgOrderValue}`}
            icon={TrendingUp}
            colorScheme="purple"
            trend={{ value: '+5.3%', isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Chart data={revenueByDay} title="Revenue This Week" />
          <PieChart data={ordersByStatus} title="Orders by Status" />
        </div>

        {/* Popular Dishes & Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Chart data={popularDishes} title="Most Popular Dishes" />

          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary-900 mb-6">Top Customers</h3>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900">{customer.name}</h4>
                      <p className="text-sm text-primary-600">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">₹{customer.spent.toLocaleString()}</p>
                    <p className="text-xs text-primary-500">total spent</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-primary-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-primary-50/50 rounded-lg hover:bg-primary-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'order' && <Package className="w-5 h-5 text-green-600" />}
                    {activity.type === 'delivery' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                    {activity.type === 'alert' && <Clock className="w-5 h-5 text-orange-600" />}
                    {activity.type === 'review' && <Star className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary-900">{activity.message}</p>
                    <p className="text-sm text-primary-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary-900 mb-6">Quick Stats</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600">Customer Satisfaction</span>
                  <span className="text-sm font-bold text-primary-900">98%</span>
                </div>
                <div className="w-full h-2 bg-primary-100 rounded-full">
                  <div className="w-[98%] h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600">Avg Delivery Time</span>
                  <span className="text-sm font-bold text-primary-900">32 min</span>
                </div>
                <div className="w-full h-2 bg-primary-100 rounded-full">
                  <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600">Order Success Rate</span>
                  <span className="text-sm font-bold text-primary-900">95%</span>
                </div>
                <div className="w-full h-2 bg-primary-100 rounded-full">
                  <div className="w-[95%] h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-primary-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary-700">Total Customers</span>
                  <span className="text-2xl font-bold text-primary-900">1,247</span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="font-medium">+23 this week</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
