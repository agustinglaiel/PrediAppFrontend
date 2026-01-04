import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import useAdminProdesManagement from "../hooks/useAdminProdesManagement";

const AdminProdesManagementPage = () => {
  const {
    year: selectedYear,
    setYear,
    pastEvents,
    loading,
    error,
    notification,
    updateProdeScores,
  } = useAdminProdesManagement(new Date().getFullYear());

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value, 10));
  };

  const handleUpdateProdeClick = (sessionData) => {
  console.log("click update prode para sessionData:", sessionData);

  // Normalizar/extraer
  const sessionIdRaw =
    sessionData?.id ?? sessionData?.session_id ?? sessionData?.sessionId;
  const sessionName =
    sessionData?.sessionName ?? sessionData?.session_name ?? "";
  const sessionType =
    sessionData?.sessionType ?? sessionData?.session_type ?? "";

  const sessionId = Number(sessionIdRaw);
  if (!sessionIdRaw || isNaN(sessionId)) {
    console.warn("sessionId inválido en updateProdeClick:", sessionData);
    return;
  }

  updateProdeScores({
    sessionId,
    sessionName,
    sessionType,
  });
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
        <h1 className="text-3xl font-bold mb-6">Gestión de Pronósticos</h1>

        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg text-white text-center ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div>
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
                  location={event.location}
                  sessions={event.sessions}
                  flagUrl={event.flagUrl}
                  circuitLayoutUrl={event.circuitLayoutUrl}
                  weekendId={event.weekendId}
                  isAdmin={true}
                  isPastEvent={true}
                  onUpdateProdeClick={handleUpdateProdeClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminProdesManagementPage;
