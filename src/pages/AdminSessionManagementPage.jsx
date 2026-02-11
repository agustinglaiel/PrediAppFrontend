import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
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
  const currentYear = new Date().getFullYear();
  const allowedYears = [currentYear, currentYear - 1];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeTab, setActiveTab] = useState("upcoming");
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
        circuit_short_name: fetchedSession.circuit_short_name,
        country_code: fetchedSession.country_code,
        country_name: fetchedSession.country_name,
        location: fetchedSession.location,
        session_name: fetchedSession.session_name,
        session_type: fetchedSession.session_type,
        date_start: fetchedSession.date_start,
        date_end: fetchedSession.date_end,
        year: fetchedSession.year,
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

  const displayEvents = activeTab === "upcoming" ? upcoming : past;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Floating "+" button */}
      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedSession(null);
            setIsModalOpen(true);
          }}
          aria-label="Crear nueva sesión"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      <main className="flex-grow pt-20 pb-24">
        {/* Year selector — underline style */}
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <div className="max-w-xs mx-auto">
            <div className="flex items-center gap-3">
              {allowedYears.map((year) => {
                const isActive = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`relative flex-1 py-2 text-center text-sm font-semibold tracking-wide transition-all duration-300 ease-in-out ${
                      isActive
                        ? "text-red-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <span className="relative z-10">{year}</span>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-300 ease-in-out ${
                        isActive
                          ? "w-8 opacity-100"
                          : "w-0 opacity-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab selector — upcoming / past */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-1.5 overflow-hidden max-w-md mx-auto">
            <div
              className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                activeTab === "upcoming"
                  ? "left-1.5 right-1/2 mr-0.75"
                  : "left-1/2 right-1.5 ml-0.75"
              }`}
            />
            <div className="relative flex">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
                  activeTab === "upcoming"
                    ? "text-white"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <span className="relative z-10">Próximas sesiones</span>
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
                  activeTab === "past"
                    ? "text-white"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <span className="relative z-10">Sesiones pasadas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="px-4 mt-8">
          {displayEvents.length === 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-1.5 rounded-full mb-4 border border-gray-200/50">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {selectedYear}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No hay sesiones
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {activeTab === "upcoming"
                    ? "No hay sesiones próximas para este año"
                    : "No hay sesiones pasadas para este año"}
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-200 rounded-full"></span>
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-200 rounded-full"></span>
                </div>
                <p className="mt-4 text-xs text-gray-400">
                  Puedes crear sesiones con el botón +
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {displayEvents.map((event, index) => (
                <EventCard
                  key={`${event.weekendId ?? index}`}
                  country={event.country}
                  circuit={event.circuit}
                  location={event.location}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  weekendId={event.weekendId}
                  isAdmin={true}
                  onEditClick={handleEditClick}
                  isPastEvent={activeTab === "past"}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <SessionForm
              session={selectedSession}
              onSubmit={isEditing ? handleUpdateSession : handleCreateSession}
              onCancel={handleCloseModal}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessionManagementPage;
