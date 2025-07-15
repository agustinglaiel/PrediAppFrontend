// src/hooks/useUser.js
import { useState, useEffect } from "react";
import { getUserById } from "../api/users";

/**
 * Hook para cargar un usuario por su ID.
 * @param {number} userId 
 * @returns {{ user: object|null, loading: boolean, error: Error|null }}
 */
export default function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let canceled = false;
    setLoading(true);
    getUserById(userId)
      .then(data => {
        if (!canceled) setUser(data);
      })
      .catch(err => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, [userId]);

  return { user, loading, error };
}
