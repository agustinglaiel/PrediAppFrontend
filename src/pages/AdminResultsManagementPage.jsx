import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import UpdateResults from "../components/admin/UpdateResults";
import { getPastSessionsByYear } from "../api/sessions";
import { getAllDrivers } from "../api/drivers";
import {
  saveSessionResultsAdmin,
  getResultsOrderedByPosition,
  fetchResultsFromExternalAPI,
  FetchNonRaceResultsExternalAPI,
} from "../api/results";

const AdminResultsManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionsData, driversData] = await Promise.all([
          getPastSessionsByYear(selectedYear),
          getAllDrivers(),
        ]);
        const groupedEvents = await processSessions(sessionsData);
        setEvents(groupedEvents);
        setDrivers(driversData);
      } catch (err) {
        setError(err.message || "Error al cargar datos iniciales.");
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

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

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Gestión de Resultados</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span>{error}</span>
          </div>
        )}
        <div className="mb-4">
          <label className="mr-2 text-gray-700">Seleccionar Año:</label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded"
            disabled={loading}
          >
            {[...Array(10).keys()].map((i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Sesiones Pasadas: {selectedYear}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : events.length === 0 ? (
            <p className="text-gray-600">
              No hay sesiones pasadas para este año.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  country={event.country}
                  circuit={event.circuit}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  isAdmin={true}
                  onEditClick={handleEditClick}
                  onGetResults={handleGetResults}
                  editButtonText="Actualizar resultado"
                  showGetResultsButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {isModalOpen && selectedSession && (
        <UpdateResults
          session={selectedSession}
          drivers={drivers}
          onSave={handleSaveResults}
          onCancel={handleCancel}
        />
      )}
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminResultsManagementPage;
