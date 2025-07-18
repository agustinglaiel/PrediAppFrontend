// src/hooks/usePosts.js
import { useState, useEffect, useCallback } from "react";
import { getPosts } from "../api/posts";

export default function usePosts(offset = 0, limit = 10) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Memoizamos la función de fetch para poder llamarla desde fuera
  const fetchPosts = useCallback(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    getPosts(offset, limit)
      .then(data => {
        if (!canceled) setPosts(data);
      })
      .catch(err => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => { canceled = true; };
  }, [offset, limit]);

  // La llamada inicial y cada vez que cambien offset/limit
  useEffect(() => {
    const cleanup = fetchPosts();
    return cleanup;
  }, [fetchPosts]);

  // Devolvemos también refresh para recargar manualmente
  return { posts, loading, error, refresh: fetchPosts };
}
