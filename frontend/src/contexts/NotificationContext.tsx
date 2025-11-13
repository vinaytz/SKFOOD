import React, { createContext, useContext, useState, ReactNode } from 'react';


interface NotificationContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; show: boolean };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};



export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [toast, setToast] = useState({ message: '', type: 'info' as const, show: false });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type, show: true });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };


    return (
        <NotificationContext.Provider value={{
            showToast,
            toast
        }}>
        {children}
        </NotificationContext.Provider>   
    )
}