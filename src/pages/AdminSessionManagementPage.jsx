import React, { useState } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import SessionForm from "../components/admin/SessionForm";
import {
  getSessionById,
  updateSession,
  createSession,
} from "../api/sessions";
import useSessionsGrouped from "../hooks/useSessionsGrouped";

const AdminSessionManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);

  const {
    upcoming,
    past,
    loading,
    error: sessionError,
    refetch,
  } = useSessionsGrouped(selectedYear);

  const handleCreateSession = async (sessionData) => {
    try {
      await createSession(sessionData);
      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error en handleCreateSession:", err);
      setError(err.message || "Error al crear la sesión.");
    }
  };

  const handleUpdateSession = async (sessionData) => {
    try {
      await updateSession(selectedSession.id, sessionData);
      await refetch();
      setIsModalOpen(false);
      setSelectedSession(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error en handleUpdateSession:", err);
      setError(err.message || "Error al actualizar la sesión.");
    }
  };

  const handleEditClick = async (session) => {
    try {
      const fetchedSession = await getSessionById(session.id);
      const transformedSession = {
        id: fetchedSession.id,
        weekend_id: fetchedSession.weekend_id,
        circuit_key: fetchedSession.circuit_key,
        circuit_short_name: fetchedSession.circuit_short_name,
        country_code: fetchedSession.country_code,
        country_name: fetchedSession.country_name,
        location: fetchedSession.location,
        session_key: fetchedSession.session_key,
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

  if (error || sessionError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">
          {error || sessionError || "Error al cargar datos"}
        </p>
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
          {upcoming.length === 0 ? (
            <p className="text-gray-600">
              No hay eventos próximos para este año.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {upcoming.map((event, index) => (
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
          {past.length === 0 ? (
            <p className="text-gray-600">
              No hay sesiones pasadas para este año.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {past.map((event, index) => (
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
