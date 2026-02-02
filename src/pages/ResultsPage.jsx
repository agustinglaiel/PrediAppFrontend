// src/pages/ResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PastResultsEvents from "../components/results/PastResultsEvents";
import { getPastSessions } from "../api/sessions";
import {
  groupSessionsByWeekend,
  withArgentinaTimes,
} from "../utils/sessions";

const ResultsPage = () => {
  const currentYear = new Date().getFullYear();
  const allowedYears = [2026, 2025];
  const [eventsByYear, setEventsByYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPastSessions = async () => {
      try {
        setLoading(true);
        const payload = await getPastSessions();

        const perYear = payload.map((yearBlock) => {
          const grouped = groupSessionsByWeekend(yearBlock.sessions || []);
          grouped.sort(
            (a, b) =>
              new Date(b.sessions[0]?.date_start || 0) -
              new Date(a.sessions[0]?.date_start || 0)
          );
          const events = withArgentinaTimes(grouped);
          return {
            year: yearBlock.year,
            events,
          };
        });

        perYear.sort((a, b) => b.year - a.year);

        const nonEmptyYears = perYear.filter(
          (block) => block.events.length > 0
        );

        const defaultYear =
          allowedYears.find((year) =>
            nonEmptyYears.some((block) => block.year === year)
          ) ?? allowedYears[0];

        setEventsByYear(nonEmptyYears);
        setSelectedYear(defaultYear);
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

  const years = allowedYears;
  const filteredEvents = eventsByYear.filter(
    (block) => block.year === selectedYear
  );

  const yearSelector =
    years.length > 0 ? (
      <label className="flex items-center gap-3 text-sm font-medium text-gray-600">
        Temporada
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none pl-4 pr-10 py-2 rounded-full border border-red-200 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            ▼
          </span>
        </div>
      </label>
    ) : null;

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
      <main className="flex-grow pt-12 pb-24">
        <PastResultsEvents
          events={filteredEvents}
          onResultClick={handleResultClick}
          headerControls={yearSelector}
          showYearHeadings={false}
          emptyMessage={
            eventsByYear.length === 0
              ? "No hay sesiones correspondientes a esta temporada"
              : "No hay sesiones correspondientes al año seleccionado"
          }
        />
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default ResultsPage;
