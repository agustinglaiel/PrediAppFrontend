// src/pages/ResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PastResultsEvents from "../components/results/PastResultsEvents";
import { getPastSessionsByYear } from "../api/sessions";
import {
  groupSessionsByWeekend,
  withArgentinaTimes,
} from "../utils/sessions";

const ResultsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const raw = await getPastSessionsByYear(currentYear);

        // 1) Agrupo por fin de semana
        const grouped = groupSessionsByWeekend(raw || []);

        // 2) Aplico formateo de hora Argentina
        const withTimes = withArgentinaTimes(grouped);

        // 3) Ordeno de más reciente a más antiguo según la primer sesión
        withTimes.sort(
          (a, b) =>
            new Date(b.sessions[0]?.date_start || 0) -
            new Date(a.sessions[0]?.date_start || 0)
        );

        setEvents(withTimes);
      } catch (err) {
        if (err.response?.status === 403) {
          setError(
            "Acceso denegado (403). Verifica los permisos o contacta al soporte."
          );
        } else if (err.response?.status === 401) {
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
        <PastResultsEvents
          events={events}
          onResultClick={handleResultClick}
        />
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ResultsPage;
