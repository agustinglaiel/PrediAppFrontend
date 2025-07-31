import React from "react";
import PropTypes from "prop-types";

export default function Scoreboard({ data, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Tabla de clasificación</h2>
        <p>Cargando clasificación…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Tabla de clasificación</h2>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  // Ordenar de mayor a menor puntuación
  const sorted = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tabla de clasificación</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2">#</th>
            <th className="border-b py-2">Usuario</th>
            <th className="border-b py-2">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr key={row.username} className="hover:bg-gray-50">
              <td className="py-2">{idx + 1}</td>
              <td className="py-2">{row.username}</td>
              <td className="py-2">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Scoreboard.propTypes = {
  data:     PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      score:    PropTypes.number.isRequired,
    })
  ).isRequired,
  loading:  PropTypes.bool.isRequired,
  error:    PropTypes.instanceOf(Error),
};
