import { useState, useEffect, useCallback } from "react";
import { getScoreboard } from "../api/users";

export default function useScoreboard() {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchScoreboard = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getScoreboard()
      .then(data => {
        if (!cancelled) {
          setScoreboard(data);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = fetchScoreboard();
    return cleanup;
  }, [fetchScoreboard]);

  return { scoreboard, loading, error, refresh: fetchScoreboard };
}
