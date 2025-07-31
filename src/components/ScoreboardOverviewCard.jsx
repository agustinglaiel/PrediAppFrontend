// src/components/ScoreboardOverviewCard.jsx
import React from "react";
import PropTypes from "prop-types";

const ScoreboardOverviewCard = ({ title, position, onClick, isGeneral }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        {isGeneral ? (
          <div className="text-xs uppercase bg-red-100 text-red-700 px-2 py-1 rounded">
            General
          </div>
        ) : (
          <div className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Grupo
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Posición:</span>
          <span className="text-lg font-semibold text-gray-900">
            {position != null ? position : "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

ScoreboardOverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func.isRequired,
  isGeneral: PropTypes.bool,
};

ScoreboardOverviewCard.defaultProps = {
  isGeneral: false,
};

export default ScoreboardOverviewCard;