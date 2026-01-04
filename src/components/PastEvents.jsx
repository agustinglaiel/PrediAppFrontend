// frontendnuevo/src/components/PastEvents.jsx
import React from "react";
import EventCard from "./EventCard";

const PastEvents = ({
  events,
  onPronosticoClick,
  isModalOpen,
  onCloseModal,
  onContinueToLogin,
  emptyMessage = "No hay eventos pasados registrados.",
}) => {
  const hasEvents = events.some((group) => group.events.length > 0);

  if (!hasEvents) {
    return (
      <div className="px-4 mt-8">
        <p className="text-gray-500 text-sm italic text-center">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-8 space-y-8">
      {events.map((group) => (
        <div key={group.year}>
          <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">
            {group.year}
          </h3>
          <div className="space-y-6">
            {group.events.map((event, index) => (
              <EventCard
                key={`${group.year}-${event.weekendId ?? index}`}
                country={event.country}
                circuit={event.circuit}
                location={event.location}
                sessions={event.sessions}
                flagUrl={event.flagUrl}
                circuitLayoutUrl={event.circuitLayoutUrl}
                weekendId={event.weekendId}
                isPastEvent={true}
                onPronosticoClick={onPronosticoClick}
                isModalOpen={isModalOpen}
                onCloseModal={onCloseModal}
                onContinueToLogin={onContinueToLogin}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastEvents;