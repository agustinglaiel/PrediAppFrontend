import React, { useEffect, useState } from "react";
import SessionItem from "./SessionItem";

const pad = (value) => value.toString().padStart(2, "0");
const formatShortDate = (date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date
    .getFullYear()
    .toString()
    .slice(-2)}`;

const formatWeekendRange = (sessions = []) => {
  if (!sessions.length) return null;
  const first = sessions[0];
  const last = sessions[sessions.length - 1];

  const startDate = first?.date_start || first?.startTime;
  const endDate = last?.date_end || last?.date_start || startDate;

  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedStart = formatShortDate(start);
  const formattedEnd = formatShortDate(end);

  return `${formattedStart} - ${formattedEnd}`;
};

const EventCard = ({
  country,
  circuit,
  location,
  sessions = [],
  flagUrl,
  circuitLayoutUrl,
  weekendId,
  onPronosticoClick,
  isModalOpen,
  onCloseModal,
  onContinueToLogin,
  isPastEvent = false,
  isAdmin = false,
  onEditClick,
  onGetResults,
  editButtonText,
  showGetResultsButton,
  onUpdateProdeClick,
  isLoggedIn,
  initiallyExpanded,
}) => {
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date_start);
    const dateB = new Date(b.date_start);
    return dateA - dateB;
  });

  const defaultExpanded =
    typeof initiallyExpanded === "boolean" ? initiallyExpanded : !!isAdmin;
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  useEffect(() => {
    setIsOpen(defaultExpanded);
  }, [defaultExpanded]);

  const fallbackId = `${country ?? "country"}-${circuit ?? "circuit"}`
    .replace(/\s+/g, "-")
    .toLowerCase();
  const accordionContentId = `weekend-${weekendId ?? fallbackId}`;

  const displayLocation = location || circuit || "Ubicación no disponible";
  const weekendRange = formatWeekendRange(sortedSessions);

  const handlePronosticoClickLocal = (session) => {
    if (!onPronosticoClick) return;

    const sessionData = {
      id: session.id,
      sessionName: session.sessionName,
      sessionType: session.sessionType,
      date_start: session.date_start,
      date_end: session.date_end,
      countryName: country,
      flagUrl: flagUrl,
      circuitName: circuit,
    };
    onPronosticoClick(sessionData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden max-w-full border border-gray-100">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={accordionContentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-4 flex items-center text-left bg-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
      >
  <div className="w-16 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`${country} flag`}
              className="w-full h-auto"
            />
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-xl text-black">{country}</h3>
          <p className="text-sm text-black">{displayLocation}</p>
          {weekendRange && (
            <p className="text-sm text-black">{weekendRange}</p>
          )}
        </div>
        <div className="ml-auto flex items-center">
          {circuitLayoutUrl && (
            <div className="bg-white rounded-lg p-2 w-28 h-20 flex items-center justify-center">
              <img
                src={circuitLayoutUrl}
                alt={`${circuit} layout`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div id={accordionContentId} className="border-t border-gray-100">
          {sortedSessions.map((session, index) => (
            <SessionItem
              key={index}
              sessionId={session.id}
              date={session.date}
              month={session.month}
              sessionName={session.sessionName}
              sessionType={session.sessionType}
              startTime={session.date_start}
              endTime={session.date_end}
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
              onUpdateProdeClick={onUpdateProdeClick}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCard;
