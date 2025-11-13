import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Sabji {
  id: string;
  name: string;
  image: string;
  taste: 'mild' | 'spicy' | 'sweet';
}

export interface OrderItem {
  selectedSabjis: Sabji[];
  baseOption: 'roti-only' | 'both' | 'rice-only';
  extraRoti: number;
  upgrades: {
    specialPaneer: boolean;
    extraRaita: boolean;
    saladAddons: boolean;
  };
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  type: 'geolocation' | 'manual';
  address: string;
  hostel?: string;
  room?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  items: OrderItem;
  address: DeliveryAddress;
  total: number;
  otp: string;
  status: 'pending' | 'on-the-way' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
}

interface OrderContextType {
  currentOrder: OrderItem;
  setCurrentOrder: (order: OrderItem) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  savedAddresses: DeliveryAddress[];
  addSavedAddress: (address: DeliveryAddress) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; show: boolean };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem>({
    selectedSabjis: [],
    baseOption: 'roti-only',
    extraRoti: 0,
    upgrades: {
      specialPaneer: false,
      extraRaita: false,
      saladAddons: false,
    },
    quantity: 1,
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      items: {
        selectedSabjis: [
          { id: '1', name: 'Dal Tadka', image: '/api/placeholder/80/80', taste: 'mild' },
          { id: '2', name: 'Paneer Butter Masala', image: '/api/placeholder/80/80', taste: 'mild' },
        ],
        baseOption: 'both',
        extraRoti: 1,
        upgrades: { specialPaneer: true, extraRaita: false, saladAddons: false },
        quantity: 2,
      },
      address: {
        id: '1',
        type: 'manual',
        address: 'Hostel A, Room 101',
        hostel: 'Hostel A',
        room: '101',
      },
      total: 340,
      otp: '1234',
      status: 'on-the-way',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
    },
    {
      id: '2',
      items: {
        selectedSabjis: [
          { id: '3', name: 'Rajma', image: '/api/placeholder/80/80', taste: 'mild' },
        ],
        baseOption: 'roti-only',
        extraRoti: 0,
        upgrades: { specialPaneer: false, extraRaita: true, saladAddons: false },
        quantity: 1,
      },
      address: {
        id: '2',
        type: 'manual',
        address: 'Hostel B, Room 205',
        hostel: 'Hostel B',
        room: '205',
      },
      total: 130,
      otp: '5678',
      status: 'delivered',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 23 * 60 * 60 * 1000),
    },
  ]);

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      type: 'manual',
      address: 'Hostel A, Room 101',
      hostel: 'Hostel A',
      room: '101',
    },
    {
      id: '2',
      type: 'manual',
      address: 'Hostel B, Room 205',
      hostel: 'Hostel B',
      room: '205',
    },
  ]);

  const [toast, setToast] = useState({ message: '', type: 'info' as const, show: false });

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };

  const addSavedAddress = (address: DeliveryAddress) => {
    setSavedAddresses(prev => {
      const exists = prev.find(addr => addr.address === address.address);
      if (exists) return prev;
      return [address, ...prev];
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      setCurrentOrder,
      orders,
      addOrder,
      updateOrderStatus,
      savedAddresses,
      addSavedAddress,
      showToast,
      toast,
    }}>
      {children}
    </OrderContext.Provider>
  );
};