import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import UpcomingEvents from "../components/UpcomingEvents";
import PastEvents from "../components/PastEvents";

import useWeekendEvents from "../hooks/useWeekendEvents";
import { AuthContext } from "../contexts/AuthContext";

const PronosticosPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const { upcoming, past, error } = useWeekendEvents(userId);
  const navigate = useNavigate();

  /** Navegación según tipo de sesión ------------------------------------ */
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

  /** Render ---------------------------------------------------------------- */
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500">
          {error.message ?? "Error al cargar datos"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-12 pb-4">
        <UpcomingEvents
          events={upcoming}
          onPronosticoClick={handlePronosticoClick}
          isLoggedIn={!!user}
        />
        <PastEvents events={past} onPronosticoClick={handlePronosticoClick} />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default PronosticosPage;
