// src/pages/RankingPage.jsx
import React, { useContext, useMemo } from "react";
import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import ScoreboardOverviewCard from "../components/ScoreboardOverviewCard";
import useScoreboard from "../hooks/useScoreboard";
import useUserGroups from "../hooks/useUserGroups";
import { AuthContext } from "../contexts/AuthContext";

const RankingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const {
    scoreboard,
    loading: loadingScoreboard,
    error: scoreboardError,
    currentSeasonYear,
    pastSeasons,
  } = useScoreboard();
  const { groups, loading: loadingGroups, error: groupsError } =
    useUserGroups(userId);

    // calcular posición del usuario en scoreboard general
  const userGeneralPosition = useMemo(() => {
    if (!scoreboard || !user?.username) return null;
    const target = user.username.toLowerCase();
    const sorted = [...scoreboard].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex(
      (r) => String(r.username).toLowerCase() === target
    );
    return idx >= 0 ? idx + 1 : null;
  }, [scoreboard, user]);
  
  
  const isLoading = loadingScoreboard || loadingGroups;
  const error = scoreboardError || groupsError;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 pb-24 px-4">
        <div className="sticky top-24 z-20 mb-6 flex justify-center">
          <div className="bg-white/90 backdrop-blur rounded-full px-2 py-2 shadow-sm border border-gray-100">
            <button
              onClick={() => navigate("/ganadores-historicos")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaTrophy className="text-sm" />
              Ganadores
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error.message || error.toString()}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Cargando rankings...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* General */}
              <ScoreboardOverviewCard
                title="Ranking General"
                position={userGeneralPosition || "—"}
                isGeneral
                onClick={() => navigate("/scoreboard/general")}
              />

              {/* Por cada grupo */}
              {groups.map(({ group, userPosition }) => (
                <ScoreboardOverviewCard
                  key={group.id}
                  title={group.group_name || "Grupo"}
                  position={userPosition || "—"}
                  onClick={() => navigate(`/grupos/${group.id}`)}
                />
              ))}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default RankingPage;
