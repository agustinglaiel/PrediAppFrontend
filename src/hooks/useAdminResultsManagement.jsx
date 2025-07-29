// src/hooks/useAdminResultsManagement.js
import { useState, useEffect } from "react";
import { getPastSessionsByYear } from "../api/sessions";
import { getAllDrivers } from "../api/drivers";
import {
  getResultsOrderedByPosition,
  fetchResultsFromExternalAPI,
  FetchNonRaceResultsExternalAPI,
  saveSessionResultsAdmin,
} from "../api/results";

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
    let day = "1";
    let month = "JAN";
    if (session.date_start && typeof session.date_start === "string") {
      try {
        const [datePart] = session.date_start.split("T");
        if (datePart) {
          const [year, monthNum, dayNum] = datePart.split("-");
          day = dayNum;
          const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ];
          month = months[parseInt(monthNum, 10) - 1] || "JAN";
        }
      } catch (error) {
        console.error("Error parsing date_start:", session.date_start, error);
      }
    }
    const [startTime] = session.date_start
      .split("T")[1]
      .split("-")[0]
      .split(":");
    const [endTime] = session.date_end.split("T")[1].split("-")[0].split(":");

    let hasResults = false;
    try {
      const results = await getResultsOrderedByPosition(session.id);
      hasResults = results && results.length > 0;
    } catch (err) {
      hasResults = false;
    }

    eventsMap[weekendId].sessions.push({
      id: session.id,
      date: day,
      month: month,
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
      hasResults: hasResults,
    });
  }
  return Object.values(eventsMap).sort((a, b) => {
    const dateA = new Date(a.sessions[0].date_start || "2025-01-01");
    const dateB = new Date(b.sessions[0].date_start || "2025-01-01");
    return dateA - dateB;
  });
};

export default function useAdminResultsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [sessionsData, driversData] = await Promise.all([
          getPastSessionsByYear(selectedYear),
          getAllDrivers(),
        ]);
        if (cancelled) return;
        const groupedEvents = await processSessions(sessionsData);
        setEvents(groupedEvents);
        setDrivers(driversData);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Error al cargar datos iniciales.");
          setTimeout(() => setError(null), 5000);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year, 10));
  };

  const handleEditClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleGetResults = async (sessionId, isNonRace = false) => {
    try {
      setLoading(true);
      setError(null);
      if (isNonRace) {
        await FetchNonRaceResultsExternalAPI(sessionId);
      } else {
        await fetchResultsFromExternalAPI(sessionId);
      }
      const data = await getPastSessionsByYear(selectedYear);
      const groupedEvents = await processSessions(data);
      setEvents(groupedEvents);
    } catch (err) {
      setError(
        err.message ||
          (isNonRace
            ? "Error al obtener los resultados no de carrera desde la API externa."
            : "Error al obtener los resultados desde la API externa.")
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResults = async (results) => {
    try {
      setLoading(true);
      setError(null);
      await saveSessionResultsAdmin(selectedSession.id, results);
      setIsModalOpen(false);
      setSelectedSession(null);
      const data = await getPastSessionsByYear(selectedYear);
      const groupedEvents = await processSessions(data);
      setEvents(groupedEvents);
    } catch (err) {
      setError(err.message || "Error al guardar los resultados.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
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