import React, { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { IoIosTrophy, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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

  const totalPages = Math.ceil(sortedEntries.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header de la sección */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <IoIosTrophy className="text-red-500 text-xl" />
        <h2 className="text-lg font-bold text-gray-900">Tabla de posiciones</h2>
      </div>

      {/* Encabezados de columna */}
      <div className="grid grid-cols-[40px_1fr_56px] items-center gap-3 px-5 py-2 border-b border-gray-100">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">#</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jugador</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Pts</span>
      </div>

      {/* Lista de jugadores */}
      <div className="divide-y divide-gray-100">
        {paginatedEntries.map((entry, index) => {
          const globalPos = startIndex + index + 1;
          const isLoggedUser =
            entry.username?.toLowerCase() === usernameLogged && !!usernameLogged;

          return (
            <div
              key={entry.user_id}
              className={`
                grid grid-cols-[40px_1fr_56px] items-center gap-3 px-5 py-3
                transition-colors duration-150
                ${isLoggedUser
                  ? "bg-red-50/70 border-l-[3px] border-l-red-500"
                  : "hover:bg-gray-50/60 border-l-[3px] border-l-transparent"
                }
              `}
            >
              {/* Posición */}
              <div className="flex justify-center">
                <span className={`text-sm font-semibold w-8 text-center ${
                  isLoggedUser ? "text-red-600" : "text-gray-400"
                }`}>
                  {globalPos}
                </span>
              </div>

              {/* Username */}
              <div className="min-w-0">
                <span
                  className={`truncate block text-sm ${
                    isLoggedUser ? "font-bold text-gray-900" : "font-medium text-gray-700"
                  }`}
                  title={entry.username}
                >
                  {entry.username}
                  {isLoggedUser && (
                    <span className="ml-1.5 text-[10px] font-semibold text-red-500 uppercase">Tú</span>
                  )}
                </span>
              </div>

              {/* Score */}
              <div className="text-center">
                <span
                  className={`inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-lg text-sm font-bold ${
                    isLoggedUser
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600"
                  }`}
                >
                  {entry.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!entries?.length && (
        <div className="py-10 text-center">
          <IoIosTrophy className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-400 font-medium">No hay datos para mostrar.</p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 px-5 py-3 border-t border-gray-100">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
            }`}
          >
            <IoIosArrowBack className="text-base" />
          </button>

          {/* Page indicators */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${
                page === currentPage
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/25"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95"
            }`}
          >
            <IoIosArrowForward className="text-base" />
          </button>
        </div>
      )}
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