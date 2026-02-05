import React from "react";

const FALLBACK_HEADSHOT =
  "https://media.formula1.com/d_driver_fallback_image.png";

const resolveHeadshotUrl = (driver, driverFromDirectory) => {
  const baseUrl =
    driver?.headshot_url ||
    driverFromDirectory?.headshot_url ||
    driver?.image_url ||
    driverFromDirectory?.image_url ||
    FALLBACK_HEADSHOT;

  return baseUrl?.includes("1col") ? baseUrl.replace("1col", "2col") : baseUrl;
};

const DriversClassificationTable = ({ drivers, driversById }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-16" />
            <col />
            <col className="w-20" />
          </colgroup>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Piloto
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver, index) => {
              const directoryDriver = driversById.get(
                driver.driver_id ?? driver.id
              );
              const fullName =
                driver.full_name ||
                `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim() ||
                directoryDriver?.full_name ||
                `${directoryDriver?.first_name ?? ""} ${
                  directoryDriver?.last_name ?? ""
                }`.trim();
              const teamName =
                driver.current_team?.team_name ||
                driver.team_name ||
                directoryDriver?.current_team?.team_name ||
                directoryDriver?.team_name ||
                "";
              const points = driver.points ?? driver.total_points ?? 0;
              const headshotUrl = resolveHeadshotUrl(driver, directoryDriver);

              return (
                <tr
                  key={driver.driver_id ?? driver.id ?? `${fullName}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        index === 0
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={headshotUrl}
                          alt={fullName || "Piloto"}
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            event.currentTarget.src = FALLBACK_HEADSHOT;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {fullName || "Piloto"}
                        </p>
                        {teamName && (
                          <p className="text-xs text-gray-500 truncate">
                            {teamName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">
                    {points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversClassificationTable;
