import { useState, useEffect } from "react";
import { getUserById } from "../api/users";

export default function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      console.log("useUser: ID inválido, no se realiza la solicitud", { userId });
      setLoading(false);
      setError(new Error("ID de usuario inválido"));
      return;
    }

    let canceled = false;
    setLoading(true);
    console.log("useUser: solicitando usuario con ID:", userId);
    getUserById(userId)
      .then(data => {
        console.log("useUser: datos recibidos:", data);
        if (!canceled) {
          setUser(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error("useUser: error:", err);
        if (!canceled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false);
        }
      });

    return () => {
      canceled = true;
    };
  }, [userId]);

  return { user, loading, error };
}