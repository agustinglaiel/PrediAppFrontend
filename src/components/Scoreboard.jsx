import React, { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { IoIosTrophy, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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

  // Posición del usuario en el ranking global
  const userGlobalPosition = useMemo(() => {
    if (!username || !sortedFull.length) return null;
    const idx = sortedFull.findIndex(
      (r) => r.username?.toLowerCase() === username
    );
    return idx >= 0 ? idx + 1 : null;
  }, [sortedFull, username]);

  // Pagination
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = rows.slice(startIndex, startIndex + rowsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Máximo número de botones de página visibles
  const maxVisiblePages = 5;
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxVisiblePages + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Cargando ranking…</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2 flex-shrink-0">
        <IoIosTrophy className="text-red-500 text-xl" />
        <h2 className="text-lg font-bold text-gray-900">Ranking Global</h2>
        {userGlobalPosition && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            Tu posición
            <span className="text-sm font-bold text-gray-900">#{userGlobalPosition}</span>
          </span>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[40px_1fr_56px] items-center gap-3 px-5 py-2 border-b border-gray-100 flex-shrink-0">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">#</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jugador</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Pts</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 overflow-y-auto min-h-0 flex-1">
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

          const isUser = row.username?.toLowerCase() === username && !!username;

          return (
            <div
              key={row.username}
              className={`
                grid grid-cols-[40px_1fr_56px] items-center gap-3 px-5 py-3
                transition-colors duration-150
                ${isUser
                  ? "bg-red-50/70 border-l-[3px] border-l-red-500"
                  : "hover:bg-gray-50/60 border-l-[3px] border-l-transparent"
                }
              `}
            >
              {/* Position */}
              <div className="flex justify-center">
                <span className={`text-sm font-semibold w-8 text-center ${
                  isUser ? "text-red-600" : "text-gray-400"
                }`}>
                  {position}
                </span>
              </div>

              {/* Username */}
              <div className="min-w-0">
                <span
                  className={`truncate block text-sm ${
                    isUser ? "font-bold text-gray-900" : "font-medium text-gray-700"
                  }`}
                  title={row.username}
                >
                  {row.username}
                  {isUser && (
                    <span className="ml-1.5 text-[10px] font-semibold text-red-500 uppercase">Tú</span>
                  )}
                </span>
              </div>

              {/* Score */}
              <div className="text-center">
                <span
                  className={`inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-lg text-sm font-bold ${
                    isUser
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600"
                  }`}
                >
                  {row.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="px-5 py-4 flex-shrink-0">
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
            <span className="text-red-400 text-base">⚠</span>
            {error.message || error.toString()}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && rows.length === 0 && !error && (
        <div className="py-10 text-center flex-shrink-0">
          <IoIosTrophy className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-sm text-gray-400 font-medium">No hay datos para mostrar.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 px-5 py-3 border-t border-gray-100 flex-shrink-0">
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

          {getVisiblePages().map((page) => (
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