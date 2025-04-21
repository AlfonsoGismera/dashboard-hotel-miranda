import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/themes';

export const ThemeContext = createContext();
const KEY = 'hotelMirandaTheme';

export function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setMode(saved);
  }, []);

  function toggleTheme() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem(KEY, next);
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}