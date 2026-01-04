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

  return (
    <div className="px-4 mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {headerControls}
      </div>
      {!hasEvents ? (
        <p className="text-gray-500 text-sm italic text-center">
          {emptyMessage}
        </p>
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
