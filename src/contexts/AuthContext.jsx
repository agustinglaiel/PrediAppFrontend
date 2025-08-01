import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  parseJwt,
  logout as apiLogout,
  setAuthToken,
  getUserById,
} from "../api/users"; // asegúrate de que estas funciones estén exportadas correctamente

export const AuthContext = createContext();

const normalizeUser = (data) => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  username: data.username,
  email: data.email,
  role: data.role,
  score: data.score,
  avatarUrl: data.avatar_url || null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fresh = await getUserById(user.id);
      setUser(normalizeUser(fresh));
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("Error refrescando user:", err);
      // opcional: si 401, hacer logout automático
    }
  }, [user?.id]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setAuthToken(token);
      const payload = parseJwt(token);
      if (payload) {
        const {
          user_id,
          first_name,
          last_name,
          username,
          email,
          role,
          score,
        } = payload;
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
      const {
        user_id,
        first_name,
        last_name,
        username,
        email,
        role,
        score,
      } = payload;
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
      await apiLogout();
    } catch {
      // ignorar error remoto
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout: handleLogout,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
