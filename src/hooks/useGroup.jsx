// src/hooks/useGroup.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { getGroupById } from "../api/groups";
import { getUserById } from "../api/users";

/**
 * Devuelve:
 *  - group: el grupo completo
 *  - leaderboard: array ordenado por score desc ({ user_id, username, score })
 *  - userPosition: posición 1-based del userId dentro del leaderboard (null si no está)
 *  - isCreator: si loggedUserId es admin del grupo
 *  - creatorId: id del admin
 */
export default function useGroup(groupId, loggedUserId) {
  const [group, setGroup] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setError(null);
      const { data: grp } = await getGroupById(groupId);
      setGroup(grp);

  const validUsers = (grp.users || []).filter((u) => u.role !== "Invited");

      const scores = await Promise.all(
        validUsers.map(async (u) => {
          try {
            const username = u.username
              ? u.username
              : (await getUserById(u.user_id))?.username;
            return {
              user_id: u.user_id,
              username: username || "—",
              score: typeof u.score === "number" ? u.score : 0,
            };
          } catch (e) {
            // degradado: si falla una consulta, igual lo mostramos con score
            return {
              user_id: u.user_id,
              username: u.username || "—",
              score: typeof u.score === "number" ? u.score : 0,
            };
          }
        })
      );

      const sorted = [...scores].sort((a, b) => b.score - a.score);
      setLeaderboard(sorted);
    } catch (err) {
      console.error("useGroup error:", err);
      setError(err?.message || "Error cargando el grupo.");
      setLeaderboard([]);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const creatorId = useMemo(
    () => group?.users?.find((u) => u.role === "Admin")?.user_id,
    [group]
  );
  const isCreator = creatorId === loggedUserId;

  const userPosition = useMemo(() => {
    if (!loggedUserId || !leaderboard.length) return null;
    const idx = leaderboard.findIndex(
      (entry) => String(entry.user_id) === String(loggedUserId)
    );
    return idx >= 0 ? idx + 1 : null;
  }, [leaderboard, loggedUserId]);

  return {
    group,
    leaderboard,
    userPosition,
    creatorId,
    isCreator,
    loading,
    error,
    refetch: fetchGroup,
  };
}
