// src/components/results/ResultGrid.jsx
import React from "react";

const ResultGrid = ({ results }) => {
  // Función para determinar puntos fijos según la posición
  const getFixedPoints = (position) => {
    const pointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const pos = parseInt(position, 10);
    return pos >= 1 && pos <= 10 ? pointsMap[pos - 1] : 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-300">
            <th className="py-2 px-4 border-b text-center">POS</th>
            <th className="py-2 px-4 border-b text-center">NO</th>
            <th className="py-2 px-4 border-b text-center">DRIVER</th>
            <th className="py-2 px-4 border-b text-center">TEAM</th>
            <th className="py-2 px-4 border-b text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => {
            const positionDisplay =
              result.status === "DNF" || result.status === "DNS"
                ? result.status
                : result.position || "N/A";
            const points = getFixedPoints(result.position) || 0;

            return (
              <tr
                key={result.id || index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4 border-b text-center">
                  {positionDisplay}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {result.driver?.driver_number || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {result.driver?.last_name || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {result.driver?.team_name || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">{points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultGrid;
