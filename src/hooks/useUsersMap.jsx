import { useState, useEffect, useRef } from "react";
import { getUserById } from "../api/users";

// Normalización ligera (puede concordar con la que usa AuthContext)
const normalizeUser = (data) => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  username: data.username,
  avatarUrl: data.avatar_url || null,
  role: data.role,
});

export default function useUsersMap(userIds = []) {
  const cacheRef = useRef({}); // userId -> user normalized
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uniqueIds = Array.from(new Set(userIds.filter((id) => id != null)));
    const toFetch = uniqueIds.filter(
      (id) => !cacheRef.current[String(id)]
    );
    if (toFetch.length === 0) {
      setUsersMap({ ...cacheRef.current });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(
      toFetch.map(async (id) => {
        try {
          const data = await getUserById(id);
          const normalized = normalizeUser(data);
          cacheRef.current[String(id)] = normalized;
          return { id, user: normalized };
        } catch (e) {
          const fallback = {
            id,
            username: "Desconocido",
          };
          cacheRef.current[String(id)] = fallback;
          return { id, user: fallback };
        }
      })
    )
      .then(() => {
        if (cancelled) return;
        setUsersMap({ ...cacheRef.current });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userIds.join(",")]);

  return { usersMap, loading, error };
}
