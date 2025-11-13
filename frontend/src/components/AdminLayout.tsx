import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut} from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AdminAuthContext';


interface LayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

     const navigationItems = [
      ...(isLoggedIn ? [{ path:'/admin', label: 'Home' }, { path: '/admin/publish-menu', label: 'Publish Menu' }, { path: '/admin/orders', label: 'Order Management' }] : []),
    ];
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-primary-200/60 bg-white/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to='/' className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-800 transition-colors">
                <span className="text-white font-bold text-base">SK</span>
              </div>
              <span className="text-xl font-semibold text-primary-900 tracking-tight">SKFood</span>
            </Link>

            {isLoggedIn ?
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className= 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 bg-primary-900 text-white hover:text-primary-900 hover:bg-primary-100'
                >
                  {item.label}
                </Link>
              ))}
            </nav>: <div></div>
            }

            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary-100 rounded-lg" >
                    <User className="w-4 h-4 text-primary-700" />
                    <span className="text-sm font-medium text-primary-900">Admin </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/admin/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-primary-700 hover:text-primary-900 hover:bg-primary-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 md:hidden bg-white border-t border-primary-200/60 shadow-lg animate-slide-down">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='text-primary-700 hover:text-primary-900 hover:bg-primary-100 flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-250'
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <div className="border-t border-primary-200 pt-4 mt-4">
                  <div className="space-y-2">
                    <div onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-2.5 bg-primary-100 rounded-lg">
                      <User className="w-5 h-5 text-primary-700" />
                      <span className="text-sm font-medium text-primary-900">Admin</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                      <Button variant="outline" fullWidth>Login</Button>
                    </Link>
                  </div>
                )}
              
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

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