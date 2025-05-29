
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username?: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERNAME = 'arsalan';
const HARDCODED_PASSWORD = 'Arsi73Arsi73';
const AUTH_STORAGE_KEY = 'v2dashboard_auth_status';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Check localStorage only on the client-side after mount
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Could not access localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  const login = async (username?: string, password?: string): Promise<boolean> => {
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      router.push('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
