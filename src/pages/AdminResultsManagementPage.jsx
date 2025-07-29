// src/pages/AdminResultsManagementPage.jsx
import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import UpdateResults from "../components/admin/UpdateResults";
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
    handleGetResults,
    handleSaveResults,
    handleCancel,
  } = useAdminResultsManagement();

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
            onChange={(e) => handleYearChange(e.target.value)}
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