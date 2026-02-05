import React, { useMemo, useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import Podium from "../components/Podium";
import HistoricalWinnersModal from "../components/HistoricalWinnersModal";
import useScoreboard from "../hooks/useScoreboard";

const HistoricalWinnersPage = () => {
  const { pastSeasons, loading, error } = useScoreboard();
  const [selectedSeasonYear, setSelectedSeasonYear] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeasonMenuOpen, setIsSeasonMenuOpen] = useState(false);
  const seasonMenuRef = useRef(null);

  useEffect(() => {
    if (pastSeasons.length > 0 && selectedSeasonYear == null) {
      setSelectedSeasonYear(pastSeasons[0].season_year);
    }
  }, [pastSeasons, selectedSeasonYear]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (seasonMenuRef.current && !seasonMenuRef.current.contains(event.target)) {
        setIsSeasonMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedSeason = useMemo(() => {
    if (pastSeasons.length === 0) return null;
    return (
      pastSeasons.find((season) => season.season_year === selectedSeasonYear) ||
      pastSeasons[0]
    );
  }, [pastSeasons, selectedSeasonYear]);

  const entries = selectedSeason?.scoreboard || [];

  const topThree = useMemo(() => {
    return [...entries].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [entries]);

  const winners = useMemo(() => {
    return [...pastSeasons]
      .sort((a, b) => b.season_year - a.season_year)
      .map((season) => {
        const sorted = [...(season.scoreboard || [])].sort(
          (a, b) => b.score - a.score
        );
        const top = sorted[0];
        return {
          season_year: season.season_year,
          username: top?.username || "—",
          score: typeof top?.score === "number" ? top.score : null,
        };
      });
  }, [pastSeasons]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 pb-24 px-4">

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error.message || error.toString()}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Cargando historial...</p>
          </div>
        ) : pastSeasons.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-600">
            Aún no hay temporadas históricas para mostrar.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
              <label className="text-sm font-semibold text-gray-700">
                Temporada
              </label>
              <div
                ref={seasonMenuRef}
                className="relative w-full sm:w-52"
              >
                <button
                  type="button"
                  onClick={() => setIsSeasonMenuOpen((prev) => !prev)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-800 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <span>{selectedSeasonYear || "Seleccionar"}</span>
                  <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                    ▼
                  </span>
                </button>
                {isSeasonMenuOpen && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    <ul className="max-h-56 overflow-y-auto py-1">
                      {pastSeasons.map((season) => (
                        <li key={season.season_year}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSeasonYear(season.season_year);
                              setIsSeasonMenuOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                              season.season_year === selectedSeasonYear
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {season.season_year}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Podium entries={topThree} />
          </div>
        )}
      </main>

      <HistoricalWinnersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        winners={winners}
      />
    </div>
  );
};

export default HistoricalWinnersPage;
