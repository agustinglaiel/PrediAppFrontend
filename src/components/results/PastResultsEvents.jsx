// src/components/results/PastResultsEvents.jsx
import React from "react";
import EventCard from "../EventCard";

const PastResultsEvents = ({
  events,
  onResultClick,
  title = "Resultados",
  headerControls = null,
  emptyMessage = "No hay resultados disponibles aún.",
  showYearHeadings = true,
}) => {
  const hasEvents = events.some((group) => group.events.length > 0);

  const showTitle = Boolean(title);

  return (
    <div className="px-4 mt-8">
      {(showTitle || headerControls) && (
        <div
          className={`flex flex-wrap items-center gap-4 mb-6 ${
            showTitle ? "justify-between" : "justify-start"
          }`}
        >
          {showTitle && <h2 className="text-2xl font-bold">{title}</h2>}
          {headerControls}
        </div>
      )}
      {!hasEvents ? (
        <div className="max-w-6xl mx-auto mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            {/* Badge de temporada */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-1.5 rounded-full mb-4 border border-gray-200/50">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Resultados</span>
            </div>

            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Aún no hay resultados!
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
              Los resultados aparecerán aquí una vez finalizadas las sesiones
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {events.map((group) => (
            <div key={group.year}>
              {showYearHeadings && (
                <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
                  {group.year}
                </h3>
              )}
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
                    onPronosticoClick={onResultClick}
                    isPastEvent={true}
                    showAllSessionButtons={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastResultsEvents;
