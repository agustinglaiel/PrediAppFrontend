import React from "react";

const Leaderboard = ({ entries }) => {
  // Ordenar las entradas por score de mayor a menor
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

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
              {sortedEntries.map((entry, index) => (
                <tr key={entry.user_id} className="border-b border-gray-100 last:border-b-0">
                  <td className="py-3 font-semibold text-gray-900 text-center">{index + 1}</td>
                  <td className="py-3 text-gray-800 text-center">{entry.username}</td>
                  <td className="py-3 text-gray-800 text-center font-medium">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;