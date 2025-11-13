import React, { useState } from 'react';
import { Bell, Check, X, Package, TrendingUp, AlertCircle, Info, User } from 'lucide-react';
import { Card } from './Card';
// import { Button } from './Button';
// import { Badge } from './Badge';

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'delivery' | 'user';
  title: string;
  message: string;
  time: Date;
  isRead: boolean;
  data?: any;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  // onMarkAsRead,
  // onMarkAllAsRead,
  // onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'promotion':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'user':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'delivery':
        return <Info className="w-5 h-5 text-purple-600" />;
    }
  };

  const formatTime = (time: Date) => {
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="relative" >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-primary-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-primary-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden z-50 p-0 shadow-2xl animate-scale-in">
            <div className="p-4 border-b border-primary-200 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-primary-900">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-primary-600" />
                </button>
              </div>
              {/* {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onMarkAllAsRead}
                  className="w-full justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )} */}
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                  <p className="text-primary-600">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-primary-100 hover:bg-primary-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-primary-200 flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-primary-900 text-sm">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-primary-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primary-500">
                            {formatTime(notification.time)}
                          </span>
                          {/* <div className="flex gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
