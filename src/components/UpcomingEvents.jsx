// UpcomingEvents.jsx
import React from "react";
import EventCard from "./EventCard";

const UpcomingEvents = ({
  events,
  onPronosticoClick,
  isModalOpen,
  onCloseModal,
  onContinueToLogin,
  isAdmin = false,
  isLoggedIn,
}) => {
  return (
    <div className="px-4 mt-8">
      {/* <h2 className="text-2xl font-bold mb-4">Próximos eventos</h2> */}
      {events.map((event, index) => (
        <EventCard
          key={index}
          country={event.country}
          circuit={event.circuit}
          sessions={event.sessions}
          flagUrl={event.flagUrl}
          circuitLayoutUrl={event.circuitLayoutUrl}
          onPronosticoClick={onPronosticoClick} // Pasamos la función
          isModalOpen={isModalOpen}
          onCloseModal={onCloseModal}
          onContinueToLogin={onContinueToLogin}
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default UpcomingEvents;
