import React, { useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export default function Scoreboard({ data, loading, error }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;
  
  // Primeros 100 del ranking global
  const top100 = (data || []).slice(0, 100);
  const userIndexInTop = top100.findIndex(r => r.username === username);
  
  // Buscar la fila real del user si está fuera del top 100
  const userRow =
    userIndexInTop === -1
      ? (data || []).find(r => r.username === username)
      : null;
  
  // Si el user está fuera del top 100, lo agregamos último
  const rows = userRow ? [...top100, userRow] : top100;
  
  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col overflow-hidden min-h-0 max-h-full">
      <h2 className="text-xl font-bold p-4 flex-shrink-0 border-b-2 border-gray-300">Tabla de clasificación general</h2>
      <div 
        className={`${rows.length > 10 ? 'flex-1 overflow-y-auto' : 'overflow-y-auto'} min-h-0`}
        style={{ maxHeight: rows.length > 10 ? '100%' : 'fit-content' }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="h-10">
              <th className="text-center font-semibold text-gray-700 border-b border-gray-200 w-16">#</th>
              <th className="text-left font-semibold text-gray-700 pl-4 border-b border-gray-200">Usuario</th>
              <th className="text-right font-semibold text-gray-700 pr-4 border-b border-gray-200">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              // Si la fila es la del usuario fuera del top 100, mostrar la posición real global
              let position;
              if (row.username === username && userRow) {
                position = data.findIndex(r => r.username === username) + 1;
              } else {
                // Si tu backend trae row.position, usalo, si no, idx+1
                position = row.position ?? idx + 1;
              }
              const isUser = row.username === username;
              const isLast = idx === rows.length - 1;
              return (
                <tr
                  key={row.username}
                  className={`
                    ${isUser ? "bg-red-100 font-semibold hover:bg-red-50" : "hover:bg-gray-50"}
                    ${isLast ? "border-b-2 border-gray-300" : "border-b border-gray-200"}
                  `}
                >
                  <td className="h-12 text-center text-gray-600 w-16">{position}</td>
                  <td className="h-12 pl-4 text-gray-800">{row.username}</td>
                  <td className="h-12 text-right pr-4 font-medium text-gray-900">{row.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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