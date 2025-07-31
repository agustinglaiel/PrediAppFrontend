import { useCallback, useMemo, useEffect, useState, useContext } from "react";
import useSessionsGrouped from "./useSessionsGrouped";
import { withArgentinaTimes } from "../utils/sessions";
import {
  updateRaceProdeScores,
  updateSessionProdeScores,
} from "../api/prodes";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook para la página de administración de prodes:
 * - carga sesiones pasadas por año (usa useSessionsGrouped)
 * - formatea horarios (withArgentinaTimes)
 * - ejecuta update de prodes y refresca user
 * - expone notificaciones
 */
export default function useAdminProdesManagement(initialYear) {
  const [year, setYear] = useState(initialYear);
  const {
    past: rawPastEvents,
    loading: loadingSessions,
    error: sessionsError,
    refetch: refetchSessions,
  } = useSessionsGrouped(year);

  const pastEvents = useMemo(
    () => withArgentinaTimes(rawPastEvents || []),
    [rawPastEvents]
  );

  const [notification, setNotification] = useState(null);
  const { refreshUser } = useContext(AuthContext || {});

  const updateProdeScores = useCallback(
    async ({ sessionId, sessionName, sessionType }) => {
      console.log("updateProdeScores invoked with", {
        sessionId,
        sessionName,
        sessionType,
      });
      try {
        const isRaceSession =
          sessionName?.toLowerCase() === "race" &&
          sessionType?.toLowerCase() === "race";

        let response;
        if (isRaceSession) {
          response = await updateRaceProdeScores(sessionId);
        } else {
          response = await updateSessionProdeScores(sessionId);
        }

        console.log("updateProdeScores response:", response);

        setNotification({
          type: "success",
          message:
            response?.message ||
            "Puntajes de pronósticos actualizados con éxito.",
        });

        // refrescar sesiones
        await refetchSessions();

        // refrescar user si está disponible
        if (typeof refreshUser === "function") {
          await refreshUser();
        }
      } catch (err) {
        console.error("Error updating prode scores:", err);
        setNotification({
          type: "error",
          message:
            err?.message ||
            "Error al actualizar los puntajes de pronósticos.",
        });
      } finally {
        setTimeout(() => setNotification(null), 5000);
      }
    },
    [refreshUser, refetchSessions]
  );

  return {
    year,
    setYear,
    pastEvents,
    loading: loadingSessions,
    error: sessionsError,
    notification,
    updateProdeScores,
    refetch: refetchSessions,
  };
}
