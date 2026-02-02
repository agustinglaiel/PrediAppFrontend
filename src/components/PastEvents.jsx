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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Badge de temporada */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-1.5 rounded-full mb-4 border border-gray-200/50">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Temporada {new Date().getFullYear()}</span>
            </div>
            
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Aún no hay carreras!
            </h3>
            
            {/* Mensaje */}
            <p className="text-gray-500 text-sm leading-relaxed">
              {emptyMessage}
            </p>
            
            {/* Línea decorativa */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-200 rounded-full"></span>
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-200 rounded-full"></span>
            </div>
            
            {/* Texto inferior sutil */}
            <p className="mt-4 text-xs text-gray-400">
              Los eventos aparecerán aquí una vez finalizados
            </p>
          </div>
        </div>
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