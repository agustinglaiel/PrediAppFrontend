// src/components/results/ResultSessionItem.jsx
import React from "react";
import DateDisplay from "../DateDisplay";

const ResultSessionItem = ({
  sessionId,
  date,
  month,
  sessionName,
  sessionType,
  startTime,
  endTime,
  onResultClick,
}) => {
  return (
    <div className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
      <DateDisplay date={date} month={month} />
      <div className="ml-6 flex-grow">
        <div className="font-semibold">{sessionName}</div>
        <div className="text-sm text-gray-600">
          {startTime}
          {endTime ? ` - ${endTime}` : ""}
        </div>
      </div>
      <button
        onClick={() => onResultClick(sessionId, sessionType)}
        className="px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap bg-gray-200 text-gray-700 hover:bg-gray-300"
      >
        Ver resultados
      </button>
    </div>
  );
};

export default ResultSessionItem;
