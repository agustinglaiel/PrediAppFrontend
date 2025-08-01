// src/pages/GroupPage.jsx
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
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

  const {
    group,
    leaderboard: userScores,
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

  // 2) Obtiene solicitudes
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
    refetchGroup(); // refresca datos del grupo / leaderboard
  };

  const handleAccept = (userId) => {
    console.log("Aceptar solicitud de user:", userId);
  };
  const handleReject = (userId) => {
    console.log("Rechazar solicitud de user:", userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando grupo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <WarningModal message={error} onClose={() => {}} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 px-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{group?.group_name}</h1>
            {isCreator && (
              <span className="text-lg text-gray-500 font-medium">
                Codigo: {group?.group_code}
              </span>
            )}
          </div>
          {isCreator && (
            <button
              onClick={handleShowRequests}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Solicitudes
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <Leaderboard entries={userScores} />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>

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
