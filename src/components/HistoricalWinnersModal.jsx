import React from "react";
import PropTypes from "prop-types";

const HistoricalWinnersModal = ({ isOpen, onClose, winners }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold">Ganadores por temporada</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {winners.length === 0 ? (
            <p className="text-gray-600 text-sm">No hay ganadores históricos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {winners.map((winner) => (
                <li
                  key={winner.season_year}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-gray-500">Temporada {winner.season_year}</p>
                    <p className="text-base font-semibold text-gray-900">
                      {winner.username || "—"}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {typeof winner.score === "number" ? `${winner.score} pts` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-red-600 text-white py-2 font-semibold hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

HistoricalWinnersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  winners: PropTypes.arrayOf(
    PropTypes.shape({
      season_year: PropTypes.number.isRequired,
      username: PropTypes.string,
      score: PropTypes.number,
    })
  ),
};

HistoricalWinnersModal.defaultProps = {
  winners: [],
};

export default HistoricalWinnersModal;
