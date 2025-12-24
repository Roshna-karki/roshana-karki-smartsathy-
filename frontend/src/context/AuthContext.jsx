import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authServices';  
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('[AuthContext] bootstrapped user from storage', currentUser);
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('[AuthContext] login called for', email);
    try {
      const data = await authService.login(email, password);
      console.log('[AuthContext] login successful', data);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('[AuthContext] login failed', err);
      throw err;
    }
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const data = await authService.updateProfile(userData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};