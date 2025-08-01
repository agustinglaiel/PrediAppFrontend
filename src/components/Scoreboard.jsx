// src/components/Scoreboard.jsx
import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export default function Scoreboard({ data, loading, error }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;

  // Orden completo por score descendente
  const sortedFull = useMemo(() => {
    return [...(data || [])].sort((a, b) => b.score - a.score);
  }, [data]);

  // Top 100 y posible fila extra del usuario si está fuera
  const top100 = sortedFull.slice(0, 100);
  const userInTop100 = top100.findIndex((r) => r.username === username);
  const userRow =
    userInTop100 === -1 ? sortedFull.find((r) => r.username === username) : null;
  const rows = userRow ? [...top100, userRow] : top100;

  // Si está cargando o error, puedes delegar la UI hacia quien llame (ScoreboardPage)
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden max-w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Tabla de posiciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-700 text-center">Puesto</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Usuario</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                // Calcular posición real: si es el usuario fuera del top100, buscar en sortedFull
                let position;
                if (row.username === username && userRow) {
                  position = sortedFull.findIndex((r) => r.username === username) + 1;
                } else {
                  // Si backend trae position úsalo, sino índice en la lista (que para top100 es correcto)
                  position = row.position ?? idx + 1;
                }

                const isUser = row.username === username;
                return (
                  <tr
                    key={row.username}
                    className={`
                      border-b border-gray-100 last:border-b-0
                      ${isUser ? "bg-red-100 font-semibold" : "hover:bg-gray-50"}
                    `}
                  >
                    <td className="py-3 text-center">{position}</td>
                    <td className="py-3 text-center">{row.username}</td>
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
