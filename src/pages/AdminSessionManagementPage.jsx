import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import {
  getUpcomingSessions,
  getSessionById,
  updateSession,
} from "../api/sessions";
import SessionForm from "../components/admin/SessionForm";

const AdminSessionManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingSessions();
        const groupedEvents = processSessions(data);
        setEvents(groupedEvents);
      } catch (err) {
        setError(err.message || "Error al cargar sesiones.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

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
            ? `/images/circuitLayouts/${session.country_name.toLowerCase()}.png`
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
        id: session.id,
        date: day,
        month: month,
        sessionName: session.session_name,
        sessionType: session.session_type,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        date_start: session.date_start,
        weekend_id: session.weekend_id,
        circuit_key: session.circuit_key,
        circuit_short_name: session.circuit_short_name,
        country_code: session.country_code,
        country_name: session.country_name,
        location: session.location,
        year: session.year,
      });
    });
    return Object.values(eventsMap).sort((a, b) => {
      const dateA = new Date(a.sessions[0].date_start || "2025-01-01");
      const dateB = new Date(b.sessions[0].date_start || "2025-01-01");
      return dateA - dateB;
    });
  };

  const handleCreateSession = async (sessionData) => {
    try {
      const response = await createSession(sessionData);
      const data = await getUpcomingSessions();
      const groupedEvents = processSessions(data);
      setEvents(groupedEvents);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSession = async (sessionData) => {
    try {
      setLoading(true);
      console.log("Enviando datos a updateSession:", sessionData); // Depuración
      const { data, status } = await updateSession(
        selectedSession.id,
        sessionData
      );
      console.log("Respuesta de updateSession:", { data, status }); // Depuración
      if (status === 200) {
        const updatedData = await getUpcomingSessions();
        const groupedEvents = processSessions(updatedData);
        setEvents(groupedEvents);
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
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">Próximos eventos</h2>
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
              />
            ))}
          </div>
        </div>
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
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminSessionManagementPage;
