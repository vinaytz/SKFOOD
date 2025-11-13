import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { LoginPage } from './pages/Auth/LoginPage';
import { AdminLoginPage} from './pages/Auth/AdminLoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { MealBuilder } from './pages/MealBuilder';
import { OrderSummary } from './pages/OrderSummary';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PublishMenu } from './pages/admin/PublishMenu';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AnalyticsDashboard } from './pages/admin/AnalyticsDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { Toast } from './components/Toast';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - With AdminLayout */}
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
            <NotificationProvider>
              <AdminLayout>
                <Routes>
                  <Route path="/login" element={<AdminLoginPage />} />
                  
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/publish-menu" element={<PublishMenu />} />

                  <Route path="/orders" element={<AdminOrders />} />
                  <Route path="/orders/:status" element={<AdminOrders />} />
                </Routes>
              </AdminLayout>
            </NotificationProvider>
            </AdminAuthProvider>
          }
        />

        {/* User Routes - With Layout and Providers */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <OrderProvider>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    
                    {/* Protected Routes */}
                    <Route path="/meal-builder" element={<MealBuilder />} />
                    <Route path="/order-summary" element={<OrderSummary />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<Orders />} />
                  </Routes>
                  <Toast />
                </Layout>
              </OrderProvider>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;