// src/components/SessionItem.jsx
import React, { useState } from "react";
import DateDisplay from "./DateDisplay";
import AuthModal from "./AuthModal";
import { FaCheckCircle } from "react-icons/fa";
import { formatArgTime } from "../utils/date";  // ← NEW

const SessionItem = ({
  sessionId,
  date,
  month,
  sessionName,
  sessionType,
  startTime,
  endTime,
  hasPronostico,
  onPronosticoClick,
  isModalOpen,
  onCloseModal,
  onContinueToLogin,
  prodeSession,
  prodeRace,
  isPastEvent = false,
  score,
  isAdmin = false,
  onEditClick,
  onGetResults,
  editButtonText,
  hasResults,
  showGetResultsButton,
  onUpdateProdeClick,
  isLoggedIn,
}) => {
  const hasProde =
    (sessionType !== "Race" && prodeSession) ||
    (sessionType === "Race" && prodeRace);

  const isSessionEnded = endTime ? new Date() > new Date(endTime) : false;

  const [isFetching, setIsFetching] = useState(false);

  const handleGetResultsClick = async () => {
    if (!onGetResults) return;
    try {
      setIsFetching(true);
      const isRace = sessionName.toLowerCase() === "race" && sessionType.toLowerCase() === "race";
      if (isRace) {
        await onGetResults(sessionId);
      } else {
        await onGetResults(sessionId, true);
      }
    } finally {
      setIsFetching(false);
    }
  };

  // use the single util for formatting
  const formattedStartTime = formatArgTime(startTime);
  const formattedEndTime   = endTime ? formatArgTime(endTime) : null;

  return (
    <div className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
      <DateDisplay date={date} month={month} />

      <div className="ml-6 flex-grow">
        <div className="font-semibold">{sessionName}</div>
        <div className="text-sm text-gray-600">
          {formattedStartTime}
          {formattedEndTime ? ` – ${formattedEndTime}` : ""}
        </div>
      </div>

      {!isAdmin && isPastEvent && isSessionEnded ? (
        <button
          onClick={onPronosticoClick}
          className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {score != null ? `${score} Puntos` : "Ver resultados"}
        </button>
      ) : !isAdmin && !isPastEvent && hasPronostico !== undefined ? (
        <button
          onClick={isLoggedIn ? onPronosticoClick : null}
          disabled={!isLoggedIn}
          title={!isLoggedIn ? "Necesita estar logueado" : ""}
          className={`
            px-4 py-1
            rounded-full
            text-sm font-medium
            transition-colors duration-200
            whitespace-nowrap
            ${
              hasProde
                ? "bg-white text-green-500 border border-green-500 hover:bg-green-50"
                : "bg-orange-300 text-white hover:bg-orange-400" +
                  (!isLoggedIn ? " opacity-50" : "")
            }
          `}
        >
          {hasProde ? "Actualizar pronóstico" : "Completar pronóstico"}
        </button>
      ) : null}

      {isAdmin && onUpdateProdeClick ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onUpdateProdeClick({ sessionId, sessionName, sessionType })
            }
            className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600"
          >
            Actualizar pronósticos
          </button>
        </div>
      ) : isAdmin && (onEditClick || onGetResults) ? (
        <div className="flex items-center gap-2">
          {hasResults && (
            <FaCheckCircle
              className="text-green-500"
              title="Resultados cargados"
            />
          )}
          <div className="flex flex-col gap-2">
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600"
              >
                {editButtonText || "Editar"}
              </button>
            )}
            {showGetResultsButton && onGetResults && (
              <button
                onClick={handleGetResultsClick}
                disabled={isFetching}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isFetching
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white flex items-center justify-center`}
              >
                {isFetching ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Cargando...
                  </>
                ) : (
                  "Obtener Resultados"
                )}
              </button>
            )}
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onContinueToLogin={onContinueToLogin}
      />
    </div>
  );
};

export default SessionItem;
