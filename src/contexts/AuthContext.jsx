import React, { createContext, useState, useEffect } from "react";
import { parseJwt, logout, setAuthToken } from "../api/users";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al montar, si hay token, decodifícalo para poblar user
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setAuthToken(token);
      const payload = parseJwt(token);
      if (payload) {
        const { user_id, first_name, last_name, username, email, role, score } =
          payload;
        setUser({
          id: user_id,
          firstName: first_name,
          lastName: last_name,
          username,
          email,
          role,
          score,
        });
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("jwtToken");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token } = userData;
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);

    const payload = parseJwt(token);
    if (payload) {
      const { user_id, first_name, last_name, username, email, role, score } =
        payload;
      setUser({
        id: user_id,
        firstName: first_name,
        lastName: last_name,
        username,
        email,
        role,
        score,
      });
      setIsAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignorar fallo remoto
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      setAuthToken(null);
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
