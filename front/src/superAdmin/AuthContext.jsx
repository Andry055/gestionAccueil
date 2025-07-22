// src/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Exemple d'utilisateur connecté
  const [user, setUser] = useState({ username: "andry", role: "superadmin" });

  const login = (username, role) => {
    setUser({ username, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook custom pour utiliser le contexte plus facilement
export function useAuth() {
  return useContext(AuthContext);
}
