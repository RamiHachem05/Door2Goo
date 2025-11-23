// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("d2g_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("d2g_token") || null;
  });

  const isAuthenticated = !!token;

  // Save user + token whenever they change
  useEffect(() => {
    if (token) localStorage.setItem("d2g_token", token);
    else localStorage.removeItem("d2g_token");

    if (user) localStorage.setItem("d2g_user", JSON.stringify(user));
    else localStorage.removeItem("d2g_user");
  }, [user, token]);

  // LOGIN
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("d2g_user");
    localStorage.removeItem("d2g_token");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}