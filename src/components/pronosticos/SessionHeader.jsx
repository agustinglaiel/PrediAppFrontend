import React from "react";

const SessionHeader = ({
  countryName,
  flagUrl,
  sessionName,
  sessionType,
  className,
}) => {
  // Mapear tipo de sesión a un label en español
  const getSessionLabel = (type) => {
    const labels = {
      "Race": "Carrera",
      "Qualifying": "Clasificación",
      "Sprint Qualifying": "Clasificación Sprint",
      "Sprint": "Carrera Sprint",
      "Practice 1": "Práctica 1",
      "Practice 2": "Práctica 2",
      "Practice 3": "Práctica 3",
    };
    return labels[type] || type || "Sesión";
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 ${className || ""}`}>
      {/* Decoración de fondo */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-red-600 rounded-full blur-3xl" />
      </div> */}

      <div className="relative flex items-center px-5 py-5 gap-4">
        {/* Bandera */}
        <div className="flex-shrink-0">
          <img
            src={flagUrl}
            alt={`${countryName} flag`}
            className="w-14 h-auto rounded-md border-2 border-white/20 shadow-lg"
            style={{ display: "block" }}
          />
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
              {getSessionLabel(sessionName)}
            </span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight truncate uppercase">
            {countryName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
