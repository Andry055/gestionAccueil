// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Chargement initial depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          username: parsedUser.username,
          role: parsedUser.role,
          token: parsedUser.token
        });
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsReady(true);
  }, []);

  const login = (username, role, token) => {
    const userData = { username, role, token };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token: user?.token, // Accès direct au token
      role: user?.role,   // Accès direct au rôle
      login, 
      logout, 
      isReady 
    }}>
      {isReady && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};