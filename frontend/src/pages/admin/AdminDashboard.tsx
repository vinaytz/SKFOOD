import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, PlusCircle, BarChart3, BarChart } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
// import { useOrder } from '../../contexts/OrderContext';

export const AdminDashboard: React.FC = () => {


  // const todayOrders = orders.filter(order => {
  //   const today = new Date().toDateString();
  //   return order.createdAt.toDateString() === today;
  // });

  // const pendingOrders = orders.filter(order => ['pending', 'on-the-way'].includes(order.status));
  const pendingOrders = "sdc"
  // const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20">
      {/* Header */}
      <header className="glass border-b border-primary-200/50 shadow-sm bg-white/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 tracking-tight">SKFood Admin</h1>
              <p className="text-sm text-primary-600">Manage your food business with powerful tools</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/analytics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              {/* <Link to="/">
                <Button size="sm">
                  View App
                </Button>
              </Link> */}
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Today's Orders"
              value={todayOrders.length}
              icon={ShoppingBag}
              colorScheme="blue"
              trend={{ value: '+8%', isPositive: true }}
            />
            <StatCard
              title="Today's Revenue"
              value={`₹${todayRevenue}`}
              icon={DollarSign}
              colorScheme="green"
              trend={{ value: '+12%', isPositive: true }}
            />
            <StatCard
              title="Pending Orders"
              value={pendingOrders.length}
              icon={Clock}
              colorScheme="orange"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${orders.reduce((sum, o) => sum + o.total, 0)}`}
              icon={TrendingUp}
              colorScheme="purple"
            />
          </div> */}
        </div>
      </header>

      <div className="px-4 py-6 max-w-7xl mx-auto space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-primary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/publish-menu">
              <Card hoverable className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-900">Publish Today's Menu</h3>
                    <p className="text-sm text-primary-600">Add sabjis and set prices for today</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card hoverable className="p-5">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-900">Manage Orders</h3>
                    <p className="text-sm text-primary-600">View and update order status</p>
                  </div>
                  {pendingOrders.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {pendingOrders.length} pending
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Menu Management */}
        <div>
          <h2 className="text-xl font-bold text-primary-900 mb-4">Menu Management</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card hoverable className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-primary-900 mb-1">Today's Summary</h3>
              <p className="text-sm text-primary-600">Saved menu combinations</p>
            </Card>

            <Card hoverable className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-primary-900 mb-1">Analytics</h3>
              <p className="text-sm text-primary-600">Sales & order insights</p>
            </Card>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary-900">Recent Orders</h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div> */}

          <div className="space-y-3">
            {/* {pendingOrders.slice(0, 3).map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-primary-900">Order #{order.id}</h3>
                    <p className="text-sm text-primary-600">
                      {order.items.quantity} thali(s) • ₹{order.total}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-primary-500">
                        {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status === 'pending' ? 'Preparing' : 'On the way'}
                    </span>
                    <p className="text-sm text-primary-600 mt-1">OTP: {order.otp}</p>
                  </div>
                </div>
              </Card>
            ))} */}

            {/* {pendingOrders.length === 0 && (
              <Card className="p-8 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-primary-600">No pending orders</p>
              </Card>
            )} */}
          </div>
        </div>

        {/* Business Insights
        <Card className="p-6 bg-gradient-to-r from-orange-50/50 to-orange-50/30 border-orange-200/50">
          <h3 className="font-semibold text-primary-900 mb-3">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-primary-600">Total Orders</span>
              <p className="font-semibold text-primary-900">{todayOrders.length}</p>
            </div>
            <div>
              <span className="text-primary-600">Revenue</span>
              <p className="font-semibold text-orange-600">₹{todayRevenue}</p>
            </div>
            <div>
              <span className="text-primary-600">Avg Order Value</span>
              <p className="font-semibold text-primary-900">
                ₹{todayOrders.length > 0 ? Math.round(todayRevenue / todayOrders.length) : 0}
              </p>
            </div>
            <div>
              <span className="text-primary-600">Customer Satisfaction</span>
              <p className="font-semibold text-green-600">98%</p>
            </div>
          </div>
        </Card> */}
      </div>


         {/* <footer className="bg-white border-t border-primary-200/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SK</span>
                </div>
                <span className="text-lg font-semibold text-primary-900">SKFood</span>
              </div>
              <p className="text-primary-600 text-sm leading-relaxed max-w-md mb-6">
                Premium homestyle meals delivered fresh to your hostel.
                Quality ingredients, authentic flavors.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-primary-500">
                <span>© 2025 SKFood</span>
                <span>•</span>
                <Link to="/privacy" className="hover:text-primary-900 transition-colors">Privacy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-primary-900 transition-colors">Terms</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-4 text-sm">Contact</h3>
              <div className="space-y-2.5 text-sm text-primary-600">
                <p>+91 98765 43210</p>
                <p>hello@skfood.com</p>
                <p className="text-xs">12:00 PM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};