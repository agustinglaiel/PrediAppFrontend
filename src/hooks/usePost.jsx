// src/hooks/usePost.js
import { useState, useEffect, useCallback } from "react";
import { getPostById } from "../api/posts";

export default function usePost(postId) {
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 1) Creamos la función de fetch reutilizable
  const fetchPost = useCallback(() => {
    if (!postId) return;

    let canceled = false;
    setLoading(true);
    setError(null);

    getPostById(postId)
      .then(data => {
        if (!canceled) setPost(data);
      })
      .catch(err => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => { canceled = true; };
  }, [postId]);

  // 2) Llamamos a fetchPost al montar o cuando cambie postId
  useEffect(() => {
    const cancel = fetchPost();
    // en caso de cleanup
    return () => {
      if (typeof cancel === "function") cancel();
    };
  }, [fetchPost]);

  // 3) Exponemos la función para recargar a voluntad
  return { post, loading, error, refresh: fetchPost };
}
