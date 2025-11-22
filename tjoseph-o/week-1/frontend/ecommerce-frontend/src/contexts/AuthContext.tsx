'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user_data');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...');
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.success) {
        console.log('Login successful, token received:', response.token.substring(0, 20) + '...');
        
        const userWithId = {
          ...response.user,
          id: response.user._id || response.user.id
        };
        
        console.log('Storing token in localStorage...');
        // Store token FIRST, then update state
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(userWithId));
          console.log('Token stored. Verification:', localStorage.getItem('auth_token')?.substring(0, 20) + '...');
        }
        
        // Update state after storage
        setToken(response.token);
        setUser(userWithId);
        
        console.log('Login process completed');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(username, email, password);
      
      if (response.success) {
        const userWithId = {
          ...response.user,
          id: response.user._id || response.user.id
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(userWithId));
        }
        
        setToken(response.token);
        setUser(userWithId);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
