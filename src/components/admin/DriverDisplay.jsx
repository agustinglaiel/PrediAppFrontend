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
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onEdit(driver)}
    >
      {/* Headshot */}
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
        <img
          src={highResUrl}
          alt={`${fullName} headshot`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = headshotUrl;
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">{fullName}</h3>
        <p className="text-xs text-gray-500 truncate">{teamName}</p>
      </div>

      {/* Number + Country */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">{driver.country_code}</span>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
          {driver.driver_number}
        </span>
      </div>
    </div>
  );
};

export default DriverDisplay;
