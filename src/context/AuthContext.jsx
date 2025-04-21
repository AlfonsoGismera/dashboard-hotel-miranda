import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const STORAGE_KEY = 'hotelMirandaAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(username, password) {
    // hardcoded creds
    if (username === 'admin' && password === 'admin') {
      const u = { name: 'Admin' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}