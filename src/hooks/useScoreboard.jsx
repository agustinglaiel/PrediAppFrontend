import { useState, useEffect, useCallback, useMemo } from "react";
import { getScoreboard } from "../api/users";

export default function useScoreboard() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScoreboard = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getScoreboard()
      .then((data) => {
        if (!cancelled) {
          setSeasons(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
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

  const sortedSeasons = useMemo(() => {
    return [...seasons].sort((a, b) => b.season_year - a.season_year);
  }, [seasons]);

  const currentSeason = sortedSeasons[0] || null;
  const pastSeasons = sortedSeasons.slice(1);
  const scoreboard = currentSeason?.scoreboard || [];

  return {
    scoreboard,
    seasons: sortedSeasons,
    currentSeason,
    currentSeasonYear: currentSeason?.season_year ?? null,
    pastSeasons,
    loading,
    error,
    refresh: fetchScoreboard,
  };
}
