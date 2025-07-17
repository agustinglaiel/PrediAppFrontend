// src/hooks/usePostThread.js
import { useState, useEffect } from "react";
import { getPostById } from "../api/posts";

export default function usePostThread(postId) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getPostById(postId)
      .then(data => setThread(data))
      .finally(() => setLoading(false));
  }, [postId]);
  return { thread, loading };
}