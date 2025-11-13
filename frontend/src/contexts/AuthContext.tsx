import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string, name: string, phone:string) => Promise<string>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend API URL - update this with your backend port
const API_URL = import.meta.env.VITE_BACKEND_API_URL

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount by validating token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/userAuth/verify`, {
          method: 'GET',
          credentials: 'include', // Important: sends cookies with request
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/userAuth/login`, {
        method: 'POST',
        credentials: 'include', // Important: enables cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data);
        return data.message
      }

      // Backend might return user data in different structures
      const userFromResponse = data.user || data;
      
      // Set user data from response
      const userData: User = {
        id: userFromResponse._id || userFromResponse.id,
        email: userFromResponse.email,
        name: userFromResponse.name,
        phone: userFromResponse.phone,
      };

      setUser(userData);
      setIsLoggedIn(true);
      
      return "true";
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the component can catch it
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/userAuth/signup`, {
        method: 'POST',
        credentials: 'include', // Important: enables cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name , phone}),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data);
        return data.message
      }

      // Backend might return user data in different structures
      const userFromResponse = data.user || data;
      
      // Set user data from response
      const userData: User = {
        id: userFromResponse._id || userFromResponse.id,
        email: userFromResponse.email,
        name: userFromResponse.name,
        phone: userFromResponse.phone,
      };


      setUser(userData);
      setIsLoggedIn(true);
      
      return "true";
    } catch (error) {
      console.error('Registration error:', error);
      // Re-throw the error so the component can catch it
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/userAuth/logout`, {
        method: 'POST',
        credentials: 'include', // Important: sends cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/userAuth/profile`, {
        method: 'PATCH',
        credentials: 'include', // Important: sends cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      login,
      register,
      logout,
      updateProfile,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Utility function to make authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};