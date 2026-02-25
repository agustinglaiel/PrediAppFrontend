// src/pages/AdminResultsManagementPage.jsx
import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import UpdateResults from "../components/admin/UpdateResults";
import YearSelector from "../components/YearSelector";
import useAdminResultsManagement from "../hooks/useAdminResultsManagement";

const AdminResultsManagementPage = () => {
  const {
    events,
    loading,
    error,
    selectedYear,
    selectedSession,
    isModalOpen,
    drivers,
    handleYearChange,
    handleEditClick,
    handleSaveResults,
    handleCancel,
  } = useAdminResultsManagement();

  const currentYear = new Date().getFullYear();
  const allowedYears = [...Array(10).keys()].map((i) => currentYear - i);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-20 pb-24">
        {/* Header row: Title + Year dropdown */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-gray-800">Gestión de Resultados</h1>
            <YearSelector
              selectedYear={selectedYear}
              years={allowedYears}
              onChange={(year) => handleYearChange(year)}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Events */}
        <div className="px-4 mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
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
                  No hay sesiones pasadas para este año
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-200 rounded-full"></span>
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-200 rounded-full"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  country={event.country}
                  circuit={event.circuit}
                  location={event.location}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  weekendId={event.weekendId}
                  isAdmin={true}
                  onEditClick={handleEditClick}
                  editButtonText="Actualizar"
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
    </div>
  );
};

export default AdminResultsManagementPage;