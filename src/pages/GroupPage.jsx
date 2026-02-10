// src/pages/GroupPage.jsx
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosPeople, IoIosTrophy, IoIosArrowBack, IoIosCopy, IoIosMail } from "react-icons/io";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import WarningModal from "../components/WarningModal";
import Leaderboard from "../components/Leaderboard";
import GroupRequests from "../components/groups/GroupRequests";
import { AuthContext } from "../contexts/AuthContext";
import { getJoinRequestByGroupId } from "../api/groups";
import useGroup from "../hooks/useGroup";

const GroupPage = () => {
  const { user } = useContext(AuthContext);
  const loggedUserId = user?.id;
  const { groupId } = useParams();
  const navigate = useNavigate();

  const {
    group,
    leaderboard: userScores,
    userPosition,
    creatorId,
    isCreator,
    loading,
    error,
    refetch: refetchGroup,
  } = useGroup(groupId, loggedUserId);

  // Estados para el modal de solicitudes
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinReqLoading, setJoinReqLoading] = useState(false);
  const [joinReqError, setJoinReqError] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Obtiene solicitudes
  const handleShowRequests = async () => {
    try {
      setJoinReqLoading(true);
      setJoinReqError(null);
      const { data } = await getJoinRequestByGroupId(groupId);
      setJoinRequests(data?.users ?? []);
    } catch (err) {
      setJoinReqError(err.message);
      setJoinRequests([]);
    } finally {
      setJoinReqLoading(false);
      setShowRequestsModal(true);
    }
  };

  const handleCloseRequests = () => {
    setShowRequestsModal(false);
    refetchGroup();
  };

  const handleCopyCode = async () => {
    if (!group?.group_code) return;
    try {
      await navigator.clipboard.writeText(group.group_code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // fallback
      setCodeCopied(false);
    }
  };

  // Iniciales del grupo para el avatar
  const groupInitials = group?.group_name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "G";

  // Cantidad de miembros activos
  const activeMembersCount =
    group?.users?.filter((u) => u.role !== "Invited").length ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-3">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Cargando grupo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <WarningModal message={error} onClose={() => navigate("/grupos")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4">

          {/* ── Botón volver ── */}
          {/* <button
            onClick={() => navigate("/grupos")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-4 mt-1"
          >
            <IoIosArrowBack className="text-base" />
            Mis Grupos
          </button> */}

          {/* ── Card principal del grupo ── */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5">
            {/* Info del grupo */}
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Avatar compacto */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-500/20 flex-shrink-0">
                    <span className="text-white font-bold text-sm tracking-wide">
                      {groupInitials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-gray-900 truncate">
                      {group?.group_name}
                    </h1>
                    {isCreator && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                        <IoIosTrophy className="text-xs" />
                        Administrador
                      </span>
                    )}
                  </div>
                </div>

                {isCreator && (
                  <button
                    onClick={handleShowRequests}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all duration-200"
                  >
                    <IoIosMail className="text-base" />
                    Solicitudes
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                  <IoIosPeople className="text-gray-500 text-lg" />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-gray-900">{activeMembersCount}</p>
                    <p className="text-[11px] text-gray-500">
                      {activeMembersCount === 1 ? "Miembro" : "Miembros"}
                    </p>
                  </div>
                </div>

                {userPosition && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                    <IoIosTrophy className="text-yellow-500 text-lg" />
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-gray-900">#{userPosition}</p>
                      <p className="text-[11px] text-gray-500">Tu posición</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Código del grupo (solo admin) */}
              {isCreator && group?.group_code && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-0">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Código:</span>
                    <span className="text-sm font-mono font-semibold text-gray-800 truncate">
                      {group.group_code}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      codeCopied
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 active:scale-[0.97]"
                    }`}
                  >
                    <IoIosCopy className="text-sm" />
                    {codeCopied ? "Copiado" : "Copiar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Leaderboard ── */}
          <Leaderboard entries={userScores} />

        </div>
      </main>

      {showRequestsModal && (
        <GroupRequests
          groupId={parseInt(groupId, 10)}
          creatorId={creatorId}
          requests={joinRequests}
          loading={joinReqLoading}
          error={joinReqError}
          onClose={handleCloseRequests}
        />
      )}
    </div>
  );
};

export default GroupPage;
