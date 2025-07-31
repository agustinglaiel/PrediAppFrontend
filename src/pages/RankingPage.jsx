// src/pages/RankingPage.jsx
import React, { useContext, useMemo } from "react";
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

  const { scoreboard, loading: loadingScoreboard, error: scoreboardError } =
    useScoreboard();
  const { groups, loading: loadingGroups, error: groupsError } =
    useUserGroups(userId);

  // calcular posición del usuario en scoreboard general
  const userGeneralPosition = useMemo(() => {
    if (!scoreboard || !user?.username) return null;
    const sorted = [...scoreboard].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex((r) => r.username === user.username);
    return idx >= 0 ? idx + 1 : null;
  }, [scoreboard, user]);

  const isLoading = loadingScoreboard || loadingGroups;
  const error = scoreboardError || groupsError;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Ranking</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600">Cargando rankings...</p>
          </div>
        ) : (
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
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default RankingPage;
