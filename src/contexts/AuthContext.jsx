// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  parseJwt,
  logout as apiLogout,
  setAuthToken,
  getUserById,
} from "../api/users";
import {
  setStoredScore,
  clearStoredScore,
  getStoredScore,
  SCORE_UPDATED_EVENT,
  SCORE_KEY,
} from "../utils/scoreStorage";

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

  // Mantener user.score sincronizado cuando el storage cambie "en caliente"
  useEffect(() => {
    const onScoreUpdated = () => {
      setUser((prev) => {
        if (!prev) return prev;
        const current = getStoredScore();
        if (prev.score === current) return prev;
        return { ...prev, score: current };
      });
    };
    window.addEventListener(SCORE_UPDATED_EVENT, onScoreUpdated);
    return () => window.removeEventListener(SCORE_UPDATED_EVENT, onScoreUpdated);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fresh = await getUserById(user.id);
      setUser(normalizeUser(fresh));
      setIsAuthenticated(true);
      if (typeof fresh?.score === "number") {
        setStoredScore(fresh.score);
      }
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

        // 1) Seteamos el usuario del JWT
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

        // 2) Semilla de score en storage SOLO si no hay uno ya persistido
        const already = localStorage.getItem(SCORE_KEY);
        if (already === null) {
          setStoredScore(score ?? 0);
        }

        // 3) Alinear user.score en memoria al valor del storage si difiere
        const stored = getStoredScore();
        if (typeof stored === "number" && stored !== (score ?? 0)) {
          setUser((prev) => (prev ? { ...prev, score: stored } : prev));
        }
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

      // 1) Seteamos el usuario del JWT
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

      // 2) Semilla en storage SOLO si no existe aún
      const already = localStorage.getItem(SCORE_KEY);
      if (already === null) {
        setStoredScore(score ?? 0);
      }

      // 3) Alinear user.score en memoria al valor del storage si difiere
      const stored = getStoredScore();
      if (typeof stored === "number" && stored !== (score ?? 0)) {
        setUser((prev) => (prev ? { ...prev, score: stored } : prev));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      setAuthToken(null);
      clearStoredScore();
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
