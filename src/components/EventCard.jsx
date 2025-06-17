import React from "react";
import SessionItem from "./SessionItem";

const EventCard = ({
  country,
  circuit,
  sessions,
  flagUrl,
  circuitLayoutUrl,
  onPronosticoClick,
  isModalOpen,
  onCloseModal,
  onContinueToLogin,
  isPastEvent = false,
  isAdmin = false,
  onEditClick,
  onGetResults,
  editButtonText,
  hasResults,
  showGetResultsButton,
  onUpdateProdeClick, // Nueva prop para pronósticos
}) => {
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date_start);
    const dateB = new Date(b.date_start);
    return dateA - dateB;
  });

  const handlePronosticoClickLocal = (session) => {
    if (!onPronosticoClick) return;

    const sessionData = {
      id: session.id,
      sessionName: session.sessionName,
      sessionType: session.sessionType,
      date_start: session.date_start,
      countryName: country,
      flagUrl: flagUrl,
      circuitName: circuit,
    };
    onPronosticoClick(sessionData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden max-w-full">
      <div className="p-4 flex items-center">
        <div className="bg-gray-100 w-16 h-12 rounded-lg flex items-center justify-center overflow-hidden">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`${country} flag`}
              className="w-full h-auto"
            />
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-xl">{country}</h3>
          <p className="text-gray-600">{circuit}</p>
        </div>
        <div className="ml-auto">
          {circuitLayoutUrl && (
            <img
              src={circuitLayoutUrl}
              alt={`${circuit} layout`}
              className="w-24 h-24 rounded-lg object-contain"
            />
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        {sortedSessions.map((session, index) => (
          <SessionItem
            key={index}
            sessionId={session.id}
            date={session.date}
            month={session.month}
            sessionName={session.sessionName}
            sessionType={session.sessionType}
            startTime={session.startTime}
            endTime={session.endTime}
            date_end={session.date_end}
            hasPronostico={session.hasPronostico}
            isModalOpen={isModalOpen}
            onCloseModal={onCloseModal}
            onContinueToLogin={onContinueToLogin}
            prodeSession={session.prodeSession}
            prodeRace={session.prodeRace}
            isPastEvent={isPastEvent}
            score={session.score}
            onPronosticoClick={() => handlePronosticoClickLocal(session)}
            isAdmin={isAdmin}
            onEditClick={() => onEditClick && onEditClick(session)}
            onGetResults={onGetResults}
            editButtonText={editButtonText}
            hasResults={session.hasResults}
            showGetResultsButton={showGetResultsButton}
            onUpdateProdeClick={onUpdateProdeClick} // Pasar la prop a SessionItem
          />
        ))}
      </div>
    </div>
  );
};

export default EventCard;
