import React from "react";
const ResultGrid = ({ results = [], sessionType = "Race", sessionName = "Race" }) => {
  // Función para determinar puntos fijos según la posición
  const getFixedPoints = (position) => {
    const pointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const pos = parseInt(position, 10);
    return pos >= 1 && pos <= 10 ? pointsMap[pos - 1] : 0;
  };
  // Función para obtener clases de estilo según la posición
  const getPositionStyles = (position) => {
    const pos = parseInt(position, 10);
    if (pos === 1) return "bg-gradient-to-r from-yellow-50 to-yellow-100";
    if (pos === 2) return "bg-gradient-to-r from-gray-50 to-gray-100";
    if (pos === 3) return "bg-gradient-to-r from-orange-50 to-amber-100";
    if (pos <= 10) return "bg-gradient-to-r from-blue-50 to-blue-100";
    return "bg-white hover:bg-gray-50";
  };
  // Función para obtener el estilo del status
  const getStatusStyle = (status) => {
    if (status === "DNF") return "text-red-600 font-semibold bg-red-100 px-2 py-1 rounded";
    if (status === "DNS") return "text-red-600 font-semibold bg-red-100 px-2 py-1 rounded";
    return "";
  };
  // Determinar si se debe mostrar la columna PTS
  const showPointsColumn = sessionType === "Race" && sessionName === "Race";
  const displayResults = results.length > 0 ? results : sampleResults;
  return (
    <div className="w-full max-w-6xl mx-auto p-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-red-700 text-white">
                <th className="py-4 px-3 text-center font-semibold tracking-wide w-16">
                  POS
                </th>
                <th className="py-4 px-3 text-center font-semibold tracking-wide w-16">
                  N°
                </th>
                <th className="py-4 px-3 text-left font-semibold tracking-wide">
                  PILOTO
                </th>
                {showPointsColumn && (
                  <th className="py-4 px-3 text-center font-semibold tracking-wide w-20">
                    PUNTOS
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayResults.map((result, index) => {
                const positionDisplay =
                  result.status === "DNF" || result.status === "DNS"
                    ? result.status
                    : result.position || "N/A";
                const points = showPointsColumn
                  ? getFixedPoints(result.position) || 0
                  : null;
                const rowStyles = getPositionStyles(result.position);
                return (
                  <tr
                    key={result.id || index}
                    className={`${rowStyles} transition-all duration-200 hover:shadow-md`}
                  >
                    <td className="py-4 px-3 text-center">
                      <span 
                        className={`font-bold text-lg ${
                          result.status ? getStatusStyle(result.status) : 'text-gray-800'
                        }`}
                      >
                        {positionDisplay}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto">
                        {result.driver?.driver_number || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="font-semibold text-gray-800 text-lg">
                        {result.driver?.last_name || "N/A"}
                      </div>
                    </td>
                    {showPointsColumn && (
                      <td className="py-4 px-3 text-center">
                        <div className="bg-blue-600 text-white rounded-lg px-3 py-1 font-bold inline-block">
                          {points}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ResultGrid;