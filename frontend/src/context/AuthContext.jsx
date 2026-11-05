import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medsupply_token') || null);
  const [loading, setLoading] = useState(true);
  
  // Active Persona selected upon opening the app: 'donor' | 'provider' | 'patient' | null
  const [activePersona, setActivePersona] = useState(sessionStorage.getItem('medsupply_active_persona') || null);
  const [showRoleModal, setShowRoleModal] = useState(true); // Ask every time they open the app!

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            if (!activePersona) {
              const mapped = res.user.role === 'equipment_owner' ? 'provider' : res.user.role;
              setActivePersona(mapped);
            }
          } else {
            logout();
          }
        } catch (e) {
          console.warn('Auth token restoration failed, clearing session.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const selectPersona = (role) => {
    setActivePersona(role);
    sessionStorage.setItem('medsupply_active_persona', role);
    setShowRoleModal(false);
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('medsupply_token', res.token);
      setToken(res.token);
      setUser(res.user);
      const mapped = res.user.role === 'equipment_owner' ? 'provider' : res.user.role;
      selectPersona(mapped);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.success) {
      localStorage.setItem('medsupply_token', res.token);
      setToken(res.token);
      setUser(res.user);
      const mapped = res.user.role === 'equipment_owner' ? 'provider' : res.user.role;
      selectPersona(mapped);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('medsupply_token');
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (email, password = 'demo123') => {
    return await login(email, password);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      loginAsDemo,
      isAuthenticated: !!user,
      activePersona,
      setActivePersona,
      selectPersona,
      showRoleModal,
      setShowRoleModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
