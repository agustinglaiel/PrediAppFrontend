import React from "react";
import DateDisplay from "./DateDisplay";
import AuthModal from "./AuthModal";

const SessionItem = ({
  sessionId,
  date,
  month,
  sessionName,
  sessionType,
  startTime,
  endTime,
  date_end,
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
  editButtonText,
}) => {
  const hasProde =
    (sessionType !== "Race" && prodeSession) ||
    (sessionType === "Race" && prodeRace);

  // Validar si la sesión ha finalizado
  const isSessionEnded = date_end ? new Date() > new Date(date_end) : false;

  // Lógica de renderizado priorizando resultados para eventos pasados terminados
  return (
    <div className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
      <DateDisplay date={date} month={month} />
      <div className="ml-6 flex-grow">
        <div className="font-semibold">{sessionName}</div>
        <div className="text-sm text-gray-600">
          {startTime}
          {endTime ? ` - ${endTime}` : ""}
        </div>
      </div>

      {!isAdmin && isPastEvent && isSessionEnded ? (
        <button
          onClick={onPronosticoClick}
          className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {score !== null && score !== undefined
            ? `${score} Puntos`
            : "Ver resultados"}
        </button>
      ) : !isAdmin && !isPastEvent && hasPronostico !== undefined ? (
        <button
          onClick={onPronosticoClick}
          className={`
            px-4 py-1
            rounded-full
            text-sm font-medium
            transition-colors duration-200
            whitespace-nowrap
            ${
              hasProde
                ? "bg-white text-green-500 border border-green-500 hover:bg-green-50"
                : "bg-orange-300 text-white hover:bg-orange-400"
            }
          `}
        >
          {hasProde ? "Actualizar pronóstico" : "Completar pronóstico"}
        </button>
      ) : null}

      {isAdmin && onEditClick && (
        <button
          onClick={onEditClick}
          className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600"
        >
          {editButtonText || "Editar"}
        </button>
      )}

      <AuthModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onContinueToLogin={onContinueToLogin}
      />
    </div>
  );
};

export default SessionItem;