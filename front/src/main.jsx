import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
