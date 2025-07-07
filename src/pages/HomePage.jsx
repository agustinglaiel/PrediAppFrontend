import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import UpcomingEvents from "../components/UpcomingEvents";

import { AuthContext } from "../contexts/AuthContext";
import useUpcomingEvents from "../hooks/useUpcomingEvents";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const navigate = useNavigate();

  const { events, loading, error } = useUpcomingEvents(userId);

  const handlePronosticoClick = (sessionData) => {
    navigate(`/pronosticos/${sessionData.id}`, { state: sessionData });
  };

  /* estados de carga / error */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando eventos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">
          {error.message ?? "No se pudieron cargar los eventos"}
        </p>
      </div>
    );
  }

  /* render principal */
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
