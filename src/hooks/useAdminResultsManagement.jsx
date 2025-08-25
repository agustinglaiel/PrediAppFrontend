// src/hooks/useAdminResultsManagement.js
import { useState, useEffect, useRef } from "react";
import { getPastSessionsByYear } from "../api/sessions";
import { getAllDrivers } from "../api/drivers";
import {
  getResultsOrderedByPosition,
  fetchResultsFromExternalAPI,
  FetchNonRaceResultsExternalAPI,
  saveSessionResultsAdmin,
} from "../api/results";

/**
 * Agrupa las sesiones por weekend_id y arma la estructura de events sin hacer I/O.
 * hasResults se setea inicialmente en undefined para mostrar estado "desconocido/cargando".
 */
const processSessions = async (sessions) => {
  const eventsMap = {};
  for (const session of sessions) {
    const weekendId = session.weekend_id;
    if (!eventsMap[weekendId]) {
      eventsMap[weekendId] = {
        country: session.country_name,
        circuit: session.circuit_short_name,
        flagUrl: session.country_name
          ? `/images/flags/${session.country_name.toLowerCase()}.jpg`
          : "/images/flags/default.jpg",
        circuitLayoutUrl: session.country_name
          ? `/images/circuitLayouts/${session.location.toLowerCase()}.png`
          : "/images/circuitLayouts/default.png",
        sessions: [],
      };
    }

    // Parseo de fecha/horarios
    let day = "1";
    let month = "JAN";
    if (session.date_start && typeof session.date_start === "string") {
      try {
        const [datePart] = session.date_start.split("T");
        if (datePart) {
          const [, monthNum, dayNum] = datePart.split("-");
          day = dayNum;
          const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
          month = months[parseInt(monthNum, 10) - 1] || "JAN";
        }
      } catch {}
    }
    const [startTime] = (session.date_start || "T00:00:00").split("T")[1].split("-")[0].split(":");
    const [endTime]   = (session.date_end   || "T00:00:00").split("T")[1].split("-")[0].split(":");

    eventsMap[weekendId].sessions.push({
      id: session.id,
      date: day,
      month,
      sessionName: session.session_name,
      sessionType: session.session_type,
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      date_start: session.date_start,
      date_end: session.date_end,
      weekend_id: session.weekend_id,
      circuit_key: session.circuit_key,
      circuit_short_name: session.circuit_short_name,
      country_code: session.country_code,
      country_name: session.country_name,
      location: session.location,
      year: session.year,
      hasResults: undefined, // desconocido al inicio (permite mostrar spinner por sesión)
    });
  }

  // Ordenamos eventos por fecha de la primera sesión
  return Object.values(eventsMap).sort((a, b) => {
    const dateA = new Date(a.sessions[0].date_start || "2025-01-01");
    const dateB = new Date(b.sessions[0].date_start || "2025-01-01");
    return dateA - dateB;
  });
};

export default function useAdminResultsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // loading de carga inicial / cambio de año
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);

  // Para cancelar efectos en vuelo
  const cancelledRef = useRef(false);

  // Helper: actualiza solo el campo hasResults de una sesión puntual
  const updateSessionHasResults = (sessionId, hasResults) => {
    setEvents((prev) =>
      prev.map((evt) => ({
        ...evt,
        sessions: evt.sessions.map((s) =>
          s.id === sessionId ? { ...s, hasResults } : s
        ),
      }))
    );
  };

  // Carga inicial / cambio de año con hidratación progresiva de hasResults
  useEffect(() => {
    cancelledRef.current = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) Traer sesiones + drivers en paralelo
        const [sessionsData, driversData] = await Promise.all([
          getPastSessionsByYear(selectedYear),
          getAllDrivers(),
        ]);

        // 2) Armar estructura y mostrar rápido
        const groupedEvents = await processSessions(sessionsData);
        if (cancelledRef.current) return;
        setEvents(groupedEvents);
        setDrivers(driversData);

        // ✅ Cortamos loading acá para que la page ya pinte la grilla
        setLoading(false);

        // 3) Paralelizar verificación de resultados por sesión (progressive hydrate)
        const allSessions = groupedEvents.flatMap((evt) => evt.sessions);
        const CONCURRENCY = 6; // limitar para no saturar
        let idx = 0;

        const runNext = async () => {
          if (cancelledRef.current) return;
          const item = allSessions[idx++];
          if (!item) return;

          try {
            const res = await getResultsOrderedByPosition(item.id);
            if (!cancelledRef.current) {
              updateSessionHasResults(item.id, Array.isArray(res) && res.length > 0);
            }
          } catch {
            if (!cancelledRef.current) {
              updateSessionHasResults(item.id, false);
            }
          }
          // siguiente
          await runNext();
        };

        // ❗ No await: se hidrata en background sin bloquear la UI
        Promise.all(
          Array.from(
            { length: Math.min(CONCURRENCY, allSessions.length) },
            () => runNext()
          )
        ).catch(() => {});
      } catch (err) {
        if (!cancelledRef.current) {
          setError(err.message || "Error al cargar datos iniciales.");
          setTimeout(() => setError(null), 5000);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelledRef.current = true;
    };
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year, 10));
  };

  const handleEditClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  // Refresca hasResults SOLO para una sesión (sin bloquear toda la página)
  const refreshSingleSessionHasResults = async (sessionId) => {
    try {
      const res = await getResultsOrderedByPosition(sessionId);
      updateSessionHasResults(sessionId, Array.isArray(res) && res.length > 0);
    } catch {
      updateSessionHasResults(sessionId, false);
    }
  };

  // Obtener resultados desde API externa (por sesión).
  // No usamos setLoading(true) global para no bloquear el resto de la UI.
  const handleGetResults = async (sessionId, isNonRace = false) => {
    try {
      setError(null);
      // feedback local (undefined = "cargando/checando")
      updateSessionHasResults(sessionId, undefined);

      if (isNonRace) {
        await FetchNonRaceResultsExternalAPI(sessionId);
      } else {
        await fetchResultsFromExternalAPI(sessionId);
      }

      // Luego de traerlos, refrescamos SOLO esa sesión
      await refreshSingleSessionHasResults(sessionId);
    } catch (err) {
      setError(
        err.message ||
          (isNonRace
            ? "Error al obtener los resultados no de carrera desde la API externa."
            : "Error al obtener los resultados desde la API externa.")
      );
      setTimeout(() => setError(null), 5000);
      updateSessionHasResults(sessionId, false);
    }
  };

  const handleSaveResults = async (results) => {
    const sessionId = selectedSession?.id;
    try {
      setError(null);
      await saveSessionResultsAdmin(sessionId, results);
      setIsModalOpen(false);
      setSelectedSession(null);

      // Refrescamos SOLO esa sesión
      await refreshSingleSessionHasResults(sessionId);
    } catch (err) {
      setError(err.message || "Error al guardar los resultados.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  return {
    events,
    loading,
    error,
    selectedYear,
    selectedSession,
    isModalOpen,
    drivers,
    handleYearChange,
    handleEditClick,
    handleGetResults,
    handleSaveResults,
    handleCancel,
  };
}
