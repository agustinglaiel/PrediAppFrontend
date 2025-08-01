import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export default function Scoreboard({ data, loading, error }) {
  const { user } = useContext(AuthContext);
  const username = user?.username?.toLowerCase();

  const sortedFull = useMemo(() => {
    return [...(data || [])].sort((a, b) => b.score - a.score);
  }, [data]);

  const top100 = sortedFull.slice(0, 100);
  const userInTop100 = top100.findIndex(
    (r) => r.username?.toLowerCase() === username
  );
  const userRow =
    userInTop100 === -1
      ? sortedFull.find((r) => r.username?.toLowerCase() === username)
      : null;
  const rows = userRow ? [...top100, userRow] : top100;

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
              {rows.map((row, idx) => {
                let position;
                if (row.username?.toLowerCase() === username && userRow) {
                  position =
                    sortedFull.findIndex(
                      (r) => r.username?.toLowerCase() === username
                    ) + 1;
                } else {
                  position = row.position ?? idx + 1;
                }

                const isUser = row.username?.toLowerCase() === username;
                return (
                  <tr
                    key={row.username}
                    className={`
                      border-b border-gray-100 last:border-b-0
                      ${isUser ? "bg-red-100 font-semibold" : "hover:bg-gray-50"}
                    `}
                  >
                    <td className="py-3 text-center">{position}</td>
                    <td className="py-3 text-center">
                      <div
                        className="truncate mx-auto"
                        style={{ maxWidth: "160px" }}
                        title={row.username}
                      >
                        {row.username}
                      </div>
                    </td>
                    <td className="py-3 text-center font-medium">{row.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {error && (
            <div className="mt-4 text-red-600 text-center">
              Ocurrió un error: {error.message || error.toString()}
            </div>
          )}
          {!loading && rows.length === 0 && (
            <div className="mt-4 text-gray-600 text-center">
              No hay datos para mostrar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Scoreboard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      position: PropTypes.number,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),
};
