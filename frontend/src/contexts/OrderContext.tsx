import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { orderAPI } from '../utils/api';

export interface Sabji {
  name: string;
  imageUrl: string;
  isSpecial: boolean;
}

export interface OrderItem {
  mealType?: 'lunch' | 'dinner';
  menuId?: string;
  selectedSabjis: Sabji[];
  baseOption: 'roti-only' | 'both' | 'rice-only';
  extraRoti: number;
  quantity: number;
  basePrice?: number;
  availableBaseOptions?: string[];
}

export interface DeliveryAddress {
  id?: string;
  type: 'geolocation' | 'manual';
  label?: string;
  address: string;
  hostel?: string;
  room?: string;
  phoneNumber?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Order {
  _id: string;
  mealType: string;
  selectedSabjis: Sabji[];
  baseOption: string;
  extraRoti: number;
  quantity: number;
  deliveryAddress: DeliveryAddress;
  pricing: {
    basePrice: number;
    specialSabjiPrice: number;
    extraRotiPrice: number;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'paid' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  otp: string;
  estimatedDelivery: string;
  createdAt: string;
}

interface OrderContextType {
  currentOrder: OrderItem;
  setCurrentOrder: (order: OrderItem) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  savedAddresses: DeliveryAddress[];
  setSavedAddresses: (addresses: DeliveryAddress[]) => void;
  fetchSavedAddresses: () => Promise<void>;
  addSavedAddress: (address: DeliveryAddress) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; show: boolean };
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const initialOrderState: OrderItem = {
  selectedSabjis: [],
  baseOption: 'roti-only',
  extraRoti: 0,
  quantity: 1,
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem>(initialOrderState);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [toast, setToast] = useState({ message: '', type: 'info' as const, show: false });

  const fetchSavedAddresses = async () => {
    try {
      const response = await orderAPI.getSavedAddresses();
      if (response.data.success) {
        const addresses = response.data.addresses.map((addr: any, index: number) => ({
          id: `saved_${index}`,
          type: 'manual' as const,
          label: addr.label,
          address: addr.address,
          phoneNumber: addr.phoneNumber,
          coordinates: addr.lat && addr.lng ? { lat: addr.lat, lng: addr.lng } : undefined,
        }));
        setSavedAddresses(addresses);
      }
    } catch (error) {
      console.error('Failed to fetch saved addresses:', error);
    }
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

  const resetOrder = () => {
    setCurrentOrder(initialOrderState);
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      setCurrentOrder,
      orders,
      setOrders,
      savedAddresses,
      setSavedAddresses,
      fetchSavedAddresses,
      addSavedAddress,
      showToast,
      toast,
      resetOrder,
    }}>
      {children}
    </OrderContext.Provider>
  );
}