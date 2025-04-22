import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import 'react-calendar/dist/Calendar.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProviderWrapper>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProviderWrapper>
    </AuthProvider>
  </React.StrictMode>
);