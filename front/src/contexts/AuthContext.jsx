'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsReady(true);
  }, []);

  const login = (username, prenom, role, token, tel) => {
    const userData = { username, prenom, role, token, tel };
    localStorage.setItem('user', JSON.stringify(userData));
    document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    document.cookie = 'auth_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token,
        role: user?.role,
        login,
        logout,
        isReady,
      }}
    >
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
