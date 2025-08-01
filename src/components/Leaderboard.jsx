import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

const Leaderboard = ({ entries }) => {
  const { user } = useContext(AuthContext);
  const usernameLogged = user?.username?.toLowerCase();

  const sortedEntries = useMemo(
    () => [...(entries || [])].sort((a, b) => b.score - a.score),
    [entries]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden max-w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Tabla de posiciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup><col style={{ width: 60 }} /><col style={{ width: 180 }} /><col style={{ width: 100 }} /></colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-700 text-center">Puesto</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Usuario</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry, index) => {
                const isLoggedUser =
                  entry.username?.toLowerCase() === usernameLogged && !!usernameLogged;
                return (
                  <tr
                    key={entry.user_id}
                    className={`
                      border-b border-gray-100 last:border-b-0
                      ${isLoggedUser ? "bg-red-100 font-semibold" : "hover:bg-gray-50"}
                    `}
                  >
                    <td className="py-3 text-center">{index + 1}</td>
                    <td className="py-3 text-center">
                      <div
                        className="truncate mx-auto"
                        style={{ maxWidth: "160px" }}
                        title={entry.username}
                      >
                        {entry.username}
                      </div>
                    </td>
                    <td className="py-3 text-center font-medium">{entry.score}</td>
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

Leaderboard.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      username: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Leaderboard;
