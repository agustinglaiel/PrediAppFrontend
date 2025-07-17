import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";

export default function usePosts(offset = 0, limit = 10) {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
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

  return { posts, loading, error };
}
