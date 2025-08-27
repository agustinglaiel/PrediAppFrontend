import React, { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export default function Scoreboard({ data, loading, error }) {
  const { user } = useContext(AuthContext);
  const username = user?.username?.toLowerCase();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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

  // Calculate pagination
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = rows.slice(startIndex, startIndex + rowsPerPage);

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
                {paginatedRows.map((row, idx) => {
                  let position;
                  if (row.username?.toLowerCase() === username && userRow) {
                    position =
                      sortedFull.findIndex(
                        (r) => r.username?.toLowerCase() === username
                      ) + 1;
                  } else {
                    position = row.position ?? startIndex + idx + 1;
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
                      <td className="py-3 text-center align-middle">{position}</td>
                      <td className="py-3 text-center align-middle">
                        <div
                          className="truncate mx-auto"
                          style={{ maxWidth: "90%" }}
                          title={row.username}
                        >
                          {row.username}
                        </div>
                      </td>
                      <td className="py-3 text-center font-medium align-middle">{row.score}</td>
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
          {rows.length > 0 && (
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