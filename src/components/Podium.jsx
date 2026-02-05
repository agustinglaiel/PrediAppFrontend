import React, { useMemo } from "react";
import PropTypes from "prop-types";

const PodiumSpot = ({ place, entry }) => {
  const heightMap = {
    1: "h-40 sm:h-44",
    2: "h-32 sm:h-36",
    3: "h-28 sm:h-32",
  };

  const colorMap = {
    1: "from-amber-400 to-amber-600",
    2: "from-slate-300 to-slate-500",
    3: "from-orange-300 to-orange-500",
  };

  const labelMap = {
    1: "1°",
    2: "2°",
    3: "3°",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 text-lg font-semibold">
        {labelMap[place]}
      </div>
      <div
        className={`w-24 sm:w-28 lg:w-32 ${heightMap[place]} rounded-t-2xl bg-gradient-to-b ${colorMap[place]} text-white shadow-lg flex flex-col items-center justify-end pb-4 px-2`}
      >
        <p className="text-sm sm:text-base font-semibold text-center truncate w-full">
          {entry?.username || "—"}
        </p>
        <p className="text-xs sm:text-sm text-white/90">
          {typeof entry?.score === "number" ? `${entry.score} pts` : "Sin datos"}
        </p>
      </div>
    </div>
  );
};

const Podium = ({ entries }) => {
  const topThree = useMemo(() => {
    const sorted = [...(entries || [])].sort((a, b) => b.score - a.score);
    return [sorted[0] || null, sorted[1] || null, sorted[2] || null];
  }, [entries]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-end justify-center gap-4">
        <PodiumSpot place={2} entry={topThree[1]} />
        <PodiumSpot place={1} entry={topThree[0]} />
        <PodiumSpot place={3} entry={topThree[2]} />
      </div>
    </div>
  );
};

PodiumSpot.propTypes = {
  place: PropTypes.oneOf([1, 2, 3]).isRequired,
  entry: PropTypes.shape({
    username: PropTypes.string,
    score: PropTypes.number,
  }),
};

PodiumSpot.defaultProps = {
  entry: null,
};

Podium.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ),
};

Podium.defaultProps = {
  entries: [],
};

export default Podium;
