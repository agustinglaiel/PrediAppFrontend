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
  "RB": { accent: "#6692FF", bg: "rgba(102,146,255,0.08)" },
  "Kick Sauber": { accent: "#52E252", bg: "rgba(82,226,82,0.08)" },
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
      <div className="flex flex-col gap-2">
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
                relative flex items-center rounded-xl px-4 py-3 transition-all duration-200
                ${isTopThree ? "shadow-md" : "shadow-sm"}
                ${isRetired ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"}
              `}
              style={{
                background: isRetired
                  ? "linear-gradient(135deg, #fef2f2, #fff5f5)"
                  : isTopThree
                  ? `linear-gradient(135deg, ${teamColor.bg}, white)`
                  : "#ffffff",
                border: `1px solid ${isRetired ? "#fecaca" : isTopThree ? teamColor.accent + "30" : "#e5e7eb"}`,
              }}
            >
              {/* Barra lateral de color del equipo */}
              <div
                className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                style={{ backgroundColor: teamColor.accent }}
              />

              {/* Posición */}
              <div className="flex items-center justify-center w-12 flex-shrink-0 ml-2">
                {isRetired ? (
                  <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-md px-2 py-1">
                    {positionDisplay}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-gray-400">
                    {positionDisplay}
                  </span>
                )}
              </div>

              {/* Número del piloto */}
              <div className="flex-shrink-0 mx-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm"
                  style={{ backgroundColor: teamColor.accent }}
                >
                  {result.driver?.driver_number || "–"}
                </div>
              </div>

              {/* Info del piloto */}
              <div className="flex-grow min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {result.driver?.first_name || ""}
                  </span>
                </div>
                <div className="font-bold text-gray-900 text-base leading-tight truncate">
                  {result.driver?.last_name || "N/A"}
                </div>
                {teamName && (
                  <span
                    className="text-[11px] font-medium mt-0.5 inline-block"
                    style={{ color: teamColor.accent }}
                  >
                    {teamName}
                  </span>
                )}
              </div>

              {/* Acrónimo */}
              <div className="flex-shrink-0 mx-2 hidden sm:block">
                <span className="text-xs font-semibold text-gray-400 tracking-widest">
                  {result.driver?.name_acronym || ""}
                </span>
              </div>

              {/* Puntos */}
              {showPointsColumn && (
                <div className="flex-shrink-0 ml-2 w-14 text-right">
                  {isPointsFinish && !isRetired ? (
                    <div className="inline-flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">
                        {points}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium ml-0.5 mt-1">
                        pts
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-300 font-medium">
                      {isRetired ? "–" : "0"}
                    </span>
                  )}
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