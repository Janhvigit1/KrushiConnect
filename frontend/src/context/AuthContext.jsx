import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  loginFarmer,
  registerFarmer,
  getMe,
  updateLanguagePreference
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('krushi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('krushi_token'));
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const data = await getMe();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('krushi_user', JSON.stringify(data.user));
            if (data.user.preferredLanguage) {
              i18n.changeLanguage(data.user.preferredLanguage);
              localStorage.setItem('krushi_lang', data.user.preferredLanguage);
            }
          }
        } catch (err) {
          console.error('Session expired or error verifying user:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginFarmer(credentials);
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('krushi_token', data.token);
      localStorage.setItem('krushi_user', JSON.stringify(data.user));
      if (data.user.preferredLanguage) {
        i18n.changeLanguage(data.user.preferredLanguage);
        localStorage.setItem('krushi_lang', data.user.preferredLanguage);
      }
    }
    return data;
  };

  const register = async (formData) => {
    const data = await registerFarmer(formData);
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('krushi_token', data.token);
      localStorage.setItem('krushi_user', JSON.stringify(data.user));
      if (data.user.preferredLanguage) {
        i18n.changeLanguage(data.user.preferredLanguage);
        localStorage.setItem('krushi_lang', data.user.preferredLanguage);
      }
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krushi_token');
    localStorage.removeItem('krushi_user');
  };

  const changeLanguage = async (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('krushi_lang', newLang);
    if (user) {
      setUser((prev) => ({ ...prev, preferredLanguage: newLang }));
      try {
        await updateLanguagePreference(newLang);
      } catch (e) {
        console.warn('Could not save language to backend:', e.message);
      }
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('krushi_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        changeLanguage,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
