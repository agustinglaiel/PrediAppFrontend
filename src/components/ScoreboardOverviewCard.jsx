// src/components/ScoreboardOverviewCard.jsx
import React from "react";
import PropTypes from "prop-types";

const ScoreboardOverviewCard = ({
  title,
  position,
  onClick,
  isGeneral,
  badgeLabel,
  badgeClassName,
}) => {
  const resolvedBadgeLabel = badgeLabel || (isGeneral ? "General" : "Grupo");
  const resolvedBadgeClassName =
    badgeClassName ||
    (isGeneral
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700");

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <div
          className={`text-xs uppercase px-2 py-1 rounded ${resolvedBadgeClassName}`}
        >
          {resolvedBadgeLabel}
        </div>
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
  badgeLabel: PropTypes.string,
  badgeClassName: PropTypes.string,
};

ScoreboardOverviewCard.defaultProps = {
  isGeneral: false,
  badgeLabel: null,
  badgeClassName: null,
};

export default ScoreboardOverviewCard;