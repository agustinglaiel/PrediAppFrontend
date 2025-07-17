// src/hooks/usePost.js
import { useState, useEffect } from "react";
import { getPostById } from "../api/posts";

export default function usePost(postId) {
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!postId) return;
    let canceled = false;
    setLoading(true);
    getPostById(postId)
      .then(data => { if (!canceled) setPost(data); })
      .catch(err => { if (!canceled) setError(err); })
      .finally(() => { if (!canceled) setLoading(false); });
    return () => { canceled = true; };
  }, [postId]);

  return { post, loading, error };
}
