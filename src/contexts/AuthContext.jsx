import React, { createContext, useState, useEffect, useCallback } from "react";
import { parseJwt, logout, setAuthToken, getUserById } from "../api/users"; // asumí que exportás getUserById
// si getUserById está en otro archivo, importalo correctamente

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper para mapear respuesta del backend al shape esperado
  const normalizeUser = (data) => {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      email: data.email,
      role: data.role,
      score: data.score,
      // si tenés otros campos como imagen, etc., los podés agregar aquí
    };
  };

  // Refrescar user desde el backend (no depende del token)
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fresh = await getUserById(user.id);
      setUser(normalizeUser(fresh));
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("Error refrescando user:", err);
      // opcional: podrías invalidar sesión si da 401
    }
  }, [user?.id]);

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
      value={{
        user,
        isAuthenticated,
        login,
        logout: handleLogout,
        loading,
        refreshUser, // <-- lo exponemos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
