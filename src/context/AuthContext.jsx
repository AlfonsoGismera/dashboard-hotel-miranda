// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const STORAGE_KEY = 'hotelMirandaAuth';

export function AuthProvider({ children }) {
  // 1) Inicializa directamente el estado desde localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // 2) Cuando cambie user, lo guardamos/limpiamos en localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  function login(username, password, remember = true) {
    if (username === 'admin' && password === 'admin') {
      const u = { name: 'Admin' };
      setUser(u);
      if (!remember) localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);

  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
