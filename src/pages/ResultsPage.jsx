// src/pages/ResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PastResultsEvents from "../components/results/PastResultsEvents"; // Ruta ajustada según tu estructura
import { getPastSessionsByYear } from "../api/sessions";

const ResultsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        setLoading(true);
        setEvents([]);
        const currentYear = new Date().getFullYear(); // Obtenemos el año actual
        const data = await getPastSessionsByYear(currentYear); // Pasamos el año actual
        const groupedEvents = processSessions(data);
        setEvents(groupedEvents);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError(
            "Acceso denegado (403). Verifica los permisos o contacta al soporte."
          );
        } else if (err.response && err.response.status === 401) {
          setError(
            "No autorizado (401). Verifica los permisos o contacta al soporte."
          );
        } else {
          setError(`No se pudieron cargar los resultados: ${err.message}`);
        }
        console.error("Error fetching past sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastSessions();
  }, []);

  const processSessions = (sessions) => {
    if (!sessions || !Array.isArray(sessions)) {
      return [];
    }

    const eventsMap = {};
    sessions.forEach((session) => {
      const weekendId = session.weekend_id || "unknown";
      if (!eventsMap[weekendId]) {
        eventsMap[weekendId] = {
          country: session.country_name || "Unknown",
          circuit: session.circuit_short_name || "Unknown Circuit",
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

      eventsMap[weekendId].sessions.push({
        id: session.id || Math.random(),
        date: day,
        month: month,
        sessionName: session.session_name || "Unknown Session",
        sessionType: session.session_type || "Unknown Type",
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        date_start: session.date_start,
        date_end: session.date_end, // Añadimos date_end
      });
    });

    return Object.values(eventsMap).sort((a, b) => {
      const dateA = new Date(a.sessions[0].date_start || "2025-01-01");
      const dateB = new Date(b.sessions[0].date_start || "2025-01-01");
      return dateB - dateA; // Ordenamos de más reciente a más antiguo
    });
  };

  const handleResultClick = (sessionData) => {
    navigate(`/resultados/${sessionData.id}`, { state: sessionData });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 pb-4">
        <PastResultsEvents events={events} onResultClick={handleResultClick} />
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ResultsPage;
