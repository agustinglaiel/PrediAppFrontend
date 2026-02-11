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
          (allowedYears.includes(currentYear) ? currentYear : null) ??
          nonEmptyYears[0]?.year ??
          allowedYears[0];

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
      <div className="max-w-xs mx-auto w-full">
        <div className="flex items-center gap-3">
          {years.map((year) => {
            const isActive = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`relative flex-1 py-2 text-center text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out
                  ${isActive
                    ? "text-red-600"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <span className="relative z-10">{year}</span>
                {/* Active underline indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-300 ease-in-out ${
                    isActive ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
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
      <main className="flex-grow pt-20 pb-24">
        {/* Year selector */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          {yearSelector}
        </div>

        <PastResultsEvents
          title=""
          events={filteredEvents}
          onResultClick={handleResultClick}
          headerControls={null}
          showYearHeadings={false}
          emptyMessage={
            eventsByYear.length === 0
              ? "No hay sesiones correspondientes a esta temporada"
              : "No hay sesiones correspondientes al año seleccionado"
          }
        />
      </main>
    </div>
  );
};

export default ResultsPage;
