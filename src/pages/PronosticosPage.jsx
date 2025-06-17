import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import UpcomingEvents from "../components/UpcomingEvents";
import PastEvents from "../components/PastEvents";

import { getUpcomingSessions, getPastSessionsByYear } from "../api/sessions";
import { getProdeByUserAndSession } from "../api/prodes";
import { AuthContext } from "../contexts/AuthContext";

const PronosticosPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const navigate = useNavigate();

  const groupSessionsByWeekend = (sessions) => {
    const eventsMap = {};
    sessions.forEach((session) => {
      const weekendId = session.weekend_id;
      if (!eventsMap[weekendId]) {
        eventsMap[weekendId] = {
          country: session.country_name || "Unknown",
          circuit: session.circuit_short_name || "Unknown Circuit",
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

      const dateStartObj = new Date(session.date_start);
      const dateEndObj = new Date(session.date_end);

      const startTime = dateStartObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const endTime = dateEndObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      eventsMap[weekendId].sessions.push({
        id: session.id,
        date: dateStartObj.getDate().toString(),
        month: dateStartObj
          .toLocaleString("en", { month: "short" })
          .toUpperCase(),
        sessionName: session.session_name,
        sessionType: session.session_type,
        startTime,
        endTime,
        date_start: session.date_start,
        date_end: session.date_end,
        hasPronostico: true,
        prodeSession: null,
        prodeRace: null,
        score: null,
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

  const fillProdeData = async (eventsArray) => {
    for (const event of eventsArray) {
      const prodePromises = event.sessions.map(async (sess) => {
        try {
          const prode = await getProdeByUserAndSession(
            parseInt(userId, 10),
            sess.id
          );
          if (prode) {
            if (prode.p4 !== undefined && prode.p5 !== undefined) {
              sess.prodeRace = prode;
              sess.prodeSession = null;
            } else {
              sess.prodeSession = prode;
              sess.prodeRace = null;
            }
            sess.score = prode.score || 0;
          } else {
            sess.score = null;
          }
        } catch (err) {
          console.error(`Error fetching prode for session ${sess.id}:`, err);
          sess.score = null;
        }
      });
      await Promise.all(prodePromises);
    }
    return eventsArray;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentYear = new Date().getFullYear();
        const [upcomingRaw, pastRaw] = await Promise.all([
          getUpcomingSessions(),
          getPastSessionsByYear(currentYear),
        ]);

        console.log("Sesiones pasadas crudas:", pastRaw);

        const upcomingGrouped = groupSessionsByWeekend(upcomingRaw || []);
        const pastGrouped = groupSessionsByWeekend(pastRaw || []);

        // Ordenar eventos próximos por fecha ascendente
        const sortedUpcoming = upcomingGrouped.sort((a, b) => {
          return new Date(a.earliestDate) - new Date(b.earliestDate);
        });

        // Ordenar eventos pasados por fecha descendente
        const sortedPast = pastGrouped.sort((a, b) => {
          return new Date(b.earliestDate) - new Date(a.earliestDate);
        });

        const upcomingWithProde = await fillProdeData(sortedUpcoming);
        const pastWithProde = await fillProdeData(sortedPast);

        setUpcomingEvents(upcomingWithProde);
        setPastEvents(pastWithProde);
      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePronosticoClick = (sessionData) => {
    const isPastEvent = new Date(sessionData.date_start) < new Date();
    const isRace =
      sessionData.sessionName === "Race" && sessionData.sessionType === "Race";

    if (isPastEvent) {
      if (isRace) {
        navigate(`/pronosticos/result/race/${sessionData.id}`, {
          state: sessionData,
        });
      } else {
        navigate(`/pronosticos/result/${sessionData.id}`, {
          state: sessionData,
        });
      }
    } else {
      navigate(`/pronosticos/${sessionData.id}`, { state: sessionData });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Cargando sesiones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 pb-4">
        <UpcomingEvents
          events={upcomingEvents}
          onPronosticoClick={handlePronosticoClick}
        />
        <PastEvents
          events={pastEvents}
          onPronosticoClick={handlePronosticoClick}
        />
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default PronosticosPage;
