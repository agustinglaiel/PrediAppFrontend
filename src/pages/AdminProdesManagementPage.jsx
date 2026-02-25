import React from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import YearSelector from "../components/YearSelector";
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

  const handleUpdateProdeClick = (sessionData) => {
    console.log("click update prode para sessionData:", sessionData);

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

  const currentYear = new Date().getFullYear();
  const allowedYears = [...Array(10).keys()].map((i) => currentYear - i);

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
      <main className="flex-grow pt-20 pb-24">
        {/* Header row: Title + Year dropdown */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <h1 className="text-xl font-bold text-gray-800">Gestión de Pronósticos</h1>
            <YearSelector
              selectedYear={selectedYear}
              years={allowedYears}
              onChange={(year) => setYear(year)}
              disabled={loading}
            />
          </div>
        </div>

        {notification && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div
              className={`p-4 rounded-xl text-white text-center ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {notification.message}
            </div>
          </div>
        )}

        {/* Events */}
        <div className="px-4 mt-4">
          {pastEvents.length === 0 ? (
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
    </div>
  );
};

export default AdminProdesManagementPage;
