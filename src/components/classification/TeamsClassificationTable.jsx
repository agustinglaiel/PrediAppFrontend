import React from "react";

const TEAM_COLORS = {
  Alpine: "#005081",
  "Aston Martin": "#00482C",
  "Williams Racing": "#002D7A",
  Audi: "#6B0015",
  Cadillac: "#444444",
  Ferrari: "#C00012",
  "Hass F1 Team": "#4D5052",
  Mclaren: "#FF6A00",
  Mercedes: "#007560",
  "Racing Bulls": "#2345AB",
  "Red Bull Racing": "#001A4D",
};

const getTeamColor = (teamName) => {
  if (!teamName) return "#D1D5DB";
  return TEAM_COLORS[teamName] || "#D1D5DB";
};

const TeamsClassificationTable = ({ teams }) => {
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
                Equipo
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teams.map((team, index) => {
              const teamName = team.team_name || team.name || "Equipo";
              const points = team.points ?? team.total_points ?? 0;
              const teamLogo = team.team_logo || team.logo_url || "";
              const teamColor = getTeamColor(teamName);

              return (
                <tr
                  key={team.team_id ?? team.team_name ?? `${teamName}-${index}`}
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
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: teamColor }}
                      >
                        {teamLogo ? (
                          <img
                            src={teamLogo}
                            alt={teamName}
                            className="w-full h-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span
                            className="w-6 h-6 rounded-full bg-white/70"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {teamName}
                      </span>
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

export default TeamsClassificationTable;
