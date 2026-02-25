// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  parseJwt,
  logout as apiLogout,
  setAuthToken,
  getUserById,
  getUserScoreByUserId,
} from "../api/users";
import {
  setStoredScore,
  clearStoredScore,
  getStoredScore,
  getStoredSeasonYear,
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
  seasonYear: data.season_year ?? data.seasonYear ?? null,
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
      const normalized = normalizeUser(fresh);

      // Fetch current season score from the new endpoint
      try {
        const scoreRes = await getUserScoreByUserId(user.id);
        if (scoreRes.status === 200 && scoreRes.data) {
          normalized.score = scoreRes.data.total_score ?? scoreRes.data.score ?? 0;
          normalized.seasonYear = scoreRes.data.season_year ?? normalized.seasonYear;
        }
      } catch {
        // If season score fetch fails, keep whatever we had
      }

      setUser(normalized);
      setIsAuthenticated(true);
      if (typeof normalized.score === "number") {
        setStoredScore(normalized.score, normalized.seasonYear);
      }
    } catch (err) {
      console.warn("Error refrescando user:", err);
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
          season_year,
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
          seasonYear: season_year ?? getStoredSeasonYear(),
        });
        setIsAuthenticated(true);

        // 2) Semilla de score en storage SOLO si no hay uno ya persistido
        const already = localStorage.getItem(SCORE_KEY);
        if (already === null) {
          setStoredScore(score ?? 0, season_year);
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
    const { token, score: responseScore, season_year: responseSeasonYear } = userData;
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
        season_year,
      } = payload;

      // Priorizamos el score y season_year del body de la respuesta sobre el JWT
      const resolvedScore = typeof responseScore === "number" ? responseScore : (typeof score === "number" ? score : 0);
      const resolvedSeasonYear = responseSeasonYear ?? season_year ?? null;

      // 1) Seteamos el usuario
      setUser({
        id: user_id,
        firstName: first_name,
        lastName: last_name,
        username,
        email,
        role,
        score: resolvedScore,
        seasonYear: resolvedSeasonYear,
      });
      setIsAuthenticated(true);

      // 2) Siempre actualizar el score en storage con el valor fresco del login/signup
      setStoredScore(resolvedScore, resolvedSeasonYear);
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
