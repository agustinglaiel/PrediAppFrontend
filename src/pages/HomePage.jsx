import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import UpcomingEvents from "../components/UpcomingEvents";
import { getUpcomingSessions } from "../api/sessions";
import { getProdeByUserAndSession } from "../api/prodes";

// Simulamos isRaceSession desde el frontend para consistencia con el backend
const isRaceSession = (sessionName, sessionType) => {
  return sessionName === "Race" && sessionType === "Race";
};

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
      type: session.session_type,
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      hasPronostico: true,
      prodeSession: null,
      prodeRace: null,
      sessionName: session.session_name,
      sessionType: session.session_type,
      date_start: session.date_start,
    });

    if (
      new Date(session.date_start) < new Date(eventsMap[weekendId].earliestDate)
    ) {
      eventsMap[weekendId].earliestDate = session.date_start;
    }
  });

  return Object.values(eventsMap).sort((a, b) => {
    return new Date(a.earliestDate) - new Date(b.earliestDate);
  });
};

const fillProdeData = async (eventsArray, userId) => {
  for (const event of eventsArray) {
    await Promise.all(
      event.sessions.map(async (sess) => {
        try {
          const prode = await getProdeByUserAndSession(
            parseInt(userId, 10),
            sess.id
          );
          if (prode) {
            const isRace = prode.p4 !== undefined && prode.p5 !== undefined;
            sess.prodeRace = isRace ? prode : null;
            sess.prodeSession = isRace ? null : prode;
            sess.score = prode.score ?? null;
          } else {
            sess.prodeRace = sess.prodeSession = null;
            sess.score = null;
          }
        } catch (err) {
          console.error(`Error fetching prode for session ${sess.id}:`, err);
          sess.prodeRace = sess.prodeSession = null;
          sess.score = null;
        }
      })
    );
  }
  return eventsArray;
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await getUpcomingSessions();
        const grouped = processSessions(raw || []);
        const finalEvents = userId
          ? await fillProdeData(grouped, parseInt(userId, 10))
          : grouped;
        setEvents(finalEvents);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError(
            "Acceso denegado (403). Verifica los permisos o contacta al soporte."
          );
        } else if (err.response && err.response.status === 401) {
          setError(
            "No autorizado (401). Verifica los permisos o contacta al soporte."
          );
        } else {
          setError(`No se pudieron cargar los eventos: ${err.message}`);
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handlePronosticoClick = (sessionData) => {
    navigate(`/pronosticos/${sessionData.id}`, { state: sessionData });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando eventos...</p>
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
      <NavigationBar />
      <main className="flex-grow pt-12 pb-12">
        <UpcomingEvents
          events={events}
          onPronosticoClick={handlePronosticoClick}
        />
      </main>
    </div>
  );
};

export default HomePage;
