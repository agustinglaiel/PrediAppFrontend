// src/hooks/useUser.js
import { useState, useEffect } from "react";
import { getUserById } from "../api/users";

export default function useUser(userId) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setLoading(false);
      setError(new Error("ID de usuario inválido"));
      return;
    }
    let cancelled = false;
    setLoading(true);

    getUserById(userId)
      .then(data => {
        if (cancelled) return;

        // Conversión única de TODOS los campos que vas a usar:
        const mapped = {
          id:             data.id,
          firstName:      data.first_name,
          lastName:       data.last_name,
          username:       data.username,
          email:          data.email,
          role:           data.role,
          score:          data.score,
          createdAt:      data.created_at,
          isActive:       data.is_active,
          phoneNumber:    data.phone_number,
          // aquí usamos directamente lo que devolvió el backend
          profileImageUrl:
            data.imagen_perfil && data.imagen_mime_type
              ? `data:${data.imagen_mime_type};base64,${data.imagen_perfil}`
              : null,
        };

        setUser(mapped);
        setError(null);
      })
      .catch(err => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { user, loading, error };
}
