import React, { createContext, useState, useEffect } from "react";
import { logout } from "../api/users";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole");

      if (token && userId && role) {
        setUser({ id: userId, role });
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem("jwtToken", userData.token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userRole", userData.role);

    setUser({ id: userData.id, role: userData.role });
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout: handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
