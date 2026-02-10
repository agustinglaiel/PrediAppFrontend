import React from "react";

// Mapa de colores de equipo por team_name (F1 2025 season colors)
const TEAM_COLORS = {
  "Red Bull Racing": { accent: "#3671C6", bg: "rgba(54,113,198,0.08)" },
  "McLaren": { accent: "#FF8000", bg: "rgba(255,128,0,0.08)" },
  "Ferrari": { accent: "#E8002D", bg: "rgba(232,0,45,0.08)" },
  "Mercedes": { accent: "#27F4D2", bg: "rgba(39,244,210,0.08)" },
  "Aston Martin": { accent: "#229971", bg: "rgba(34,153,113,0.08)" },
  "Alpine": { accent: "#0093CC", bg: "rgba(0,147,204,0.08)" },
  "Williams": { accent: "#64C4FF", bg: "rgba(100,196,255,0.08)" },
  "Racing Bulls": { accent: "#6692FF", bg: "rgba(102,146,255,0.08)" },
  "Kick Sauber": { accent: "#52E252", bg: "rgba(82,226,82,0.08)" },
  "Audi": { accent: "#000000", bg: "rgba(0,0,0,0.08)" },
  "Haas F1 Team": { accent: "#B6BABD", bg: "rgba(182,186,189,0.08)" },
  "Cadillac": { accent: "#1E3D6F", bg: "rgba(30,61,111,0.08)" },
};

const DEFAULT_TEAM_COLOR = { accent: "#6B7280", bg: "rgba(107,114,128,0.06)" };

const getTeamColor = (teamName) => {
  if (!teamName) return DEFAULT_TEAM_COLOR;
  const key = Object.keys(TEAM_COLORS).find(
    (k) => teamName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(teamName.toLowerCase())
  );
  return key ? TEAM_COLORS[key] : DEFAULT_TEAM_COLOR;
};

const ResultGrid = ({ results = [], sessionType = "Race", sessionName = "Race" }) => {
  // Puntos F1 por posición
  const getFixedPoints = (position) => {
    const pointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    const pos = parseInt(position, 10);
    return pos >= 1 && pos <= 10 ? pointsMap[pos - 1] : 0;
  };

  const showPointsColumn = sessionType === "Race" && sessionName === "Race";
  const displayResults = results.length > 0 ? results : [];

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      {/* Lista de resultados estilo cards */}
      <div className="flex flex-col gap-1.5">
        {displayResults.map((result, index) => {
          const pos = parseInt(result.position, 10);
          const isDNF = result.status === "DNF";
          const isDNS = result.status === "DNS";
          const isRetired = isDNF || isDNS;
          const isTopThree = pos >= 1 && pos <= 3 && !isRetired;
          const isPointsFinish = pos >= 1 && pos <= 10 && !isRetired;

          const teamName = result.driver?.current_team?.team_name || result.driver?.team_name || "";
          const teamColor = getTeamColor(teamName);
          const points = showPointsColumn ? getFixedPoints(result.position) : null;

          const positionDisplay = isRetired ? result.status : (result.position || "–");

          return (
            <div
              key={result.id || index}
              className={`
                relative flex items-center rounded-lg px-3 py-2 transition-all duration-200 shadow-sm
                ${isRetired ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"}
              `}
              style={{
                background: isRetired
                  ? "linear-gradient(135deg, #fef2f2, #fff5f5)"
                  : "#ffffff",
                border: `1px solid ${isRetired ? "#fecaca" : "#e5e7eb"}`,
              }}
            >
              {/* Barra lateral de color del equipo */}
              <div
                className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full"
                style={{ backgroundColor: teamColor.accent }}
              />

              {/* Posición */}
              <div className="flex items-center justify-center w-8 flex-shrink-0 ml-1.5">
                {isRetired ? (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                    {positionDisplay}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-gray-400">
                    {positionDisplay}
                  </span>
                )}
              </div>

              {/* Número del piloto */}
              <div className="flex-shrink-0 mx-2">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: teamColor.accent }}
                >
                  {result.driver?.driver_number || "–"}
                </div>
              </div>

              {/* Info del piloto */}
              <div className="flex-grow min-w-0 leading-none">
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-gray-900 text-sm truncate">
                    {result.driver?.first_name || ""}
                  </span>
                  <span className="font-bold text-gray-900 text-sm truncate">
                    {result.driver?.last_name || "N/A"}
                  </span>
                </div>
                {teamName && (
                  <span
                    className="text-[10px] font-medium inline-block mt-px"
                    style={{ color: teamColor.accent }}
                  >
                    {teamName}
                  </span>
                )}
              </div>

              {/* Acrónimo */}
              <div className="flex-shrink-0 mx-1.5 hidden sm:block">
                <span className="text-[10px] font-semibold text-gray-400 tracking-widest">
                  {result.driver?.name_acronym || ""}
                </span>
              </div>

              {/* Puntos */}
              {showPointsColumn && isPointsFinish && !isRetired && (
                <div className="flex-shrink-0 ml-1.5 w-12 text-right">
                  <div className="inline-flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-800">
                      {points}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium ml-0.5">
                      pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultGrid;