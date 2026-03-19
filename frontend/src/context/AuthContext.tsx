import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type Role = 'Student' | 'Admin' | 'Technician' | 'Manager';

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: Role;
  department: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default auth header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    // Add axios interceptor to handle 401 Unauthorized errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token might be expired or invalid
          console.warn("Unauthorized request, logging out...");
          logout();
          // Optionally redirect to login, but logout() usually clears state which triggers a redirect in many app structures
          window.location.href = '/login'; 
        }
        return Promise.reject(error);
      }
    );

    setIsLoading(false);

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
