import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import { getPastSessionsByYear } from "../api/sessions";
import { updateRaceProdeScores, updateSessionProdeScores } from "../api/prodes";

const AdminProdesManagementPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [notification, setNotification] = useState(null); // Nuevo estado para notificaciones

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const pastData = await getPastSessionsByYear(selectedYear);
        const pastGrouped = processSessions(pastData);

        // Ordenar eventos pasados por fecha descendente
        const sortedPast = pastGrouped.sort((a, b) => {
          return new Date(b.earliestDate) - new Date(a.earliestDate);
        });

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
          earliestDate: session.date_start,
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

      if (
        new Date(session.date_start) <
        new Date(eventsMap[weekendId].earliestDate)
      ) {
        eventsMap[weekendId].earliestDate = session.date_start;
      }
    });
    return Object.values(eventsMap);
  };

  const handleUpdateProdeClick = async ({
    sessionId,
    sessionName,
    sessionType,
  }) => {
    try {
      setLoading(true);
      const isRaceSession =
        sessionName.toLowerCase() === "race" &&
        sessionType.toLowerCase() === "race";

      let response;
      if (isRaceSession) {
        response = await updateRaceProdeScores(sessionId);
      } else {
        response = await updateSessionProdeScores(sessionId);
      }

      setNotification({
        type: "success",
        message:
          response.message || "Puntajes de pronósticos actualizados con éxito.",
      });

      // Ocultar la notificación después de 5 segundos
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error("Error updating prode scores:", error);
      setNotification({
        type: "error",
        message:
          error.message || "Error al actualizar los puntajes de pronósticos.",
      });

      // Ocultar la notificación después de 5 segundos
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setLoading(false);
    }
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
