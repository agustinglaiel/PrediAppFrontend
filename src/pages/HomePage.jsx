import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import UpcomingEvents from "../components/UpcomingEvents";
import PastEvents from "../components/PastEvents";

import useWeekendEvents from "../hooks/useWeekendEvents";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const { upcoming, past, error } = useWeekendEvents(userId);
  const navigate = useNavigate();
  
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState("upcoming");
  const currentYear = new Date().getFullYear();
  const currentSeasonPast = past
    .filter((group) => group.year === currentYear)
    .map((group) => ({
      ...group,
      events: group.events ?? [],
    }));

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

    <main className="flex-grow pt-20 pb-24">
        {/* Selector de pestañas moderno */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-1.5 overflow-hidden max-w-md mx-auto">
            {/* Fondo deslizante para la pestaña activa */}
            <div 
              className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                activeTab === "upcoming" ? "left-1.5 right-1/2 mr-0.75" : "left-1/2 right-1.5 ml-0.75"
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
                <span className="relative z-10">
                  Próximos eventos
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("past")}
                className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
                  activeTab === "past"
                    ? "text-white"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <span className="relative z-10">
                  Eventos pasados
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        {activeTab === "upcoming" ? (
          <UpcomingEvents
            events={upcoming}
            onPronosticoClick={handlePronosticoClick}
            isLoggedIn={!!user}
          />
        ) : (
          <PastEvents
            events={currentSeasonPast}
            onPronosticoClick={handlePronosticoClick}
            emptyMessage="Actualmente no hay eventos que hayan transcurrido esta temporada"
          />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default HomePage;