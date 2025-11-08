import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // restore session
  useEffect(() => {
    const saved = localStorage.getItem("d2g_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email) => {
    const u = { email };
    setUser(u);
    localStorage.setItem("d2g_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("d2g_user");
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
