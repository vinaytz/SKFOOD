// src/utils/api.ts - UPDATED TO WORK WITH EXISTING AUTH
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cookie utilities
export const setAuthToken = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
};

export const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') return value;
  }
  return null;
};

export const removeAuthToken = () => {
  document.cookie = 'token=; path=/; max-age=0';
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API Endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/userAuth/login', { email, password }),
  
  signup: (name: string, email: string, password: string, phone?: string) =>
    api.post('/userAuth/signup', { name, email, password, phone }),
};

export const menuAPI = {
  getLunchMenu: () => api.get('/userPanel/seeLunchMenu'),
  getDinnerMenu: () => api.get('/userPanel/seeDinnerMenu'),
};

export const orderAPI = {
  prepareThali: (orderData: any) =>
    api.post('/userPanel/prepareYourThali', orderData),
  
  verifyPayment: (paymentData: any) =>
    api.post('/userPanel/orderPreparedThali', paymentData),
  
  getUserOrders: () =>
    api.get('/userPanel/getUserOrders'),
  
  getSavedAddresses: () =>
    api.get('/userPanel/getSavedAddresses'),
};

export default api;