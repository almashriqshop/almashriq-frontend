import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../lib/constants';

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  pincode: string;
  state: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  fullName?: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  reward_points?: number;
  rewardPoints?: number;
}

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  syncProfile: () => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id' | 'isDefault'>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<void>;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('am_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('am_user');
    return saved ? JSON.parse(saved) : null;
  });

  const apiUrl = API_URL;

  useEffect(() => {
    if (token) {
      localStorage.setItem('am_token', token);
    } else {
      localStorage.removeItem('am_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('am_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('am_user');
    }
  }, [user]);

  const login = (newToken: string, userData: any) => {
    setToken(newToken);
    
    // Normalize user object fields
    const normalizedUser: UserProfile = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName || userData.full_name,
      role: userData.role,
      addresses: userData.addresses || [],
      rewardPoints: userData.rewardPoints || userData.reward_points || 0
    };

    setUser(normalizedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const syncProfile = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const normalizedUser: UserProfile = {
          id: data.id,
          email: data.email,
          fullName: data.full_name || data.fullName,
          role: data.role,
          addresses: data.addresses || [],
          rewardPoints: data.reward_points || data.rewardPoints || 0
        };
        setUser(normalizedUser);
      } else if (response.status === 401 || response.status === 403) {
        logout();
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  };

  const addAddress = async (addrData: Omit<UserAddress, 'id' | 'isDefault'>) => {
    if (!token) return false;
    try {
      const response = await fetch(`${apiUrl}/auth/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addrData)
      });

      if (response.ok) {
        await syncProfile();
        return true;
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to add address.');
        return false;
      }
    } catch (err) {
      console.error('Address creation error:', err);
      return false;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${apiUrl}/auth/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await syncProfile();
      }
    } catch (err) {
      console.error('Address deletion error:', err);
    }
  };

  // Sync profile when token changes on mount
  useEffect(() => {
    if (token) {
      syncProfile();
    }
  }, [token]);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        syncProfile,
        addAddress,
        deleteAddress,
        apiUrl
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
