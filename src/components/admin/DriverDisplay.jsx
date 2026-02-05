// src/components/admin/DriverDisplay.jsx
import React from "react";

const DriverDisplay = ({ driver, onEdit }) => {
  const fullName =
    driver.full_name || `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim();
  const headshotUrl =
    driver.headshot_url ||
    "https://media.formula1.com/d_driver_fallback_image.png";
  const highResUrl =
    driver.headshot_url?.replace("1col", "2col") || headshotUrl;
  const teamName = driver.current_team?.team_name || driver.team_name || "";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full max-w-xs mx-auto">
      <div className="w-full h-40 overflow-hidden">
        <img
          src={highResUrl}
          alt={`${fullName} headshot`}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = headshotUrl;
          }}
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="font-bold text-lg mb-1">{fullName}</h3>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">Nº:</span> {driver.driver_number}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">País:</span> {driver.country_code}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Equipo:</span> {teamName}
        </p>
        <button
          onClick={() => onEdit(driver)}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default DriverDisplay;
