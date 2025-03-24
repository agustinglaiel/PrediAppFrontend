// src/components/PastResultsEvents.jsx
import React from "react";
import EventCard from "../EventCard";

const PastResultsEvents = ({ events, onResultClick }) => {
  return (
    <div className="px-4 mt-12">
      <h2 className="text-2xl font-bold mb-4">Resultados</h2>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          No hay resultados disponibles aún.
        </p>
      ) : (
        events.map((event, index) => (
          <EventCard
            key={index}
            country={event.country}
            circuit={event.circuit}
            sessions={event.sessions}
            flagUrl={event.flagUrl}
            circuitLayoutUrl={event.circuitLayoutUrl}
            onPronosticoClick={onResultClick} // Usamos esto para "Ver resultados"
            isPastEvent={true} // Forzamos eventos pasados
          />
        ))
      )}
    </div>
  );
};

export default PastResultsEvents;
