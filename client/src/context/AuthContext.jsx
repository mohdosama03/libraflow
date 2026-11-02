import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('libraflow_token');
      const cachedUser = localStorage.getItem('libraflow_user');
      if (!token) {
        setLoading(false);
        return;
      }
      if (cachedUser) setUser(JSON.parse(cachedUser));
      try {
        const { user: fresh } = await authService.me();
        setUser(fresh);
        localStorage.setItem('libraflow_user', JSON.stringify(fresh));
      } catch {
        localStorage.removeItem('libraflow_token');
        localStorage.removeItem('libraflow_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const persistSession = (token, freshUser) => {
    localStorage.setItem('libraflow_token', token);
    localStorage.setItem('libraflow_user', JSON.stringify(freshUser));
    setUser(freshUser);
  };

  const login = useCallback(async (payload) => {
    const { token, user: freshUser, message } = await authService.login(payload);
    persistSession(token, freshUser);
    toast.success(message || 'Welcome back!');
    return freshUser;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: freshUser, message } = await authService.register(payload);
    persistSession(token, freshUser);
    toast.success(message || 'Account created!');
    return freshUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('libraflow_token');
    localStorage.removeItem('libraflow_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((freshUser) => {
    localStorage.setItem('libraflow_user', JSON.stringify(freshUser));
    setUser(freshUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
