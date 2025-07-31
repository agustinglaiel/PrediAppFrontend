// src/hooks/useUserGroups.js
import { useState, useEffect, useCallback } from "react";
import { getGroupByUserId } from "../api/groups";
import { getUserScoreByUserId } from "../api/users";

/**
 * Devuelve los grupos a los que pertenece el usuario, junto con:
 *  - leaderboard: lista de miembros con username/score/user_id ordenada desc.
 *  - userPosition: posición (1-based) del usuario logueado dentro de ese grupo.
 */
export default function useUserGroups(userId) {
  const [groups, setGroups] = useState([]); // cada uno tendrá { group, leaderboard, userPosition }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    if (!userId) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data: userGroups } = await getGroupByUserId(userId); // suponemos array de grupos

      const enriched = await Promise.all(
        userGroups.map(async (grp) => {
          // filtrar usuarios válidos (como en GroupPage): excluir invited
          const validUsers = (grp.users || []).filter((u) => u.role !== "invited");

          // obtener score y username de cada uno
          const scores = await Promise.all(
            validUsers.map(async (u) => {
              try {
                const { data } = await getUserScoreByUserId(u.user_id);
                return {
                  user_id: u.user_id,
                  username: data.username,
                  score: typeof data.score === "number" ? data.score : 0,
                };
              } catch (e) {
                return {
                  user_id: u.user_id,
                  username: u.username || "—",
                  score: 0,
                };
              }
            })
          );

          // ordenar desc por score
          const leaderboard = [...scores].sort((a, b) => b.score - a.score);

          // calcular posición del userId
          const userEntryIndex = leaderboard.findIndex(
            (entry) => entry.user_id === parseInt(userId, 10)
          );
          const userPosition = userEntryIndex >= 0 ? userEntryIndex + 1 : null;

          return {
            group: grp,
            leaderboard,
            userPosition,
          };
        })
      );

      setGroups(enriched);
    } catch (err) {
      console.error("useUserGroups error:", err);
      setError(err.message || "Error cargando grupos.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refetch: fetchGroups };
}
