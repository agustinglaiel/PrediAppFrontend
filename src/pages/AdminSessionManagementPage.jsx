import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import {
  getUpcomingSessions,
  getPastSessionsByYear,
  getSessionById,
  updateSession,
  createSession,
} from "../api/sessions";
import SessionForm from "../components/admin/SessionForm";

const AdminSessionManagementPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const [upcomingData, pastData] = await Promise.all([
          getUpcomingSessions(),
          getPastSessionsByYear(selectedYear),
        ]);

        // Filtrar sesiones futuras por el año seleccionado
        const filteredUpcoming = upcomingData.filter(
          (session) =>
            new Date(session.date_start).getFullYear() === selectedYear
        );

        const upcomingGrouped = processSessions(filteredUpcoming);
        const pastGrouped = processSessions(pastData);

        // Ordenar eventos próximos por fecha ascendente
        const sortedUpcoming = upcomingGrouped.sort((a, b) => {
          return new Date(a.earliestDate) - new Date(b.earliestDate);
        });

        // Ordenar eventos pasados por fecha descendente
        const sortedPast = pastGrouped.sort((a, b) => {
          return new Date(b.earliestDate) - new Date(a.earliestDate);
        });

        setUpcomingEvents(sortedUpcoming);
        setPastEvents(sortedPast);
      } catch (err) {
        setError(err.message || "Error al cargar sesiones.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [selectedYear]);

  const processSessions = (sessions) => {
    const eventsMap = {};
    sessions.forEach((session) => {
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
          earliestDate: session.date_start, // Guardar la fecha más temprana para ordenar
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
      });

      // Actualizar la fecha más temprana del evento si es necesario
      if (
        new Date(session.date_start) <
        new Date(eventsMap[weekendId].earliestDate)
      ) {
        eventsMap[weekendId].earliestDate = session.date_start;
      }
    });
    return Object.values(eventsMap);
  };

  const handleCreateSession = async (sessionData) => {
    try {
      setLoading(true);
      console.log("Enviando datos a createSession:", sessionData);
      const { data, status } = await createSession(sessionData);
      console.log("Respuesta de createSession:", { data, status });
      if (status === 201) {
        const [updatedUpcoming, updatedPast] = await Promise.all([
          getUpcomingSessions(),
          getPastSessionsByYear(selectedYear),
        ]);
        const filteredUpcoming = updatedUpcoming.filter(
          (session) =>
            new Date(session.date_start).getFullYear() === selectedYear
        );
        const upcomingGrouped = processSessions(filteredUpcoming);
        const pastGrouped = processSessions(updatedPast);
        setUpcomingEvents(
          upcomingGrouped.sort(
            (a, b) => new Date(a.earliestDate) - new Date(b.earliestDate)
          )
        );
        setPastEvents(
          pastGrouped.sort(
            (a, b) => new Date(b.earliestDate) - new Date(a.earliestDate)
          )
        );
        setIsModalOpen(false);
      } else {
        setError(`La creación no fue exitosa. Estado: ${status}`);
      }
    } catch (err) {
      console.error("Error en handleCreateSession:", err);
      setError(err.message || "Error al crear la sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async (sessionData) => {
    try {
      setLoading(true);
      console.log("Enviando datos a updateSession:", sessionData);
      const { data, status } = await updateSession(
        selectedSession.id,
        sessionData
      );
      console.log("Respuesta de updateSession:", { data, status });
      if (status === 200) {
        const [updatedUpcoming, updatedPast] = await Promise.all([
          getUpcomingSessions(),
          getPastSessionsByYear(selectedYear),
        ]);
        const filteredUpcoming = updatedUpcoming.filter(
          (session) =>
            new Date(session.date_start).getFullYear() === selectedYear
        );
        const upcomingGrouped = processSessions(filteredUpcoming);
        const pastGrouped = processSessions(updatedPast);
        setUpcomingEvents(
          upcomingGrouped.sort(
            (a, b) => new Date(a.earliestDate) - new Date(b.earliestDate)
          )
        );
        setPastEvents(
          pastGrouped.sort(
            (a, b) => new Date(b.earliestDate) - new Date(a.earliestDate)
          )
        );
        setIsModalOpen(false);
        setSelectedSession(null);
        setIsEditing(false);
      } else {
        setError(`La actualización no fue exitosa. Estado: ${status}`);
      }
    } catch (err) {
      console.error("Error en handleUpdateSession:", err);
      setError(err.message || "Error al actualizar la sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (session) => {
    try {
      setLoading(true);
      const fetchedSession = await getSessionById(session.id);
      const transformedSession = {
        id: fetchedSession.id,
        weekend_id: fetchedSession.weekend_id,
        circuit_key: fetchedSession.circuit_key,
        circuit_short_name: fetchedSession.circuit_short_name,
        country_code: fetchedSession.country_code,
        country_name: fetchedSession.country_name,
        location: fetchedSession.location,
        session_name: fetchedSession.session_name,
        session_type: fetchedSession.session_type,
        date_start: fetchedSession.date_start,
        date_end: fetchedSession.date_end,
        year: fetchedSession.year,
        d_fast_lap: fetchedSession.d_fast_lap,
        vsc: fetchedSession.vsc,
        sf: fetchedSession.sf,
        dnf: fetchedSession.dnf,
      };
      setSelectedSession(transformedSession);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || "Error al cargar los datos de la sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
    setIsEditing(false);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
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
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Gestión de Sesiones</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Crear Nueva Sesión
        </button>
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
            Próximos eventos: {selectedYear}
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">
              No hay eventos próximos para este año.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <EventCard
                  key={index}
                  country={event.country}
                  circuit={event.circuit}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  isAdmin={true}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          )}
        </div>
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Sesiones pasadas: {selectedYear}
          </h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-600">
              No hay sesiones pasadas para este año.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <EventCard
                  key={index}
                  country={event.country}
                  circuit={event.circuit}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  isAdmin={true}
                  onEditClick={handleEditClick}
                  isPastEvent={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Editar Sesión" : "Crear Sesión"}
            </h2>
            <SessionForm
              session={selectedSession}
              onSubmit={isEditing ? handleUpdateSession : handleCreateSession}
              onCancel={handleCloseModal}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminSessionManagementPage;
