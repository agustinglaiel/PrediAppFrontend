import React, { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

const Leaderboard = ({ entries }) => {
  const { user } = useContext(AuthContext);
  const usernameLogged = user?.username?.toLowerCase();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const sortedEntries = useMemo(
    () => [...(entries || [])].sort((a, b) => b.score - a.score),
    [entries]
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedEntries.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage);

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-left">Tabla de posiciones</h2>
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden max-w-full">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: "25%" }} />
                <col style={{ width: "50%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-semibold text-gray-700 text-center align-middle">Puesto</th>
                  <th className="pb-3 font-semibold text-gray-700 text-center align-middle">Usuario</th>
                  <th className="pb-3 font-semibold text-gray-700 text-center align-middle">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry, index) => {
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
                      <td className="py-3 text-center align-middle">{startIndex + index + 1}</td>
                      <td className="py-3 text-center align-middle">
                        <div
                          className="truncate mx-auto"
                          style={{ maxWidth: "90%" }}
                          title={entry.username}
                        >
                          {entry.username}
                        </div>
                      </td>
                      <td className="py-3 text-center font-medium align-middle">{entry.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!entries?.length && (
              <div className="mt-4 text-gray-600 text-center">
                No hay datos para mostrar.
              </div>
            )}
          </div>
          {sortedEntries.length > 0 && (
            <div className="mt-4 flex justify-center items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`
                  text-lg font-semibold
                  ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}
                `}
              >
                &lt;
              </button>
              <span className="text-sm text-gray-700">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`
                  text-lg font-semibold
                  ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"}
                `}
              >
                &gt;
              </button>
            </div>
          )}
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