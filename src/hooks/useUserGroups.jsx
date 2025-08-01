// src/hooks/useUserGroups.js
import { useState, useEffect, useCallback, useRef } from "react";
import { getGroupByUserId } from "../api/groups";
import { getUserScoreByUserId } from "../api/users";

/**
 * Devuelve los grupos a los que pertenece el usuario, junto con por cada uno:
 *  - group: el objeto del grupo original
 *  - leaderboard: lista de miembros con username/score/user_id ordenada desc.
 *  - userPosition: posición (1-based) del usuario logueado dentro de ese grupo (null si no está)
 *  - creatorId: id del creador del grupo
 *  - isCreator: si el userId es el creador
 *  - error?: error específico al enriquecer ese grupo (no rompe los demás)
 */
export default function useUserGroups(userId) {
  const [groups, setGroups] = useState([]); // cada uno tendrá { group, leaderboard, userPosition, creatorId, isCreator, error }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Helper que enriquece un solo grupo (no es un hook)
  const enrichGroup = async (grp, userId, signal) => {
    try {
      // filtrar usuarios válidos
      const validUsers = (grp.users || []).filter((u) => u.role !== "invited");

      // obtener score y username de cada uno
      const scores = await Promise.all(
        validUsers.map(async (u) => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
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

      const leaderboard = [...scores].sort((a, b) => b.score - a.score);
      const userEntryIndex = leaderboard.findIndex(
        (entry) => String(entry.user_id) === String(userId)
      );
      const userPosition = userEntryIndex >= 0 ? userEntryIndex + 1 : null;

      const creatorId = grp.users?.find((u) => u.role === "creator")?.user_id;
      const isCreator =
        creatorId != null && String(creatorId) === String(userId);

      return {
        group: grp,
        leaderboard,
        userPosition,
        creatorId,
        isCreator,
      };
    } catch (e) {
      // Si se abortó, propaga para que se ignore fuera
      if (e.name === "AbortError") throw e;
      // Degradado: devolver info mínima con el error
      const creatorId = grp.users?.find((u) => u.role === "creator")?.user_id;
      const isCreator =
        creatorId != null && String(creatorId) === String(userId);
      return {
        group: grp,
        leaderboard: [],
        userPosition: null,
        creatorId,
        isCreator,
        error: e.message || "Error al enriquecer el grupo",
      };
    }
  };

  const fetchGroups = useCallback(async () => {
    if (!userId) {
      setGroups([]);
      setLoading(false);
      return;
    }

    // cancelar previo
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const { data: userGroups } = await getGroupByUserId(userId, {
        signal: controller.signal,
      }); // suponemos array de grupos

      // Enriquecer todos en paralelo (no limitado; si necesitás throttling podés agregarlo)
      const enriched = await Promise.all(
        userGroups.map((grp) =>
          enrichGroup(grp, userId, controller.signal).catch((e) => {
            if (e.name === "AbortError") throw e;
            // ya manejado en enrichGroup, pero por si acaso
            return {
              group: grp,
              leaderboard: [],
              userPosition: null,
              creatorId: grp.users?.find((u) => u.role === "creator")?.user_id,
              isCreator:
                String(
                  grp.users?.find((u) => u.role === "creator")?.user_id
                ) === String(userId),
              error: e.message || "Error desconocido",
            };
          })
        )
      );

      setGroups(enriched);
    } catch (err) {
      if (err.name === "AbortError") {
        // ignorar, es cancelación intencional
        return;
      }
      console.error("useUserGroups error:", err);
      setError(err.message || "Error cargando grupos.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGroups();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchGroups]);

  return { groups, loading, error, refetch: fetchGroups };
}
