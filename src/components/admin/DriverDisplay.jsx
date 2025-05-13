import React from "react";

const DriverDisplay = ({ driver }) => {
  const fullName = `${driver.first_name} ${driver.last_name}`;
  const headshotUrl =
    driver.headshot_url ||
    "https://media.formula1.com/d_driver_fallback_image.png";
  const highResUrl =
    driver.headshot_url?.replace("1col", "2col") || headshotUrl;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full max-w-xs mx-auto">
      <div className="w-full h-40 overflow-hidden">
        {" "}
        {/* Reducimos de h-64 a h-40 */}
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
        {" "}
        {/* Reducimos el padding de p-4 a p-3 */}
        <h3 className="font-bold text-lg mb-1">{fullName}</h3>{" "}
        {/* Reducimos de text-xl a text-lg y mb-2 a mb-1 */}
        <p className="text-gray-600 text-sm mb-1">
          {" "}
          {/* Reducimos de text-base a text-sm */}
          <span className="font-semibold">Nº:</span> {driver.driver_number}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          <span className="font-semibold">País:</span> {driver.country_code}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Equipo:</span> {driver.team_name}
        </p>
      </div>
    </div>
  );
};

export default DriverDisplay;
