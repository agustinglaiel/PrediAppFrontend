// src/pages/RankingPage.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import ScoreboardOverviewCard from "../components/ScoreboardOverviewCard";
import AuthModal from "../components/AuthModal";
import useScoreboard from "../hooks/useScoreboard";
import useUserGroups from "../hooks/useUserGroups";
import { AuthContext } from "../contexts/AuthContext";

const RankingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } =
    useContext(AuthContext);
  const userId = user?.id;
  const [showWinnersLabel, setShowWinnersLabel] = useState(true);
  const [isWinnersArmed, setIsWinnersArmed] = useState(false);
  const collapseTimerRef = useRef(null);
  const winnersButtonRef = useRef(null);

  const {
    scoreboard,
    loading: loadingScoreboard,
    error: scoreboardError,
    currentSeasonYear,
    pastSeasons,
  } = useScoreboard({ enabled: isAuthenticated });
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

  const shouldShowAuthModal = !authLoading && !isAuthenticated;

  const scheduleCollapse = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    collapseTimerRef.current = setTimeout(() => {
      setShowWinnersLabel(false);
      setIsWinnersArmed(false);
    }, 2500);
  };

  useEffect(() => {
    scheduleCollapse();
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isWinnersArmed) return undefined;

    const handleClickOutside = (event) => {
      if (
        winnersButtonRef.current &&
        !winnersButtonRef.current.contains(event.target)
      ) {
        setShowWinnersLabel(false);
        setIsWinnersArmed(false);
        if (collapseTimerRef.current) {
          clearTimeout(collapseTimerRef.current);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWinnersArmed]);

  const handleWinnersClick = () => {
    if (!showWinnersLabel) {
      setShowWinnersLabel(true);
      setIsWinnersArmed(true);
      scheduleCollapse();
      return;
    }

    if (isWinnersArmed) {
      navigate("/ganadores-historicos");
      return;
    }

    navigate("/ganadores-historicos");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <AuthModal
        isOpen={shouldShowAuthModal}
        message="Para acceder a esta funcionalidad es necesario tener un usuario registrado. Desea proceder a registrarse?"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        onContinueToLogin={() => navigate("/login", { replace: true })}
        onClose={() => navigate("/", { replace: true })}
      />

      <div className="fixed bottom-20 right-6 z-50" ref={winnersButtonRef}>
        <button
          onClick={handleWinnersClick}
          aria-label="Ver ganadores históricos"
          className={`inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
            showWinnersLabel ? "gap-2 px-6 py-2.5" : "h-12 w-12 justify-center p-0"
          }`}
        >
          <FaTrophy className="text-sm" />
          <span
            className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ${
              showWinnersLabel ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Ganadores
          </span>
        </button>
      </div>

      <main className="flex-grow pt-20 pb-24 px-4">
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
